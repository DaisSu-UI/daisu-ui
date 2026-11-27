import { afterEach, beforeEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import type { ReactNode } from '@lynx-js/react';
import { createRef, forwardRef, runOnMainThread, useImperativeHandle, useState } from '@lynx-js/react' with { rstest: 'importActual' };
import type { SwiperProps as NativeProps } from '@lynx-js/lynx-ui';
const { native }=rstest.hoisted(()=>({native:{swipeTo:rstest.fn(),swipeNext:rstest.fn(),swipePrev:rstest.fn(),props:null as NativeProps<string|Record<string,unknown>>|null}}));
// Tests cover controlled state and main-thread style writes. Native compositor
// timing and device gestures still require an actual host.
rstest.mock('@lynx-js/lynx-ui',()=>({Swiper:forwardRef((props:NativeProps<string|Record<string,unknown>>,ref)=>{native.props=props;useImperativeHandle(ref,()=>native);return <view>{props.data?.map((item,index)=><view key={index}>{props.children?.({item,index,realIndex:index})}</view>)}</view>; }),SwiperItem:({children}:{children?:ReactNode})=><view>{children}</view>}));
import { Swiper } from './Swiper.js';
import type { SwiperRef } from './Swiper.js';
import { swiperIndex, swiperNumber } from './swiperModel.js';
import { swiperCardFrame } from './swiperAnimation.js';
const list=['a.jpg','b.jpg','c.jpg'];
function resize(node:Element,width=390,height=192){fireEvent(node.querySelector('.ui-swiper-measure')||node,Object.assign(new Event('bindEvent:layoutchange'),{eventType:'bindEvent',eventName:'layoutchange',detail:{width,height}}));}
function start(){native.props!.onSwipeStart?.(0);}
function finish(index:number){native.props!.onSwipeStop?.(index);}
beforeEach(()=>{native.swipeTo.mockClear();native.swipeNext.mockClear();native.swipePrev.mockClear();native.props=null;});
afterEach(()=>{cleanup();rstest.useRealTimers();});
test('Swiper normalizes invalid indexes, boundaries, dimensions and empty lists',()=>{
 expect(swiperIndex(-1,3,true)).toBe(2);expect(swiperIndex(8,3,false)).toBe(2);expect(swiperIndex(NaN,3,false)).toBe(0);expect(swiperIndex(2,0,true)).toBe(0);expect(swiperNumber(Infinity,300)).toBe(300);
 const screen=render(<Swiper list={list} displayMultipleItems={2} previousMargin={24} nextMargin={24} autoplay={false}/>);resize(screen.container.querySelector('.ui-swiper')!);expect(native.props!.itemWidth).toBe(171);expect(native.props!.containerWidth).toBe(342);
 screen.rerender(<Swiper list={[]} autoplay={false}/>);expect(screen.container.querySelector('.ui-swiper-native')).toBeNull();expect(screen.container.querySelector('.ui-swiper-indicator')).toBeNull();
});
test('Swiper preserves item clicks, object field mapping and custom rendering',()=>{
 const click=rstest.fn(),screen=render(<Swiper list={[{url:'a.jpg',title:'标题'}]} valueKey="url" textKey="title" autoplay={false} onClick={click}/>);resize(screen.container.querySelector('.ui-swiper')!);expect(screen.getByText('标题')).toBeTruthy();expect(screen.container.querySelector('image')!.getAttribute('src')).toBe('a.jpg');fireEvent.tap(screen.container.querySelector('.ui-swiper-item')!);expect(click).toHaveBeenCalledWith(0,{url:'a.jpg',title:'标题'});
 start();fireEvent.tap(screen.container.querySelector('.ui-swiper-item')!);expect(click).toHaveBeenCalledTimes(1);finish(0);
 screen.rerender(<Swiper list={list} autoplay={false} renderItem={({index})=>`内容${index}`} renderIndicator={({total})=>`总数${total}`}/>);expect(screen.getByText('内容2')).toBeTruthy();expect(screen.getByText('总数3')).toBeTruthy();
});
test('Swiper keeps imperative and indicator navigation animated and reports exactly once on completion',async()=>{
 const ref=createRef<SwiperRef>(),change=rstest.fn(),screen=render(<Swiper ref={ref} list={list} loop={false} autoplay={false} onChange={change}/>);resize(screen.container.querySelector('.ui-swiper')!);
 ref.current!.swipeTo(2);expect(native.swipeTo).toHaveBeenLastCalledWith(2,{animate:true});start();expect(change).not.toHaveBeenCalled();finish(2);await waitFor(()=>expect(change).toHaveBeenCalledWith(2,'nav'));
 fireEvent.tap(screen.container.querySelectorAll('.ui-swiper-dot')[1]!,{eventType:'catchEvent'});expect(native.swipeTo).toHaveBeenLastCalledWith(1,{animate:true});start();finish(1);expect(change).toHaveBeenLastCalledWith(1,'nav');expect(change).toHaveBeenCalledTimes(2);
 start();finish(0);expect(change).toHaveBeenLastCalledWith(0,'touch');
});
test('Swiper accepts controlled changes, restores rejected touch changes silently, and reconciles prop updates',async()=>{
 const change=rstest.fn(),screen=render(<Swiper list={list} current={0} autoplay={false} onChange={change}/>);resize(screen.container.querySelector('.ui-swiper')!);start();finish(1);
 await waitFor(()=>expect(native.swipeTo).toHaveBeenCalledWith(0,{animate:false}));start();finish(0);expect(change).toHaveBeenCalledTimes(1);expect(change).toHaveBeenCalledWith(1,'touch');
 screen.rerender(<Swiper list={list} current={2} autoplay={false} onChange={change}/>);await waitFor(()=>expect(native.swipeTo).toHaveBeenLastCalledWith(2,{animate:true}));start();finish(2);expect(change).toHaveBeenLastCalledWith(2,'nav');expect(screen.container.querySelectorAll('.ui-swiper-dot')[2]!.className).toContain('ui-swiper-dot-active');
});
test('Swiper controlled listeners can accept native changes without a rollback',async()=>{
 function Controlled(){const [current,setCurrent]=useState(0);return <Swiper list={list} current={current} autoplay={false} onChange={setCurrent}/>;}
 const screen=render(<Controlled/>);resize(screen.container.querySelector('.ui-swiper')!);start();finish(1);await waitFor(()=>expect(screen.container.querySelectorAll('.ui-swiper-dot')[1]!.className).toContain('ui-swiper-dot-active'));expect(native.swipeTo).not.toHaveBeenCalled();
});
test('Swiper pauses autoplay during gestures, wraps through native paging, and cancels timers on unmount',async()=>{
 rstest.useFakeTimers();const change=rstest.fn(),screen=render(<Swiper list={list} defaultCurrent={2} interval={1000} onChange={change}/>);resize(screen.container.querySelector('.ui-swiper')!);await rstest.advanceTimersByTimeAsync(1000);expect(native.swipeNext).toHaveBeenCalledTimes(1);start();finish(0);expect(change).toHaveBeenLastCalledWith(0,'autoplay');await rstest.advanceTimersByTimeAsync(0);start();await rstest.advanceTimersByTimeAsync(1500);expect(native.swipeNext).toHaveBeenCalledTimes(1);finish(1);await rstest.advanceTimersByTimeAsync(1000);expect(native.swipeNext).toHaveBeenCalledTimes(2);screen.unmount();await rstest.advanceTimersByTimeAsync(4000);expect(native.swipeNext).toHaveBeenCalledTimes(2);
});
test('Swiper stops non-loop autoplay at the final item and recovers when a list shrinks',async()=>{
 rstest.useFakeTimers();const screen=render(<Swiper list={list} defaultCurrent={2} loop={false} interval={1000}/>);resize(screen.container.querySelector('.ui-swiper')!);await rstest.advanceTimersByTimeAsync(3000);expect(native.swipeTo).not.toHaveBeenCalled();screen.rerender(<Swiper list={['a.jpg']} loop={false}/>);await rstest.advanceTimersByTimeAsync(0);expect(native.props!.initialIndex).toBe(0);expect(screen.container.querySelector('.ui-swiper-indicator')).toBeNull();
});

test('Swiper card height follows physical progress, including loop duplicates and the initial frame',()=>{
 expect(swiperCardFrame(0,192,168).height).toBe('192px');expect(swiperCardFrame(1,192,168).height).toBe('168px');expect(swiperCardFrame(-1,192,168).height).toBe('168px');expect(swiperCardFrame(.5,192,168).height).toBe('180px');expect(swiperCardFrame(2,192,168).height).toBe('192px');
 const screen=render(<Swiper list={list} neighborHeight={168} previousMargin={24} nextMargin={24} displayMultipleItems={2} autoplay={false}/>);resize(screen.container.querySelector('.ui-swiper')!);expect(native.props!.customAnimationFirstScreen!(.5,1)).toEqual({});expect(native.props!.containerWidth).toBe(342);
 expect(Array.from(screen.container.querySelectorAll('.ui-swiper-card-viewport')).map(node=>(node as HTMLElement).style.height)).toEqual(['192px','168px','192px']);
 expect(Array.from(screen.container.querySelectorAll('.ui-swiper-card-image')).every(node=>(node as HTMLElement).style.height==='192px')).toBe(true);
 // Descendant layout events must never resize the native viewport or reset paging.
 fireEvent(screen.container.querySelector('.ui-swiper')!,Object.assign(new Event('bindEvent:layoutchange'),{eventType:'bindEvent',eventName:'layoutchange',detail:{width:780,height:192}}));expect(native.props!.containerWidth).toBe(342);expect(native.props!.itemWidth).toBe(171);
});

test('Swiper preserves the old visible-height curve without scaling image content', () => {
  for (const progress of [-2, -1, -.5, 0, .5, 1, 2, 5]) {
    const frame = swiperCardFrame(progress, 192, 168);
    expect(frame.transform).toBeUndefined();
    const oldVisibleHeight = 192 - 24 * Math.max(0, 1 - Math.abs(Math.abs(progress) - 1));
    expect(frame.height).toBe(`${oldVisibleHeight}px`);
  }
});

 test('Swiper does not rebuild its native slides when a gesture starts', () => {
 const renderItem=rstest.fn(({index}: {index:number})=><text>{index}</text>);
 const screen=render(<Swiper list={list} autoplay={false} neighborHeight={168} displayMultipleItems={2} renderItem={renderItem}/>);resize(screen.container.querySelector('.ui-swiper')!);
 const before=renderItem.mock.calls.length;start();expect(renderItem.mock.calls.length).toBe(before);
 expect(screen.container.querySelector('.ui-swiper-item')?.getAttribute('style')).toContain('height: 192px');
 });

test('main-thread card frames animate the crop while leaving images and slide geometry unchanged', async () => {
 const screen=render(<Swiper list={list} autoplay={false} neighborHeight={168}/>,{enableMainThread:true,enableBackgroundThread:true});
 resize(screen.container.querySelector('.ui-swiper')!);
 await waitFor(()=>expect(screen.container.querySelectorAll('.ui-swiper-card-viewport')).toHaveLength(3));
 const animate=native.props!['main-thread:customAnimation']!;
 for(const progress of [0,.5,1,1.5,2,-1]){
  await runOnMainThread(animate)(progress,0);
  expect((screen.container.querySelector('.ui-swiper-card-viewport') as HTMLElement).style.height).toBe(swiperCardFrame(progress,192,168).height);
  expect((screen.container.querySelector('.ui-swiper-card-image') as HTMLElement).style.height).toBe('192px');
  expect((screen.container.querySelector('.ui-swiper-item') as HTMLElement).style.height).toBe('192px');
 }
});
