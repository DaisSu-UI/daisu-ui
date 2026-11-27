import { useLocale } from './useLocale.js';
import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { localeDate } from './locale.js';
import type { UiMessageKey } from './locale.js';
import { CalendarMonth } from './CalendarMonth.js';
import { DatetimePickerView } from './DatetimePickerView.js';
import type { DatetimePickerViewRef } from './DatetimePickerView.js';
import type { DatetimeColumnType, DatetimeFilter } from './datetimePickerModel.js';
import { FormFieldContext } from './formContext.js';
import { Toast } from './Toast.js';
import { useToast } from './useToast.js';
import { calendarAddDays, calendarBounds, calendarComplete, calendarMidnight, calendarMonth, calendarPanels, calendarPick, calendarRange, calendarScrollTarget, calendarTime, calendarValues } from './calendarModel.js';
import type { CalendarDayItem, CalendarModelProps, CalendarSwitchMode, CalendarValue } from './calendarModel.js';
export type CalendarViewProps = CalendarModelProps & {
  value?: CalendarValue; disabled?: boolean; panelHeight?: number; showPanelTitle?: boolean; switchMode?: CalendarSwitchMode; rangePrompt?: string;
  formatter?: (day: CalendarDayItem) => Partial<CalendarDayItem>; onChange?: (event: { value: CalendarValue }) => void; onOverRange?: () => void;
  timeFilter?: DatetimeFilter; timeItemHeight?: number; timeVisibleItemCount?: number; hideSecond?: boolean; immediateChange?: boolean;
  onPickStart?: () => void; onPickEnd?: () => void; className?: string; style?: CSSProperties;
};
export type CalendarViewRef = { scrollIntoView: () => void; getSelected: () => CalendarValue };
export const CalendarView = forwardRef<CalendarViewRef, CalendarViewProps>(function CalendarView({ value, type = 'date', minDate, maxDate, firstDayOfWeek = 0, maxRange, allowSameDay = false, defaultTime, disabled: disabledProp, panelHeight = 316, showPanelTitle = true, switchMode = 'none', formatter, rangePrompt, onChange, onOverRange, timeFilter, timeItemHeight = 44, timeVisibleItemCount = 3, hideSecond = false, immediateChange = false, onPickStart, onPickEnd, className = '', style }, ref) {
  const { locale, t: localeText } = useLocale();
  const unitLabel = useMemo(() => (type: DatetimeColumnType, value: number) => localeText(`calendar.${type}` as UiMessageKey, { value: String(value).padStart(2, '0') }), [localeText]);


  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const [inner, setInner] = useState<CalendarValue>(null), current = value === undefined ? inner : value, currentRef = useRef(current); currentRef.current = current;
  const first = ((Math.trunc(firstDayOfWeek) % 7) + 7) % 7, model = useMemo(() => ({ type, minDate, maxDate, firstDayOfWeek: first, maxRange, allowSameDay, defaultTime }), [type, minDate, maxDate, first, maxRange, allowSameDay, defaultTime]);
  const bounds = useMemo(() => calendarBounds(model), [minDate, maxDate]), monthly = calendarMonth(type), switching = switchMode !== 'none';
  const [display, setDisplay] = useState(() => Math.max(bounds.min, Math.min(bounds.max, calendarValues(current)[0] ?? Date.now()))), [timeIndex, setTimeIndex] = useState(type === 'datetimerange' && calendarComplete(current ?? null, type) ? 1 : 0);
  const scroll = useRef<NodesRef>(null), time = useRef<DatetimePickerViewRef>(null), toast = useToast();
  const panels = useMemo(() => calendarPanels({ type, minDate, maxDate, firstDayOfWeek: first }, switching, display), [type, minDate, maxDate, first, switching, display]);
  const total = panels.reduce((sum, panel) => sum + panel.height, 0);
  const [initialOffset] = useState(() => switching ? 0 : calendarScrollTarget(panels, current ?? null, model).offset);
  const [window, setWindow] = useState(() => ({ row: Math.floor(initialOffset / 64), active: Math.max(0, panels.findIndex(panel => panel.offset + panel.height > initialOffset)) }));
  const offset = window.row * 64;
  const updateWindow = (next: number) => {
    'background only';
    const row = Math.floor(Math.max(0, next) / 64), active = Math.max(0, panels.findIndex(panel => panel.offset + panel.height > next));
    setWindow(previous => previous.row === row && previous.active === active ? previous : { row, active });
  };
  const scrollLayout = useRef({ viewport: 0, content: 0 }), pendingOffset = useRef<number | null>(initialOffset);
  const scrollTo = (next: number) => {
    'background only';
    updateWindow(next); pendingOffset.current = next;
    if (scrollLayout.current.viewport <= 0 || scrollLayout.current.content <= 0 || Math.abs(scrollLayout.current.viewport - scrollHeight) >= 1 || Math.abs(scrollLayout.current.content - total) >= 1) return;
    scroll.current?.invoke({ method: 'scrollTo', params: { offset: next, smooth: false }, success: () => { if (pendingOffset.current === next) pendingOffset.current = null; } }).exec();
  };
  const layoutReady = (part: 'viewport' | 'content', width: number, height: number) => {
    'background only';
    // Descendant layout notifications must not invalidate the measured container.
    const expected = part === 'viewport' ? scrollHeight : total;
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0 || Math.abs(height - expected) >= 1) return;
    scrollLayout.current[part] = height;
    if (pendingOffset.current !== null) scrollTo(pendingOffset.current);
  };
  const reveal = () => {
    'background only'; const anchor = Math.max(bounds.min, Math.min(bounds.max, calendarValues(currentRef.current)[0] ?? Date.now()));
    if (switching) { setDisplay(anchor); scrollTo(0); }
    else { const target = calendarScrollTarget(panels, currentRef.current ?? null, model); scrollTo(target.offset); }
  };
  useEffect(reveal, [type, minDate, maxDate, first, switching]);
  useEffect(() => { setTimeIndex(type === 'datetimerange' && calendarComplete(currentRef.current ?? null, type) ? 1 : 0); }, [type]);
  const uncontrolled = value === undefined;
  const emit = useCallback((next: CalendarValue) => { 'background only'; if (disabled) return; if (uncontrolled) { currentRef.current = next; setInner(next); } onChange?.({ value: next }); }, [disabled, uncontrolled, onChange]);
  const choose = useCallback((date: number) => {
    'background only'; if (disabled) return; const result = calendarPick(model, currentRef.current ?? null, date); if (!result) return;
    if (result.overRange) { onOverRange?.(); toast.show(rangePrompt ?? localeText(monthly ? 'calendar.rangeMonths' : type === 'weekrange' ? 'calendar.rangeWeeks' : 'calendar.rangeDays', { max: maxRange ?? 0 })); }
    setTimeIndex(result.timeIndex ?? 0); emit(result.value);
  }, [disabled, model, emit, onOverRange, rangePrompt, maxRange, monthly, toast.show, localeText]);
  const times = calendarValues(current), activeTime = times[timeIndex] ?? times[0], showTime = calendarTime(type) && activeTime !== undefined;
  const timeString = (date: number) => { const d = new Date(date); return [d.getHours(), d.getMinutes(), ...(hideSecond ? [] : [d.getSeconds()])].map(value => String(value).padStart(2, '0')).join(':'); };
  const combineTime = (next: string): CalendarValue => {
    const date = new Date(activeTime!), [h = 0, m = 0, s = 0] = next.split(':').map(Number); date.setHours(h, m, s, 0);
    let stamp = Math.max(bounds.min, Math.min(bounds.max, date.getTime()));
    if (type === 'datetimerange') { if (timeIndex === 0 && times[1] !== undefined) stamp = Math.min(stamp, times[1]); if (timeIndex === 1 && times[0] !== undefined) stamp = Math.max(stamp, times[0]); const next = Array.isArray(currentRef.current) ? [...currentRef.current] : []; next[timeIndex] = stamp; return next; }
    return stamp;
  };
  useImperativeHandle(ref, () => ({ scrollIntoView: reveal, getSelected: () => { 'background only'; const selected = time.current?.getSelected().value; return showTime && typeof selected === 'string' && selected ? combineTime(selected) : currentRef.current ?? null; } }), [panels, model, current, showTime, timeIndex, activeTime, hideSecond, disabled, switching]);
  const sameDay = (stamp: number | undefined) => stamp !== undefined && calendarMidnight(stamp) === calendarMidnight(activeTime!);
  const timeMin = Math.max(sameDay(bounds.min) ? bounds.min : -Infinity, type === 'datetimerange' && timeIndex === 1 && sameDay(times[0]) ? times[0]! : -Infinity);
  const timeMax = Math.min(sameDay(bounds.max) ? bounds.max : Infinity, type === 'datetimerange' && timeIndex === 0 && sameDay(times[1]) ? times[1]! : Infinity);
  const height = Math.max(0, Number.isFinite(panelHeight) ? panelHeight : 316), scrollHeight = Math.max(0, height - (showTime ? 120 : 0)) + (monthly ? showPanelTitle ? 26 : 16 : 0);
  const activePanel = window.active, titleDate = switching ? panels[0]!.date : panels[activePanel]?.date ?? display;
  const visible = switching ? panels : panels.filter(panel => panel.offset + panel.height >= offset - 128 && panel.offset <= offset + scrollHeight + 192);
  const moveTarget = (amount: number, years = false) => { const d = new Date(display); d.setDate(1); if (monthly || years) d.setFullYear(d.getFullYear() + amount); else d.setMonth(d.getMonth() + amount); return d.getTime(); };
  const canMove = (amount: number, years = false) => { const d = new Date(moveTarget(amount, years)), min = new Date(bounds.min), max = new Date(bounds.max), key = monthly ? d.getFullYear() : d.getFullYear() * 12 + d.getMonth(), low = monthly ? min.getFullYear() : min.getFullYear() * 12 + min.getMonth(), high = monthly ? max.getFullYear() : max.getFullYear() * 12 + max.getMonth(); return key >= low && key <= high; };
  const control = (amount: number, years = false) => <view className={`ui-calendar-control ${canMove(amount, years) ? '' : 'ui-calendar-control-disabled'}`} bindtap={() => { 'background only'; if (!disabled && canMove(amount, years)) { setDisplay(moveTarget(amount, years)); scrollTo(0); } }} accessibility-element accessibility-traits="button" accessibility-label={localeText(years || monthly ? amount < 0 ? 'calendar.prevYear' : 'calendar.nextYear' : amount < 0 ? 'calendar.prevMonth' : 'calendar.nextMonth')}><Icon name={years ? amount < 0 ? 'double-left' : 'double-right' : amount < 0 ? 'left' : 'right'} size={20} /></view>;
  return <view className={`ui-calendar-view ${monthly ? 'ui-calendar-view-months' : ''} ${className}`} style={style}>
    {switching ? <view className="ui-calendar-controls"><view className="ui-calendar-control-side">{!monthly && switchMode === 'year-month' ? control(-1, true) : null}{control(-1)}</view><text>{localeDate(locale, titleDate, monthly ? 'year' : 'month')}</text><view className="ui-calendar-control-side">{control(1)}{!monthly && switchMode === 'year-month' ? control(1, true) : null}</view></view> : null}
    {!monthly ? <view className="ui-calendar-weekdays">{Array.from({ length: 7 }, (_, i) => <text key={i}>{localeText(`calendar.weekday${(i + first) % 7}` as UiMessageKey)}</text>)}</view> : null}
    {!switching && showPanelTitle ? <text className="ui-calendar-panel-title">{localeDate(locale, titleDate, monthly ? 'year' : 'month')}</text> : null}
    <view className="ui-calendar-scroll-viewport" style={{ height: `${scrollHeight}px` }} bindlayoutchange={event => { 'background only'; layoutReady('viewport', event.detail.width, event.detail.height); }}>
    <scroll-view ref={scroll} className="ui-calendar-scroll" scroll-orientation="vertical" scroll-bar-enable={false} initial-scroll-offset={initialOffset} enable-nested-scroll force-can-scroll style={{ zIndex: 0, height: `${scrollHeight}px` }}
      bindscroll={event => { 'background only'; if (!switching) updateWindow(event.detail.scrollTop); }}>
      <view className="ui-calendar-scroll-content" flatten={false} style={{ height: `${total}px` }}
        bindlayoutchange={event => { 'background only'; layoutReady('content', event.detail.width, event.detail.height); }}>
      {visible.map(panel => <CalendarMonth key={panel.date} panel={panel} type={type} first={first} model={model} bounds={bounds} current={current ?? null} disabled={disabled} formatter={formatter} onPick={choose}
        startRow={switching || panels.length === 1 ? 0 : Math.max(0, Math.floor((offset - 128 - panel.offset - (panel.title ? 40 : 0)) / 64))}
        endRow={switching || panels.length === 1 ? panel.rows - 1 : Math.min(panel.rows - 1, Math.floor((offset + scrollHeight + 192 - panel.offset - (panel.title ? 40 : 0)) / 64))} />)}
      </view>
    </scroll-view>
    </view>
    {showTime ? <view className="ui-calendar-time">{type === 'datetimerange' ? <view className="ui-calendar-time-label"><text>{timeIndex === 0 ? localeText('common.start') : localeText('common.end')}</text></view> : null}<view className="ui-calendar-time-picker"><DatetimePickerView key={`${timeIndex}:${calendarMidnight(activeTime!)}`} ref={time} type="time" value={timeString(activeTime!)} useSecond={!hideSecond} itemHeight={timeItemHeight} visibleItemCount={timeVisibleItemCount} filter={timeFilter} formatter={unitLabel} disabled={disabled} immediateChange={immediateChange} onPickStart={onPickStart} onPickEnd={onPickEnd} boundaryMinDate={Number.isFinite(timeMin) ? timeMin : undefined} boundaryMaxDate={Number.isFinite(timeMax) ? timeMax : undefined} onChange={({ value }) => { 'background only'; if (typeof value === 'string' && value) emit(combineTime(value)); }} /></view></view> : null}
    <Toast {...toast.props} />
  </view>;
});
