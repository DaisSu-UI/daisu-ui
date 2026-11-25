import { afterEach, beforeEach, expect, rstest, test } from '@rstest/core';
import { createRef } from '@lynx-js/react';
import type { NodesRef } from '@lynx-js/types';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { SwipeAction } from './SwipeAction.js';
import type { SwipeActionRef, SwipeActionStatus } from './SwipeAction.js';

const side = <view><text>删除</text></view>;
let restoreGeometry: () => void;
beforeEach(() => {
  const original = lynx.createSelectorQuery.bind(lynx);
  const spy = rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => {
    const query = original(), select = query.select.bind(query);
    query.select = selector => {
      const ref = select(selector), invoke = ref.invoke.bind(ref);
      ref.invoke = options => options.method === 'boundingClientRect' ? { exec() { options.success?.({ left: 0, top: 0, width: 100, height: 44 }); } } as unknown as ReturnType<NodesRef['invoke']> : invoke(options);
      return ref;
    };
    return query;
  });
  restoreGeometry = () => spy.mockRestore();
});
afterEach(() => restoreGeometry());
test('SwipeAction closes before emitting a click, suppresses events when guard refuses, and deduplicates pending closes', async () => {
  let resolve: (value: boolean) => void = () => {}; let calls = 0;
  const events: unknown[] = [];
  const beforeClose = () => { calls++; return new Promise<boolean>(accept => { resolve = accept; }); };
  try {
    const screen = render(<SwipeAction defaultValue="right" right={side} beforeClose={beforeClose} onChange={value => events.push(value)} onClick={event => events.push(event)} />);
    const body = screen.container.querySelector('.ui-swipe-body')!;
    fireEvent.tap(body, { eventType: 'catchEvent' }); fireEvent.tap(body, { eventType: 'catchEvent' }); expect(calls).toBe(1);
    resolve(false); await waitFor(() => expect(screen.container.querySelector('.ui-swipe-action-pending')).toBeNull()); expect(events).toEqual([]);
    fireEvent.tap(screen.container.querySelector('.ui-swipe-right')!, { eventType: 'catchEvent' }); resolve(true);
    await waitFor(() => expect(events).toEqual(['close', { value: 'right' }]));
    fireEvent.tap(body, { eventType: 'catchEvent' }); expect(calls).toBe(2);
  } finally { cleanup(); }
});

test('SwipeAction invalidates asynchronous closure when disabled or unmounted, but callback identity changes retain pending work', async () => {
  let resolve: (value: boolean) => void = () => {}; const events: SwipeActionStatus[] = [];
  const beforeClose = () => new Promise<boolean>(accept => { resolve = accept; }); const ref = createRef<SwipeActionRef>();
  const props = { ref, defaultValue: 'right' as const, right: side, onChange: (value: SwipeActionStatus) => events.push(value) };
  try {
    const screen = render(<SwipeAction {...props} beforeClose={beforeClose} />);
    const first = ref.current!.close('value');
    screen.rerender(<SwipeAction {...props} beforeClose={() => beforeClose()} />); resolve(true);
    expect(await first).toBe(true); expect(events).toEqual(['close']);
    screen.rerender(<SwipeAction {...props} value="right" beforeClose={beforeClose} />);
    const second = ref.current!.close();
    screen.rerender(<SwipeAction {...props} value="right" disabled beforeClose={beforeClose} />); resolve(true);
    expect(await second).toBe(false); expect(events).toEqual(['close']);
    screen.rerender(<SwipeAction {...props} value="right" beforeClose={beforeClose} />);
    const third = ref.current!.close(); screen.unmount(); resolve(true);
    expect(await third).toBe(false); expect(events).toEqual(['close']);
  } finally { cleanup(); }
});

test('SwipeAction guards externally controlled closure and reports the previous value when rejected', async () => {
  const events: unknown[] = [];
  const props = { right: side, onChange: (value: SwipeActionStatus) => events.push(value), beforeClose: (reason: string, position: string) => { events.push([reason, position]); return false; } };
  try {
    const screen = render(<SwipeAction {...props} value="right" />);
    screen.rerender(<SwipeAction {...props} value="close" />);
    await waitFor(() => expect(events).toEqual([['value', 'right'], 'right']));
    fireEvent.tap(screen.container.querySelector('.ui-swipe-body')!, { eventType: 'catchEvent' });
    await waitFor(() => expect(events).toHaveLength(3));
    expect(events[2]).toEqual(['click', 'inside']);
  } finally { cleanup(); }
});

test('SwipeAction recognizes horizontal drag, cancels vertical drag and restores after cancellation', async () => {
  const events: SwipeActionStatus[] = [];
  try {
    const screen = render(<SwipeAction right={side} onChange={value => events.push(value)} />);
    fireEvent.layoutchange(screen.container.querySelector('.ui-swipe-right')!, { detail: { width: 100 } });
    const track = screen.container.querySelector('.ui-swipe-track')!;
    const touch = (type: 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel', x: number, y: number) => fireEvent[type](track, { touches: [{ clientX: x, clientY: y }] });
    touch('touchstart', 200, 100); touch('touchmove', 190, 200); touch('touchend', 190, 200); expect(events).toEqual([]);
    touch('touchstart', 200, 100); touch('touchmove', 120, 100); touch('touchcancel', 120, 100); expect(events).toEqual([]);
    touch('touchstart', 200, 100); touch('touchmove', 120, 100); touch('touchend', 120, 100);
    expect(events).toEqual(['right']);
    expect(screen.container.querySelector('.ui-swipe-track')?.getAttribute('style')).toContain('translateX(-100px)');
    fireEvent.tap(screen.container.querySelector('.ui-swipe-body')!, { eventType: 'catchEvent' }); expect(events).toEqual(['right']);
  } finally { cleanup(); }
});
