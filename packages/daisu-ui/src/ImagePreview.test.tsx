import { afterEach, beforeEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { createRef } from '@lynx-js/react';
import type { SwiperProps } from './Swiper.js';
const { observed }=rstest.hoisted(()=>({observed:{props:null as SwiperProps|null}}));
// Native paging is exercised by the browser; keep preview lifecycle/slots real.
rstest.mock('./Swiper.js',()=>({Swiper:(props:SwiperProps)=>{observed.props=props;return <view className="preview-test-swiper">{props.list.map((item,index)=><view key={index}>{props.renderItem?.({item,index})}</view>)}</view>;}}));
import { ImagePreview } from './ImagePreview.js';
import type { ImagePreviewRef } from './ImagePreview.js';
import { useImagePreview } from './useImagePreview.js';
const images=['first.jpg','second.jpg','third.jpg'];
beforeEach(()=>{observed.props=null;});afterEach(()=>{cleanup();rstest.useRealTimers();});
test('ImagePreview clamps the start index, preserves fitting and gates close requests and callbacks',async()=>{
 const change=rstest.fn(),opened=rstest.fn(),closed=rstest.fn(),click=rstest.fn();const screen=render(<ImagePreview show images={images} startPosition={100} onShowChange={change} onOpen={opened} onClose={closed} onClick={click}/>);
 await waitFor(()=>expect(screen.getByText('3 / 3')).toBeTruthy());expect(opened).toHaveBeenCalledTimes(1);expect(observed.props!.autoplay).toBe(false);expect(screen.container.querySelector('image')!.getAttribute('mode')).toBe('aspectFit');observed.props!.onClick!(2,images[2]!);observed.props!.onClick!(2,images[2]!);expect(change).toHaveBeenCalledTimes(1);expect(click).toHaveBeenCalledWith(2);
 screen.rerender(<ImagePreview show={false} images={images} onClose={closed}/>);await waitFor(()=>expect(closed).toHaveBeenCalledTimes(1));
});
test('ImagePreview changes slides, handles long press and independently configures close icon/index/content',async()=>{
 const change=rstest.fn(),press=rstest.fn(),close=rstest.fn();const screen=render(<ImagePreview show images={images} closeOnClick={false} closeIconPosition="top-left" onShowChange={close} onChange={change} onLongPress={press}/>);
 await waitFor(()=>expect(observed.props).toBeTruthy());observed.props!.onClick!(0,images[0]!);expect(close).not.toHaveBeenCalled();observed.props!.onChange!(1,'touch');expect(change).toHaveBeenCalledWith(1);await waitFor(()=>expect(screen.getByText('2 / 3')).toBeTruthy());
 fireEvent(screen.container.querySelector('.ui-image-preview-item')!,Object.assign(new Event('bindEvent:longpress'),{eventType:'bindEvent',eventName:'longpress',detail:{}}));expect(press).toHaveBeenCalledWith(0);fireEvent.tap(screen.container.querySelector('.ui-image-preview-close-top-left')!,{eventType:'catchEvent'});expect(close).toHaveBeenCalledWith(false);
 screen.rerender(<ImagePreview show images={images} closeable={false} showIndex={false} renderIndicator={({current,total})=><text>{`${current} of ${total}`}</text>} renderContent={({current})=><text>{`说明${current}`}</text>}/>);expect(screen.container.querySelector('.ui-image-preview-close')).toBeNull();expect(screen.container.querySelector('.ui-image-preview-index')).toBeNull();expect(screen.getByText('1 of 3')).toBeTruthy();expect(screen.getByText('说明1')).toBeTruthy();
});
test('ImagePreview imperative open replaces the session and normalizes active indexes',async()=>{
 const ref=createRef<ImagePreviewRef>(),screen=render(<ImagePreview ref={ref}/>);ref.current!.open({images,startPosition:1,closeable:false});await waitFor(()=>expect(screen.getByText('2 / 3')).toBeTruthy());ref.current!.setActive(-1);await waitFor(()=>expect(screen.getByText('1 / 3')).toBeTruthy());ref.current!.open(['one.jpg']);await waitFor(()=>expect(observed.props!.list).toEqual(['one.jpg']));expect(screen.container.querySelector('.ui-image-preview-index')).toBeNull();ref.current!.close();
});
test('useImagePreview keeps callers isolated and resets per-call options on reopen',async()=>{
 function Example(){const a=useImagePreview(),b=useImagePreview();return <view><text bindtap={()=>a.previewImage({images,startPosition:2,showIndex:false})}>第一次</text><text bindtap={()=>a.previewImage(images)}>重开</text><text bindtap={a.closeImagePreview}>关闭</text><ImagePreview {...a.props}/><ImagePreview {...b.props}/></view>;}
 const screen=render(<Example/>);fireEvent.tap(screen.getByText('第一次'));await waitFor(()=>expect(observed.props!.current).toBe(2));expect(screen.container.querySelector('.ui-image-preview-index')).toBeNull();fireEvent.tap(screen.getByText('关闭'));fireEvent.tap(screen.getByText('重开'));await waitFor(()=>expect(screen.getByText('1 / 3')).toBeTruthy());expect(screen.container.querySelectorAll('.preview-test-swiper')).toHaveLength(1);
});
test('ImagePreview releases the native pager after leave and cancels stale leave work when reopened',async()=>{
 rstest.useFakeTimers();const screen=render(<ImagePreview show images={images} duration={0}/>);await rstest.advanceTimersByTimeAsync(40);expect(screen.container.querySelector('.preview-test-swiper')).toBeTruthy();screen.rerender(<ImagePreview show={false} images={images} duration={0}/>);await rstest.advanceTimersByTimeAsync(40);expect(screen.container.querySelector('.preview-test-swiper')).toBeNull();screen.rerender(<ImagePreview show images={images} duration={0}/>);await rstest.advanceTimersByTimeAsync(40);expect(screen.container.querySelector('.preview-test-swiper')).toBeTruthy();
});
