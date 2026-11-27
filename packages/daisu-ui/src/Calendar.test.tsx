import { beforeEach, afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { createRef } from '@lynx-js/react';
import type { CalendarRef } from './Calendar.js';
import { Calendar, CalendarView } from './Calendar.js';
const nativeCalls: { method: string; params?: unknown }[] = [];
beforeEach(() => { nativeCalls.length = 0; const original = lynx.createSelectorQuery.bind(lynx); rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => { const query = original(), select = query.select.bind(query); query.select = selector => selector.startsWith('[react-ref-') ? { invoke: (options: Parameters<import('@lynx-js/types').NodesRef['invoke']>[0]) => ({ exec() { nativeCalls.push({ method: options.method, params: options.params }); options.success?.({}); } }) } as unknown as import('@lynx-js/types').NodesRef : select(selector); return query; }); });
afterEach(() => { cleanup(); rstest.restoreAllMocks(); });
const day = (n: number) => new Date(2026, 10, n).getTime();
test('CalendarView starts at the selected virtual month and waits for native layout before scrolling', () => {
  const screen = render(<CalendarView value={day(20)} minDate={new Date(2026, 0, 1).getTime()} maxDate={new Date(2026, 11, 31).getTime()} />);
  const scroll = screen.container.querySelector('.ui-calendar-scroll')!;
  const initial = Number(scroll.getAttribute('initial-scroll-offset'));
  expect(initial).toBeGreaterThan(0);
  expect(screen.container.querySelector('.ui-calendar-day-selected')?.textContent).toBe('20');
  expect(nativeCalls).toEqual([]);
  const layout = (selector: string, width: number, height: number) => fireEvent(lynx.createSelectorQuery().select(selector) as unknown as Element, Object.assign(new Event('bindEvent:layoutchange'), { eventName: 'layoutchange', eventType: 'bindEvent', detail: { width, height } }));
  layout('.ui-calendar-scroll-viewport', 0, 0);
  expect(nativeCalls).toEqual([]);
  layout('.ui-calendar-scroll-viewport', 390, 316);
  expect(nativeCalls).toEqual([]);
  const content = screen.container.querySelector('.ui-calendar-scroll-content')!;
  const totalHeight = Number(/height:\s*([\d.]+)px/.exec(content.getAttribute('style')!)![1]);
  expect(totalHeight).toBeGreaterThan(initial);
  layout('.ui-calendar-scroll-content', 0, totalHeight);
  expect(nativeCalls).toEqual([]);
  layout('.ui-calendar-scroll-content', 390, totalHeight);
  expect(nativeCalls).toContainEqual({ method: 'scrollTo', params: { offset: initial, smooth: false } });
});
test('CalendarView default panels render complete seven-cell rows with explicit month heights', () => {
  const screen = render(<CalendarView value={day(20)} minDate={day(1)} maxDate={day(30)} />);
  expect(screen.container.querySelectorAll('.ui-calendar-day')).toHaveLength(30);
  const month = screen.container.querySelector('.ui-calendar-month')!;
  expect(month.getAttribute('style')).toContain('height: 316px');
  for (const row of month.querySelectorAll('.ui-calendar-row')) expect(row.children).toHaveLength(7);
  expect(screen.container.querySelector('.ui-calendar-scroll-content')?.children).toHaveLength(1);
  expect(screen.container.querySelector('.ui-calendar-day-selected')?.textContent).toBe('20');
});
test('Calendar range validates inclusive maxRange and allows same-day selection only when enabled', () => {
  const changes: unknown[] = []; let exceeded=0;
  const screen=render(<CalendarView type="daterange" value={[day(1)]} minDate={day(1)} maxDate={day(30)} maxRange={3} onOverRange={()=>{exceeded++;}} onChange={e=>changes.push(e.value)} />);
  const pick=(n:number)=>fireEvent.tap([...screen.container.querySelectorAll('.ui-calendar-day')].find(e=>e.textContent===String(n))!);
  pick(1); expect(changes).toEqual([]); pick(5); expect(exceeded).toBe(1); expect(changes).toEqual([[day(1),day(3)]]); pick(3); expect(changes).toEqual([[day(1),day(3)],[day(1),day(3)]]);
});
test('Calendar without a confirm button commits only after the complete range', async () => {
  const values: unknown[]=[];
  const screen=render(<Calendar visible type="daterange" showConfirm={false} minDate={day(1)} maxDate={day(30)} onConfirm={e=>values.push(e.value)} />);
  const pick=(n:number)=>fireEvent.tap([...screen.container.querySelectorAll('.ui-calendar-day')].find(e=>e.textContent===String(n))!);
  pick(2); expect(values).toEqual([]); pick(4);
  await waitFor(()=>expect(values).toEqual([[day(2),day(4)]]));
});

