import { useLocale } from './useLocale.js';
import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import { Popup } from './Popup.js';
import { FormFieldContext } from './formContext.js';
import { Loading } from './Loading.js';
import { PickerView } from './PickerView.js';
import type { PickerViewProps, PickerViewRef } from './PickerView.js';
import { pickerSelection } from './pickerModel.js';
import type { PickerChange, PickerValue } from './pickerModel.js';
export { PickerView } from './PickerView.js';
export type { PickerViewProps, PickerViewRef } from './PickerView.js';
export { pickerColumns, pickerSelection } from './pickerModel.js';
export type { PickerChange, PickerValue, PickerOption, PickerColumnItem, PickerColumns, PickerFieldNames } from './pickerModel.js';
export type PickerProps = PickerViewProps & {
  visible?: boolean; onVisibleChange?: (visible: boolean) => void; title?: ReactNode;
  confirmButtonText?: string; cancelButtonText?: string; beforeConfirm?: (value: PickerValue[]) => boolean | Promise<boolean>;
  onConfirm?: (event: PickerChange) => void; onCancel?: () => void; onClose?: () => void; onOpen?: () => void;
  closeOnClickModal?: boolean; safeAreaInsetBottom?: boolean; viewClassName?: string; zIndex?: number; rootPortal?: boolean; safeAreaBottom?: number;
};
export type PickerRef = { open: () => void; close: () => void };
export const Picker = forwardRef<PickerRef, PickerProps>(function Picker({ visible, onVisibleChange, title = '', confirmButtonText, cancelButtonText, beforeConfirm, onConfirm, onCancel, onClose, onOpen, closeOnClickModal = true, safeAreaInsetBottom = true, viewClassName, zIndex = 100, rootPortal = false, safeAreaBottom = 0, ...props }, ref) {
  const { t: localeText } = useLocale();
  confirmButtonText ??= localeText('common.done');
  cancelButtonText ??= localeText('common.cancel');

  const field = useContext(FormFieldContext), disabled = props.disabled ?? field?.disabled ?? false;
  const [innerVisible, setInnerVisible] = useState(false), show = visible ?? innerVisible;
  const [draft, setDraft] = useState<PickerValue[]>([]), [busy, setBusy] = useState(false);
  const sequence = useRef(0), pending = useRef(false), view = useRef<PickerViewRef>(null), openCallback = useRef(onOpen); openCallback.current = onOpen;
  const snapshot = useMemo(() => ({ show, value: props.value, columns: props.columns, cascade: props.cascade, valueKey: props.valueKey, labelKey: props.labelKey, childrenKey: props.childrenKey, disabled, loading: props.loading }), [show, props.value, props.columns, props.cascade, props.valueKey, props.labelKey, props.childrenKey, disabled, props.loading]);
  const latest = useRef(snapshot); latest.current = snapshot;
  useEffect(() => { sequence.current++; pending.current = false; setBusy(false); if (show) setDraft(pickerSelection(props).value); }, [snapshot]);
  useEffect(() => { if (show) openCallback.current?.(); }, [show]);
  useEffect(() => () => { sequence.current++; }, []);
  const changeVisible = (next: boolean) => { 'background only'; if (visible === undefined) setInnerVisible(next); onVisibleChange?.(next); };
  const close = () => { 'background only'; sequence.current++; pending.current = false; setBusy(false); if (show) { changeVisible(false); onClose?.(); } };
  const cancel = () => { 'background only'; if (!show) return; onCancel?.(); close(); };
  useImperativeHandle(ref, () => ({ open: () => { 'background only'; if (!disabled && !show) changeVisible(true); }, close }), [show, disabled, visible, onVisibleChange, onClose]);
  const confirm = async () => {
    'background only'; if (!show || pending.current || disabled || props.loading) return;
    const selected = view.current?.getSelected() ?? pickerSelection({ ...props, value: draft }), ticket = ++sequence.current, source = latest.current;
    pending.current = true; setBusy(true);
    try {
      if (!await (beforeConfirm?.(selected.value) ?? true) || ticket !== sequence.current || source !== latest.current) return;
      props.onChange?.(selected); onConfirm?.(selected); close();
    } catch { /* Rejection preserves the draft so the user can try again. */ }
    finally { if (ticket === sequence.current) { pending.current = false; setBusy(false); } }
  };
  return <Popup show={show} onClose={cancel} closeOnClickModal={closeOnClickModal} position="bottom" zIndex={zIndex} rootPortal={rootPortal} safeAreaInsetBottom={safeAreaInsetBottom} safeAreaBottom={safeAreaBottom} round className="ui-picker">
    <view className="ui-picker-toolbar"><text className="ui-picker-cancel" bindtap={cancel}>{cancelButtonText}</text><view className="ui-picker-title">{typeof title === 'string' ? <text>{title}</text> : title}</view><view className="ui-picker-confirm" accessibility-element accessibility-label={confirmButtonText} bindtap={() => void confirm()}>{busy ? <Loading size={16} /> : <text>{confirmButtonText}</text>}</view></view>
    <PickerView {...props} ref={view} className={[props.className, viewClassName].filter(Boolean).join(' ')} value={draft} disabled={disabled || busy} onChange={event => { 'background only'; setDraft(event.value); }} />
  </Popup>;
});
