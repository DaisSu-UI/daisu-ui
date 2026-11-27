import { expect, test } from '@rstest/core';
import { calendarBounds, calendarComplete, calendarPanelDates, calendarPanels, calendarPick, calendarScrollTarget, calendarState, calendarWeekNumber } from './calendarModel.js';
const day = (n: number, month = 10, year = 2026) => new Date(year, month, n).getTime();
const bounds = { minDate: day(1), maxDate: day(30) };
test('native calendar rows preserve weekday alignment and every date, including leap February', () => {
  const sunday = calendarPanels(bounds, false, day(20))[0]!;
  const rows = calendarPanelDates(sunday);
  expect(rows[0]).toEqual(Array.from({ length: 7 }, (_, index) => day(index + 1)));
  expect(rows[4]).toEqual([day(29), day(30), null, null, null, null, null]);
  const monday = calendarPanels({ ...bounds, firstDayOfWeek: 1 }, false, day(20))[0]!;
  expect(calendarPanelDates(monday, 'date', 1)[0]).toEqual([null, null, null, null, null, null, day(1)]);
  const leap = calendarPanels({ minDate: day(1, 1, 2028), maxDate: day(29, 1, 2028) }, false, day(29, 1, 2028))[0]!;
  const dates = calendarPanelDates(leap).flat().filter(value => value !== null);
  expect(dates).toHaveLength(29);
  expect(new Set(dates).size).toBe(29);
  expect(dates[28]).toBe(day(29, 1, 2028));
});
test('native month selection renders twelve months as three four-cell rows', () => {
  const panel = calendarPanels({ ...bounds, type: 'month' }, false, day(20))[0]!;
  const rows = calendarPanelDates(panel, 'month');
  expect(rows).toHaveLength(3);
  expect(rows.every(row => row.length === 4)).toBe(true);
  expect(rows.flat().map(value => new Date(value!).getMonth())).toEqual(Array.from({ length: 12 }, (_, index) => index));
});
test('calendar ranges retain an incomplete endpoint and truncate inclusive maximum ranges', () => {
  const props = { ...bounds, type: 'daterange' as const, maxRange: 3 };
  expect(calendarPick(props, null, day(2))?.value).toEqual([day(2), null]);
  expect(calendarComplete([day(2), null], 'daterange')).toBe(false);
  expect(calendarPick(props, [day(2), null], day(2))).toBeUndefined();
  expect(calendarPick({ ...props, allowSameDay: true }, [day(2), null], day(2))?.value).toEqual([day(2), day(2)]);
  expect(calendarPick(props, [day(2), null], day(8))).toEqual({ value: [day(2), day(4)], overRange: true, timeIndex: 1 });
  expect(calendarPick(props, [day(5), null], day(2))?.value).toEqual([day(2), null]);
});
test('week and month selections align their periods and include entire weeks visually', () => {
  const props = { ...bounds, type: 'week' as const, firstDayOfWeek: 1 };
  expect(calendarPick(props, null, day(24))?.value).toBe(day(23));
  expect(calendarState(day(23), day(24), props)).toBe('start');
  expect(calendarState(day(25), day(24), props)).toBe('middle');
  expect(calendarState(day(29), day(24), props)).toBe('end');
  expect(calendarPick({ ...bounds, type: 'month' }, null, day(24))?.value).toBe(day(1));
  expect(calendarWeekNumber(day(1, 0, 2021))).toBe(53);
  expect(calendarWeekNumber(day(4, 0, 2021))).toBe(1);
});
test('multiple selection toggles days and represents consecutive runs', () => {
  const props = { ...bounds, type: 'dates' as const };
  expect(calendarPick(props, [day(1), day(2)], day(1))?.value).toEqual([day(2)]);
  expect(calendarState(day(2), [day(1), day(2), day(3)], props)).toBe('multiple-middle');
  expect(calendarState(day(3), [day(1), day(2), day(3)], props)).toBe('end');
});
test('datetime preserves configured times, clips boundary times and switches range editor', () => {
  const props = { minDate: day(1) + 9 * 3600000, maxDate: day(30) + 18 * 3600000, type: 'datetimerange' as const, defaultTime: ['08:30:00', '17:45:00'] };
  expect(calendarPick(props, null, day(1))?.value).toEqual([props.minDate, null]);
  const value = [day(2) + 8.5 * 3600000, day(3) + 17.75 * 3600000];
  expect(calendarPick(props, [value[0]!, null], day(3))?.value).toEqual(value);
  expect(calendarPick(props, value, day(2))).toEqual({ value, timeIndex: 0 });
  expect(calendarPick(props, value, day(3))).toEqual({ value, timeIndex: 1 });
  expect(() => calendarPick({ ...props, defaultTime: '25:00' }, null, day(2))).toThrow();
});
test('calendar panels keep exact offsets and selected-week scroll target with bounded mounting', () => {
  const panels = calendarPanels({ minDate: day(1), maxDate: day(31, 11) }, false, day(24));
  expect(panels[1]?.offset).toBe(panels[0]?.height);
  expect(calendarScrollTarget(panels, day(24), bounds)).toEqual({ index: 0, offset: 192 });
  expect(calendarPanels(bounds, true, day(24))).toHaveLength(1);
  expect(() => calendarPanels({ minDate: day(1, 0, 2000), maxDate: day(1, 0, 2040) }, false, day(24))).toThrow();
  expect(() => calendarBounds({ minDate: day(30), maxDate: day(1) })).toThrow();
});
