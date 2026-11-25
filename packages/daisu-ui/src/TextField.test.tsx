import { expect, rstest, test } from '@rstest/core';
import { useState } from '@lynx-js/react';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import type { NodesRef } from '@lynx-js/types';
import { Input } from './Input.js';
import { Textarea } from './Textarea.js';

function nativeEditor() {
  let value = '';
  const writes: string[] = [];
  const query = lynx.createSelectorQuery.bind(lynx);
  const mock = rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => {
    const result = query(), select = result.select.bind(result);
    result.select = selector => selector.startsWith('[react-ref-') ? {
      invoke: (options: Parameters<NodesRef['invoke']>[0]) => ({ exec() {
        if (options.method === 'setValue') { value = (options.params as { value: string }).value; writes.push(value); }
      } }),
    } as unknown as NodesRef : select(selector);
    return result;
  });
  const input = (next: string, isComposing = false) => {
    value = next;
    fireEvent(lynx.createSelectorQuery().select('.ui-textfield-native') as unknown as Element,
      Object.assign(new Event('bindEvent:input'), { eventName: 'input', eventType: 'bindEvent', detail: { value: next, isComposing } }));
  };
  return { mock, input, writes, value: () => value };
}

for (const [name, Editor] of [['Input', Input], ['Textarea', Textarea]] as const) {
  test(`${name} restores repeated rejected edits and clears, including an initially empty draft`, async () => {
    const native = nativeEditor(), changes: string[] = [];
    try {
      const screen = render(<Editor value="保留" clearable maxlength={20} showWordLimit onChange={value => changes.push(value)} />);
      await waitFor(() => expect(native.value()).toBe('保留'));
      for (let i = 0; i < 2; i++) {
        fireEvent.tap(screen.container.querySelector('.ui-textfield-clear')!, { eventType: 'catchEvent' });
        await waitFor(() => expect(native.value()).toBe('保留'));
      }
      for (let i = 0; i < 2; i++) { native.input('拒绝'); await waitFor(() => expect(native.value()).toBe('保留')); }
      expect(changes).toEqual(['', '', '拒绝', '拒绝']);
      expect(screen.container.querySelector('.ui-textfield-count')?.textContent).toBe('2/20');
    } finally { cleanup(); native.mock.mockRestore(); }
  });

  test(`${name} accepts controlled edits, buffers IME, and reflects external resets without extra change events`, async () => {
    const native = nativeEditor(), changes: string[] = [];
    function Controlled({ reset }: { reset: boolean }) {
      const [value, setValue] = useState<string | number>(0);
      return <Editor value={reset ? '' : value} clearable onChange={next => { changes.push(next); setValue(next); }} />;
    }
    try {
      const screen = render(<Controlled reset={false} />);
      await waitFor(() => expect(native.value()).toBe('0'));
      native.input('中', true); expect(changes).toEqual([]);
      native.input('中文'); await waitFor(() => expect(changes).toEqual(['中文']));
      expect(native.value()).toBe('中文');
      fireEvent.tap(screen.container.querySelector('.ui-textfield-clear')!, { eventType: 'catchEvent' });
      await waitFor(() => expect(native.value()).toBe(''));
      native.input('新值'); await waitFor(() => expect(changes).toEqual(['中文', '', '新值']));
      screen.rerender(<Controlled reset />);
      await waitFor(() => expect(native.value()).toBe(''));
      expect(changes).toEqual(['中文', '', '新值']);
    } finally { cleanup(); native.mock.mockRestore(); }
  });

  test(`${name} disabled and readonly editors block changes and clear controls`, () => {
    const native = nativeEditor(), change = rstest.fn();
    try {
      const screen = render(<Editor defaultValue="初始" disabled clearable onChange={change} />);
      expect(screen.container.querySelector('.ui-textfield-native')?.getAttribute('disabled')).toBe('true');
      native.input('修改'); expect(change).not.toHaveBeenCalled(); expect(screen.container.querySelector('.ui-textfield-clear')).toBeNull();
      screen.rerender(<Editor value="只读" readonly clearable onChange={change} />);
      expect(screen.container.querySelector('.ui-textfield-native')?.getAttribute('readonly')).toBe('true');
      native.input('修改'); expect(change).not.toHaveBeenCalled(); expect(screen.container.querySelector('.ui-textfield-clear')).toBeNull();
    } finally { cleanup(); native.mock.mockRestore(); }
  });
}
