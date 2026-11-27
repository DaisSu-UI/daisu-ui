import { afterEach, expect, rstest, test } from '@rstest/core';
import { createRef } from '@lynx-js/react';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import type { NodesRef } from '@lynx-js/types';
import { unzlibSync } from 'fflate';
import { Signature } from './Signature.js';
import type { SignatureRef } from './Signature.js';
import { signaturePng, signatureWidth } from './signatureModel.js';
afterEach(()=>{cleanup();rstest.restoreAllMocks();});
function geometry(){const original=lynx.createSelectorQuery.bind(lynx);rstest.spyOn(lynx,'createSelectorQuery').mockImplementation(()=>{const query=original(),select=query.select.bind(query);query.select=selector=>{const node=select(selector),invoke=node.invoke.bind(node);node.invoke=options=>options.method==='boundingClientRect'?{exec(){options.success?.({left:10,top:20,width:100,height:80});}} as unknown as ReturnType<NodesRef['invoke']>:invoke(options);return node;};return query;});}
async function stroke(board:Element,x=20){const point=(px:number)=>({eventType:'catchEvent',touches:[{identifier:7,clientX:px,clientY:40,x:1,y:1}],changedTouches:[{identifier:7,clientX:px,clientY:40,x:1,y:1}]});fireEvent.touchstart(board,point(x));await Promise.resolve();fireEvent.touchmove(board,point(x+30));fireEvent.touchend(board,point(x+40));await Promise.resolve();}
test('Signature uses viewport coordinates, preserves chronological undo/redo groups and drops redo after new input',async()=>{geometry();const ref=createRef<SignatureRef>(),screen=render(<Signature ref={ref} enableHistory step={2}/>),board=screen.container.querySelector('.ui-signature-board')!;await stroke(board);await stroke(board,30);await stroke(board,40);const svg=()=>screen.container.querySelector('.ui-signature-svg')!.getAttribute('content')!;const original=svg();expect(original).toContain('cx="10"');expect((original.match(/<g /g)??[]).length).toBe(3);ref.current!.revoke();await waitFor(()=>expect((svg().match(/<g /g)??[]).length).toBe(1));ref.current!.restore();await waitFor(()=>expect(svg()).toBe(original));ref.current!.revoke();await stroke(board,60);ref.current!.restore();await waitFor(()=>expect((svg().match(/<g /g)??[]).length).toBe(2));expect(ref.current!.confirm().success).toBe(true);ref.current!.clear();expect(ref.current!.confirm().success).toBe(false);});
test('Signature discards cancellation and multitouch, disabled prevents input, resize retains completed strokes',async()=>{geometry();const ref=createRef<SignatureRef>(),start=rstest.fn(),screen=render(<Signature ref={ref} onStart={start}/>),board=screen.container.querySelector('.ui-signature-board')!;await stroke(board);fireEvent.layoutchange(board,{detail:{width:120,height:80}});expect(ref.current!.confirm().success).toBe(true);fireEvent.touchstart(board,{eventType:'catchEvent',touches:[{identifier:1,clientX:30,clientY:40}]});fireEvent.touchcancel(board,{eventType:'catchEvent'});await Promise.resolve();expect(ref.current!.confirm().success).toBe(true);ref.current!.clear();fireEvent.touchstart(board,{eventType:'catchEvent',touches:[{identifier:1,clientX:30,clientY:40},{identifier:2,clientX:40,clientY:50}]});expect(ref.current!.confirm().success).toBe(false);const count=start.mock.calls.length;screen.rerender(<Signature ref={ref} disabled onStart={start}/>);await stroke(board);expect(start).toHaveBeenCalledTimes(count);});
test('Signature exports a decodable RGBA PNG at requested scale without Buffer/atob and validates allocation bounds',()=>{const result=signaturePng([{color:'#0083ff',points:[{x:2,y:2,time:0,width:3},{x:18,y:18,time:10,width:3}]}],20,20,2,'#fff');const bytes=Uint8Array.from(atob(result.dataUrl.split(',')[1]!),c=>c.charCodeAt(0));expect([...bytes.slice(0,8)]).toEqual([137,80,78,71,13,10,26,10]);const view=new DataView(bytes.buffer);expect(view.getUint32(16)).toBe(40);expect(view.getUint32(20)).toBe(40);let offset=8,raw:Uint8Array=new Uint8Array();while(offset<bytes.length){const length=view.getUint32(offset),name=String.fromCharCode(...bytes.slice(offset+4,offset+8));if(name==='IDAT')raw=unzlibSync(bytes.slice(offset+8,offset+8+length));offset+=length+12;}expect(raw.length).toBe(40*161);expect([...raw.slice(1,5)]).toEqual([255,255,255,255]);expect(raw[4*161+4*4+3]).toBe(255);const originalBuffer=globalThis.Buffer,originalAtob=globalThis.atob;try{Object.assign(globalThis,{Buffer:undefined,atob:undefined});expect(signaturePng([{color:'black',points:[{x:1,y:1,time:0,width:2}]}],4,4).success).toBe(true);}finally{Object.assign(globalThis,{Buffer:originalBuffer,atob:originalAtob});}expect(()=>signaturePng([],4096,4096,4)).toThrow();expect(()=>signaturePng([],20,20,Infinity)).toThrow();expect(signatureWidth(10,4,1,6,1.5)).toBeLessThan(signatureWidth(.1,4,1,6,1.5));});

test('Signature draws and exports in a native runtime without Array.prototype.at', async () => {
  geometry();
  const ref = createRef<SignatureRef>(), screen = render(<Signature ref={ref} enableHistory />);
  const originalAt = Array.prototype.at;
  try {
    Object.defineProperty(Array.prototype, 'at', { configurable: true, writable: true, value: undefined });
    await stroke(screen.container.querySelector('.ui-signature-board')!);
  } finally {
    Object.defineProperty(Array.prototype, 'at', { configurable: true, writable: true, value: originalAt });
  }
  expect(ref.current!.confirm().success).toBe(true);
  ref.current!.revoke(); expect(ref.current!.confirm().success).toBe(false);
  ref.current!.restore(); expect(ref.current!.confirm().success).toBe(true);
});
