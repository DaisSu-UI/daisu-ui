import { afterEach, expect, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { SelectPicker } from './SelectPicker.js';
afterEach(cleanup);
const columns = [{ value: false, label: 'False' }, { value: 'false', label: 'String' }, { value: 1, label: 'Disabled', disabled: true }];
function tapChoice(screen: Pick<ReturnType<typeof render>, 'container'>, index: number) {
  const element = screen.container.querySelectorAll('.ui-choice')[index]!;
  fireEvent(element, Object.assign(new Event('catchEvent:tap'), { eventName: 'tap', eventType: 'catchEvent' }));
}

test('SelectPicker change reports drafts; cancellation and reopening restore the committed value', () => {
  const changes: unknown[] = []; let confirms = 0, cancels = 0;
  const screen = render(<SelectPicker visible columns={columns} value={[false]} onChange={event => changes.push(event.value)} onConfirm={() => confirms++} onCancel={() => cancels++} />);
  tapChoice(screen, 2); expect(changes).toEqual([]);
  tapChoice(screen, 1); expect(changes).toEqual([[false, 'false']]); expect(confirms).toBe(0);
  fireEvent.tap(screen.container.querySelector('.ui-overlay')!); expect(cancels).toBe(1);
  screen.rerender(<SelectPicker visible={false} columns={columns} value={[false]} />);
  screen.rerender(<SelectPicker visible columns={columns} value={[false]} />);
  expect(screen.container.querySelectorAll('.ui-choice-checked')).toHaveLength(1);
});

test('SelectPicker handles boolean radio values, custom fields and auto confirmation', async () => {
  const results: unknown[] = [];
  const screen = render(<SelectPicker visible type="radio" showConfirm={false} columns={[{ id: false, text: 'False' }, { id: true, text: 'True' }]} valueKey="id" labelKey="text" value={true} onConfirm={event => results.push(event)} />);
  expect(screen.container.querySelector('.ui-select-picker-footer')).toBeNull();
  tapChoice(screen, 0);
  await waitFor(() => expect(results).toHaveLength(1));
  expect(results[0]).toMatchObject({ value: false, selectedItems: [{ value: false, label: 'False', id: false }] });
});

test('SelectPicker rejects duplicate and stale confirmations after closing', async () => {
  let resolve!: (allow: boolean) => void, calls = 0, confirms = 0;
  const screen = render(<SelectPicker visible columns={columns} beforeConfirm={() => { calls++; return new Promise(r => { resolve = r; }); }} onConfirm={() => confirms++} />);
  fireEvent.tap(screen.container.querySelector('.ui-select-picker-footer .ui-button')!);
  fireEvent.tap(screen.container.querySelector('.ui-select-picker-footer .ui-button')!); expect(calls).toBe(1);
  fireEvent.tap(screen.container.querySelector('.ui-overlay')!); resolve(true); await Promise.resolve(); await Promise.resolve(); expect(confirms).toBe(0);
});

test('SelectPicker min/max constraints and loading prevent invalid interaction', () => {
  const changes: unknown[] = []; let confirms = 0;
  const screen = render(<SelectPicker visible columns={columns} value={[false]} min={1} max={1} onChange={event => changes.push(event)} />);
  tapChoice(screen, 0); tapChoice(screen, 1); expect(changes).toEqual([]);
  screen.rerender(<SelectPicker visible columns={columns} loading onChange={event => changes.push(event)} onConfirm={() => confirms++} />);
  tapChoice(screen, 0); fireEvent.tap(screen.container.querySelector('.ui-select-picker-footer .ui-button')!); expect(changes).toEqual([]); expect(confirms).toBe(0);
});