test('CalendarView formatter cannot enable days outside bounds and month controls change the visible panel', () => {
  const changed = rstest.fn();
  const screen = render(<CalendarView minDate={day(10)} maxDate={new Date(2026,11,15).getTime()} switchMode="month" value={day(20)} formatter={day => ({ ...day, disabled: false })} onChange={changed} />);
  fireEvent.tap([...screen.container.querySelectorAll('.ui-calendar-day')].find(e => e.textContent === '1')!);
  expect(changed).not.toHaveBeenCalled();
  fireEvent.tap(screen.container.querySelector('[accessibility-label="下一月"]')!);
  expect(screen.container.querySelector('.ui-calendar-controls')?.textContent).toContain('2026年12月');
});

const tapDay = (screen: Pick<ReturnType<typeof render>, 'container'>, n: number) => fireEvent.tap([...screen.container.querySelectorAll('.ui-calendar-day')].find(e => e.textContent === String(n))!);
const tapConfirm = (screen: Pick<ReturnType<typeof render>, 'container'>) => fireEvent.tap(screen.container.querySelector('.ui-calendar-confirm-button .ui-button')!);
test('Calendar drafts notify separately and cancellation never commits', () => {
  const changed = rstest.fn(), pick = rstest.fn(), cancel = rstest.fn();
  const screen = render(<Calendar visible value={day(2)} minDate={day(1)} maxDate={day(30)} onChange={changed} onPickChange={pick} onCancel={cancel} />);
  tapDay(screen, 4); expect(pick).toHaveBeenCalledWith({ value: day(4) }); expect(changed).not.toHaveBeenCalled();
  fireEvent.tap(screen.container.querySelector('.ui-action-sheet-close')!, { eventType: 'catchEvent' }); expect(cancel).toHaveBeenCalledTimes(1);
  screen.rerender(<Calendar visible={false} value={day(2)} minDate={day(1)} maxDate={day(30)} />);
  screen.rerender(<Calendar visible value={day(2)} minDate={day(1)} maxDate={day(30)} />);
  expect(screen.container.querySelector('.ui-calendar-day-selected')?.textContent).toBe('2');
});
test('Calendar ignores duplicate and stale asynchronous confirmation after cancel or source change', async () => {
  let resolve!: (allowed: boolean) => void;
  const before = rstest.fn(() => new Promise<boolean>(done => { resolve = done; })), confirm = rstest.fn();
  const props = { minDate: day(1), maxDate: day(30), beforeConfirm: before, onConfirm: confirm };
  const screen = render(<Calendar {...props} visible value={day(2)} />);
  tapConfirm(screen); tapConfirm(screen); expect(before).toHaveBeenCalledTimes(1);
  fireEvent.tap(screen.container.querySelector('.ui-overlay')!); resolve(true); await Promise.resolve(); await Promise.resolve(); expect(confirm).not.toHaveBeenCalled();
  screen.rerender(<Calendar {...props} visible value={day(3)} />); tapConfirm(screen);
  screen.rerender(<Calendar {...props} visible value={day(4)} />); resolve(true); await Promise.resolve(); await Promise.resolve(); expect(confirm).not.toHaveBeenCalled();
});
test('Calendar switches public tabs and reports the selected type when confirming', async () => {
  const confirm = rstest.fn(); const screen = render(<Calendar visible showTypeSwitch value={day(24)} minDate={day(1)} maxDate={day(30)} onConfirm={confirm} />);
  fireEvent.tap([...screen.container.querySelectorAll('.ui-tabs-nav-item')].find(e => e.textContent === '月')!);
  tapConfirm(screen); await waitFor(() => expect(confirm).toHaveBeenCalledWith({ value: day(24), type: 'month' }));
});
test('Calendar async shortcuts ignore results after close and support an uncontrolled ref', async () => {
  const ref = createRef<CalendarRef>(), pick = rstest.fn(); let resolve!: (value: number[]) => void;
  const screen = render(<Calendar ref={ref} type="daterange" minDate={day(1)} maxDate={day(30)} shortcuts={[{ text: '近7天' }]} onShortcutsClick={() => new Promise<number[]>(done => { resolve = done; })} onPickChange={pick} />);
  ref.current?.open(); await waitFor(() => expect(screen.container.querySelector('.ui-tag')).toBeTruthy());
  fireEvent.tap(screen.container.querySelector('.ui-tag')!); ref.current?.close(); resolve([day(2), day(8)]); await Promise.resolve(); await Promise.resolve(); expect(pick).not.toHaveBeenCalled();
});
test('Calendar shortcut updates its draft and commits a complete range through the common confirmation flow', async () => {
  const confirm = rstest.fn(), pick = rstest.fn();
  const screen = render(<Calendar visible type="daterange" showConfirm={false} minDate={day(1)} maxDate={day(30)} shortcuts={[{ text: '近7天' }]} onShortcutsClick={() => [day(2), day(8)]} onPickChange={pick} onConfirm={confirm} />);
  fireEvent.tap(screen.container.querySelector('.ui-tag')!);
  await waitFor(() => expect(confirm).toHaveBeenCalledWith({ value: [day(2), day(8)], type: 'daterange' })); expect(pick).toHaveBeenCalledTimes(1);
});
test('Calendar confirmation captures a moving time wheel and preserves both same-day constraints', async () => {
  const confirm = rstest.fn(), hour = 3600000;
  const value = [day(2) + 10 * hour, day(2) + 12 * hour];
  const screen = render(<Calendar visible type="datetimerange" value={value} minDate={day(2) + 8 * hour} maxDate={day(2) + 18 * hour} allowSameDay onConfirm={confirm} />);
  const hours = screen.container.querySelector('.ui-picker-column')!;
  expect([...hours.querySelectorAll('.ui-picker-option-disabled')].map(e => e.textContent)).toContain('09时');
  const node = lynx.createSelectorQuery().select('.ui-picker-column') as unknown as Element;
  fireEvent.scroll(node, { detail: { scrollTop: 12 * 44 } }); fireEvent.touchstart(node); fireEvent.scroll(node, { detail: { scrollTop: 13 * 44 } });
  tapConfirm(screen); await waitFor(() => expect(confirm).toHaveBeenCalledWith({ value: [value[0], day(2) + 13 * hour], type: 'datetimerange' }));
});

