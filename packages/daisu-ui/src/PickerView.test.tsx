import { beforeEach, afterEach, expect, rstest, test } from '@rstest/core';
import { createRef } from '@lynx-js/react';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { PickerView } from './PickerView.js';
import type { PickerViewRef } from './PickerView.js';
import { nearestPickerIndex, pickerSelection } from './pickerModel.js';
beforeEach(() => { const original = lynx.createSelectorQuery.bind(lynx); rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => { const query = original(), select = query.select.bind(query); query.select = selector => selector.startsWith('[react-ref-') ? { invoke: () => ({ exec() {} }) } as unknown as import('@lynx-js/types').NodesRef : select(selector); return query; }); });
afterEach(() => { cleanup(); rstest.restoreAllMocks(); });

test('PickerView maps custom cascade fields, preserves strict values and returns complete metadata', () => {
  const event = pickerSelection({ columns: [{ id: 1, text: '数值', nodes: [{ id: 2, text: '禁用', disabled: true }, { id: '2', text: '字符串' }] }], value: [1, 2], cascade: true, valueKey: 'id', labelKey: 'text', childrenKey: 'nodes' }, 1);
  expect(event.value).toEqual([1, '2']); expect(event.selectedValues).toEqual(event.value);
  expect(event.selectedLabels).toEqual(['数值', '字符串']); expect(event.selectedIndexes).toEqual([0, 1]); expect(event.columnIndex).toBe(1);
  expect(pickerSelection({ columns: [['a', 'b'], [1, 2]], value: ['b', 2] }).value).toEqual(['b', 2]);
  expect(nearestPickerIndex([{ value: 1, label: 'one', disabled: true }], 0)).toBe(-1);
});

test('PickerView ignores disabled taps, reads the latest offset before confirmation, and resets columns', async () => {
  const ref = createRef<PickerViewRef>(), changes: unknown[] = [];
  const columns = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B', disabled: true }, { value: 'c', label: 'C' }];
  const screen = render(<PickerView ref={ref} columns={columns} immediateChange onChange={event => changes.push(event)} />);
  fireEvent.tap(screen.container.querySelectorAll('.ui-picker-option')[1]!); expect(changes).toEqual([]);
  const column = lynx.createSelectorQuery().select('.ui-picker-column') as unknown as Element;
  fireEvent.touchstart(column); fireEvent.scroll(column, { detail: { scrollTop: 88 } });
  expect(ref.current!.getSelectedValues()).toEqual(['c']);
  fireEvent.touchend(column); expect(changes).toHaveLength(1); expect(ref.current!.getColumnIndex(0)).toBe(2);
  fireEvent.tap(screen.container.querySelectorAll('.ui-picker-option')[2]!); expect(changes).toHaveLength(1);
  ref.current!.resetColumns([1, 2]); await waitFor(() => expect(ref.current!.getColumnData(0).map(item => item.value)).toEqual([1, 2]));
  screen.rerender(<PickerView ref={ref} columns={['new']} />); expect(ref.current!.getSelectedValues()).toEqual(['new']);
});

test('PickerView programmatic value updates do not emit change and disabled wheels ignore gestures', () => {
  let count = 0;
  const columns = ['a', 'b']; const screen = render(<PickerView columns={columns} value={['a']} onChange={() => count++} />);
  screen.rerender(<PickerView columns={columns} value={['b']} disabled immediateChange onChange={() => count++} />);
  fireEvent.tap(screen.container.querySelectorAll('.ui-picker-option')[0]!);
  const column = lynx.createSelectorQuery().select('.ui-picker-column') as unknown as Element;
  fireEvent.touchstart(column); fireEvent.scroll(column, { detail: { scrollTop: 0 } }); fireEvent.touchend(column);
  expect(count).toBe(0); expect(screen.container.querySelector('.ui-picker-option-selected')!.textContent).toBe('b');
});
