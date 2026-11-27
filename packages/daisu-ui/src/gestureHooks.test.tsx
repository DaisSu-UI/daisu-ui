import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import type { TouchEvent, MouseEvent } from '@lynx-js/types';
import { useDragEvents } from './useDragEvents.js';
import { useFrameTask } from './useFrameTask.js';
import { usePressState } from './usePressState.js';
afterEach(() => { cleanup(); rstest.useRealTimers(); });
const point = { touches: [{ clientX: 10, clientY: 10 }], changedTouches: [{ clientX: 10, clientY: 10 }] } as TouchEvent;

test('only the active gesture owns outside listeners; stale movement and duplicate release do nothing', () => {
  const moved = rstest.fn(), ended = rstest.fn();
  const events: Record<string, ReturnType<typeof useDragEvents>> = {};
  function Item({ id }: { id: string }) { const bindings = useDragEvents({ onStart: () => true, onMove: moved, onEnd: ended, onCancel() {} }); events[id] = bindings; return <view className={id} {...bindings} />; }
  const screen = render(<><Item id="one" /><Item id="two" /></>);
  expect(events.one!['global-bindmousemove']).toBeUndefined();
  expect(events.two!['global-bindmousemove']).toBeUndefined();
  fireEvent.touchstart(screen.container.querySelector('.one')!, { ...point, eventType: 'catchEvent' });
  const outsideMove = events.one!['global-bindmousemove']!;
  expect(outsideMove).toBeTypeOf('function');
  expect(events.two!['global-bindmousemove']).toBeUndefined();
  outsideMove(point as unknown as MouseEvent);
  fireEvent.touchend(screen.container.querySelector('.one')!, { ...point, eventType: 'catchEvent' });
  fireEvent.touchend(screen.container.querySelector('.one')!, { ...point, eventType: 'catchEvent' });
  outsideMove(point as unknown as MouseEvent);
  expect(moved).toHaveBeenCalledTimes(1);
  expect(ended).toHaveBeenCalledTimes(1);
  expect(events.one!['global-bindmousemove']).toBeUndefined();
});

test('disabled gestures cancel once and touch compatibility mouse starts are ignored', () => {
  const start = rstest.fn(() => true), cancel = rstest.fn();
  function Item({ disabled = false }: { disabled?: boolean }) { const events = useDragEvents({ disabled, onStart: start, onMove() {}, onEnd() {}, onCancel: cancel }); return <view className="gesture" {...events} />; }
  const screen = render(<Item />), node = screen.container.querySelector('.gesture')!;
  fireEvent.touchstart(node, { ...point, eventType: 'catchEvent' });
  fireEvent.touchend(node, { ...point, eventType: 'catchEvent' });
  fireEvent.mousedown(node, { clientX: 10, clientY: 10, eventType: 'catchEvent' });
  expect(start).toHaveBeenCalledTimes(1);
  fireEvent.touchstart(node, { ...point, eventType: 'catchEvent' });
  screen.rerender(<Item disabled />);
  expect(cancel).toHaveBeenCalledTimes(1);
});

test('frame work keeps the newest callback, coalesces a burst, and cancels on unmount', async () => {
  rstest.useFakeTimers();
  const first = rstest.fn(), second = rstest.fn();
  let frame!: ReturnType<typeof useFrameTask>;
  function Item({ callback }: { callback: () => void }) { frame = useFrameTask(callback); return <view />; }
  const screen = render(<Item callback={first} />);
  for (let i = 0; i < 100; i++) frame.schedule();
  screen.rerender(<Item callback={second} />);
  await rstest.advanceTimersByTimeAsync(16);
  expect(first).not.toHaveBeenCalled(); expect(second).toHaveBeenCalledTimes(1);
  frame.schedule(); screen.unmount(); await rstest.advanceTimersByTimeAsync(100);
  expect(second).toHaveBeenCalledTimes(1);
});

test('shared press feedback has stable handlers and clears when disabled', () => {
  let press!: ReturnType<typeof usePressState>;
  function Item({ enabled = true }: { enabled?: boolean }) { press = usePressState(enabled); return <view className="press" {...press.events} />; }
  const screen = render(<Item />), start = press.start, end = press.end;
  fireEvent.touchstart(screen.container.querySelector('.press')!, { ...point }); expect(press.pressed).toBe(true);
  expect(press.start).toBe(start); expect(press.end).toBe(end);
  screen.rerender(<Item enabled={false} />);
  expect(press.pressed).toBe(false); expect(press.events['global-bindmouseup']).toBeUndefined();
});

test('a release callback error still clears ownership of global mouse listeners', () => {
  let events!: ReturnType<typeof useDragEvents>;
  function Item() { events = useDragEvents({ onStart() {}, onMove() {}, onEnd() { throw new Error('caller failed'); }, onCancel() {} }); return <view className="release" {...events} />; }
  const screen = render(<Item />);
  fireEvent.touchstart(screen.container.querySelector('.release')!, { ...point, eventType: 'catchEvent' });
  expect(() => events['global-bindmouseup']!(point as unknown as MouseEvent)).toThrow('caller failed');
  screen.rerender(<Item />);
  expect(events['global-bindmousemove']).toBeUndefined();
});
