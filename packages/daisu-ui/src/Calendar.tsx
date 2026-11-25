import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import { ActionSheet } from './ActionSheet.js';
import { Button } from './Button.js';
import { Icon } from './Icon.js';
import { Tabs } from './Tabs.js';
import { Tag } from './Tag.js';
import { FormFieldContext } from './formContext.js';
import { CalendarView } from './CalendarView.js';
import type { CalendarViewProps, CalendarViewRef } from './CalendarView.js';
import { calendarComplete, calendarNormalize, calendarRange, calendarWeekNumber } from './calendarModel.js';
import type { CalendarType, CalendarValue } from './calendarModel.js';
export { CalendarView } from './CalendarView.js';
export type { CalendarViewProps, CalendarViewRef } from './CalendarView.js';
export type { CalendarType, CalendarValue, CalendarDayItem, CalendarDayType, CalendarSwitchMode } from './calendarModel.js';
export type CalendarRef = { open: () => void; close: () => void };
export type CalendarShortcut = { text: string; [key: string]: unknown };
export type CalendarProps = Omit<CalendarViewProps, 'onChange'> & {
  visible?: boolean; onVisibleChange?: (visible: boolean) => void; title?: string; confirmText?: string; showConfirm?: boolean;
  onConfirm?: (event: { value: CalendarValue; type: CalendarType }) => void; onChange?: (event: { value: CalendarValue }) => void; onPickChange?: (event: { value: CalendarValue }) => void;
  onCancel?: () => void; onOpen?: () => void; onClose?: () => void; beforeConfirm?: (value: CalendarValue) => boolean | Promise<boolean>;
  innerDisplayFormat?: (value: number | null, endpoint: 'start' | 'end', type: CalendarType) => string; ellipsis?: boolean; showTypeSwitch?: boolean;
  shortcuts?: readonly CalendarShortcut[]; onShortcutsClick?: (event: { item: CalendarShortcut; index: number }) => CalendarValue | Promise<CalendarValue>;
  confirmLeft?: ReactNode; confirmRight?: ReactNode; viewClassName?: string; closeOnClickModal?: boolean; duration?: number; rootPortal?: boolean; safeAreaInsetBottom?: boolean; safeAreaBottom?: number; zIndex?: number;
};
const pad = (value: number) => String(value).padStart(2, '0');
function innerLabel(value: number | null, endpoint: 'start' | 'end', type: CalendarType) {
  if (value === null) return `${endpoint === 'start' ? '开始' : '结束'}${type === 'weekrange' ? '周' : type === 'monthrange' ? '月份' : '时间'}`;
  const date = new Date(value), day = `${pad(date.getFullYear() % 100)}年${pad(date.getMonth() + 1)}月${pad(date.getDate())}日`;
  return type === 'weekrange' ? `${date.getFullYear()} 第${pad(calendarWeekNumber(value))}周` : type === 'monthrange' ? `${date.getFullYear()}年${pad(date.getMonth() + 1)}月` : type === 'datetimerange' ? `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` : day;
}
export const Calendar = forwardRef<CalendarRef, CalendarProps>(function Calendar({ visible, onVisibleChange, title = '选择日期', confirmText = '确定', showConfirm = true, onConfirm, onChange, onPickChange, onCancel, onOpen, onClose, beforeConfirm, innerDisplayFormat = innerLabel, ellipsis = false, showTypeSwitch = false, shortcuts = [], onShortcutsClick, confirmLeft, confirmRight, viewClassName = '', closeOnClickModal = true, duration = 200, rootPortal = false, safeAreaInsetBottom = true, safeAreaBottom = 0, zIndex = 100, value, type = 'date', disabled: disabledProp, className = '', style, ...props }, ref) {
  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const [innerVisible, setInnerVisible] = useState(false), [innerValue, setInnerValue] = useState<CalendarValue>(null), show = visible ?? innerVisible, sourceValue = value === undefined ? innerValue : value;
  const { minDate, maxDate, firstDayOfWeek, maxRange, allowSameDay, defaultTime, formatter, timeFilter, hideSecond, switchMode } = props;
  const model = useMemo(() => ({ type, minDate, maxDate, firstDayOfWeek, maxRange, allowSameDay, defaultTime }), [type, minDate, maxDate, firstDayOfWeek, maxRange, allowSameDay, defaultTime]);
  const source = useMemo(() => ({ sourceValue, model, show, disabled, formatter, timeFilter, hideSecond, switchMode, showTypeSwitch }), [sourceValue, model, show, disabled, formatter, timeFilter, hideSecond, switchMode, showTypeSwitch]);
  const latest = useRef(source); latest.current = source;
  const [ready, setReady] = useState<typeof source>(), [draft, setDraft] = useState<CalendarValue>(null), [activeType, setActiveType] = useState(type), [busy, setBusy] = useState(false), [shortcut, setShortcut] = useState(-1);
  const needsReveal = useRef(false);
  const selection = useRef(draft), selectedType = useRef(activeType), view = useRef<CalendarViewRef>(null), generation = useRef(0), pending = useRef(false), opened = useRef(show), committed = useRef({ prop: type, type }), openCallback = useRef(onOpen); openCallback.current = onOpen;
  useEffect(() => { if (needsReveal.current) { needsReveal.current = false; view.current?.scrollIntoView(); } }, [draft]);
  useEffect(() => {
    generation.current++; pending.current = false; setBusy(false); opened.current = show;
    if (committed.current.prop !== type) committed.current = { prop: type, type };
    if (show) { const nextType = showTypeSwitch ? committed.current.type : type, next = calendarNormalize(sourceValue, { ...model, type: nextType }); selection.current = next; selectedType.current = nextType; setActiveType(nextType); setDraft(next); setShortcut(-1); setReady(source); }
  }, [source]);
  useEffect(() => { if (show) openCallback.current?.(); }, [show]);
  useEffect(() => () => { generation.current++; opened.current = false; }, []);
  const changeVisible = (next: boolean) => { 'background only'; if (visible === undefined) setInnerVisible(next); onVisibleChange?.(next); };
  const close = (cancelled = false) => {
    'background only'; if (!opened.current) return; opened.current = false; generation.current++; pending.current = false; setBusy(false); if (cancelled) onCancel?.(); changeVisible(false); onClose?.();
  };
  useImperativeHandle(ref, () => ({ open: () => { 'background only'; if (!show && !disabled) changeVisible(true); }, close: () => close(true) }), [show, disabled, visible, onVisibleChange, onCancel, onClose]);
  const confirm = async (suppliedValue?: CalendarValue) => {
    'background only'; if (!opened.current || disabled || pending.current) return;
    const next = suppliedValue === undefined ? view.current?.getSelected() ?? selection.current : suppliedValue;
    if (!calendarComplete(next, selectedType.current)) return;
    selection.current = next; setDraft(next); pending.current = true; setBusy(true); const ticket = ++generation.current, snapshot = latest.current;
    try {
      if (!await (beforeConfirm?.(next) ?? true) || ticket !== generation.current || snapshot !== latest.current || !opened.current) return;
      committed.current = { prop: type, type: selectedType.current }; if (value === undefined) setInnerValue(next);
      onChange?.({ value: next }); onConfirm?.({ value: next, type: selectedType.current }); close();
    } catch { /* Rejected confirmation keeps the draft available. */ }
    finally { if (ticket === generation.current) { pending.current = false; setBusy(false); } }
  };
  const update = (next: CalendarValue, shortcutIndex = -1) => {
    'background only'; if (!opened.current || disabled || pending.current) return; selection.current = next; setDraft(next); setShortcut(shortcutIndex); onPickChange?.({ value: next }); if (!showConfirm && calendarComplete(next, selectedType.current)) void confirm(next);
  };
  const chooseShortcut = async (item: CalendarShortcut, index: number) => {
    'background only'; if (!onShortcutsClick || !opened.current || disabled || pending.current) return;
    const ticket = ++generation.current, snapshot = latest.current; pending.current = true; setBusy(true);
    try { const next = await onShortcutsClick({ item, index }); if (ticket !== generation.current || snapshot !== latest.current || !opened.current) return; pending.current = false; setBusy(false); needsReveal.current = true; update(calendarNormalize(next, { ...model, type: selectedType.current }), index); }
    catch { /* Failed shortcuts leave the existing draft intact. */ }
    finally { if (ticket === generation.current) { pending.current = false; setBusy(false); } }
  };
  const endpoints = Array.isArray(draft) ? draft : [], range = calendarRange(activeType), types: CalendarType[] = calendarRange(type) ? ['daterange', 'weekrange', 'monthrange'] : ['date', 'week', 'month'];
  return <ActionSheet show={show} onClose={() => close(true)} title={title} titleClassName="ui-calendar-header" className={`ui-calendar ${className}`} style={style} duration={duration} closeOnClickModal={closeOnClickModal} rootPortal={rootPortal} safeAreaInsetBottom={safeAreaInsetBottom} safeAreaBottom={safeAreaBottom} zIndex={zIndex} renderClose={() => <><Icon name="close" size={24} color="#4e5369" className="ui-calendar-close-light" /><Icon name="close" size={24} color="#e5e6eb" className="ui-calendar-close-dark" /></>}>
    {showTypeSwitch ? <Tabs className="ui-calendar-tabs" items={types.map((name, index) => ({ name, title: ['日', '周', '月'][index]! }))} value={activeType} onChange={next => { 'background only'; if (!opened.current || disabled || busy) return; selectedType.current = next as CalendarType; setActiveType(next as CalendarType); setShortcut(-1); }} /> : null}
    {shortcuts.length ? <view className="ui-calendar-shortcuts">{shortcuts.map((item, index) => <Tag key={index} type={shortcut === index ? 'primary' : 'default'} variant={shortcut === index ? 'dark' : 'light'} label={item.text} onTap={() => { 'background only'; void chooseShortcut(item, index); }} />)}</view> : null}
    {range ? <view className="ui-calendar-range">{(['start', 'end'] as const).map((endpoint, index) => <view key={endpoint} className={`ui-calendar-range-item ${endpoints[index] == null ? 'ui-calendar-range-placeholder' : ''}`}><text className={ellipsis ? 'ui-calendar-range-ellipsis' : ''}>{innerDisplayFormat(endpoints[index] ?? null, endpoint, activeType)}</text><view className="ui-calendar-range-line" /></view>).flatMap((item, index) => index ? [<view key="separator" className="ui-calendar-range-separator" />, item] : [item])}</view> : null}
    {ready && (!show || ready === source) ? <CalendarView {...props} ref={view} value={draft} type={activeType} disabled={disabled || busy || !show} className={viewClassName} onChange={({ value }) => update(value)} /> : null}
    {showConfirm ? <view className="ui-calendar-confirm"><view className="ui-calendar-confirm-line" />{confirmLeft}<view className="ui-calendar-confirm-button"><Button size="large" round={false} label={confirmText} disabled={disabled || !calendarComplete(draft, activeType)} loading={busy} onTap={() => { 'background only'; void confirm(); }} /></view>{confirmRight}</view> : null}
  </ActionSheet>;
});
