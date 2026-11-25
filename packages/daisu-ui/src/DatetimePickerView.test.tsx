import { beforeEach, afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { createRef } from '@lynx-js/react';
import { DatetimePickerView } from './DatetimePickerView.js';
import type { DatetimePickerViewRef } from './DatetimePickerView.js';
beforeEach(() => { const original = lynx.createSelectorQuery.bind(lynx); rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => { const query = original(), select = query.select.bind(query); query.select = selector => selector.startsWith('[react-ref-') ? { invoke: () => ({ exec() {} }) } as unknown as import('@lynx-js/types').NodesRef : select(selector); return query; }); });
afterEach(() => { cleanup(); rstest.restoreAllMocks(); });
test('DatetimePickerView reports correction metadata and exposes current options through its ref', () => {
  const changed = rstest.fn(), ref = createRef<DatetimePickerViewRef>();
  render(<DatetimePickerView ref={ref} type="time" value="25:70" onChange={changed} />);
  expect(changed).toHaveBeenCalledWith(expect.objectContaining({ value: '23:59', columns: [expect.objectContaining({ type: 'hour' }), expect.objectContaining({ type: 'minute' })] }));
  expect(ref.current?.correctValue('01:04')).toBe('01:04'); expect(ref.current?.getSelectedOptions().map(o => o.value)).toEqual([23, 59]);
});
test('DatetimePickerView month interaction clips invalid dates and reports corrected columns', async () => {
  const changed = rstest.fn(); const value = new Date(2024, 0, 31).getTime();
  const screen = render(<DatetimePickerView type="date" value={value} onChange={changed} />);
  fireEvent.tap(screen.container.querySelectorAll('.ui-picker-column')[1]!.querySelectorAll('.ui-picker-option')[1]!);
  await waitFor(() => expect(changed).toHaveBeenCalledWith(expect.objectContaining({ value: new Date(2024, 1, 29).getTime(), columns: expect.arrayContaining([expect.objectContaining({ type: 'date', values: expect.arrayContaining([29]) })]) })));
});
