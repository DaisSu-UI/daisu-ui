import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from '@lynx-js/react';
import type { ReactNode, Ref } from '@lynx-js/react';
import { Popup } from './Popup.js';
import { Loading } from './Loading.js';
import { FormFieldContext } from './formContext.js';
import { DatetimePickerView } from './DatetimePickerView.js';
import type { DatetimePickerViewProps, DatetimePickerViewRef } from './DatetimePickerView.js';
import { datetimeDefaults, datetimeLabel, datetimeModel } from './datetimePickerModel.js';
import type { DatetimeModelProps, DatetimePickerType, DatetimePickerValue } from './datetimePickerModel.js';
import type { PickerOption } from './pickerModel.js';
export { DatetimePickerView } from './DatetimePickerView.js';
export type { DatetimePickerViewProps, DatetimePickerViewRef, DatetimePickerChange } from './DatetimePickerView.js';
export type { DatetimePickerType, DatetimePickerValue, DatetimeColumn, DatetimeColumnType, DatetimeFilterParams } from './datetimePickerModel.js';
export type DatetimePickerModelValue = DatetimePickerValue | readonly DatetimePickerValue[];
type Result<V> = V extends readonly DatetimePickerValue[] ? DatetimePickerValue[] : DatetimePickerValue;
export type DatetimePickerRef = { open: () => void; close: () => void };
export type DatetimePickerProps<V extends DatetimePickerModelValue = DatetimePickerValue> = Omit<DatetimePickerViewProps, 'value' | 'onChange'> & {
  value?: V; visible?: boolean; onVisibleChange?: (visible: boolean) => void; title?: string;
  cancelButtonText?: string; confirmButtonText?: string; beforeConfirm?: (value: Result<V>) => boolean | Promise<boolean>;
  onConfirm?: (event: { value: Result<V> }) => void; onChange?: (event: { value: Result<V> }) => void; onPickChange?: (event: { value: Result<V> }) => void;
  onToggle?: (value: DatetimePickerValue) => void; onCancel?: () => void; onClose?: () => void; onOpen?: () => void;
  displayFormatTabLabel?: (items: PickerOption[]) => string; closeOnClickModal?: boolean; rootPortal?: boolean; safeAreaInsetBottom?: boolean; safeAreaBottom?: number; zIndex?: number; viewClassName?: string;
};
function boundary(value: DatetimePickerValue, type?: DatetimePickerType) {
  if (type !== 'time') return Number(value);
  const [hour = 0, minute = 0, second = 0] = String(value).split(':').map(Number); return new Date(2000, 0, 1, hour, minute, second).getTime();
}
export function datetimeDraft(value: DatetimePickerModelValue | undefined, props: DatetimeModelProps): DatetimePickerValue | DatetimePickerValue[] {
  if (!Array.isArray(value)) return datetimeModel({ ...props, value: value as DatetimePickerValue | undefined }).value;
  const first = datetimeModel({ ...props, value: value[0] }).value;
  const last = value[1] === '' || value[1] === undefined ? props.type === 'time' ? `${String(props.maxHour ?? 23).padStart(2, '0')}:${String(props.maxMinute ?? 59).padStart(2, '0')}${props.useSecond ? `:${String(props.maxSecond ?? 59).padStart(2, '0')}` : ''}` : props.maxDate ?? datetimeDefaults.maxDate : value[1];
  const second = datetimeModel({ ...props, value: last }).value;
  return [first, first !== '' && second !== '' && boundary(first, props.type) > boundary(second, props.type) ? first : second];
}
const DatetimePickerImpl = forwardRef<DatetimePickerRef, DatetimePickerProps<DatetimePickerModelValue>>(function DatetimePicker({ value, visible, onVisibleChange, title = '', cancelButtonText = '取消', confirmButtonText = '完成', beforeConfirm, onConfirm, onChange, onPickChange, onToggle, onCancel, onClose, onOpen, displayFormatTabLabel, closeOnClickModal = true, rootPortal = false, safeAreaInsetBottom = true, safeAreaBottom = 0, zIndex = 100, viewClassName = '', className = '', style, disabled: disabledProp, ...props }, ref) {
  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const [innerVisible, setInnerVisible] = useState(false), [innerValue, setInnerValue] = useState<DatetimePickerModelValue>(), show = visible ?? innerVisible;
  const sourceValue = value ?? innerValue;
  const { type, minDate, maxDate, minHour, maxHour, minMinute, maxMinute, minSecond, maxSecond, useSecond, filter, formatter, columnFormatter, boundaryMinDate, boundaryMaxDate } = props;
  const modelProps = useMemo(() => ({ type, minDate, maxDate, minHour, maxHour, minMinute, maxMinute, minSecond, maxSecond, useSecond, filter, formatter, columnFormatter, boundaryMinDate, boundaryMaxDate }), [type, minDate, maxDate, minHour, maxHour, minMinute, maxMinute, minSecond, maxSecond, useSecond, filter, formatter, columnFormatter, boundaryMinDate, boundaryMaxDate]);
  const snapshot = useMemo(() => ({ sourceValue, modelProps, show, disabled, loading: props.loading }), [sourceValue, modelProps, show, disabled, props.loading]);
  const latestSource = useRef(snapshot); latestSource.current = snapshot;
  const [ready, setReady] = useState<typeof snapshot>();
  const [draft, setDraft] = useState<DatetimePickerValue | DatetimePickerValue[]>(''), [tab, setTab] = useState(0), [busy, setBusy] = useState(false);
  const current = useRef(draft), active = useRef(0), view = useRef<DatetimePickerViewRef>(null), generation = useRef(0), pending = useRef(false), openCallback = useRef(onOpen); openCallback.current = onOpen;
  useEffect(() => { generation.current++; pending.current = false; setBusy(false); if (show) { setReady(snapshot); const next = datetimeDraft(sourceValue, modelProps); current.current = next; setDraft(next); active.current = 0; setTab(0); } }, [snapshot]);
  useEffect(() => { if (show) openCallback.current?.(); }, [show]);
  useEffect(() => () => { generation.current++; }, []);
  const changeVisible = (next: boolean) => { 'background only'; if (visible === undefined) setInnerVisible(next); onVisibleChange?.(next); };
  const close = () => { 'background only'; generation.current++; pending.current = false; setBusy(false); if (show) { changeVisible(false); onClose?.(); } };
  const cancel = () => { 'background only'; if (show) { onCancel?.(); close(); } };
  useImperativeHandle(ref, () => ({ open: () => { 'background only'; if (!show && !disabled) changeVisible(true); }, close: cancel }), [show, disabled, visible, onVisibleChange, onClose, onCancel]);
  const range = Array.isArray(draft), values = range ? draft : [draft], selected = values[tab] ?? '';
  const limit = range && values[1 - tab] !== '' ? boundary(values[1 - tab]!, type) : undefined;
  const viewProps = { ...modelProps, boundaryMinDate: range && tab === 1 ? limit : boundaryMinDate, boundaryMaxDate: range && tab === 0 ? limit : boundaryMaxDate };
  const update = (next: DatetimePickerValue, emit = true) => {
    'background only'; if (!show || disabled || props.loading || busy) return;
    const value = Array.isArray(current.current) ? current.current.map((value, index) => index === active.current ? next : value) : next;
    current.current = value; setDraft(value); if (emit) onPickChange?.({ value });
  };
  const capture = () => {
    'background only'; const next = view.current?.getSelected().value ?? (Array.isArray(current.current) ? current.current[active.current] ?? '' : current.current);
    update(next, false); return current.current;
  };
  const confirm = async () => {
    'background only'; if (!show || disabled || props.loading || pending.current) return;
    const next = capture(); if (next === '' || Array.isArray(next) && next.some(value => value === '')) return;
    pending.current = true; setBusy(true); const ticket = ++generation.current, source = latestSource.current;
    try {
      if (!await (beforeConfirm?.(next) ?? true) || ticket !== generation.current || source !== latestSource.current) return;
      if (value === undefined) setInnerValue(next); onChange?.({ value: next }); onConfirm?.({ value: next }); close();
    } catch { /* Rejection keeps the current draft available. */ }
    finally { if (ticket === generation.current) { pending.current = false; setBusy(false); } }
  };
  return <Popup show={show} onClose={cancel} position="bottom" round duration={200} lockScroll={false} closeOnClickModal={closeOnClickModal} rootPortal={rootPortal} safeAreaInsetBottom={safeAreaInsetBottom} safeAreaBottom={safeAreaBottom} zIndex={zIndex} className={`ui-datetime-picker ${className}`} style={style}>
    <view className="ui-datetime-picker-toolbar"><text className="ui-datetime-picker-cancel" bindtap={cancel}>{cancelButtonText}</text>{title ? <text className="ui-datetime-picker-title">{title}</text> : <view /> }<view className="ui-datetime-picker-confirm" bindtap={() => { 'background only'; void confirm(); }} accessibility-element accessibility-traits="button" accessibility-label={confirmButtonText}>{busy ? <Loading size={20} /> : <text>{confirmButtonText}</text>}</view></view>
    {range ? <view className="ui-datetime-picker-range">{values.map((value, index) => <view key={index} className={`ui-datetime-picker-range-item ${tab === index ? 'ui-datetime-picker-range-active' : ''}`} bindtap={() => {
      'background only'; if (busy || disabled || props.loading || index === tab) return; const next = capture(); active.current = index; setTab(index); if (Array.isArray(next)) onToggle?.(next[index]!);
    }}><text>{displayFormatTabLabel ? displayFormatTabLabel(datetimeModel({ ...modelProps, value }).selectedOptions) : datetimeLabel(value, type, useSecond)}</text><view className="ui-datetime-picker-range-line" /></view>).flatMap((item, index) => index ? [<view key="separator" className="ui-datetime-picker-range-separator" />, item] : [item])}</view> : null}
    {ready && (!show || ready === snapshot) ? <DatetimePickerView key={tab} {...props} {...viewProps} ref={view} value={selected} disabled={disabled || busy || !show} className={viewClassName} onChange={({ value }) => update(value)} /> : null}
  </Popup>;
});
export const DatetimePicker = DatetimePickerImpl as <V extends DatetimePickerModelValue = DatetimePickerValue>(props: DatetimePickerProps<V> & { ref?: Ref<DatetimePickerRef> }) => ReactNode;
