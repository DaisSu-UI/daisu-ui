import { afterEach, beforeEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import type { NodesRef } from '@lynx-js/types';
import { Slider } from './Slider.js';
beforeEach(() => {
  const original = lynx.createSelectorQuery.bind(lynx);
  rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => {
    const query = original(), select = query.select.bind(query);
    query.select = selector => selector.startsWith('[react-ref-') ? { invoke: (options: Parameters<NodesRef['invoke']>[0]) => ({ exec() { options.success?.({ left: 0, top: 0, width: 100, height: 100 }); } }) } as unknown as NodesRef : select(selector);
    return query;
  });
});
afterEach(() => { cleanup(); rstest.restoreAllMocks(); rstest.useRealTimers(); });
const point = (x: number) => ({ eventType: 'catchEvent' as const, touches: [{ clientX: x, clientY: 0 }], changedTouches: [{ clientX: x, clientY: 0 }] });
test('Slider creates no hidden tooltip while idle and removes the active value bubble after release', () => {
  const screen = render(<Slider defaultValue={[20, 60]} />), rail = screen.container.querySelector('.ui-slider-rail')!;
  expect(screen.container.querySelector('.ui-slider-tooltip')).toBeNull();
  fireEvent.touchstart(rail, point(20));
  expect(screen.container.querySelectorAll('.ui-slider-tooltip')).toHaveLength(1);
  fireEvent.touchend(rail, point(25));
  expect(screen.container.querySelector('.ui-slider-tooltip')).toBeNull();
});
test('Slider coalesces high frequency moves but commits the exact final value once', async () => {
  rstest.useFakeTimers();
  const changed = rstest.fn(), ended = rstest.fn();
  const screen = render(<Slider onChange={changed} onChangeEnd={ended} />), rail = screen.container.querySelector('.ui-slider-rail')!;
  fireEvent.touchstart(rail, point(0));
  for (let x = 1; x <= 100; x++) fireEvent.touchmove(rail, point(x));
  expect(changed.mock.calls.length).toBeLessThanOrEqual(2);
  fireEvent.touchend(rail, point(100));
  expect(changed).toHaveBeenLastCalledWith(100);
  expect(ended).toHaveBeenCalledExactlyOnceWith(100);
  await rstest.advanceTimersByTimeAsync(100);
  expect(ended).toHaveBeenCalledTimes(1);
  expect(screen.container.querySelector('.ui-slider-tooltip')).toBeNull();
});

test('Slider handles a quick mouse press/release before global move handlers are attached', () => {
  const ended = rstest.fn(), screen = render(<Slider onChangeEnd={ended} />), rail = screen.container.querySelector('.ui-slider-rail')!;
  const mouse = (x: number) => ({ eventType: 'catchEvent' as const, x, y: 0, clientX: x, clientY: 0, pageX: x, pageY: 0 });
  fireEvent.mousedown(rail, mouse(20));
  fireEvent.mouseup(rail, mouse(35));
  fireEvent.mouseup(rail, mouse(35));
  expect(ended).toHaveBeenCalledExactlyOnceWith(35);
  expect(screen.container.querySelector('.ui-slider-tooltip')).toBeNull();
});

test('native range thumbs use viewport coordinates and keep the grabbed thumb through local-coordinate changes', async () => {
  rstest.useFakeTimers();
  const ended = rstest.fn(), screen = render(<Slider defaultValue={[20, 60]} theme="capsule" onChangeEnd={ended} />);
  const rail = screen.container.querySelector('.ui-slider-rail')!;
  const nativePoint = (clientX: number, x: number) => ({ eventType: 'catchEvent' as const, detail: { x: clientX, y: 0 }, touches: [{ x, y: 0, clientX, clientY: 0 }], changedTouches: [{ x, y: 0, clientX, clientY: 0 }] });
  const upper = screen.container.querySelectorAll('.ui-slider-handle')[1]!;
  fireEvent.touchstart(upper, nativePoint(68, 8));
  expect(screen.container.querySelectorAll('.ui-slider-thumb')[1]!.getAttribute('accessibility-label')).toContain('60');
  fireEvent.touchmove(rail, nativePoint(78, 1));
  await rstest.advanceTimersByTimeAsync(16);
  expect(screen.container.querySelectorAll('.ui-slider-thumb')[1]!.getAttribute('accessibility-label')).toContain('70');
  fireEvent.touchend(rail, nativePoint(88, 2));
  expect(ended).toHaveBeenLastCalledWith([20, 80]);
  const lower = screen.container.querySelectorAll('.ui-slider-handle')[0]!;
  fireEvent.touchstart(lower, nativePoint(24, 4));
  fireEvent.touchmove(rail, nativePoint(34, 0));
  await rstest.advanceTimersByTimeAsync(16);
  fireEvent.touchend(rail, nativePoint(44, 1));
  expect(ended).toHaveBeenLastCalledWith([40, 80]);
  expect(ended).toHaveBeenCalledTimes(2);
});

test('capsule movement is monotonic when native local x moves in the opposite direction', async () => {
  rstest.useFakeTimers();
  const changed = rstest.fn(), screen = render(<Slider defaultValue={40} theme="capsule" onChange={changed} />);
  const rail = screen.container.querySelector('.ui-slider-rail')!;
  fireEvent.touchstart(rail, { ...point(40), touches: [{ x: 2, clientX: 40, clientY: 0 }] });
  for (const [clientX, x] of [[45, 8], [50, 2], [55, 10], [60, 0]]) {
    fireEvent.touchmove(rail, { ...point(clientX!), touches: [{ x, clientX, clientY: 0 }] });
    await rstest.advanceTimersByTimeAsync(16);
  }
  fireEvent.touchend(rail, point(60));
  expect(changed.mock.calls.map(([value]) => value)).toEqual([45, 50, 55, 60]);
});

test('vertical range thumbs also use clientY and retain independent lower and upper values', () => {
  const ended = rstest.fn(), screen = render(<Slider vertical defaultValue={[20, 60]} onChangeEnd={ended} />);
  const rail = screen.container.querySelector('.ui-slider-rail')!;
  const verticalPoint = (clientY: number) => ({ eventType: 'catchEvent' as const, touches: [{ x: 0, y: 2, clientX: 0, clientY }], changedTouches: [{ x: 0, y: 2, clientX: 0, clientY }] });
  fireEvent.touchstart(screen.container.querySelectorAll('.ui-slider-handle')[1]!, verticalPoint(60));
  fireEvent.touchend(rail, verticalPoint(90));
  expect(ended).toHaveBeenLastCalledWith([20, 90]);
  fireEvent.touchstart(screen.container.querySelectorAll('.ui-slider-handle')[0]!, verticalPoint(20));
  fireEvent.touchend(rail, verticalPoint(40));
  expect(ended).toHaveBeenLastCalledWith([40, 90]);
});
