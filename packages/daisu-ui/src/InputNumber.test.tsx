import { expect, rstest, test } from '@rstest/core';
import { useState } from '@lynx-js/react';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import type { NodesRef } from '@lynx-js/types';
import { InputNumber } from './InputNumber.js';
import type { InputNumberValue } from './InputNumber.js';
import { addNumber, normalizeNumber, numberRules } from './inputNumberModel.js';
function setupNative() {
  let value = '';
  const query = lynx.createSelectorQuery.bind(lynx);
  const mock = rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => {
    const result = query(), select = result.select.bind(result);
    result.select = selector => selector.startsWith('[react-ref-') ? { invoke: (options: Parameters<NodesRef['invoke']>[0]) => ({ exec() { if (options.method === 'setValue') value = (options.params as { value: string }).value; } }) } as unknown as NodesRef : select(selector);
    return result;
  });
  const emit = (event: string, next: string) => { value = next; fireEvent(lynx.createSelectorQuery().select('.ui-textfield-native') as unknown as Element, Object.assign(new Event(`bindEvent:${event}`), { eventName: event, eventType: 'bindEvent', detail: { value: next } })); };
  const mount = (container: ParentNode) => { value = container.querySelector('.ui-textfield-native')?.getAttribute('default-value') ?? ''; };
  return { mock, emit, mount, value: () => value };
}
const tap = (container: HTMLElement, direction: 'plus' | 'minus') => fireEvent.tap(container.querySelector(`.ui-input-number-${direction}`)!, { eventType: 'catchEvent' });
test('InputNumber decimal and strict stepping respect legal bounds without floating-point drift', () => {
  const decimal = numberRules({ min: -10, max: 10, step: .1, precision: 1 });
  expect(normalizeNumber(addNumber(.1, .2), decimal)).toBe(.3);
  expect(normalizeNumber(-1.26, decimal)).toBe(-1.3);
  const strict = numberRules({ min: 3, max: 15, step: 2, stepStrictly: true });
  expect([1, 5, 17].map(value => normalizeNumber(value, strict))).toEqual([4, 6, 14]);
  expect(normalizeNumber(10, numberRules({ min: 3, max: 3, step: 2, stepStrictly: true }))).toBe(3);
});
test('InputNumber temporary empty text waits for blur; deferred input commits once and allowNull preserves empty', async () => {
  const native = setupNative(), changes: InputNumberValue[] = [];
  try {
    const screen = render(<InputNumber immediateChange={false} onChange={event => changes.push(event.value)} />);
    native.emit('input', '8'); expect(changes).toEqual([]);
    native.emit('blur', '8'); await waitFor(() => expect(changes).toEqual([8]));
    native.emit('input', ''); expect(changes).toEqual([8]);
    native.emit('blur', ''); await waitFor(() => expect(changes).toEqual([8, 1]));
    screen.rerender(<InputNumber allowNull onChange={event => changes.push(event.value)} />);
    native.emit('input', ''); await waitFor(() => expect(changes).toEqual([8, 1, '']));
  } finally { cleanup(); native.mock.mockRestore(); }
});
test('InputNumber controlled buttons and edits restore rejected values and honor all disabled controls', async () => {
  const native = setupNative(), changes: InputNumberValue[] = [];
  try {
    const screen = render(<InputNumber value={2} onChange={event => changes.push(event.value)} />);
    native.mount(screen.container);
    await waitFor(() => expect(native.value()).toBe('2'));
    for (let i = 0; i < 2; i++) { tap(screen.container, 'plus'); await waitFor(() => expect(native.value()).toBe('2')); }
    expect(changes).toEqual([3, 3]);
    screen.rerender(<InputNumber value={2} disabled onChange={event => changes.push(event.value)} />); tap(screen.container, 'plus'); expect(changes).toHaveLength(2);
    screen.rerender(<InputNumber value={2} disableMinus disablePlus disableInput onChange={event => changes.push(event.value)} />); tap(screen.container, 'plus'); tap(screen.container, 'minus'); expect(changes).toHaveLength(2);
    screen.rerender(<InputNumber value={3} min={3} max={4} step={2} onChange={event => changes.push(event.value)} />); tap(screen.container, 'plus'); tap(screen.container, 'minus'); expect(changes).toHaveLength(2);
  } finally { cleanup(); native.mock.mockRestore(); }
});
test('InputNumber async guards cancel on external replacement, reject edits, and ignore results after unmount', async () => {
  const native = setupNative(), changes: InputNumberValue[] = [], guards: ((accepted: boolean) => void)[] = [];
  const beforeChange = () => new Promise<boolean>(resolve => guards.push(resolve));
  try {
    const screen = render(<InputNumber value={2} beforeChange={beforeChange} onChange={event => changes.push(event.value)} />);
    tap(screen.container, 'plus'); expect(guards).toHaveLength(1);
    screen.rerender(<InputNumber value={7} beforeChange={beforeChange} onChange={event => changes.push(event.value)} />);
    guards[0](true); await waitFor(() => expect(native.value()).toBe('7')); expect(changes).toEqual([]);
    tap(screen.container, 'plus'); guards[1](false); await waitFor(() => expect(native.value()).toBe('7')); expect(changes).toEqual([]);
    tap(screen.container, 'plus'); screen.unmount(); guards[2](true); await Promise.resolve(); expect(changes).toEqual([]);
  } finally { cleanup(); native.mock.mockRestore(); }
});
test('InputNumber long press repeats on controlled updates and stops on touch cancel without a trailing tap', async () => {
  const native = setupNative();
  rstest.useFakeTimers();
  try {
    function Controlled() { const [value, setValue] = useState(1); return <InputNumber longPress value={value} onChange={event => setValue(Number(event.value))} />; }
    const screen = render(<Controlled />), plus = screen.container.querySelector('.ui-input-number-plus')!;
    fireEvent.touchstart(plus, { touches: [{ clientX: 10, clientY: 10 }] });
    await rstest.advanceTimersByTimeAsync(1100);
    expect(native.value()).toBe('4');
    fireEvent.touchcancel(plus); await rstest.advanceTimersByTimeAsync(1000); expect(native.value()).toBe('4');
    tap(screen.container, 'plus'); await Promise.resolve(); expect(native.value()).toBe('4');
  } finally { cleanup(); rstest.useRealTimers(); native.mock.mockRestore(); }
});
