import { useState } from '@lynx-js/react';
import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import type { NodesRef, ObserveCallback } from '@lynx-js/types';
import { Sticky, StickyBox } from './Sticky.js';
const originalObserver=lynx.createIntersectionObserver;
afterEach(()=>{cleanup();rstest.restoreAllMocks();if(!originalObserver)delete (lynx as unknown as Record<string,unknown>).createIntersectionObserver;});
function nativeGeometry(withBox=false){
 if(!lynx.createIntersectionObserver)Object.assign(lynx,{createIntersectionObserver:()=>{throw new Error('Observer mock not installed');}});
 let top=100,boxTop=80,boxHeight=160,reads=0;
 const listeners:{callback?:ObserveCallback;disconnect:ReturnType<typeof rstest.fn>}[]=[];
 rstest.spyOn(lynx,'createIntersectionObserver').mockImplementation(()=>{const listener={disconnect:rstest.fn()} as typeof listeners[number];listeners.push(listener);const observer={relativeToViewport(){return observer;},observe(_selector:string,callback:ObserveCallback){listener.callback=callback;},disconnect:listener.disconnect};return observer as unknown as ReturnType<typeof lynx.createIntersectionObserver>;});
 const original=lynx.createSelectorQuery.bind(lynx);
 rstest.spyOn(lynx,'createSelectorQuery').mockImplementation(()=>{const query=original(),select=query.select.bind(query);query.select=selector=>{const node=select(selector),invoke=node.invoke.bind(node);node.invoke=options=>options.method==='boundingClientRect'?{exec(){const boundary=withBox&&++reads%2===0,y=boundary?boxTop:top,height=boundary?boxHeight:40;options.success?.({left:12,right:112,top:y,bottom:y+height,width:100,height});}} as unknown as ReturnType<NodesRef['invoke']>:invoke(options);return node;};return query;});
 return {listeners,set(t:number,b=boxTop,h=boxHeight){top=t;boxTop=b;boxHeight=h;},notify(){for(const listener of listeners)if(!listener.disconnect.mock.calls.length)listener.callback?.({} as Parameters<ObserveCallback>[0]);}};
}
function StatefulContent(){const [value,setValue]=useState(0);return <text bindtap={()=>setValue(current=>current+1)}>{`原始内容${value}`}</text>;}
function layout(node:Element,width=100,height=40){fireEvent(node,Object.assign(new Event('bindEvent:layoutchange'),{eventType:'bindEvent',eventName:'layoutchange',detail:{width,height}}));}
test('Sticky pins at viewport offset, preserves its placeholder and child state, then returns',async()=>{
 const native=nativeGeometry(),screen=render(<Sticky offsetTop={44}><StatefulContent/></Sticky>),content=screen.container.querySelector('.ui-sticky-content')!;layout(content);fireEvent.tap(screen.getByText('原始内容0'));await waitFor(()=>expect(screen.getByText('原始内容1')).toBeTruthy());
 const css=()=>screen.container.querySelector('.ui-sticky-container')!.getAttribute('style')!;
 await waitFor(()=>expect(native.listeners.length).toBeGreaterThan(0));native.set(30);native.notify();await waitFor(()=>expect(css()).toContain('fixed'));expect(css()).toContain('44px');expect(screen.container.querySelector('.ui-sticky')!.getAttribute('style')).toContain('40px');expect(screen.getByText('原始内容1')).toBeTruthy();
 native.set(120);native.notify();await waitFor(()=>expect(css()).toContain('relative'));
 screen.rerender(<Sticky offsetTop={150}><StatefulContent/></Sticky>);await waitFor(()=>expect(css()).toContain('150px'));expect(screen.getByText('原始内容1')).toBeTruthy();
 screen.unmount();expect(native.listeners.every(listener=>listener.disconnect.mock.calls.length>0)).toBe(true);
});
test('StickyBox stops at its bottom, handles resized containers and restores without reparenting',async()=>{
 const native=nativeGeometry(true),screen=render(<StickyBox><view><Sticky offsetTop={44}><text>内容</text></Sticky></view></StickyBox>);layout(screen.container.querySelector('.ui-sticky-content')!);
 const css=()=>screen.container.querySelector('.ui-sticky-container')!.getAttribute('style')!;
 native.set(20,0,160);native.notify();await waitFor(()=>expect(css()).toContain('fixed'));
 native.set(-100,-120,160);native.notify();await waitFor(()=>expect(css()).toContain('absolute'));expect(css()).toContain('100px');
 native.set(20,0,20);layout(screen.container.querySelector('.ui-sticky-box')!,100,20);await waitFor(()=>expect(css()).toContain('relative'));
 native.set(100,80,160);native.notify();await waitFor(()=>expect(css()).toContain('relative'));
});
test('Sticky remeasures dynamic children and maintains separate observer identities',async()=>{
 const native=nativeGeometry(),screen=render(<view><Sticky/><Sticky><text>另一个</text></Sticky></view>);
 const ids=Array.from(screen.container.querySelectorAll('.ui-sticky')).map(node=>node.id);await waitFor(()=>expect(screen.container.querySelectorAll('.ui-sticky-sentinel')).toHaveLength(2));
 await waitFor(()=>{const current=Array.from(screen.container.querySelectorAll('.ui-sticky')).map(node=>node.id);expect(current[0]).toBeTruthy();expect(current[0]).not.toBe(current[1]);});
 screen.rerender(<view><Sticky><text>动态插入</text></Sticky><Sticky><text>另一个</text></Sticky></view>);layout(screen.container.querySelector('.ui-sticky-content')!,180,60);native.set(10);native.notify();await waitFor(()=>expect(screen.container.querySelector('.ui-sticky')!.getAttribute('style')).toContain('60px'));expect(screen.getByText('动态插入')).toBeTruthy();expect(ids).toHaveLength(2);
});