test('Calendar callback-only rerenders preserve an edited draft', () => {
  const screen = render(<Calendar visible value={day(2)} minDate={day(1)} maxDate={day(30)} beforeConfirm={() => false} />);
  tapDay(screen, 4);
  screen.rerender(<Calendar visible value={day(2)} minDate={day(1)} maxDate={day(30)} beforeConfirm={() => false} />);
  expect(screen.container.querySelector('.ui-calendar-day-selected')?.textContent).toBe('4');
});

test('Calendar ref sets only the draft and reveals the selected month even when the value is unchanged', async () => {
  const ref = createRef<CalendarRef>(), pick = rstest.fn(), confirm = rstest.fn();
  const screen = render(<Calendar ref={ref} visible value={day(20)} minDate={day(1)} maxDate={new Date(2026, 11, 31).getTime()} switchMode="month" onPickChange={pick} onConfirm={confirm} />);
  fireEvent.tap(screen.container.querySelector('[accessibility-label="下一月"]')!);
  expect(screen.container.querySelector('.ui-calendar-controls')?.textContent).toContain('12月');
  ref.current?.setValue(day(20));
  await waitFor(() => expect(screen.container.querySelector('.ui-calendar-controls')?.textContent).toContain('11月'));
  tapDay(screen, 21);
  ref.current?.setValue(day(20));
  await waitFor(() => expect(screen.container.querySelector('.ui-calendar-day-selected')?.textContent).toBe('20'));
  expect(pick).toHaveBeenLastCalledWith({ value: day(20) });
  expect(confirm).not.toHaveBeenCalled();
  tapConfirm(screen);
  await waitFor(() => expect(confirm).toHaveBeenCalledWith({ value: day(20), type: 'date' }));
});

