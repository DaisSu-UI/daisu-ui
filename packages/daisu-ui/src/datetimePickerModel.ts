import type { PickerOption, PickerValue } from './pickerModel.js';
export type DatetimePickerType = 'datetime' | 'date' | 'year-month' | 'time' | 'year';
export type DatetimePickerValue = number | string;
export type DatetimeColumnType = 'year' | 'month' | 'date' | 'hour' | 'minute' | 'second';
export type DatetimeColumn = { type: DatetimeColumnType; values: number[] };
export type DatetimeFilterParams = { type: DatetimeColumnType; values: number[] };
export type DatetimeFilter = ((params: DatetimeFilterParams) => number[]) | ((type: string, values: number[]) => number[]);
export type DatetimeModelProps = {
  value?: DatetimePickerValue; type?: DatetimePickerType; minDate?: number; maxDate?: number; minHour?: number; maxHour?: number; minMinute?: number; maxMinute?: number;
  useSecond?: boolean; minSecond?: number; maxSecond?: number; boundaryMinDate?: number; boundaryMaxDate?: number;
  formatter?: (type: DatetimeColumnType, value: number) => string; filter?: DatetimeFilter;
  columnFormatter?: (columns: PickerOption[][]) => PickerOption[][];
};
const year = new Date().getFullYear();
export const datetimeDefaults = { minDate: new Date(year - 10, 0, 1).getTime(), maxDate: new Date(year + 10, 11, 31, 23, 59, 59).getTime() };
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
export const datetimePad = (value: number, width = 2) => String(value).padStart(width, '0');
export function datetimeParts(type: DatetimePickerType = 'datetime', useSecond = false): DatetimeColumnType[] {
  return type === 'year' ? ['year'] : type === 'year-month' ? ['year', 'month'] : type === 'date' ? ['year', 'month', 'date'] : [...(type === 'time' ? [] : ['year', 'month', 'date'] as DatetimeColumnType[]), 'hour', 'minute', ...(useSecond ? ['second'] as DatetimeColumnType[] : [])];
}
function dateParts(value: number): Record<DatetimeColumnType, number> {
  const date = new Date(value); return { year: date.getFullYear(), month: date.getMonth() + 1, date: date.getDate(), hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() };
}
function timestamp(parts: Record<DatetimeColumnType, number>) {
  const date = new Date(0); date.setFullYear(parts.year, parts.month - 1, Math.min(parts.date, new Date(parts.year, parts.month, 0).getDate())); date.setHours(parts.hour, parts.minute, parts.second, 0); return date.getTime();
}
const matchesPrefix = (parts: Record<DatetimeColumnType, number>, boundary: Record<DatetimeColumnType, number>, keys: DatetimeColumnType[], index: number) => keys.slice(0, index).every(key => parts[key] === boundary[key]);
export function datetimeModel(props: DatetimeModelProps, selection?: readonly PickerValue[]) {
  const type = props.type ?? 'datetime', parts = datetimeParts(type, props.useSecond), minDate = props.minDate ?? datetimeDefaults.minDate, maxDate = props.maxDate ?? datetimeDefaults.maxDate;
  if (!Number.isFinite(minDate) || !Number.isFinite(maxDate) || !Number.isFinite(new Date(minDate).getTime()) || !Number.isFinite(new Date(maxDate).getTime()) || minDate > maxDate) throw new Error('Invalid DatetimePicker bounds');
  const min = dateParts(minDate), max = dateParts(maxDate), validDate = typeof props.value === 'number' && Number.isFinite(props.value), requested = dateParts(validDate ? clamp(props.value as number, minDate, maxDate) : minDate);
  if (type === 'time') {
    const parsed = typeof props.value === 'string' && /^\d{1,2}:\d{2}(:\d{2})?$/.test(props.value) ? props.value.split(':').map(Number) : [];
    requested.hour = parsed[0] ?? props.minHour ?? 0; requested.minute = parsed[1] ?? props.minMinute ?? 0; requested.second = parsed[2] ?? props.minSecond ?? 0;
  }
  parts.forEach((key, index) => { if (selection?.[index] !== undefined && Number.isFinite(Number(selection[index]))) requested[key] = Number(selection[index]); });
  if (type !== 'time') {
    const lower = Math.max(minDate, props.boundaryMinDate ?? minDate), upper = Math.min(maxDate, props.boundaryMaxDate ?? maxDate);
    if (!Number.isFinite(lower) || !Number.isFinite(upper) || lower > upper) throw new Error('Invalid DatetimePicker boundary');
    Object.assign(requested, dateParts(clamp(timestamp(requested), lower, upper)));
  }
  const chosen = { ...requested }, rangeLow = props.boundaryMinDate === undefined ? undefined : dateParts(props.boundaryMinDate), rangeHigh = props.boundaryMaxDate === undefined ? undefined : dateParts(props.boundaryMaxDate);
  if (rangeLow && !Number.isFinite(rangeLow.year) || rangeHigh && !Number.isFinite(rangeHigh.year)) throw new Error('Invalid DatetimePicker boundary');
  let columns: PickerOption[][] = [], origin: DatetimeColumn[] = [], valid = true;
  // Rebuild dependent columns when a formatter disables a parent option.
  for (let pass = 0; pass <= parts.length; pass++) {
    columns = []; origin = []; valid = true;
    for (const [index, key] of parts.entries()) {
      let low = 0, high = 59;
      if (key === 'year') { low = min.year; high = max.year; }
      else if (key === 'month') { low = matchesPrefix(chosen, min, parts, index) ? min.month : 1; high = matchesPrefix(chosen, max, parts, index) ? max.month : 12; }
      else if (key === 'date') { low = matchesPrefix(chosen, min, parts, index) ? min.date : 1; high = Math.min(new Date(chosen.year, chosen.month, 0).getDate(), matchesPrefix(chosen, max, parts, index) ? max.date : 31); }
      else if (type === 'time') {
        low = clamp(Math.trunc((key === 'hour' ? props.minHour : key === 'minute' ? props.minMinute : props.minSecond) ?? 0), 0, key === 'hour' ? 23 : 59);
        high = clamp(Math.trunc((key === 'hour' ? props.maxHour : key === 'minute' ? props.maxMinute : props.maxSecond) ?? (key === 'hour' ? 23 : 59)), 0, key === 'hour' ? 23 : 59);
      } else {
        low = matchesPrefix(chosen, min, parts, index) ? min[key] : 0; high = matchesPrefix(chosen, max, parts, index) ? max[key] : key === 'hour' ? 23 : 59;
        if (key === 'second') { low = Math.max(low, props.minSecond ?? 0); high = Math.min(high, props.maxSecond ?? 59); }
      }
      if (!Number.isFinite(low) || !Number.isFinite(high) || low > high) throw new Error('Invalid DatetimePicker column bounds');
      let values = Array.from({ length: high - low + 1 }, (_, index) => low + index);
      if (props.filter) { const filter = props.filter; values = filter.length >= 2 ? (filter as (type: string, values: number[]) => number[])(key, [...values]) : (filter as (params: DatetimeFilterParams) => number[])({ type: key, values: [...values] }); }
      values = [...new Set(values.filter(value => Number.isInteger(value) && value >= low && value <= high))];
      const items = values.map(value => ({ value, label: props.formatter?.(key, value) ?? datetimePad(value, key === 'year' ? 4 : 2), disabled: !!(rangeLow && matchesPrefix(chosen, rangeLow, parts, index) && value < rangeLow[key] || rangeHigh && matchesPrefix(chosen, rangeHigh, parts, index) && value > rangeHigh[key]) }));
      const enabled = items.filter(item => !item.disabled), nearest = enabled.reduce<PickerOption | undefined>((best, item) => !best || Math.abs(Number(item.value) - requested[key]) < Math.abs(Number(best.value) - requested[key]) ? item : best, undefined);
      if (nearest) chosen[key] = Number(nearest.value); else valid = false;
      origin.push({ type: key, values }); columns.push(items);
    }
    if (!props.columnFormatter) break;
    const formatted = props.columnFormatter(columns.map(items => items.map(item => ({ ...item }))));
    columns = columns.map((items, index) => (formatted[index] ?? []).flatMap(item => { const original = items.find(option => option.value === item.value); return original ? [{ ...original, ...item, disabled: original.disabled || item.disabled }] : []; }));
    let changed = false;
    columns.forEach((items, index) => {
      const key = parts[index]!, enabled = items.filter(item => !item.disabled), nearest = enabled.reduce<PickerOption | undefined>((best, item) => !best || Math.abs(Number(item.value) - chosen[key]) < Math.abs(Number(best.value) - chosen[key]) ? item : best, undefined);
      if (!nearest) { valid = false; return; } if (chosen[key] !== Number(nearest.value)) { chosen[key] = Number(nearest.value); requested[key] = chosen[key]; changed = true; }
    });
    if (!changed) break;
  }
  const selectedOptions = columns.flatMap((items, index) => { const item = items.find(item => item.value === chosen[parts[index]!] && !item.disabled); return item ? [item] : []; });
  valid = valid && selectedOptions.length === parts.length;
  let value: DatetimePickerValue = '';
  if (valid && type === 'time') value = ['hour', 'minute', ...(props.useSecond ? ['second'] : [])].map(key => datetimePad(chosen[key as DatetimeColumnType])).join(':');
  else if (valid) {
    const normalized = { ...chosen, month: type === 'year' ? 1 : chosen.month, date: type === 'year' || type === 'year-month' ? 1 : chosen.date, hour: type === 'datetime' ? chosen.hour : 0, minute: type === 'datetime' ? chosen.minute : 0, second: type === 'datetime' && props.useSecond ? chosen.second : 0 };
    value = clamp(timestamp(normalized), Math.max(minDate, props.boundaryMinDate ?? minDate), Math.min(maxDate, props.boundaryMaxDate ?? maxDate));
  }
  return { value, columns, origin, parts, values: parts.map(key => chosen[key]), selectedOptions, valid };
}
export function datetimeLabel(value: DatetimePickerValue, type: DatetimePickerType = 'datetime', useSecond = false) {
  if (value === '') return ''; if (type === 'time') return String(value);
  const parts = dateParts(Number(value)), date = `${datetimePad(parts.year, 4)}-${datetimePad(parts.month)}-${datetimePad(parts.date)}`;
  return type === 'year' ? datetimePad(parts.year, 4) : type === 'year-month' ? date.slice(0, 7) : type === 'date' ? date : `${date} ${datetimePad(parts.hour)}:${datetimePad(parts.minute)}${useSecond ? `:${datetimePad(parts.second)}` : ''}`;
}
