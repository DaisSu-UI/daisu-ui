import {afterEach,expect,rstest,test} from '@rstest/core';
import {cleanup,fireEvent,render} from '@lynx-js/react/testing-library';
import {createRef} from '@lynx-js/react';
import {RichText} from './RichText.js';
import type {RichTextRef} from './RichText.js';
import {parseRichText,richTextStyle,richTextTableGrid,richTextUrl} from './richTextModel.js';
afterEach(cleanup);
const event=(name:string,detail:object)=>Object.assign(new Event(`bindEvent:${name}`),{eventType:'bindEvent',eventName:name,detail});
test('RichText filters executable content and unsafe resources without interpreting HTML as DOM',()=>{
 const result=parseRichText('<script>alert(1)</script><style>bad</style><svg><text>unsafe</text></svg><iframe>frame</iframe><p onclick="bad()">A &amp; B <b>bold</b> <em>end</em></p><a href="javascript:bad()">link</a><img src="data:image/svg+xml,evil">');
 expect(result.text).toContain('A & B bold end');expect(result.text).not.toMatch(/unsafe|frame|alert|bad/);
 expect(JSON.stringify(result)).not.toContain('onclick');expect(result.nodes.find(n=>n.tag==='a')!.attrs.href).toBe('');expect(result.images[0]!.src).toBe('');
 for(const src of ['javascript:alert(1)','java\nscript:bad','https://user:pass@host/file','//user:pass@host/file','file:///tmp/a.png','data:image/svg+xml;base64,AAAA'])expect(richTextUrl(src,{allowDataImage:true})).toBe('');
 expect(richTextUrl('../lake.jpg',{baseUrl:'https://example.com/images/a/'})).toBe('https://example.com/images/lake.jpg');
 expect(richTextUrl('/page',{},true)).toBe('/page');expect(richTextUrl('mailto:a@b',{},true)).toBe('mailto:a@b');expect(richTextUrl('mailto:a@b')).toBe('');
 expect(richTextUrl('data:image/png;base64,YQ==',{allowDataImage:true})).toContain('data:image/png');expect(richTextUrl('data:image/png;base64,YQ==')).toBe('');
 expect(richTextStyle('position:fixed;display:flex;background-image:url(evil);color:red;font-size:18px')).toEqual({color:'red',fontSize:'18px'});
});
test('RichText enforces input, node, depth and table expansion limits and resolves style priority',()=>{
 expect(()=>parseRichText('a'.repeat(200001))).toThrow('200000');expect(()=>parseRichText('<br>'.repeat(10001))).toThrow('10000');expect(()=>parseRichText('<div>'.repeat(129))).toThrow('128');
 expect(()=>parseRichText('<table><tr><td colspan="99">a</td><td colspan="99">b</td></tr></table>')).toThrow('100 columns');
 const result=parseRichText('<p class="note" style="color:blue">value</p>',{tagStyle:{p:'color:red;font-size:12px'},classStyles:{note:'color:green;font-size:16px'}});expect(result.nodes[0]!.style).toEqual({color:'blue',fontSize:'16px'});
 expect(parseRichText('<p style="display:none">hidden</p>').nodes).toEqual([]);
});
test('RichText headings, duplicate IDs, hidden images and overlapping table spans remain consistent',()=>{
 const result=parseRichText('<h2 id="one">First</h2><h3 id="one">Second</h3><h2 style="display:none">Hidden</h2><img style="display:none" src="hidden.jpg"><img src="a.jpg" original-src="full.jpg"><img src="b.jpg" data-preview="false">',{enableAnchor:true});
 expect(result.headings.map(h=>h.text)).toEqual(['First','Second']);expect(result.headings[0]!.id).toBe('one');expect(result.headings[1]!.id).not.toBe('one');
 expect(result.images).toHaveLength(2);expect(result.images[0]!.imageIndex).toBe(0);expect(result.images[0]!.previewSrc).toBe('full.jpg');expect(result.images[1]!.previewSrc).toBe('');
 const table=parseRichText('<table><tr><td>A</td><td rowspan="2">B</td><td>C</td></tr><tr><td colspan="2">D</td></tr></table>').nodes[0]!;const{grid,columns}=richTextTableGrid(table);expect(columns).toBe(4);expect(grid[1]![1]!.rowspan).toBe(0);expect(grid[1]![2]!.colspan).toBe(2);
});
test('RichText native text links, loaded image links and parse-error recovery update the public ref',async()=>{
 const ref=createRef<RichTextRef>(),load=rstest.fn(),link=rstest.fn(),imageClick=rstest.fn(),error=rstest.fn();
 const screen=render(<RichText ref={ref} content={'<h2 id="top">Title</h2><p><a href="/gear">Read</a></p><a href="/photo"><img src="a.jpg"></a>'} enableAnchor onLoad={load} onLinkClick={link} onImageClick={imageClick} onError={error}/>);
 expect(load).toHaveBeenCalledWith({imageCount:1});expect(ref.current!.getHeadings()).toEqual([{id:'top',level:2,text:'Title'}]);fireEvent.tap(screen.getByText('Read'));expect(link).toHaveBeenLastCalledWith({href:'/gear'});
 const img=screen.container.querySelector('.ui-img')!;fireEvent.tap(img);expect(link).toHaveBeenCalledTimes(1);fireEvent(screen.container.querySelector('.ui-img-image')!,event('load',{width:100,height:80}));fireEvent.tap(img);expect(link).toHaveBeenLastCalledWith({href:'/photo'});expect(imageClick).not.toHaveBeenCalled();
 screen.rerender(<RichText ref={ref} content={'x'.repeat(200001)} onError={error}><text>Empty</text></RichText>);expect(error).toHaveBeenCalledWith(expect.objectContaining({source:'parse',code:'CONTENT_LIMIT'}));expect(screen.getByText('Empty')).toBeTruthy();expect(ref.current!.getText()).toBe('');await expect(ref.current!.getAnchorRect('top')).rejects.toThrow();
 screen.rerender(<RichText ref={ref} content="<p>Recovered</p>"/>);expect(ref.current!.getText()).toBe('Recovered');expect(ref.current!.getHeadings()).toEqual([]);
});
test('RichText missing and failed images emit once, preserve alt and never trigger preview or click',()=>{
 const error=rstest.fn(),click=rstest.fn();const screen=render(<RichText content={'<img src="" alt="No photo"><img src="broken.jpg" alt="Broken">'} onError={error} onImageClick={click}/>);
 expect(screen.getByText('No photo')).toBeTruthy();expect(error).toHaveBeenCalledTimes(1);
 fireEvent(screen.container.querySelector('.ui-img-image')!,event('error',{errMsg:'failed'}));expect(screen.getByText('Broken')).toBeTruthy();expect(error).toHaveBeenCalledTimes(2);fireEvent.tap(screen.container.querySelector('.ui-img')!);expect(click).not.toHaveBeenCalled();
});

