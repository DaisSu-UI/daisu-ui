import { expect, rstest, test } from '@rstest/core';
import { createRef } from '@lynx-js/react';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import type { NodesRef } from '@lynx-js/types';
import { Input } from './Input.js';
import type { InputRef } from './Input.js';
function nativeMethods() {
  const calls: unknown[] = [], createQuery = lynx.createSelectorQuery.bind(lynx);
  const mock = rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => { const query = createQuery(), select = query.select.bind(query); query.select = selector => { if (selector.startsWith('[react-ref-')) return { invoke: (options: Parameters<NodesRef['invoke']>[0]) => ({ exec() { calls.push([options.method, options.params]); options.success?.({}); } }) } as unknown as NodesRef; return select(selector); }; return query; });
  return { calls, mock };
}
function emit(name: string, detail: unknown) { fireEvent(lynx.createSelectorQuery().select('.ui-textfield-native') as unknown as Element, Object.assign(new Event(`bindEvent:${name}`), { eventName: name, eventType: 'bindEvent', detail })); }

test('Input buffers composition, synchronizes externally controlled values and rolls back rejected edits', async () => {
  const { calls, mock } = nativeMethods(), changes: string[] = [];
  try {
    const screen = render(<Input value="初始" onChange={v => changes.push(v)} />);
    await waitFor(() => expect(calls).toContainEqual(['setValue', { value: '初始' }]));
    emit('input', { value: '拼', isComposing: true }); expect(changes).toEqual([]);
    emit('input', { value: '拼音', isComposing: false }); expect(changes).toEqual(['拼音']);
    await waitFor(() => expect(calls).toContainEqual(['setValue', { value: '初始' }]));
    screen.rerender(<Input value="外部重置" onChange={v => changes.push(v)} />);
    await waitFor(() => expect(calls).toContainEqual(['setValue', { value: '外部重置' }]));
    expect(changes).toEqual(['拼音']);
  } finally { cleanup(); mock.mockRestore(); }
});
test('Input clear emits input/change/clear once, password toggle retains editor and readonly is inert', async () => {
  const { calls, mock } = nativeMethods(), events: string[] = [];
  try {
    const screen = render(<Input defaultValue="123456" clearable showPassword onChange={v => events.push(`change:${v}`)} onInput={e => events.push(`input:${e.value}`)} onClear={() => events.push('clear')} />);
    const editor = screen.container.querySelector('input');
    fireEvent.tap(screen.container.querySelector('.ui-textfield-eye')!, { eventType: 'catchEvent' });
    expect(screen.container.querySelector('input')).toBe(editor); expect(editor?.getAttribute('type')).toBe('text');
    fireEvent.tap(screen.container.querySelector('.ui-textfield-clear')!, { eventType: 'catchEvent' });
    expect(events).toEqual(['input:', 'change:', 'clear']); expect(calls).toContainEqual(['focus', undefined]);
    await waitFor(() => expect(screen.container.querySelector('.ui-textfield-clear')).toBeNull());
    screen.rerender(<Input value="只读" readonly clearable onChange={v => events.push(v)} />); emit('input', { value: '伪造' });
    expect(events).toHaveLength(3); expect(screen.container.querySelector('.ui-textfield-clear')).toBeNull();
  } finally { cleanup(); mock.mockRestore(); }
});
test('Input focus-only clear handles blur-before-tap, respects focusWhenClear and exposes bounded selection', async () => {
  const { calls, mock } = nativeMethods(), ref = createRef<InputRef>();
  try {
    const screen = render(<Input ref={ref} defaultValue="abc" clearable clearTrigger="focus" focusWhenClear={false} />);
    expect(screen.container.querySelector('.ui-textfield-clear')).toBeNull(); emit('focus', { value: 'abc' });
    await waitFor(() => expect(screen.container.querySelector('.ui-textfield-clear')).toBeTruthy());
    ref.current!.setSelectionRange(-1, 20); expect(calls).toContainEqual(['setSelectionRange', { selectionStart: 0, selectionEnd: 3 }]);
    emit('blur', { value: 'abc' }); fireEvent.tap(screen.container.querySelector('.ui-textfield-clear')!, { eventType: 'catchEvent' });
    expect(calls.some(x => (x as unknown[])[0] === 'focus')).toBe(false);
  } finally { cleanup(); mock.mockRestore(); }
});