test('CalendarView retains container readiness when descendant layouts bubble before an explicit reveal', () => {
  const ref = createRef<import('./CalendarView.js').CalendarViewRef>();
  const screen = render(<CalendarView ref={ref} value={day(20)} minDate={new Date(2026, 0, 1).getTime()} maxDate={new Date(2026, 11, 31).getTime()} />);
  const layout = (selector: string, width: number, height: number) => fireEvent(lynx.createSelectorQuery().select(selector) as unknown as Element, Object.assign(new Event('bindEvent:layoutchange'), { eventName: 'layoutchange', eventType: 'bindEvent', detail: { width, height } }));
  const content = screen.container.querySelector('.ui-calendar-scroll-content')!;
  const total = Number(/height:\s*([\d.]+)px/.exec(content.getAttribute('style')!)![1]);
  layout('.ui-calendar-scroll-viewport', 390, 316);
  layout('.ui-calendar-scroll-content', 390, total);
  nativeCalls.length = 0;
  layout('.ui-calendar-scroll-content', 50, 60);
  layout('.ui-calendar-scroll-viewport', 50, 60);
  ref.current?.scrollIntoView();
  expect(nativeCalls).toHaveLength(1);
  expect(nativeCalls[0]?.method).toBe('scrollTo');
});

test('CalendarView keeps its date tree unchanged for scroll events inside the same row', () => {
  const formatter = rstest.fn(day => day);
  const screen = render(<CalendarView value={day(20)} minDate={day(1)} maxDate={new Date(2026, 11, 31).getTime()} formatter={formatter} />);
  const node = lynx.createSelectorQuery().select('.ui-calendar-scroll') as unknown as Element;
  fireEvent.scroll(node, { detail: { scrollTop: 0 } });
  const before = formatter.mock.calls.length;
  for (let top = 1; top < 32; top++) fireEvent.scroll(node, { detail: { scrollTop: top } });
  expect(formatter.mock.calls.length).toBe(before);
  fireEvent.scroll(node, { detail: { scrollTop: 384 } });
  expect(screen.container.querySelectorAll('.ui-calendar-day').length).toBeGreaterThan(0);
  expect(screen.container.querySelectorAll('.ui-calendar-day').length).toBeLessThanOrEqual(77);
});

test('CalendarView only mounts weeks near the initial selected day', () => {
  const screen = render(<CalendarView value={day(20)} minDate={new Date(2026, 0, 1).getTime()} maxDate={new Date(2026, 11, 31).getTime()} />);
  expect(screen.container.querySelector('.ui-calendar-day-selected')?.textContent).toBe('20');
  expect(screen.container.querySelectorAll('.ui-calendar-day').length).toBeLessThanOrEqual(77);
});