test('RichText source replacement clears the loaded state before a new image can be clicked',()=>{
 const click=rstest.fn(),error=rstest.fn();const screen=render(<RichText content='<img src="first.jpg">' previewImage={false} onImageClick={click} onError={error}/>);
 fireEvent(screen.container.querySelector('.ui-img-image')!,event('load',{width:100,height:80}));fireEvent.tap(screen.container.querySelector('.ui-img')!);expect(click).toHaveBeenCalledTimes(1);
 screen.rerender(<RichText content='<img src="second.jpg">' previewImage={false} onImageClick={click} onError={error}/>);
 fireEvent.tap(screen.container.querySelector('.ui-img')!);expect(click).toHaveBeenCalledTimes(1);
 fireEvent(screen.container.querySelector('.ui-img-image')!,event('error',{}));fireEvent.tap(screen.container.querySelector('.ui-img')!);expect(click).toHaveBeenCalledTimes(1);expect(error).toHaveBeenCalledTimes(1);
 screen.rerender(<RichText content='<img src="" alt="Missing">' onError={error}/>);expect(error).toHaveBeenCalledTimes(2);
});

test('RichText browser media is opt-in, sanitizes sources and excludes hidden media and fallback children',()=>{
 const html='<video id="trip" poster="javascript:bad" autoplay src="javascript:bad"><source src="clip.mp4"><source src="clip.mp4"><source src="data:image/png;base64,YQ=="><p>fallback</p></video><audio style="display:none" src="hidden.mp3"></audio><div><audio src="sound.mp3"></audio></div>';
 expect(parseRichText(html).media).toEqual([]);
 const parsed=parseRichText(html,{enableMedia:true,baseUrl:'https://example.com/media/'});
 expect(parsed.media).toHaveLength(2);expect(parsed.media[0]!.media).toEqual({id:'trip',type:'video',sources:['https://example.com/media/clip.mp4'],title:'',poster:'',loop:false,muted:false});
 expect(parsed.text).not.toContain('fallback');expect(parsed.media[1]!.media!.sources).toEqual(['https://example.com/media/sound.mp3']);
 expect(parseRichText('<div><audio src="a.mp3"></audio></div>',{enableMedia:true}).media).toHaveLength(1);
 expect(()=>parseRichText('<video>'+Array.from({length:17},(_,i)=>`<source src="clip${i}.mp4">`).join('')+'</video>',{enableMedia:true})).toThrow('16 sources');
});
test('RichText media methods validate ids, isolate component instances and stop accepting stale targets',()=>{
 const one=createRef<RichTextRef>(),two=createRef<RichTextRef>();
 const screen=render(<view><RichText ref={one} content='<video id="same" src="one.mp4"></video>'/><RichText ref={two} content='<audio id="same" src="two.mp3"></audio>'/></view>);
 expect(one.current!.playMedia('same')).toBe(false);expect(two.current!.pauseMedia()).toBe(false);
 screen.rerender(<view><RichText ref={one} mediaMode="browser" content='<video id="duplicate" src="a.mp4"></video><audio id="duplicate" src="b.mp3"></audio>'/><RichText ref={two} content='<p>Other</p>'/></view>);
 expect(one.current!.playMedia('duplicate')).toBe(false);expect(one.current!.seekMedia('missing',5)).toBe(false);expect(one.current!.seekMedia('duplicate',NaN)).toBe(false);expect(two.current!.playMedia('duplicate')).toBe(false);
 screen.rerender(<RichText ref={one} content='<p>Replaced</p>'/>);expect(one.current!.pauseMedia()).toBe(false);
});
