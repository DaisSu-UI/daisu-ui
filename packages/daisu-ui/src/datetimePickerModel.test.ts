import { expect, test } from '@rstest/core';
import { datetimeDefaults, datetimeLabel, datetimeModel } from './datetimePickerModel.js';
const at = (y: number, m: number, d: number, h = 0, min = 0, s = 0) => new Date(y, m - 1, d, h, min, s).getTime();
test('Datetime model defaults to padded numeric columns and corrects empty values', () => {
  const model = datetimeModel({ value: '' }); expect(model.value).toBe(datetimeDefaults.minDate); expect(model.columns[1]![0]!.label).toBe('01'); expect(model.origin.map(column => column.type)).toEqual(['year', 'month', 'date', 'hour', 'minute']);
});
test('Datetime model clips January 31 to February, including leap years, without rolling into March', () => {
  const source = { value: at(2024, 1, 31, 12, 30), useSecond: true };
  expect(datetimeModel(source, [2024, 2, 31, 12, 30, 0]).value).toBe(at(2024, 2, 29, 12, 30));
  expect(datetimeModel(source, [2025, 2, 31, 12, 30, 0]).value).toBe(at(2025, 2, 28, 12, 30));
});
test('Datetime model recalculates dependent hours, minutes and seconds at both bounds', () => {
  const props = { value: at(2024, 5, 20, 15, 0), minDate: at(2024, 5, 20, 14, 23, 31), maxDate: at(2024, 5, 21, 9, 4, 5), useSecond: true };
  const low = datetimeModel(props, [2024, 5, 20, 0, 0, 0]); expect(low.value).toBe(props.minDate); expect(low.origin[5]!.values[0]).toBe(31);
  const high = datetimeModel(props, [2024, 5, 21, 23, 59, 59]); expect(high.value).toBe(props.maxDate); expect(high.origin[4]!.values.at(-1)).toBe(4); expect(high.origin[5]!.values.at(-1)).toBe(5);
});
test('Datetime model supports modern and legacy filters, disabled columns and empty results', () => {
  const modern = datetimeModel({ type: 'time', value: '11:12', filter: ({ type, values }: {type: string; values: number[]}) => type === 'minute' ? [...values, 999].filter(v => v % 5 === 0) : values }); expect(modern.value).toBe('11:10'); expect(modern.origin[1]!.values).not.toContain(999);
  const legacy = datetimeModel({ type: 'time', value: '11:12', filter: (_type: string, values: number[]) => values.filter(value => value % 2 === 0) }); expect(legacy.value).toBe('10:12');
  expect(datetimeModel({ filter: () => [] }).value).toBe('');
  expect(datetimeModel({ type: 'time', value: '11:12', columnFormatter: columns => columns.map(items => items.map(item => ({ ...item, disabled: item.value === 11 }))) }).value).toBe('10:12');
});
test('Datetime range boundaries disable incompatible choices and clamp the selected value', () => {
  const min = at(2024, 2, 29, 10, 20, 30), max = at(2024, 3, 1, 12, 0, 0);
  const low = datetimeModel({ value: at(2024, 2, 1), boundaryMinDate: min, boundaryMaxDate: max, useSecond: true }); expect(low.value).toBe(min); expect(low.columns[2]!.find(item => item.value === 28)?.disabled).toBe(true);
  const high = datetimeModel({ value: at(2025, 1, 1), boundaryMaxDate: max }); expect(high.value).toBe(max);
});
test('Datetime time mode honors second bounds, and all date granularities normalize hidden fields', () => {
  expect(datetimeModel({ type: 'time', value: '09:20:26', useSecond: true, minSecond: 30 }).value).toBe('09:20:30');
  expect(datetimeModel({ type: 'date', value: at(2024, 5, 6, 7, 8, 9) }).value).toBe(at(2024, 5, 6));
  expect(datetimeModel({ type: 'year-month', value: at(2024, 5, 6) }).value).toBe(at(2024, 5, 1)); expect(datetimeModel({ type: 'year', value: at(2024, 5, 6) }).value).toBe(at(2024, 1, 1));
  expect(datetimeLabel(at(2024, 5, 6, 7, 8, 9), 'datetime', true)).toBe('2024-05-06 07:08:09');
});
test('Datetime model rejects invalid bounds', () => {
  expect(() => datetimeModel({ minDate: NaN })).toThrow(); expect(() => datetimeModel({ minDate: 2, maxDate: 1 })).toThrow(); expect(() => datetimeModel({ type: 'time', minHour: 12, maxHour: 10 })).toThrow();
});
