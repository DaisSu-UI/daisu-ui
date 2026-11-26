import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import { ActionSheet } from './ActionSheet.js';
import { Radio, RadioGroup } from './Radio.js';
import { Checkbox, CheckboxGroup } from './Checkbox.js';
import { Search } from './Search.js';
import { Button } from './Button.js';
import { Loading } from './Loading.js';
import { FormFieldContext } from './formContext.js';
import type { ChoiceValue } from './choice.js';
export type SelectPickerOption = { value: ChoiceValue; label: string; disabled?: boolean };
export type SelectPickerValue = ChoiceValue | readonly ChoiceValue[];
export type SelectPickerProps = {
  value?: SelectPickerValue; onChange?: (event: { value: ChoiceValue | ChoiceValue[] }) => void;
  visible?: boolean; onVisibleChange?: (visible: boolean) => void; columns: readonly (SelectPickerOption | Readonly<Record<string, unknown>>)[];
  type?: 'checkbox' | 'radio'; title?: string; min?: number; max?: number; disabled?: boolean; loading?: boolean;
  filterable?: boolean; filterPlaceholder?: string; confirmButtonText?: string; showConfirm?: boolean;
  valueKey?: string; labelKey?: string; checkedColor?: string; selectSize?: 'large'; loadingColor?: string;
  beforeConfirm?: (value: ChoiceValue | ChoiceValue[]) => boolean | Promise<boolean>;
  onConfirm?: (event: { value: ChoiceValue | ChoiceValue[]; selectedItems: SelectPickerOption[] }) => void;
  onCancel?: () => void; onClose?: () => void; onOpen?: () => void; closeOnClickModal?: boolean; scrollIntoView?: boolean;
  rootPortal?: boolean; zIndex?: number; safeAreaInsetBottom?: boolean; safeAreaBottom?: number;
  className?: string; style?: CSSProperties; contentClassName?: string;
};
export type SelectPickerRef = { open: () => void; close: () => void };
export const SelectPicker = forwardRef<SelectPickerRef, SelectPickerProps>(function SelectPicker({ value, visible, onVisibleChange, columns, type = 'checkbox', title = '选择器', min = 0, max = 0, disabled: disabledProp, loading = false, filterable = false, filterPlaceholder = '搜索', confirmButtonText = '确认', showConfirm = true, valueKey = 'value', labelKey = 'label', checkedColor, selectSize, loadingColor = '#4D80F0', beforeConfirm, onChange, onConfirm, onCancel, onClose, onOpen, closeOnClickModal = true, scrollIntoView = true, rootPortal = false, zIndex = 100, safeAreaInsetBottom = true, safeAreaBottom = 0, className = '', style, contentClassName = '' }, ref) {
  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const [innerVisible, setInnerVisible] = useState(false), show = visible ?? innerVisible;
  const [draft, setDraft] = useState<ChoiceValue | ChoiceValue[]>([]), [query, setQuery] = useState(''), [busy, setBusy] = useState(false);
  const generation = useRef(0), pending = useRef(false), current = useRef(draft), scroll = useRef<NodesRef>(null), offset = useRef(0), openCallback = useRef(onOpen); current.current = draft; openCallback.current = onOpen;
  const data = useMemo(() => columns.flatMap(item => {
    const record = item as Readonly<Record<string, unknown>>, optionValue = record[valueKey];
    if (!['string', 'number', 'boolean'].includes(typeof optionValue)) return [];
    return [{ ...record, value: optionValue as ChoiceValue, label: String(record[labelKey] ?? optionValue), disabled: !!record.disabled }];
  }), [columns, valueKey, labelKey]);
  const snapshot = useMemo(() => ({ value, columns, type, valueKey, labelKey, show, disabled, loading }), [value, columns, type, valueKey, labelKey, show, disabled, loading]);
  const latest = useRef(snapshot); latest.current = snapshot;
  useEffect(() => {
    generation.current++; pending.current = false; setBusy(false);
    if (show) { const next = type === 'checkbox' ? Array.isArray(value) ? [...value] : [] : typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? value : ''; current.current = next; setDraft(next); setQuery(''); }
  }, [snapshot]);
  useEffect(() => { if (show) openCallback.current?.(); }, [show]);
  useEffect(() => () => { generation.current++; }, []);
  const changeVisible = (next: boolean) => { 'background only'; if (visible === undefined) setInnerVisible(next); onVisibleChange?.(next); };
  const close = () => { 'background only'; generation.current++; pending.current = false; setBusy(false); if (show) { changeVisible(false); onClose?.(); } };
  const cancel = () => { 'background only'; if (show) { onCancel?.(); close(); } };
  useImperativeHandle(ref, () => ({ open: () => { 'background only'; if (!show && !disabled) changeVisible(true); }, close }), [show, disabled, visible, onVisibleChange, onClose]);
  const confirm = async (next = current.current) => {
    'background only'; if (!show || disabled || loading || pending.current) return;
    const selection = Array.isArray(next) ? next : [next];
    if (type === 'checkbox' && (selection.length < Math.max(0, min) || max > 0 && selection.length > max)) return;
    pending.current = true; setBusy(true); const ticket = ++generation.current, source = latest.current;
    try {
      if (!await (beforeConfirm?.(next) ?? true) || ticket !== generation.current || source !== latest.current) return;
      onConfirm?.({ value: next, selectedItems: selection.flatMap(value => { const item = data.find(item => item.value === value); return item ? [item] : []; }) }); close();
    } catch { /* Rejection preserves the current draft. */ }
    finally { if (ticket === generation.current) { pending.current = false; setBusy(false); } }
  };
  const update = (next: ChoiceValue | ChoiceValue[]) => {
    'background only'; if (disabled || loading || busy || !show) return;
    current.current = next; setDraft(next); onChange?.({ value: next }); if (type === 'radio' && !showConfirm) void confirm(next);
  };
  const items = data.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
  const label = (item: SelectPickerOption) => {
    const index = item.label.toLowerCase().indexOf(query.toLowerCase());
    return query && index >= 0 ? <text className="ui-select-picker-label" text-maxline="1">{item.label.slice(0, index)}<text className="ui-select-picker-text-active">{item.label.slice(index, index + query.length)}</text>{item.label.slice(index + query.length)}</text> : item.label;
  };
  const reveal = () => {
    'background only'; if (!scrollIntoView) return;
    const selected = Array.isArray(current.current) ? current.current[0] : current.current, index = data.findIndex(item => item.value === selected), row = selectSize === 'large' ? 58 : 54, top = index * row;
    if (index < 0 || top >= offset.current && top + row <= offset.current + 375) return;
    scroll.current?.invoke({ method: 'scrollTo', params: { offset: Math.max(0, top - 375 / 2), smooth: true } }).exec();
  };
  return <ActionSheet show={show} onClose={cancel} onAfterEnter={reveal} title={title} titleClassName="ui-select-picker-header" closeOnClickModal={closeOnClickModal} rootPortal={rootPortal} zIndex={zIndex} safeAreaInsetBottom={safeAreaInsetBottom} safeAreaBottom={safeAreaBottom} className={`ui-select-picker ${className}`} style={style}>
    {filterable ? <Search value={query} onChange={({ value }) => { 'background only'; setQuery(value); offset.current = 0; scroll.current?.invoke({ method: 'scrollTo', params: { offset: 0, smooth: false } }).exec(); }} placeholder={filterPlaceholder} hideCancel placeholderLeft disabled={loading || busy} /> : null}
    <view className="ui-select-picker-content"><scroll-view ref={scroll} className={`ui-select-picker-scroll ${loading ? 'ui-select-picker-is-loading' : ''} ${contentClassName}`} scroll-orientation="vertical" enable-scroll={!loading} scroll-bar-enable={false} bindscroll={event => { 'background only'; offset.current = event.detail.scrollTop; }}>
      {type === 'checkbox' ? <CheckboxGroup value={Array.isArray(draft) ? draft : []} min={min} max={max} disabled={disabled || busy} readonly={loading} onChange={({ value }) => update(value)} placement="right" type="square" size={selectSize} checkedColor={checkedColor}>{items.map(item => <Checkbox key={`${typeof item.value}:${item.value}`} name={item.value} disabled={item.disabled} className="ui-select-picker-option" labelClassName="ui-select-picker-choice-label">{label(item)}</Checkbox>)}</CheckboxGroup> : <RadioGroup<ChoiceValue> value={Array.isArray(draft) ? null : draft} disabled={disabled || busy} readonly={loading} placement="right" size={selectSize} checkedColor={checkedColor} onChange={value => { 'background only'; if (value !== null) update(value); }}>{items.map(item => <Radio key={`${typeof item.value}:${item.value}`} value={item.value} disabled={item.disabled} className="ui-select-picker-option" labelClassName="ui-select-picker-choice-label">{label(item)}</Radio>)}</RadioGroup>}
      {!items.length ? <text className="ui-picker-empty">暂无数据</text> : null}
    </scroll-view>{loading ? <view className="ui-select-picker-loading"><Loading size={48} color={loadingColor} /></view> : null}</view>
    {type === 'checkbox' || showConfirm ? <view className="ui-select-picker-footer"><view className="ui-select-picker-footer-line" /><Button block size="large" label={confirmButtonText} loading={busy} disabled={disabled || loading || busy} onTap={() => void confirm()} /></view> : null}
  </ActionSheet>;
});
