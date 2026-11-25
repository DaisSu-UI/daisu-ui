import { beforeEach, afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { createRef } from '@lynx-js/react';
import { DatetimePicker, datetimeDraft } from './DatetimePicker.js';
import type { DatetimePickerRef } from './DatetimePicker.js';
beforeEach(() => { const original = lynx.createSelectorQuery.bind(lynx); rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => { const query = original(), select = query.select.bind(query); query.select = selector => selector.startsWith('[react-ref-') ? { invoke: () => ({ exec() {} }) } as unknown as import('@lynx-js/types').NodesRef : select(selector); return query; }); });
afterEach(() => { cleanup(); rstest.restoreAllMocks(); });
const at = (year: number, month: number, day: number, hour = 0, minute = 0) => new Date(year, month - 1, day, hour, minute).getTime();
const tap = (screen: Pick<ReturnType<typeof render>, 'container'>, selector: string) => fireEvent.tap(screen.container.querySelector(selector)!);
test('DatetimePicker preserves the supplied value on open and commits after approval only', async () => {
  const confirm = rstest.fn(), changed = rstest.fn();
  const screen = render(<DatetimePicker visible type="time" value="09:20:26" useSecond onConfirm={confirm} onChange={changed} />);
  expect([...screen.container.querySelectorAll('.ui-picker-option-selected')].map(e => e.textContent)).toEqual(['09', '20', '26']);
  tap(screen, '.ui-datetime-picker-confirm'); await waitFor(() => expect(confirm).toHaveBeenCalledWith({ value: '09:20:26' })); expect(changed).toHaveBeenCalledTimes(1);
});
test('DatetimePicker cancel discards drafts and reopening uses the committed value', async () => {
  const pick = rstest.fn(), changed = rstest.fn(), cancel = rstest.fn();
  const screen = render(<DatetimePicker visible type="time" value="09:20" onPickChange={pick} onChange={changed} onCancel={cancel} />);
  fireEvent.tap(screen.container.querySelectorAll('.ui-picker-column')[0]!.querySelectorAll('.ui-picker-option')[10]!);
  expect(pick).toHaveBeenCalledWith({ value: '10:20' }); expect(changed).not.toHaveBeenCalled(); tap(screen, '.ui-datetime-picker-cancel'); expect(cancel).toHaveBeenCalledTimes(1);
  screen.rerender(<DatetimePicker visible={false} type="time" value="09:20" />); screen.rerender(<DatetimePicker visible type="time" value="09:20" />);
  expect([...screen.container.querySelectorAll('.ui-picker-option-selected')].map(e => e.textContent)).toEqual(['09', '20']);
});
test('DatetimePicker range switches active views, disables crossing boundaries and returns both endpoints', async () => {
  const confirm = rstest.fn(), toggle = rstest.fn(); const value = [at(2024, 5, 20, 10, 20), at(2024, 5, 21, 9, 0)];
  const screen = render(<DatetimePicker visible value={value} onConfirm={confirm} onToggle={toggle} />);
  expect(screen.container.querySelectorAll('.ui-datetime-picker-range-item')).toHaveLength(2);
  expect(screen.container.querySelectorAll('.ui-picker-column')[2]!.querySelectorAll('.ui-picker-option-disabled').length).toBeGreaterThan(0);
  fireEvent.tap(screen.container.querySelectorAll('.ui-datetime-picker-range-item')[1]!); expect(toggle).toHaveBeenCalledWith(value[1]);
  const days = screen.container.querySelectorAll('.ui-picker-column')[2]!;
  expect([...days.querySelectorAll('.ui-picker-option-disabled')].map(e => e.textContent)).toContain('19');
  tap(screen, '.ui-datetime-picker-confirm'); await waitFor(() => expect(confirm).toHaveBeenCalledWith({ value }));
});
test('DatetimePicker initializes empty range endpoints to boundaries and corrects reversed ranges', () => {
  const bounds = { minDate: at(2024, 1, 1), maxDate: at(2024, 12, 31, 23, 59) };
  expect(datetimeDraft(['', ''], bounds)).toEqual([bounds.minDate, bounds.maxDate]);
  expect(datetimeDraft([at(2024, 6, 1), at(2024, 5, 1)], bounds)).toEqual([at(2024, 6, 1), at(2024, 6, 1)]);
  expect(datetimeDraft(['', ''], { type: 'time', useSecond: true, minHour: 8, maxHour: 18 })).toEqual(['08:00:00', '18:59:59']);
});
test('DatetimePicker rejects duplicate or stale async confirmations after cancellation or owner changes', async () => {
  let resolve!: (allow: boolean) => void; const before = rstest.fn(() => new Promise<boolean>(done => { resolve = done; })), confirm = rstest.fn();
  const screen = render(<DatetimePicker visible type="time" value="09:20" beforeConfirm={before} onConfirm={confirm} />);
  tap(screen, '.ui-datetime-picker-confirm'); tap(screen, '.ui-datetime-picker-confirm'); expect(before).toHaveBeenCalledTimes(1);
  tap(screen, '.ui-overlay'); resolve(true); await Promise.resolve(); await Promise.resolve(); expect(confirm).not.toHaveBeenCalled();
  screen.rerender(<DatetimePicker visible type="time" value="10:20" beforeConfirm={before} onConfirm={confirm} />); tap(screen, '.ui-datetime-picker-confirm');
  screen.rerender(<DatetimePicker visible type="time" value="10:20" maxHour={12} beforeConfirm={before} onConfirm={confirm} />); resolve(true); await Promise.resolve(); await Promise.resolve(); expect(confirm).not.toHaveBeenCalled();
});
test('DatetimePicker rejected promises preserve the draft and ref can open an uncontrolled picker', async () => {
  const ref = createRef<DatetimePickerRef>(), confirm = rstest.fn(); const screen = render(<DatetimePicker ref={ref} type="time" value="09:20" beforeConfirm={() => Promise.reject(new Error('拒绝'))} onConfirm={confirm} />);
  expect(screen.container.querySelector('.ui-picker-column')).toBeNull(); ref.current?.open();
  await waitFor(() => expect(screen.container.querySelector('.ui-picker-column')).toBeTruthy()); tap(screen, '.ui-datetime-picker-confirm'); await Promise.resolve(); await Promise.resolve(); expect(confirm).not.toHaveBeenCalled();
  expect([...screen.container.querySelectorAll('.ui-picker-option-selected')].map(e => e.textContent)).toEqual(['09', '20']); ref.current?.close();
});
test('DatetimePicker confirmation captures an unsettled wheel offset rather than its old value', async () => {
  const confirm = rstest.fn(); const screen = render(<DatetimePicker visible type="time" value="09:20" onConfirm={confirm} />);
  const node = lynx.createSelectorQuery().select('.ui-picker-column') as unknown as Element;
  // Clear the initial programmatic scroll acknowledgement, then simulate a native drag.
  fireEvent.scroll(node, { detail: { scrollTop: 9 * 44 } }); fireEvent.touchstart(node); fireEvent.scroll(node, { detail: { scrollTop: 10 * 44 } });
  tap(screen, '.ui-datetime-picker-confirm'); await waitFor(() => expect(confirm).toHaveBeenCalledWith({ value: '10:20' }));
});
test('DatetimePicker unmount invalidates an asynchronous beforeConfirm', async () => {
  let resolve!: (allow: boolean) => void; const confirm = rstest.fn(); const screen = render(<DatetimePicker visible type="time" value="09:20" onConfirm={confirm} beforeConfirm={() => new Promise(done => { resolve = done; })} />);
  tap(screen, '.ui-datetime-picker-confirm'); screen.unmount(); resolve(true); await Promise.resolve(); await Promise.resolve(); expect(confirm).not.toHaveBeenCalled();
});
