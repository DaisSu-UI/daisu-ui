import { useState } from '@lynx-js/react';
import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import type { NodesRef, ObserveCallback } from '@lynx-js/types';
import { Sticky, StickyBox } from './Sticky.js';
const originalObserver=lynx.createIntersectionObserver;
afterEach(()=>{cleanup();rstest.restoreAllMocks();rstest.useRealTimers();if(!originalObserver)delete (lynx as unknown as Record<string,unknown>).createIntersectionObserver;});
function nativeGeometry(withBox=false){
 if(!lynx.createIntersectionObserver)Object.assign(lynx,{createIntersectionObserver:()=>{throw new Error('Observer mock not installed');}});
 let top=100,boxTop=80,boxHeight=160,reads=0;
 const listeners:{callback?:ObserveCallback;thresholds:readonly number[];disconnect:ReturnType<typeof rstest.fn>}[]=[];
 rstest.spyOn(lynx,'createIntersectionObserver').mockImplementation((_component,options)=>{const listener={disconnect:rstest.fn(),thresholds:options?.thresholds??[0]} as typeof listeners[number];listeners.push(listener);const observer={relativeToViewport(){return observer;},observe(_selector:string,callback:ObserveCallback){listener.callback=callback;},disconnect:listener.disconnect};return observer as unknown as ReturnType<typeof lynx.createIntersectionObserver>;});
 const original=lynx.createSelectorQuery.bind(lynx);
 rstest.spyOn(lynx,'createSelectorQuery').mockImplementation(()=>{const query=original(),select=query.select.bind(query);query.select=selector=>{const node=select(selector),invoke=node.invoke.bind(node);node.invoke=options=>options.method==='boundingClientRect'?{exec(){const boundary=withBox&&++reads%2===0,y=boundary?boxTop:top,height=boundary?boxHeight:40;options.success?.({left:12,right:112,top:y,bottom:y+height,width:100,height});}} as unknown as ReturnType<NodesRef['invoke']>:invoke(options);return node;};return query;});
 // Like Android, an explicitly empty threshold list produces no scroll callbacks.
 return {listeners,reads:()=>reads,set(t:number,b=boxTop,h=boxHeight){top=t;boxTop=b;boxHeight=h;},notify(){for(const listener of listeners)if(listener.thresholds.length&&!listener.disconnect.mock.calls.length)listener.callback?.({} as Parameters<ObserveCallback>[0]);}};
}
function StatefulContent(){const [value,setValue]=useState(0);return <text bindtap={()=>setValue(current=>current+1)}>{`原始内容${value}`}</text>;}
function layout(node:Element,width=100,height=40){fireEvent(node,Object.assign(new Event('bindEvent:layoutchange'),{eventType:'bindEvent',eventName:'layoutchange',detail:{width,height}}));}
test('Sticky pins at viewport offset, preserves its placeholder and child state, then returns',async()=>{
 const native=nativeGeometry(),screen=render(<Sticky offsetTop={44}><StatefulContent/></Sticky>),content=screen.container.querySelector('.ui-sticky-content-measure')!;layout(content);fireEvent.tap(screen.getByText('原始内容0'));await waitFor(()=>expect(screen.getByText('原始内容1')).toBeTruthy());
 const css=()=>screen.container.querySelector('.ui-sticky-container')!.getAttribute('style')!;
 await waitFor(()=>expect(native.listeners.length).toBeGreaterThan(0));native.set(30);native.notify();await waitFor(()=>expect(css()).toContain('fixed'));expect(css()).toContain('44px');expect(screen.container.querySelector('.ui-sticky')!.getAttribute('style')).toContain('z-index: 0');expect(css()).toContain('z-index: 1');expect(screen.container.querySelector('.ui-sticky')!.getAttribute('style')).toContain('40px');expect(screen.getByText('原始内容1')).toBeTruthy();
 native.set(120);native.notify();await waitFor(()=>expect(css()).toContain('relative'));expect(css()).toContain('left: 0px');expect(css()).toContain('z-index: 0');expect(css()).toContain('width: auto');expect(screen.container.querySelector('.ui-sticky')!.getAttribute('style')).toContain('width: auto');
 screen.rerender(<Sticky offsetTop={150}><StatefulContent/></Sticky>);await waitFor(()=>expect(css()).toContain('150px'));expect(screen.getByText('原始内容1')).toBeTruthy();
 screen.unmount();expect(native.listeners.every(listener=>listener.disconnect.mock.calls.length>0)).toBe(true);
});
test('StickyBox stops at its bottom, handles resized containers and restores without reparenting',async()=>{
 const native=nativeGeometry(true),screen=render(<StickyBox><view><Sticky offsetTop={44}><text>内容</text></Sticky></view></StickyBox>);layout(screen.container.querySelector('.ui-sticky-content-measure')!);
 const css=()=>screen.container.querySelector('.ui-sticky-container')!.getAttribute('style')!;
 native.set(20,0,160);native.notify();await waitFor(()=>expect(css()).toContain('fixed'));
 native.set(-100,-120,160);native.notify();await waitFor(()=>expect(css()).toContain('absolute'));expect(css()).toContain('100px');
 native.set(20,0,20);layout(screen.container.querySelector('.ui-sticky-box-measure')!,100,20);await waitFor(()=>expect(css()).toContain('relative'));
 native.set(100,80,160);native.notify();await waitFor(()=>expect(css()).toContain('relative'));
});
test('Sticky remeasures dynamic children and maintains separate observer identities',async()=>{
 const native=nativeGeometry(),screen=render(<view><Sticky/><Sticky><text>另一个</text></Sticky></view>);
 const ids=Array.from(screen.container.querySelectorAll('.ui-sticky')).map(node=>node.id);await waitFor(()=>expect(screen.container.querySelectorAll('.ui-sticky-sentinel')).toHaveLength(2));
 await waitFor(()=>{const current=Array.from(screen.container.querySelectorAll('.ui-sticky')).map(node=>node.id);expect(current[0]).toBeTruthy();expect(current[0]).not.toBe(current[1]);});
 screen.rerender(<view><Sticky><text>动态插入</text></Sticky><Sticky><text>另一个</text></Sticky></view>);layout(screen.container.querySelector('.ui-sticky-content-measure')!,180,60);native.set(-10);native.notify();await waitFor(()=>expect(screen.container.querySelector('.ui-sticky')!.getAttribute('style')).toContain('60px'));expect(screen.getByText('动态插入')).toBeTruthy();expect(ids).toHaveLength(2);
});

