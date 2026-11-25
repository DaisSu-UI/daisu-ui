import { expect, rstest, test } from '@rstest/core';
import { createRef } from '@lynx-js/react';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import type { NodesRef } from '@lynx-js/types';
import { Search } from './Search.js';
import type { SearchRef } from './Search.js';
function nativeMethods() {
  const calls: string[] = [], query = lynx.createSelectorQuery.bind(lynx);
  const mock = rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => { const result = query(), select = result.select.bind(result); result.select = selector => selector.startsWith('[react-ref-') ? { invoke: (options: Parameters<NodesRef['invoke']>[0]) => ({ exec() { calls.push(options.method); } }) } as unknown as NodesRef : select(selector); return result; });
  return { calls, mock };
}
const emit = (name: string, value: string) => fireEvent(lynx.createSelectorQuery().select('.ui-textfield-native') as unknown as Element, Object.assign(new Event(`bindEvent:${name}`), { eventName: name, eventType: 'bindEvent', detail: { value } }));
test('Search preserves its native editor through centered-placeholder focus, input, search and cancellation', async () => {
  const native = nativeMethods(), events: string[] = [];
  try {
    const screen = render(<Search onChange={({ value }) => events.push(`change:${value}`)} onSearch={({ value }) => events.push(`search:${value}`)} onCancel={({ value }) => events.push(`cancel:${value}`)} />);
    const input = screen.container.querySelector('input'); expect(screen.container.querySelector('.ui-search-cover')).toBeTruthy();
    fireEvent.tap(screen.container.querySelector('.ui-search-cover')!);
    await waitFor(() => expect(screen.container.querySelector('.ui-search-cover')).toBeNull()); expect(native.calls).toContain('focus');
    emit('input', '中文搜索'); emit('confirm', '中文搜索'); fireEvent.tap(screen.container.querySelector('.ui-search-cancel')!);
    expect(screen.container.querySelector('input')).toBe(input);
    expect(events).toEqual(['change:中文搜索', 'search:中文搜索', 'cancel:中文搜索']);
  } finally { cleanup(); native.mock.mockRestore(); }
});
test('Search clear emits change/clear once and honors both focus policies', async () => {
  const native = nativeMethods(), events: string[] = [];
  try {
    const screen = render(<Search defaultValue="原值" onChange={({ value }) => events.push(`change:${value}`)} onClear={() => events.push('clear')} />);
    fireEvent.tap(screen.container.querySelector('.ui-search-clear')!, { eventType: 'catchEvent' });
    await waitFor(() => expect(screen.container.querySelector('.ui-search-cover')).toBeTruthy());
    expect(events).toEqual(['change:', 'clear']); expect(native.calls).toContain('blur');
    screen.rerender(<Search value="继续" focusWhenClear onChange={({ value }) => events.push(`change:${value}`)} onClear={() => events.push('clear')} />);
    fireEvent.tap(screen.container.querySelector('.ui-search-clear')!, { eventType: 'catchEvent' });
    expect(native.calls).toContain('focus'); expect(events).toEqual(['change:', 'clear', 'change:', 'clear']);
    // Rejected controlled clear keeps the displayed value and clear affordance.
    await waitFor(() => expect(screen.container.querySelector('.ui-search-clear')).toBeTruthy());
  } finally { cleanup(); native.mock.mockRestore(); }
});
test('Search disabled entry remains clickable without editing; slots and hideCancel are honored', () => {
  const native = nativeMethods(), click = rstest.fn(), change = rstest.fn();
  try {
    const screen = render(<Search disabled hideCancel onTap={click} onChange={change} />);
    fireEvent.tap(screen.container.querySelector('.ui-search-cover')!); fireEvent.tap(screen.container.querySelector('.ui-search-block')!);
    expect(click).toHaveBeenCalled(); expect(native.calls).not.toContain('focus'); emit('input', '修改'); expect(change).not.toHaveBeenCalled();
    expect(screen.container.querySelector('.ui-search-cancel')).toBeNull();
    screen.rerender(<Search placeholderLeft prefix="全部" inputSuffix="扫码" suffix="筛选" maxlength="4" />);
    expect(screen.container.querySelector('.ui-search-cover')).toBeNull(); expect(screen.container.querySelector('.ui-search-prefix')?.textContent).toBe('全部');
    expect(screen.container.querySelector('.ui-search-input-suffix')?.textContent).toBe('扫码'); expect(screen.container.querySelector('.ui-search-suffix')?.textContent).toBe('筛选');
    expect(screen.container.querySelector('input')?.getAttribute('maxlength')).toBe('4');
  } finally { cleanup(); native.mock.mockRestore(); }
});
test('Search ref focuses, blurs and restores the cover after blur; pending blur is cleared on unmount', async () => {
  const native = nativeMethods(), ref = createRef<SearchRef>(), blur = rstest.fn();
  rstest.useFakeTimers();
  try {
    const screen = render(<Search ref={ref} onBlur={blur} />);
    ref.current!.focus(); await Promise.resolve(); expect(screen.container.querySelector('.ui-search-cover')).toBeNull();
    emit('blur', ''); await rstest.advanceTimersByTimeAsync(150); expect(blur).toHaveBeenCalledTimes(1); expect(screen.container.querySelector('.ui-search-cover')).toBeTruthy();
    ref.current!.focus(); ref.current!.setSelectionRange(0, 0); ref.current!.blur();
    expect(native.calls).toContain('setSelectionRange'); expect(native.calls).toContain('blur');
    emit('blur', ''); screen.unmount(); await rstest.advanceTimersByTimeAsync(300); expect(blur).toHaveBeenCalledTimes(1);
  } finally { cleanup(); rstest.useRealTimers(); native.mock.mockRestore(); }
});
