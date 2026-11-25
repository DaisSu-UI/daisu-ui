import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Img } from './Img.js';
import { imgDimension, imgFrame } from './imgModel.js';
afterEach(cleanup);
function event(name: string, detail: object) { return Object.assign(new Event(`bindEvent:${name}`), { eventType: 'bindEvent', eventName: name, detail }); }
const load = (node: Element) => fireEvent(node, event('load', { width: 316, height: 236 }));
test('Img resolves all anchored and fixed-aspect modes without unsupported native mode values', () => {
  const box = {width:100,height:80}, natural={width:316,height:236};
  expect(imgFrame('bottom right',box,natural)).toEqual({width:316,height:236,left:-216,top:-156,mode:'scaleToFill'});
  expect(imgFrame('top',box,natural).left).toBe(-108);
  expect(imgFrame('center',box,natural).top).toBe(-78);
  expect(imgFrame('widthFix',box,natural).height).toBeCloseTo(74.6835);
  expect(imgFrame('heightFix',box,natural).width).toBeCloseTo(107.1186);
  expect(imgFrame('aspectFill',box,natural).mode).toBe('aspectFill');
  expect(imgDimension('100',320)).toBe('100px');expect(imgDimension('27vw',240)).toBe('27vw');expect(imgDimension(NaN,320)).toBe('320px');
});
test('Img native failure removes the bitmap, custom error and click remain, source replacement resets state', () => {
  const error=rstest.fn(),click=rstest.fn(),loaded=rstest.fn();
  const screen=render(<Img src="a.jpg" loading={<text>正在载入</text>} error={<text>图片不可用</text>} onError={error} onClick={click}/>);
  expect(screen.getByText('正在载入')).toBeTruthy();
  fireEvent(screen.container.querySelector('.ui-img-image')!,event('error',{error_code:1,errMsg:'failed'}));
  expect(screen.container.querySelector('.ui-img-image')).toBeNull();expect(screen.getByText('图片不可用')).toBeTruthy();expect(error).toHaveBeenCalledTimes(1);
  fireEvent.tap(screen.container.querySelector('.ui-img')!);expect(click).toHaveBeenCalledTimes(1);
  screen.rerender(<Img src="b.jpg" onLoad={loaded}/>);load(screen.container.querySelector('.ui-img-image')!);
  expect(screen.container.querySelector('.ui-img-placeholder')).toBeNull();expect(loaded).toHaveBeenCalledTimes(1);
  screen.rerender(<Img src="a.jpg"/>);expect(screen.container.querySelector('.ui-img-loading')).toBeTruthy();
});
test('Img previews only loaded sources, passes override, prevents overlapping requests and reports missing adapters', async () => {
  let finish!:()=>void;const preview=rstest.fn(()=>new Promise<void>(resolve=>{finish=resolve;})),error=rstest.fn();
  const screen=render(<Img src="a.jpg" previewSrc="large.jpg" enablePreview onPreview={preview} onPreviewError={error}/>);
  const tap=()=>fireEvent.tap(screen.container.querySelector('.ui-img')!);
  tap();expect(preview).not.toHaveBeenCalled();load(screen.container.querySelector('.ui-img-image')!);tap();tap();await Promise.resolve();
  expect(preview).toHaveBeenCalledTimes(1);expect(preview).toHaveBeenCalledWith('large.jpg');finish();await new Promise(resolve=>setTimeout(resolve,0));
  screen.rerender(<Img src="a.jpg" enablePreview onPreviewError={error}/>);tap();await new Promise(resolve=>setTimeout(resolve,0));expect(error).toHaveBeenCalledTimes(1);
});
test('Img fixed width derives natural height and clipped anchors react to native layout changes', () => {
  const screen=render(<Img src="a.jpg" width={163} mode="widthFix"/>);
  const root=()=>screen.container.querySelector('.ui-img')!;
  fireEvent(root(),event('layoutchange',{width:163,height:240}));load(screen.container.querySelector('.ui-img-image')!);
  expect(root().getAttribute('style')).toContain('122px');
  screen.rerender(<Img src="a.jpg" width={100} height={80} mode="bottom right"/>);
  fireEvent(root(),event('layoutchange',{width:100,height:80}));
  const style=screen.container.querySelector('.ui-img-image')!.getAttribute('style');expect(style).toContain('-216px');expect(style).toContain('-156px');
});

test('Img native crop modes follow animated parent dimensions without stale pixel overrides', () => {
  const screen=render(<Img src="a.jpg" mode="aspectFill"/>);
  const image=()=>screen.container.querySelector('.ui-img-image')!;
  load(image());
  for(const height of [168,174,180,186,192])fireEvent(screen.container.querySelector('.ui-img')!,event('layoutchange',{width:171,height}));
  expect(image().getAttribute('style')).toContain('width: 100%');expect(image().getAttribute('style')).toContain('height: 100%');expect(image().getAttribute('mode')).toBe('aspectFill');
  screen.rerender(<Img src="a.jpg" mode="bottom right"/>);fireEvent(screen.container.querySelector('.ui-img')!,event('layoutchange',{width:100,height:80}));expect(image().getAttribute('style')).toContain('-156px');
  screen.rerender(<Img src="a.jpg" mode="aspectFit"/>);expect(image().getAttribute('style')).toContain('width: 100%');expect(image().getAttribute('style')).toContain('height: 100%');expect(image().getAttribute('mode')).toBe('aspectFit');
});
