import { beforeEach, afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import type { IntersectionObserver, ObserveCallback } from '@lynx-js/types';
import { CalendarViewExample } from './calendar-view.js';
const originalObserver = lynx.createIntersectionObserver;
beforeEach(() => {
  const originalQuery = lynx.createSelectorQuery.bind(lynx);
  rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => {
    const query = originalQuery(), select = query.select.bind(query);
    query.select = selector => selector.startsWith('[react-ref-') ? { invoke: (options: Parameters<import('@lynx-js/types').NodesRef['invoke']>[0]) => ({ exec() { options.success?.({}); } }) } as unknown as import('@lynx-js/types').NodesRef : select(selector);
    return query;
  });
});
afterEach(() => { cleanup(); rstest.restoreAllMocks(); rstest.useRealTimers(); if (!originalObserver) delete (lynx as unknown as Record<string, unknown>).createIntersectionObserver; });

test('CalendarView Demo mounts one calendar synchronously and retains panels once they approach the viewport', async () => {
  const listeners: { callback?: ObserveCallback; disconnect: ReturnType<typeof rstest.fn> }[] = [];
  if (!lynx.createIntersectionObserver) Object.assign(lynx, { createIntersectionObserver: () => {} });
  rstest.spyOn(lynx, 'createIntersectionObserver').mockImplementation(() => {
    const listener = { disconnect: rstest.fn() } as typeof listeners[number]; listeners.push(listener);
    const observer = { relativeToViewport() { return observer; }, observe(_selector: string, callback: ObserveCallback) { listener.callback = callback; }, disconnect: listener.disconnect };
    return observer as unknown as IntersectionObserver;
  });
  const screen = render(<CalendarViewExample />);
  expect(screen.container.querySelectorAll('.ui-calendar-view')).toHaveLength(1);
  await waitFor(() => expect(listeners).toHaveLength(8));
  listeners[0]!.callback?.({ isIntersecting: false, intersectionRatio: 0 } as Parameters<ObserveCallback>[0]);
  expect(screen.container.querySelectorAll('.ui-calendar-view')).toHaveLength(1);
  listeners[0]!.callback?.({ isIntersecting: true, intersectionRatio: 1 } as Parameters<ObserveCallback>[0]);
  await waitFor(() => expect(screen.container.querySelectorAll('.ui-calendar-view')).toHaveLength(2));
  fireEvent.tap(screen.container.querySelector('.ui-calendar-day-selected')!);
  expect(screen.container.querySelectorAll('.ui-calendar-view')).toHaveLength(2);
  screen.unmount();
  expect(listeners.every(listener => listener.disconnect.mock.calls.length > 0)).toBe(true);
});


test('CalendarView batches simultaneous visibility callbacks and cancels unmounted work', async () => {
  const listeners: ObserveCallback[] = [];
  if (!lynx.createIntersectionObserver) Object.assign(lynx, { createIntersectionObserver: () => {} });
  rstest.spyOn(lynx, 'createIntersectionObserver').mockImplementation(() => {
    const observer = { relativeToViewport() { return observer; }, observe(_selector: string, callback: ObserveCallback) { listeners.push(callback); }, disconnect() {} };
    return observer as unknown as IntersectionObserver;
  });
  const screen = render(<CalendarViewExample />);
  await waitFor(() => expect(listeners).toHaveLength(8));
  rstest.useFakeTimers();
  for (const listener of listeners) listener({ isIntersecting: true, intersectionRatio: 1 } as Parameters<ObserveCallback>[0]);
  expect(screen.container.querySelectorAll('.ui-calendar-view')).toHaveLength(1);
  await rstest.advanceTimersByTimeAsync(64);
  expect(screen.container.querySelectorAll('.ui-calendar-view')).toHaveLength(2);
  await rstest.advanceTimersByTimeAsync(64);
  expect(screen.container.querySelectorAll('.ui-calendar-view')).toHaveLength(3);
  screen.unmount();
  await rstest.advanceTimersByTimeAsync(1000);
  await rstest.runOnlyPendingTimersAsync();
  expect(rstest.getTimerCount()).toBe(0);
});

test('all nine calendar examples eventually render when the native observer silently never reports visibility', async () => {
  rstest.useFakeTimers();
  if (!lynx.createIntersectionObserver) Object.assign(lynx, { createIntersectionObserver: () => {} });
  rstest.spyOn(lynx, 'createIntersectionObserver').mockImplementation(() => {
    const observer = { relativeToViewport() { return observer; }, observe() {}, disconnect() {} };
    return observer as unknown as IntersectionObserver;
  });
  const screen = render(<CalendarViewExample />);
  expect(screen.container.querySelectorAll('.ui-calendar-view')).toHaveLength(1);
  await rstest.advanceTimersByTimeAsync(1000);
  expect(screen.container.querySelectorAll('.ui-calendar-view')).toHaveLength(1);
  await rstest.advanceTimersByTimeAsync(64);
  expect(screen.container.querySelectorAll('.ui-calendar-view')).toHaveLength(2);
  await rstest.advanceTimersByTimeAsync(600);
  expect(screen.container.querySelectorAll('.ui-calendar-view')).toHaveLength(9);
  for (const example of screen.container.querySelectorAll('.demo-calendar-deferred')) {
    expect(example.querySelectorAll('.ui-calendar-day').length).toBeGreaterThan(0);
  }
  screen.unmount();
  await rstest.runOnlyPendingTimersAsync();
  expect(rstest.getTimerCount()).toBe(0);
});

test('calendar observation uses assigned IDs and reattaches after native layout', async () => {
  const listeners: { selector?: string; callback?: ObserveCallback; disconnect: ReturnType<typeof rstest.fn> }[] = [];
  if (!lynx.createIntersectionObserver) Object.assign(lynx, { createIntersectionObserver: () => {} });
  rstest.spyOn(lynx, 'createIntersectionObserver').mockImplementation(() => {
    const listener = { disconnect: rstest.fn() } as typeof listeners[number]; listeners.push(listener);
    const observer = { relativeToViewport() { return observer; }, observe(selector: string, callback: ObserveCallback) { listener.selector = selector; listener.callback = callback; }, disconnect: listener.disconnect };
    return observer as unknown as IntersectionObserver;
  });
  const screen = render(<CalendarViewExample />);
  await waitFor(() => expect(listeners).toHaveLength(8));
  const panel = screen.container.querySelectorAll('.demo-calendar-deferred')[1]!;
  expect(panel.id).toBeTruthy();
  const original = listeners.find(listener => listener.selector === `#${panel.id}`);
  expect(original).toBeTruthy();
  for (const listener of listeners) expect(screen.container.querySelector(listener.selector!)).toBeTruthy();
  fireEvent(panel, Object.assign(new Event('bindEvent:layoutchange'), { eventType: 'bindEvent', eventName: 'layoutchange', detail: { width: 375, height: 392 } }));
  await waitFor(() => expect(listeners).toHaveLength(9));
  expect(original!.disconnect).toHaveBeenCalled();
  listeners[8]!.callback?.({ isIntersecting: true, intersectionRatio: 1 } as Parameters<ObserveCallback>[0]);
  await waitFor(() => expect(panel.querySelector('.ui-calendar-view')).toBeTruthy());
});
