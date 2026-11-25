import {afterEach,expect,rstest,test} from '@rstest/core';
import {cleanup,render} from '@lynx-js/react/testing-library';
import {createRef} from '@lynx-js/react';
import {QrCode} from './QrCode.js';
import type {QrCodeRef} from './QrCode.js';
import {qrCodeMatrix,qrCodeLayout} from './qrCodeModel.js';
afterEach(cleanup);
test('QR encodes Unicode bytes, all correction levels, finder patterns and capacity errors',()=>{
 for(const level of ['L','M','Q','H'] as const){const m=qrCodeMatrix('https://wot-ui.cn',level);expect(m.length%4).toBe(1);expect(m[0]!.slice(0,7)).toEqual(Array(7).fill(true));expect(m[1]!.slice(0,7)).toEqual([true,false,false,false,false,false,true]);}
 expect(qrCodeMatrix('中文😀')).not.toEqual(qrCodeMatrix('-\x87=\x00'));
 expect(()=>qrCodeMatrix('a'.repeat(3000))).toThrow();expect(qrCodeMatrix('')).toEqual([]);
});
test('QR geometry supports gradients, styled dots, logo clip and validates dimensions',()=>{
 const matrix=qrCodeMatrix('test');
 for(const dotType of ['square','dots','rounded','liquid'] as const){const l=qrCodeLayout(matrix,{dotType,size:280,margin:4,enableGradient:true,gradientColors:['red','blue'],logo:'/logo.png',logoRadius:12});expect(l.svg).toContain('viewBox="0 0 280 280"');expect(l.svg).toContain('<linearGradient');expect(l.svg).toContain('<clipPath');expect(l.codeSvg).not.toContain('<image');}
 for(const options of [{size:NaN},{margin:100},{dotScale:0},{size:-1},{dotScale:2}])expect(()=>qrCodeLayout(matrix,options)).toThrow();
 expect(qrCodeLayout(matrix,{colorDark:'red" onload="bad'}).svg).toContain('&quot;');
});
test('QR ref updates, emits errors and refuses stale exports after invalid or empty content',async()=>{
 const ref=createRef<QrCodeRef>(),error=rstest.fn();const screen=render(<QrCode ref={ref} text="first" onError={error}/>);
 const first=ref.current!.getSvg();expect(await ref.current!.exportImage()).toContain('data:image/svg+xml');
 screen.rerender(<QrCode ref={ref} text="中文😀" size={280} onError={error}/>);expect(ref.current!.getSvg()).not.toBe(first);
 screen.rerender(<QrCode ref={ref} text="valid" size={-1} onError={error}/>);expect(error).toHaveBeenCalledTimes(1);await expect(ref.current!.exportImage()).rejects.toThrow();
 screen.rerender(<QrCode ref={ref} text=""/>);await expect(ref.current!.exportImage()).rejects.toThrow('empty');
});
test('QR refuses a misleading standalone export that would silently lose external images',async()=>{
 const ref=createRef<QrCodeRef>();const screen=render(<QrCode ref={ref} text="logo" logo="/logo.png"/>);
 expect(ref.current!.getSvg()).toContain('href="/logo.png"');
 await expect(ref.current!.exportImage()).rejects.toThrow('浏览器导出模式');
 screen.rerender(<QrCode ref={ref} text="background" backgroundImage="https://example.com/photo.png"/>);
 await expect(ref.current!.exportImage()).rejects.toThrow('浏览器导出模式');
});
