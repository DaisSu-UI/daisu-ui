import { useLocale } from './useLocale.js';
import { localeDate } from './locale.js';
import { memo, useMemo } from '@lynx-js/react';
import { calendarMonth, calendarPanelDates, calendarRange, calendarState, calendarValues } from './calendarModel.js';
import type { CalendarDayItem, CalendarModelProps, CalendarPanel, CalendarType, CalendarValue } from './calendarModel.js';

type Props = {
  panel: CalendarPanel; type: CalendarType; first: number; model: CalendarModelProps;
  bounds: { minDay: number; maxDay: number }; current: CalendarValue; disabled: boolean;
  formatter?: (day: CalendarDayItem) => Partial<CalendarDayItem>; onPick: (date: number) => void;
  startRow: number; endRow: number;
};

/** Stable native month geometry; scrolling only changes the nearby date rows. */
export const CalendarMonth = memo(function CalendarMonth({ panel, type, first, model, bounds, current, disabled, formatter, onPick, startRow, endRow }: Props) {
  const { locale, t: localeText } = useLocale();
  const rows = useMemo(() => calendarPanelDates(panel, type, first), [panel, type, first]);
  const monthly = calendarMonth(type), date = new Date(panel.date);
  const incomplete = calendarRange(type) && calendarValues(current).length < 2 && !type.startsWith('week');
  const trailingRows = Math.max(0, rows.length - endRow - 1);
  return <view className="ui-calendar-month" flatten={false} style={{ top: `${panel.offset}px`, height: `${panel.height}px` }}>
    {panel.title ? <text className="ui-calendar-panel-title">{localeDate(locale, panel.date, monthly ? 'year' : 'month')}</text> : null}
    <view className="ui-calendar-days">
      {startRow > 0 ? <view style={{ height: `${startRow * 64}px`, flexShrink: 0 }} /> : null}
      {rows.slice(startRow, endRow + 1).map((row, index) => {
        const rowIndex = startRow + index;
        return <view className="ui-calendar-row" key={rowIndex} style={{ marginBottom: rowIndex === rows.length - 1 ? '0px' : '4px' }}>{row.map((stamp, column) => {
          if (stamp === null) return <view key={`empty-${column}`} className="ui-calendar-cell ui-calendar-empty" />;
          const d = new Date(stamp), year = d.getFullYear(), month = d.getMonth(), day = d.getDate();
          const base: CalendarDayItem = { date: stamp, text: monthly ? localeText('calendar.monthLabel', { month: month + 1, monthName: localeText(`calendar.monthName${month + 1}` as import('./locale.js').UiMessageKey) }) : String(day), type: calendarState(stamp, current, model), disabled: monthly ? new Date(year, month + 1, 0).getTime() < bounds.minDay || stamp > bounds.maxDay : stamp < bounds.minDay || stamp > bounds.maxDay };
          const item = { ...base, ...formatter?.({ ...base }) }, inactive = disabled || base.disabled || item.disabled, state = item.type;
          return <view key={stamp} className={`ui-calendar-cell ui-calendar-day ${monthly ? 'ui-calendar-day-month' : ''} ui-calendar-day-${state} ${inactive ? 'ui-calendar-day-disabled' : ''} ${incomplete ? 'ui-calendar-day-without-end' : ''} ${type === 'dates' ? 'ui-calendar-day-multiple' : ''} ${item.customClass ?? ''}`}
            bindtap={() => { 'background only'; if (!inactive) onPick(stamp); }} accessibility-element accessibility-traits="button" accessibility-label={`${localeDate(locale, stamp, monthly ? 'month' : 'day')}${inactive ? localeText('common.disabled') : ''}`}>
            {(state === 'start' || state === 'end') && !incomplete ? <view className={`ui-calendar-range-half ui-calendar-range-half-${state}`} /> : null}
            <view className="ui-calendar-day-inner">{item.topInfo ? <text className="ui-calendar-day-top">{item.topInfo}</text> : null}<text className="ui-calendar-day-label">{item.text}</text>{item.bottomInfo ? <text className="ui-calendar-day-bottom">{item.bottomInfo}</text> : null}</view>
          </view>;
        })}</view>;
      })}
      {trailingRows > 0 ? <view style={{ height: `${trailingRows * 64 - 4}px`, flexShrink: 0 }} /> : null}
    </view>
  </view>;
});