test('Sticky does not freeze the initial empty width or accept descendant layout sizes', async()=>{
 const native=nativeGeometry(),screen=render(<Sticky/>);
 const probe=()=>screen.container.querySelector('.ui-sticky-content-measure')!;
 layout(probe(),1,1);
 await waitFor(()=>expect(native.listeners.length).toBeGreaterThan(0));
 expect(screen.container.querySelector('.ui-sticky')!.getAttribute('style')).toContain('width: auto');
 screen.rerender(<Sticky><text>动态生成的操作按钮</text></Sticky>);
 layout(probe(),180,40);
 native.set(-10);native.notify();
 await waitFor(()=>expect(screen.container.querySelector('.ui-sticky')!.getAttribute('style')).toContain('width: 180px'));
 layout(screen.getByText('动态生成的操作按钮'),12,40);
 expect(screen.container.querySelector('.ui-sticky')!.getAttribute('style')).toContain('width: 180px');
 native.set(100);native.notify();
 await waitFor(()=>expect(screen.container.querySelector('.ui-sticky')!.getAttribute('style')).toContain('width: auto'));
});

test('Sticky resynchronizes after a scroll round trip even when native observer callbacks are missed', async()=>{
 const native=nativeGeometry(true),screen=render(<StickyBox><Sticky scrollTop={0} offsetTop={44}><text>同步滚动</text></Sticky></StickyBox>);
 layout(screen.container.querySelector('.ui-sticky-content-measure')!);
 const position=()=>screen.container.querySelector('.ui-sticky-container')!.getAttribute('style')!;
 native.set(20,0,160);
 screen.rerender(<StickyBox><Sticky scrollTop={80} offsetTop={44}><text>同步滚动</text></Sticky></StickyBox>);
 await waitFor(()=>expect(position()).toContain('position: fixed'));
 native.set(-100,-120,160);
 screen.rerender(<StickyBox><Sticky scrollTop={200} offsetTop={44}><text>同步滚动</text></Sticky></StickyBox>);
 await waitFor(()=>expect(position()).toContain('position: absolute'));
 native.set(100,80,160);
 screen.rerender(<StickyBox><Sticky scrollTop={0} offsetTop={44}><text>同步滚动</text></Sticky></StickyBox>);
 await waitFor(()=>expect(position()).toContain('position: relative'));
 expect(position()).toContain('left: 0px');
});

test('Sticky keeps bounded native geometry and coalesces bottom-edge notifications without changing width', async()=>{
 const native=nativeGeometry(true),screen=render(<StickyBox><Sticky offsetTop={44}><text>底部稳定内容</text></Sticky></StickyBox>);
 layout(screen.container.querySelector('.ui-sticky-content-measure')!);
 native.set(-100,-120,160);native.notify();
 const container=()=>screen.container.querySelector('.ui-sticky-container') as HTMLElement;
 await waitFor(()=>expect(container().style.position).toBe('absolute'));
 expect(container().style.width).toBe('100px');
 const observerCount=native.listeners.length;
 // Descendant layout must not be mistaken for a resize of the entire StickyBox.
 layout(screen.container.querySelector('.ui-sticky-box')!,30,10);
 layout(screen.container.querySelector('.ui-sticky-content-measure')!,100.1,40.1);
 await Promise.resolve();
 expect(native.listeners).toHaveLength(observerCount);
 rstest.useFakeTimers();
 const before=native.reads();
 for(let index=0;index<200;index++)native.notify();
 expect(native.reads()).toBe(before);
 await rstest.advanceTimersByTimeAsync(16);
 expect(native.reads()-before).toBe(2);
 expect(container().style.position).toBe('absolute');
 expect(container().style.top).toBe('100px');
 expect(container().style.width).toBe('100px');
 native.set(100,80,160);native.notify();
 await rstest.advanceTimersByTimeAsync(16);
 expect(container().style.position).toBe('relative');
 screen.unmount();
 await rstest.runOnlyPendingTimersAsync();
 expect(rstest.getTimerCount()).toBe(0);
});
