export type CalendarType = 'date' | 'dates' | 'daterange' | 'datetime' | 'datetimerange' | 'week' | 'weekrange' | 'month' | 'monthrange';
export type CalendarValue = number | readonly (number | null)[] | null;
export type CalendarDayType = '' | 'selected' | 'start' | 'end' | 'middle' | 'same' | 'current' | 'multiple-middle' | 'multiple-selected';
export type CalendarDayItem = { date: number; text: string; disabled: boolean; type: CalendarDayType; topInfo?: string; bottomInfo?: string; customClass?: string };
export type CalendarSwitchMode = 'none' | 'month' | 'year-month';
export type CalendarModelProps = { type?: CalendarType; minDate?: number; maxDate?: number; firstDayOfWeek?: number; defaultTime?: string | readonly string[]; maxRange?: number; allowSameDay?: boolean };
const now = new Date();
export const calendarDefaults = { minDate: new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).getTime(), maxDate: new Date(now.getFullYear(), now.getMonth() + 6, now.getDate(), 23, 59, 59).getTime() };
export const calendarRange = (type: CalendarType = 'date') => type.endsWith('range');
export const calendarTime = (type: CalendarType = 'date') => type === 'datetime' || type === 'datetimerange';
export const calendarMonth = (type: CalendarType = 'date') => type === 'month' || type === 'monthrange';
export function calendarMidnight(value: number) { const d = new Date(value); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
export function calendarAddDays(value: number, amount: number) { const d = new Date(value); d.setDate(d.getDate() + amount); return d.getTime(); }
export function calendarDayDistance(a: number, b: number) { const first = new Date(a), last = new Date(b); return Math.round((Date.UTC(last.getFullYear(), last.getMonth(), last.getDate()) - Date.UTC(first.getFullYear(), first.getMonth(), first.getDate())) / 86400000); }
export function calendarBounds(props: CalendarModelProps) {
  const min = props.minDate ?? calendarDefaults.minDate, max = props.maxDate ?? calendarDefaults.maxDate;
  if (!Number.isFinite(new Date(min).getTime()) || !Number.isFinite(new Date(max).getTime()) || min > max) throw new Error('Invalid Calendar bounds');
  return { min, max, minDay: calendarMidnight(min), maxDay: calendarMidnight(max) };
}
export function calendarValues(value: CalendarValue | undefined): number[] { return (Array.isArray(value) ? value : [value]).filter((item): item is number => typeof item === 'number' && Number.isFinite(new Date(item).getTime())); }
export function calendarWeekStart(value: number, first = 0) { const date = new Date(calendarMidnight(value)), day = ((Math.trunc(first) % 7) + 7) % 7; date.setDate(date.getDate() - (date.getDay() - day + 7) % 7); return date.getTime(); }
export function calendarPeriod(value: number, type: CalendarType = 'date', first = 0) {
  const date = new Date(value);
  return calendarMonth(type) ? new Date(date.getFullYear(), date.getMonth(), 1).getTime() : type.startsWith('week') ? calendarWeekStart(value, first) : calendarMidnight(value);
}
export function calendarWeekNumber(value: number) { const d = new Date(calendarMidnight(value)); d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7); const first = new Date(d.getFullYear(), 0, 4); return 1 + Math.round((calendarDayDistance(first.getTime(), d.getTime()) - 3 + (first.getDay() + 6) % 7) / 7); }
function periodEnd(value: number, type: CalendarType) { const date = new Date(value); return calendarMonth(type) ? new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime() : type.startsWith('week') ? calendarAddDays(value, 6) : value; }
export function calendarNormalize(value: CalendarValue | undefined, props: CalendarModelProps): CalendarValue {
  const bounds = calendarBounds(props), type = props.type ?? 'date';
  const values = calendarValues(value).map(value => Math.max(bounds.min, Math.min(bounds.max, calendarTime(type) ? value : calendarMidnight(value))));
  if (type === 'dates') return [...new Set(values)].sort((a, b) => a - b);
  if (calendarRange(type)) return values.length ? values.length === 1 ? [values[0]!, null] : [Math.min(values[0]!, values[1]!), Math.max(values[0]!, values[1]!)] : [];
  return values[0] ?? null;
}
export function calendarComplete(value: CalendarValue, type: CalendarType = 'date') { const values = calendarValues(value); return type === 'dates' ? values.length > 0 : calendarRange(type) ? values.length === 2 : values.length === 1; }
function withTime(date: number, props: CalendarModelProps, end = false) {
  const text = Array.isArray(props.defaultTime) ? props.defaultTime[end ? 1 : 0] ?? '00:00:00' : props.defaultTime ?? '00:00:00';
  if (!/^\d{1,2}:\d{2}(:\d{2})?$/.test(text)) throw new Error('Invalid Calendar defaultTime');
  const [h = 0, m = 0, s = 0] = text.split(':').map(Number); if (h > 23 || m > 59 || s > 59) throw new Error('Invalid Calendar defaultTime');
  const result = new Date(date); result.setHours(h, m, s, 0); const bounds = calendarBounds(props); return Math.max(bounds.min, Math.min(bounds.max, result.getTime()));
}
export function calendarPick(props: CalendarModelProps, value: CalendarValue, date: number): { value: CalendarValue; overRange?: boolean; timeIndex?: number } | undefined {
  const type = props.type ?? 'date', bounds = calendarBounds(props), period = calendarPeriod(date, type, props.firstDayOfWeek);
  if (periodEnd(period, type) < bounds.minDay || period > bounds.maxDay) return;
  const values = calendarValues(value), picked = withTime(period, props);
  if (type === 'dates') { const existing = values.some(item => calendarMidnight(item) === calendarMidnight(picked)); return { value: existing ? values.filter(item => calendarMidnight(item) !== calendarMidnight(picked)) : [...values, picked].sort((a, b) => a - b) }; }
  if (!calendarRange(type)) return { value: picked, timeIndex: 0 };
  const first = values[0], second = values[1], start = first === undefined ? undefined : calendarPeriod(first, type, props.firstDayOfWeek);
  if (type === 'datetimerange' && first !== undefined && second !== undefined) { if (calendarMidnight(date) === calendarMidnight(first)) return { value, timeIndex: 0 }; if (calendarMidnight(date) === calendarMidnight(second)) return { value, timeIndex: 1 }; }
  if (start !== undefined && second === undefined && period >= start) {
    if (period === start && !props.allowSameDay) return;
    let last = period, count = type === 'monthrange' ? (new Date(last).getFullYear() - new Date(start).getFullYear()) * 12 + new Date(last).getMonth() - new Date(start).getMonth() + 1 : type === 'weekrange' ? Math.round(calendarDayDistance(start, last) / 7) + 1 : calendarDayDistance(start, last) + 1;
    const limit = props.maxRange && Number.isFinite(props.maxRange) ? Math.max(1, Math.trunc(props.maxRange)) : 0, overRange = !!limit && count > limit;
    if (overRange) { if (type === 'monthrange') { const d = new Date(start); d.setMonth(d.getMonth() + limit - 1); last = d.getTime(); } else last = calendarAddDays(start, (limit - 1) * (type === 'weekrange' ? 7 : 1)); }
    return { value: [first!, Math.max(first!, withTime(last, props, true))], overRange, timeIndex: 1 };
  }
  return { value: [picked, null], timeIndex: 0 };
}
export function calendarState(date: number, value: CalendarValue, props: CalendarModelProps): CalendarDayType {
  const type = props.type ?? 'date', values = calendarValues(value), key = calendarPeriod(date, type, props.firstDayOfWeek);
  if (type === 'dates') {
    const selected = new Set(values.map(calendarMidnight)); if (selected.has(date)) { const before = selected.has(calendarAddDays(date, -1)), after = selected.has(calendarAddDays(date, 1)); return before && after ? 'multiple-middle' : before ? 'end' : after ? 'start' : 'multiple-selected'; }
  } else if (type.startsWith('week')) {
    if (values.length) { const first = calendarWeekStart(values[0]!, props.firstDayOfWeek), last = calendarAddDays(calendarWeekStart(values[1] ?? values[0]!, props.firstDayOfWeek), 6); if (date === first) return 'start'; if (date === last) return 'end'; if (date > first && date < last) return 'middle'; }
  } else if (calendarRange(type)) {
    const [first, last] = values.map(value => calendarPeriod(value, type, props.firstDayOfWeek));
    if (key === first && last === first) return 'same'; if (key === first) return 'start'; if (key === last) return 'end'; if (first !== undefined && last !== undefined && key > first && key < last) return 'middle';
  } else if (values[0] !== undefined && calendarPeriod(values[0], type, props.firstDayOfWeek) === key) return 'selected';
  return key === calendarPeriod(Date.now(), type, props.firstDayOfWeek) ? 'current' : '';
}
export type CalendarPanel = { date: number; offset: number; height: number; rows: number; title: boolean };
/** Explicit rows avoid native wrap sizing and percentage rounding in scroll content. */
export function calendarPanelDates(panel: CalendarPanel, type: CalendarType = 'date', firstDayOfWeek = 0): (number | null)[][] {
  const date = new Date(panel.date), year = date.getFullYear(), month = date.getMonth(), monthly = calendarMonth(type);
  const columns = monthly ? 4 : 7, count = monthly ? 12 : new Date(year, month + 1, 0).getDate();
  const empty = monthly ? 0 : (date.getDay() - firstDayOfWeek + 7) % 7;
  return Array.from({ length: panel.rows }, (_, row) => Array.from({ length: columns }, (_, column) => {
    const index = row * columns + column - empty;
    return index < 0 || index >= count ? null : new Date(year, monthly ? index : month, monthly ? 1 : index + 1).getTime();
  }));
}
export function calendarPanels(props: CalendarModelProps, switching: boolean, display: number): CalendarPanel[] {
  const { min, max } = calendarBounds(props), monthly = calendarMonth(props.type), first = new Date(min), last = new Date(max), count = monthly ? last.getFullYear() - first.getFullYear() + 1 : (last.getFullYear() - first.getFullYear()) * 12 + last.getMonth() - first.getMonth() + 1;
  if (!switching && count > 240) throw new Error('Calendar flat mode is limited to 240 panels; use switchMode="month" or "year-month"');
  let offset = 0;
  return Array.from({ length: switching ? 1 : count }, (_, index) => {
    const d = switching ? new Date(display) : new Date(first.getFullYear(), monthly ? 0 : first.getMonth() + index, 1); if (monthly && !switching) d.setFullYear(first.getFullYear() + index);
    const date = new Date(d.getFullYear(), monthly ? 0 : d.getMonth(), 1).getTime(), start = (new Date(date).getDay() - (props.firstDayOfWeek ?? 0) % 7 + 7) % 7, days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const rows = monthly ? 3 : Math.ceil((start + days) / 7), title = !switching && index > 0, height = rows * 60 + (rows - 1) * 4 + (title ? 40 : 0), panel = { date, offset, height, rows, title }; offset += height; return panel;
  });
}
export function calendarScrollTarget(panels: CalendarPanel[], value: CalendarValue, props: CalendarModelProps) {
  const { min, max } = calendarBounds(props), selected = calendarValues(value)[0] ?? Date.now(), target = Math.max(min, Math.min(max, selected)), monthly = calendarMonth(props.type), date = new Date(target);
  let index = panels.findIndex(panel => new Date(panel.date).getFullYear() === date.getFullYear() && (monthly || new Date(panel.date).getMonth() === date.getMonth())); if (index < 0) index = 0;
  const panel = panels[index]; if (!panel) return { index: 0, offset: 0 };
  const day = ((props.firstDayOfWeek ?? 0) % 7 + 7) % 7, row = monthly ? 0 : Math.floor(((new Date(date.getFullYear(), date.getMonth(), 1).getDay() - day + 7) % 7 + date.getDate() - 1) / 7);
  return { index, offset: panel.offset + (panel.title ? 40 : 0) + row * 64 };
}
