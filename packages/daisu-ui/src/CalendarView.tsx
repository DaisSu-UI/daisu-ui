import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { DatetimePickerView } from './DatetimePickerView.js';
import type { DatetimePickerViewRef } from './DatetimePickerView.js';
import type { DatetimeColumnType, DatetimeFilter } from './datetimePickerModel.js';
import { FormFieldContext } from './formContext.js';
import { Toast } from './Toast.js';
import { useToast } from './useToast.js';
import { calendarAddDays, calendarBounds, calendarComplete, calendarMidnight, calendarMonth, calendarPanels, calendarPick, calendarRange, calendarScrollTarget, calendarState, calendarTime, calendarValues } from './calendarModel.js';
import type { CalendarDayItem, CalendarModelProps, CalendarSwitchMode, CalendarValue } from './calendarModel.js';
export type CalendarViewProps = CalendarModelProps & {
  value?: CalendarValue; disabled?: boolean; panelHeight?: number; showPanelTitle?: boolean; switchMode?: CalendarSwitchMode; rangePrompt?: string;
  formatter?: (day: CalendarDayItem) => Partial<CalendarDayItem>; onChange?: (event: { value: CalendarValue }) => void; onOverRange?: () => void;
  timeFilter?: DatetimeFilter; timeItemHeight?: number; timeVisibleItemCount?: number; hideSecond?: boolean; immediateChange?: boolean;
  onPickStart?: () => void; onPickEnd?: () => void; className?: string; style?: CSSProperties;
};
export type CalendarViewRef = { scrollIntoView: () => void; getSelected: () => CalendarValue };
const unitLabel = (type: DatetimeColumnType, value: number) => `${String(value).padStart(2, '0')}${type === 'hour' ? '时' : type === 'minute' ? '分' : '秒'}`;
const panelLabel = (date: number, monthly: boolean) => { const d = new Date(date); return `${d.getFullYear()}年${monthly ? '' : `${d.getMonth() + 1}月`}`; };
export const CalendarView = forwardRef<CalendarViewRef, CalendarViewProps>(function CalendarView({ value, type = 'date', minDate, maxDate, firstDayOfWeek = 0, maxRange, allowSameDay = false, defaultTime, disabled: disabledProp, panelHeight = 316, showPanelTitle = true, switchMode = 'none', formatter, rangePrompt, onChange, onOverRange, timeFilter, timeItemHeight = 44, timeVisibleItemCount = 3, hideSecond = false, immediateChange = false, onPickStart, onPickEnd, className = '', style }, ref) {
  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const [inner, setInner] = useState<CalendarValue>(null), current = value === undefined ? inner : value, currentRef = useRef(current); currentRef.current = current;
  const first = ((Math.trunc(firstDayOfWeek) % 7) + 7) % 7, model = useMemo(() => ({ type, minDate, maxDate, firstDayOfWeek: first, maxRange, allowSameDay, defaultTime }), [type, minDate, maxDate, first, maxRange, allowSameDay, defaultTime]);
  const bounds = useMemo(() => calendarBounds(model), [minDate, maxDate]), monthly = calendarMonth(type), switching = switchMode !== 'none';
  const [display, setDisplay] = useState(() => Math.max(bounds.min, Math.min(bounds.max, calendarValues(current)[0] ?? Date.now()))), [offset, setOffset] = useState(0), [timeIndex, setTimeIndex] = useState(type === 'datetimerange' && calendarComplete(current ?? null, type) ? 1 : 0);
  const scroll = useRef<NodesRef>(null), time = useRef<DatetimePickerViewRef>(null), toast = useToast();
  const panels = useMemo(() => calendarPanels({ type, minDate, maxDate, firstDayOfWeek: first }, switching, display), [type, minDate, maxDate, first, switching, display]);
  const reveal = () => {
    'background only'; const anchor = Math.max(bounds.min, Math.min(bounds.max, calendarValues(currentRef.current)[0] ?? Date.now()));
    if (switching) { setDisplay(anchor); setOffset(0); scroll.current?.invoke({ method: 'scrollTo', params: { offset: 0, smooth: false } }).exec(); }
    else { const target = calendarScrollTarget(panels, currentRef.current ?? null, model); setOffset(target.offset); scroll.current?.invoke({ method: 'scrollTo', params: { offset: target.offset, smooth: false } }).exec(); }
  };
  useEffect(reveal, [type, minDate, maxDate, first, switching]);
  useEffect(() => { setTimeIndex(type === 'datetimerange' && calendarComplete(currentRef.current ?? null, type) ? 1 : 0); }, [type]);
  const emit = (next: CalendarValue) => { 'background only'; if (disabled) return; if (value === undefined) { currentRef.current = next; setInner(next); } onChange?.({ value: next }); };
  const choose = (date: number) => {
    'background only'; if (disabled) return; const result = calendarPick(model, currentRef.current ?? null, date); if (!result) return;
    if (result.overRange) { onOverRange?.(); toast.show(rangePrompt ?? `选择范围不能超过${maxRange}${monthly ? '个月' : type === 'weekrange' ? '周' : '天'}`); }
    setTimeIndex(result.timeIndex ?? 0); emit(result.value);
  };
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
  const activePanel = Math.max(0, panels.findIndex(panel => panel.offset + panel.height > offset)), titleDate = switching ? panels[0]!.date : panels[activePanel]?.date ?? display;
  const visible = switching ? panels : panels.filter(panel => panel.offset + panel.height >= offset - 320 && panel.offset <= offset + scrollHeight + 320), total = panels.reduce((sum, panel) => sum + panel.height, 0), firstOffset = visible[0]?.offset ?? 0, lastOffset = visible.length ? visible[visible.length - 1]!.offset + visible[visible.length - 1]!.height : 0;
  const moveTarget = (amount: number, years = false) => { const d = new Date(display); d.setDate(1); if (monthly || years) d.setFullYear(d.getFullYear() + amount); else d.setMonth(d.getMonth() + amount); return d.getTime(); };
  const canMove = (amount: number, years = false) => { const d = new Date(moveTarget(amount, years)), min = new Date(bounds.min), max = new Date(bounds.max), key = monthly ? d.getFullYear() : d.getFullYear() * 12 + d.getMonth(), low = monthly ? min.getFullYear() : min.getFullYear() * 12 + min.getMonth(), high = monthly ? max.getFullYear() : max.getFullYear() * 12 + max.getMonth(); return key >= low && key <= high; };
  const control = (amount: number, years = false) => <view className={`ui-calendar-control ${canMove(amount, years) ? '' : 'ui-calendar-control-disabled'}`} bindtap={() => { 'background only'; if (!disabled && canMove(amount, years)) { setDisplay(moveTarget(amount, years)); setOffset(0); scroll.current?.invoke({ method: 'scrollTo', params: { offset: 0, smooth: false } }).exec(); } }} accessibility-element accessibility-traits="button" accessibility-label={`${amount < 0 ? '上一' : '下一'}${years || monthly ? '年' : '月'}`}><Icon name={years ? amount < 0 ? 'double-left' : 'double-right' : amount < 0 ? 'left' : 'right'} size={20} /></view>;
  return <view className={`ui-calendar-view ${monthly ? 'ui-calendar-view-months' : ''} ${className}`} style={style}>
    {switching ? <view className="ui-calendar-controls"><view className="ui-calendar-control-side">{!monthly && switchMode === 'year-month' ? control(-1, true) : null}{control(-1)}</view><text>{panelLabel(titleDate, monthly)}</text><view className="ui-calendar-control-side">{control(1)}{!monthly && switchMode === 'year-month' ? control(1, true) : null}</view></view> : null}
    {!monthly ? <view className="ui-calendar-weekdays">{Array.from({ length: 7 }, (_, i) => <text key={i}>{['日', '一', '二', '三', '四', '五', '六'][(i + first) % 7]}</text>)}</view> : null}
    {!switching && showPanelTitle ? <text className="ui-calendar-panel-title">{panelLabel(titleDate, monthly)}</text> : null}
    <scroll-view ref={scroll} className="ui-calendar-scroll" scroll-orientation="vertical" scroll-bar-enable={false} enable-nested-scroll force-can-scroll style={{ height: `${scrollHeight}px` }} bindscroll={event => { 'background only'; if (!switching) setOffset(Math.max(0, event.detail.scrollTop)); }}>
      {firstOffset ? <view style={{ height: `${firstOffset}px` }} /> : null}
      {visible.map(panel => {
        const d = new Date(panel.date), year = d.getFullYear(), month = d.getMonth(), count = monthly ? 12 : new Date(year, month + 1, 0).getDate(), empty = monthly ? 0 : (d.getDay() - first + 7) % 7;
        return <view className="ui-calendar-month" key={panel.date}>{panel.title ? <text className="ui-calendar-panel-title">{panelLabel(panel.date, monthly)}</text> : null}<view className="ui-calendar-days">
          {empty ? <view style={{ width: `${empty * 100 / 7}%`, height: '60px', marginBottom: '4px' }} /> : null}
          {Array.from({ length: count }, (_, i) => {
            const date = new Date(year, monthly ? i : month, monthly ? 1 : i + 1).getTime(), rawType = calendarState(date, current ?? null, model), lastRow = monthly ? i >= 8 : Math.floor((empty + i) / 7) === panel.rows - 1;
            const base: CalendarDayItem = { date, text: monthly ? `${i + 1}月` : String(i + 1), type: rawType, disabled: monthly ? new Date(year, i + 1, 0).getTime() < bounds.minDay || date > bounds.maxDay : date < bounds.minDay || date > bounds.maxDay };
            const item = { ...base, ...formatter?.({ ...base }) }, inactive = disabled || base.disabled || item.disabled, state = item.type, incomplete = calendarRange(type) && calendarValues(current).length < 2 && !type.startsWith('week');
            return <view key={date} className={`ui-calendar-day ${monthly ? 'ui-calendar-day-month' : ''} ui-calendar-day-${state} ${inactive ? 'ui-calendar-day-disabled' : ''} ${incomplete ? 'ui-calendar-day-without-end' : ''} ${type === 'dates' ? 'ui-calendar-day-multiple' : ''} ${item.customClass ?? ''}`} style={{ marginBottom: lastRow ? '0px' : '4px' }} bindtap={() => { 'background only'; if (!inactive) choose(date); }} accessibility-element accessibility-traits="button" accessibility-label={`${year}年${monthly ? i + 1 : month + 1}月${monthly ? '' : `${i + 1}日`}${inactive ? '，禁用' : ''}`}>
              {(state === 'start' || state === 'end') && !incomplete ? <view className={`ui-calendar-range-half ui-calendar-range-half-${state}`} /> : null}<view className="ui-calendar-day-inner">{item.topInfo ? <text className="ui-calendar-day-top">{item.topInfo}</text> : null}<text className="ui-calendar-day-label">{item.text}</text>{item.bottomInfo ? <text className="ui-calendar-day-bottom">{item.bottomInfo}</text> : null}</view>
            </view>;
          })}</view></view>;
      })}
      {total > lastOffset ? <view style={{ height: `${total - lastOffset}px` }} /> : null}
    </scroll-view>
    {showTime ? <view className="ui-calendar-time">{type === 'datetimerange' ? <view className="ui-calendar-time-label"><text>{timeIndex === 0 ? '开始' : '结束'}</text></view> : null}<view className="ui-calendar-time-picker"><DatetimePickerView key={`${timeIndex}:${calendarMidnight(activeTime!)}`} ref={time} type="time" value={timeString(activeTime!)} useSecond={!hideSecond} itemHeight={timeItemHeight} visibleItemCount={timeVisibleItemCount} filter={timeFilter} formatter={unitLabel} disabled={disabled} immediateChange={immediateChange} onPickStart={onPickStart} onPickEnd={onPickEnd} boundaryMinDate={Number.isFinite(timeMin) ? timeMin : undefined} boundaryMaxDate={Number.isFinite(timeMax) ? timeMax : undefined} onChange={({ value }) => { 'background only'; if (typeof value === 'string' && value) emit(combineTime(value)); }} /></view></view> : null}
    <Toast {...toast.props} />
  </view>;
});
