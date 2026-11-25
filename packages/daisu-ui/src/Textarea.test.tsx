import { expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import type { NodesRef } from '@lynx-js/types';
import { Textarea } from './Textarea.js';
function nativeMethods() {
  const query = lynx.createSelectorQuery.bind(lynx);
  return rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => { const result = query(), select = result.select.bind(result); result.select = selector => selector.startsWith('[react-ref-') ? { invoke: () => ({ exec() {} }) } as unknown as NodesRef : select(selector); return result; });
}
const emit = (name: string, detail: unknown) => fireEvent(lynx.createSelectorQuery().select('.ui-textfield-native') as unknown as Element, Object.assign(new Event(`bindEvent:${name}`), { eventName: name, eventType: 'bindEvent', detail }));
test('Textarea preserves multiline value, counts input, clears it, and excludes clearing when readonly', async () => {
  const mock = nativeMethods(), events: string[] = [];
  try {
    const screen = render(<Textarea defaultValue={'第一行\n第二行'} maxlength={20} showWordLimit clearable onChange={value => events.push(value)} />);
    expect(screen.container.querySelector('.ui-textfield-count')?.textContent).toBe('7/20'); emit('input', { value: '新内容\n继续输入' });
    await waitFor(() => expect(screen.container.querySelector('.ui-textfield-count')?.textContent).toBe('8/20'));
    fireEvent.tap(screen.container.querySelector('.ui-textfield-clear')!, { eventType: 'catchEvent' });
    await waitFor(() => expect(screen.container.querySelector('.ui-textfield-count')?.textContent).toBe('0/20')); expect(events).toEqual(['新内容\n继续输入', '']);
    screen.rerender(<Textarea value="只读" readonly clearable />); emit('input', { value: '修改' }); expect(events).toHaveLength(2); expect(screen.container.querySelector('.ui-textfield-clear')).toBeNull();
  } finally { cleanup(); mock.mockRestore(); }
});
test('Textarea auto-height uses native text measurement for wrapping, supports bounds, and exposes native line events', async () => {
  const mock = nativeMethods(), lines: number[] = [];
  try {
    const screen = render(<Textarea autoHeight minHeight={40} maxHeight={100} defaultValue={'一\n二\n'} onLineChange={event => lines.push(event.lineCount)} />);
    expect(screen.container.querySelectorAll('.ui-textfield-mirror-line')).toHaveLength(3);
    expect(screen.container.querySelector('textarea')?.getAttribute('style')).toContain('height: 40px');
    fireEvent.layoutchange(screen.container.querySelector('.ui-textfield-mirror')!, { detail: { width: 200, height: 140 } });
    await waitFor(() => expect(screen.container.querySelector('textarea')?.getAttribute('style')).toContain('height: 100px'));
    emit('line', { line: 7 }); expect(lines).toEqual([7]);
    fireEvent.layoutchange(screen.container.querySelector('.ui-textfield-mirror')!, { detail: { width: 200, height: 20 } });
    await waitFor(() => expect(screen.container.querySelector('textarea')?.getAttribute('style')).toContain('height: 40px'));
  } finally { cleanup(); mock.mockRestore(); }
});
