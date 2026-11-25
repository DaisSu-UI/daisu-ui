import { afterEach, beforeEach, expect, rstest, test } from '@rstest/core';
import { registerRichTextMedia } from './richTextMediaElement.js';
import type { RichTextMediaConfig, RichTextMediaSignal } from '../richTextMedia.js';

let played: HTMLMediaElement[], paused: HTMLMediaElement[];
beforeEach(() => {
  played=[];paused=[];
  rstest.spyOn(HTMLMediaElement.prototype,'load').mockImplementation(()=>{});
  rstest.spyOn(HTMLMediaElement.prototype,'play').mockImplementation(function(this:HTMLMediaElement){
    played.push(this);Object.defineProperty(this,'paused',{configurable:true,value:false});this.dispatchEvent(new Event('play'));return Promise.resolve();
  });
  rstest.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(function(this:HTMLMediaElement){
    paused.push(this);const was=this.paused;Object.defineProperty(this,'paused',{configurable:true,value:true});if(!was)this.dispatchEvent(new Event('pause'));
  });
  registerRichTextMedia();
});
afterEach(async()=>{document.querySelectorAll('daisu-rich-media').forEach(e=>e.remove());await Promise.resolve();rstest.restoreAllMocks();});
type Player=HTMLElement&{playMedia:()=>boolean;pauseMedia:()=>boolean;seekMedia:(options:{seconds:number})=>boolean};
function mount(config:Partial<RichTextMediaConfig>={}){
 const node=document.createElement('daisu-rich-media') as Player,events:RichTextMediaSignal[]=[];
 node.addEventListener('mediaevent',e=>events.push((e as CustomEvent<RichTextMediaSignal>).detail));
 node.setAttribute('media-config',JSON.stringify({id:'clip',type:'audio',sources:['https://example.com/sound.mp3'],title:'Reading',loop:false,muted:false,...config}));document.body.append(node);
 const media=node.shadowRoot!.querySelector('audio,video') as HTMLMediaElement;return{node,media,events};
}
test('browser media queues seek without autoplay, reports actual events, and pauses/releases on removal',async()=>{
 const {node,media,events}=mount();expect(played).toHaveLength(0);expect(node.seekMedia({seconds:5})).toBe(true);expect(played).toHaveLength(0);
 Object.defineProperties(media,{readyState:{configurable:true,value:1},duration:{configurable:true,value:8}});media.dispatchEvent(new Event('loadedmetadata'));expect(media.currentTime).toBe(5);
 expect(node.playMedia()).toBe(true);await Promise.resolve();expect(events.some(e=>e.kind==='play'&&e.id==='clip')).toBe(true);
 node.pauseMedia();expect(media.paused).toBe(true);expect(events.some(e=>e.kind==='pause')).toBe(true);
 expect(node.seekMedia({seconds:-1})).toBe(false);expect(node.seekMedia({seconds:Infinity})).toBe(false);
 node.remove();await Promise.resolve();expect(paused).toContain(media);expect(media.hasAttribute('src')).toBe(false);expect(node.playMedia()).toBe(false);
});
test('browser media falls back between sources and only reports terminal resource failure',()=>{
 const {node,media,events}=mount({type:'video',sources:['https://example.com/first.mp4','https://example.com/second.mp4']});
 media.dispatchEvent(new Event('error'));expect(media.src).toBe('https://example.com/second.mp4');expect(events.filter(e=>e.kind==='error')).toHaveLength(0);
 media.dispatchEvent(new Event('error'));expect(events.filter(e=>e.kind==='error')).toEqual([expect.objectContaining({kind:'error',fatal:true,src:'https://example.com/second.mp4'})]);expect(node.shadowRoot!.querySelector('.error')!.textContent).toBe('Reading ×');expect(node.playMedia()).toBe(false);
});
test('browser media blocks executable URLs and aborts stale play completions after disposal',async()=>{
 const rejected=mount({sources:['javascript:alert(1)','data:audio/mpeg;base64,YQ==','file:///tmp/audio']});expect(rejected.events).toEqual([expect.objectContaining({kind:'error',fatal:true})]);expect(rejected.node.playMedia()).toBe(false);
 let resolve!:()=>void;rstest.mocked(HTMLMediaElement.prototype.play).mockImplementation(()=>new Promise<void>(r=>{resolve=r;}));
 const {node,media,events}=mount();node.playMedia();node.remove();await Promise.resolve();resolve();await Promise.resolve();expect(paused).toContain(media);expect(events.some(e=>e.kind==='play')).toBe(false);
});
test('a browser play rejection remains retryable and content replacement resets errors and resources',async()=>{
 const {node,media,events}=mount();rstest.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(Object.assign(new Error('User gesture required'),{name:'NotAllowedError'}));node.playMedia();await Promise.resolve();await Promise.resolve();expect(events).toContainEqual(expect.objectContaining({kind:'error',fatal:false}));expect(node.shadowRoot!.querySelector('button')).toBeTruthy();
 node.setAttribute('media-config',JSON.stringify({id:'next',type:'audio',sources:['https://example.com/next.mp3'],title:'Next'}));expect(media.hasAttribute('src')).toBe(false);expect(node.shadowRoot!.querySelector('button')!.textContent).toContain('Next');expect(node.playMedia()).toBe(true);
});
test('a seek discarded while metadata is arriving is retried when the player becomes ready',()=>{
 const {node,media,events}=mount({type:'video'});let time=0,canSeek=false;
 Object.defineProperties(media,{readyState:{configurable:true,value:1},duration:{configurable:true,value:15},currentTime:{configurable:true,get:()=>time,set:(value:number)=>{if(canSeek)time=value;}}});
 expect(node.seekMedia({seconds:5})).toBe(true);expect(time).toBe(0);
 media.dispatchEvent(new Event('loadedmetadata'));expect(time).toBe(0);expect(played).toHaveLength(0);
 canSeek=true;media.dispatchEvent(new Event('canplay'));expect(time).toBe(5);
 media.dispatchEvent(new Event('seeked'));expect(events).toContainEqual(expect.objectContaining({kind:'timeupdate',currentTime:5}));expect(played).toHaveLength(0);
});
