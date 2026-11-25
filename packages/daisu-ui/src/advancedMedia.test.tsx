import { afterEach,beforeEach,expect,rstest,test } from '@rstest/core';
import {cleanup,fireEvent,render,waitFor} from '@lynx-js/react/testing-library';
import {createRef} from '@lynx-js/react';
import type { NodesRef } from '@lynx-js/types';
import { VideoPreview } from './VideoPreview.js';
import type {VideoPreviewRef} from './VideoPreview.js';
import {useVideoPreview} from './useVideoPreview.js';
import {ImgCropper} from './ImgCropper.js';
import type {ImgCropperRef} from './ImgCropper.js';
const calls:{method:string;params?:unknown}[]=[];
beforeEach(()=>{calls.length=0;const original=lynx.createSelectorQuery.bind(lynx);rstest.spyOn(lynx,'createSelectorQuery').mockImplementation(()=>{const query=original(),select=query.select.bind(query);query.select=selector=>selector.startsWith('[react-ref-')?{invoke:(o:Parameters<NodesRef['invoke']>[0])=>({exec(){calls.push({method:o.method,params:o.params});}})} as unknown as NodesRef:select(selector);return query;});});
afterEach(()=>{cleanup();rstest.restoreAllMocks();});
const event=(detail:object)=>Object.assign(new Event('bindEvent:cropperevent'),{eventType:'bindEvent',eventName:'cropperevent',detail});
test('VideoPreview validates unsupported/unsafe opens, applies options and closes exactly once',async()=>{
 const ref=createRef<VideoPreviewRef>(),opened=rstest.fn(),closed=rstest.fn(),error=rstest.fn();
 const screen=render(<VideoPreview ref={ref} duration={0} onError={error}/>);expect(ref.current!.open({url:'movie.mp4'})).toBe(false);
 screen.rerender(<VideoPreview ref={ref} mediaMode="browser" duration={0} onError={error}/>);expect(ref.current!.open({url:'javascript:bad'})).toBe(false);
 expect(ref.current!.open({url:'movie.mp4',fullScreen:true,closePosition:'right-top',onOpen:opened,onClose:closed})).toBe(true);
 await waitFor(()=>expect(screen.container.querySelector('.ui-video-preview-fullscreen')).toBeTruthy());expect(opened).toHaveBeenCalledTimes(1);
 ref.current!.close();ref.current!.close();await waitFor(()=>expect(closed).toHaveBeenCalledTimes(1));expect(calls.some(c=>c.method==='pauseMedia')).toBe(true);
});
test('useVideoPreview keeps two instances isolated and replaces full-screen call options on reopen',async()=>{
 function Example(){const main=useVideoPreview(),sub=useVideoPreview();return <view><text bindtap={()=>main.previewVideo({url:'first.mp4',fullScreen:true})}>Main</text><text bindtap={main.closeVideoPreview}>Close</text><text bindtap={()=>main.previewVideo({url:'second.mp4'})}>Reopen</text><VideoPreview {...main.props} mediaMode="browser" duration={0}/><VideoPreview {...sub.props} mediaMode="browser" duration={0}/></view>;}
 const screen=render(<Example/>);fireEvent.tap(screen.getByText('Main'));await waitFor(()=>expect(screen.container.querySelectorAll('daisu-rich-media')).toHaveLength(1));expect(screen.container.querySelector('.ui-video-preview-fullscreen')).toBeTruthy();fireEvent.tap(screen.getByText('Close'));fireEvent.tap(screen.getByText('Reopen'));await waitFor(()=>expect(screen.container.querySelector('.ui-video-preview-fullscreen')).toBeNull());expect(screen.container.querySelector('daisu-rich-media')!.getAttribute('media-config')).toContain('second.mp4');
});
test('ImgCropper confirmation closes once, reports dimensions and gates browser-only methods',async()=>{
 const ref=createRef<ImgCropperRef>(),confirm=rstest.fn(),change=rstest.fn();
 const screen=render(<ImgCropper ref={ref}/>);expect(ref.current!.open()).toBe(false);
 screen.rerender(<ImgCropper ref={ref} show mode="browser" imgSrc="image.png" onConfirm={confirm} onShowChange={change}/>);
 await waitFor(()=>expect(screen.container.querySelector('daisu-img-cropper')).toBeTruthy());
 expect(ref.current!.setRotate(NaN)).toBe(false);expect(ref.current!.setRotate(90)).toBe(true);
 const node=screen.container.querySelector('daisu-img-cropper')!;const result={tempFilePath:'blob:result',width:700,height:700,fileType:'png'};
 fireEvent(lynx.createSelectorQuery().select('daisu-img-cropper'),event({kind:'confirm',result}));fireEvent(lynx.createSelectorQuery().select('daisu-img-cropper'),event({kind:'confirm',result}));expect(confirm).toHaveBeenCalledTimes(1);expect(confirm).toHaveBeenCalledWith(result);expect(change).toHaveBeenCalledWith(false);
 screen.rerender(<ImgCropper ref={ref} show={false} mode="browser" disabledRotate/>);expect(ref.current!.setRotate(90)).toBe(false);expect(ref.current!.confirm()).toBe(false);expect(ref.current!.downloadResult('blob:result')).toBe(true);
});
