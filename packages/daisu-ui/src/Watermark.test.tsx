import { afterEach, expect, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Watermark, watermarkGrid } from './Watermark.js';
afterEach(cleanup);
function resize(node:Element,width:number,height:number){fireEvent(node,Object.assign(new Event('bindEvent:layoutchange'),{eventType:'bindEvent',eventName:'layoutchange',detail:{width,height}}));}
test('Watermark covers partial edge cells, applies gutters and bounds pathological allocations',()=>{
 expect(watermarkGrid({width:366,height:378},100,100,0,0)).toEqual({cellWidth:100,cellHeight:100,columns:4,rows:4,count:16});expect(watermarkGrid({width:210,height:110},100,100,10,10).count).toBe(2);expect(watermarkGrid({width:10000,height:10000},0,0,0,0).count).toBe(2048);
});
test('Watermark responds to content, image, layout and size changes without intercepting input',()=>{
 const screen=render(<Watermark fullScreen={false} content="水印"/>),root=screen.container.querySelector('.ui-watermark')!;resize(root,200,200);expect(screen.container.querySelectorAll('.ui-watermark-tile')).toHaveLength(4);expect(root.getAttribute('user-interaction-enabled')).toBe('false');
 screen.rerender(<Watermark fullScreen={false} image="logo.svg" imageWidth={38} imageHeight={38} layout="staggered"/>);expect(screen.container.querySelectorAll('svg')).toHaveLength(2);expect(screen.queryByText('水印')).toBeNull();resize(root,100,100);expect(screen.container.querySelectorAll('.ui-watermark-tile')).toHaveLength(1);
 screen.rerender(<Watermark fullScreen={false} image="logo.png" opacity={2}/>);expect(screen.container.querySelectorAll('image')).toHaveLength(1);expect(root.getAttribute('style')).toContain('opacity: 1');
});
test('Watermark normalizes invalid numeric props and preserves multiline native text',()=>{
 const screen=render(<Watermark content={'第一行\n第二行'} width={NaN} height={Infinity} size={NaN} rotate={Infinity} fontWeight={700} opacity={NaN}/>),root=screen.container.querySelector('.ui-watermark')!;resize(root,100,100);expect(screen.container.querySelector('.ui-watermark-text')!.textContent).toBe('第一行\n第二行');expect(screen.container.querySelector('.ui-watermark-mark')!.getAttribute('style')).toContain('rotate(-25deg)');expect(screen.container.querySelector('.ui-watermark-text')!.getAttribute('style')).toContain('700');expect(screen.container.querySelector('.ui-watermark-fullscreen')).toBeTruthy();
});
