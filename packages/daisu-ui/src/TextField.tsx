import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import { FormFieldContext } from './formContext.js';
import { Icon } from './Icon.js';

export type TextFieldEvent = { value: string; selectionStart?: number; selectionEnd?: number; isComposing?: boolean };
export type TextFieldRef = { focus: () => void; blur: () => void; setSelectionRange: (start: number, end: number) => void };
export type TextFieldProps = {
  value?: string | number; defaultValue?: string | number;
  onChange?: (value: string) => void; onInput?: (event: TextFieldEvent) => void;
  placeholder?: string; maxlength?: number; disabled?: boolean; readonly?: boolean;
  clearable?: boolean; clearTrigger?: 'always' | 'focus'; focusWhenClear?: boolean;
  error?: boolean; compact?: boolean; alignRight?: boolean;
  prefixIcon?: string; suffixIcon?: string; prefix?: ReactNode; suffix?: ReactNode;
  showWordLimit?: boolean; focus?: boolean;
  confirmType?: 'done' | 'go' | 'next' | 'search' | 'send'; confirmHold?: boolean;
  avoidKeyboard?: boolean; cursorSpacing?: number; softInputMode?: 'unspecified' | 'nothing' | 'pan' | 'resize'; holdKeyboard?: boolean;
  selectionStart?: number; selectionEnd?: number;
  placeholderColor?: string; inputFilter?: string; showSoftInputOnFocus?: boolean; ignoreCompositionEvent?: boolean;
  onFocus?: (event: TextFieldEvent) => void; onBlur?: (event: TextFieldEvent) => void; onConfirm?: (event: TextFieldEvent) => void;
  onClear?: () => void; onClickPrefixIcon?: () => void; onClickSuffixIcon?: () => void; onTap?: () => void;
  onKeyboardHeightChange?: (event: { height: number }) => void;
  className?: string; inputClassName?: string; style?: CSSProperties;
};
export type InternalTextFieldProps = TextFieldProps & {
  multiline?: boolean; type?: 'text' | 'number' | 'digit' | 'password' | 'tel' | 'email'; showPassword?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  autoHeight?: boolean; height?: number; minHeight?: number; maxHeight?: number; maxlines?: number;
  onLineChange?: (event: { lineCount: number }) => void;
};
const textValue = (value: string | number | undefined) => value === undefined ? '' : String(value);
const nonnegative = (n: number, fallback: number) => Number.isFinite(n) ? Math.max(0, n) : fallback;
const node = (content: ReactNode) => typeof content === 'string' || typeof content === 'number' ? <text>{content}</text> : content;

/** Shared native editing/synchronization; browser APIs belong only in the H5 host. */
export const TextField = forwardRef<TextFieldRef, InternalTextFieldProps>(function TextField({ value, defaultValue = '', onChange, onInput, placeholder = '请输入...', maxlength = -1, disabled: disabledProp, readonly = false, clearable = false, clearTrigger = 'always', focusWhenClear = true, error: errorProp, compact: compactProp, alignRight = false, prefixIcon, suffixIcon, prefix, suffix, showWordLimit = false, focus, confirmType = 'done', confirmHold = false, avoidKeyboard = true, cursorSpacing = 0, softInputMode = 'nothing', holdKeyboard = false, selectionStart, selectionEnd, placeholderColor, inputFilter, showSoftInputOnFocus = true, ignoreCompositionEvent = true, onFocus, onBlur, onConfirm, onClear, onClickPrefixIcon, onClickSuffixIcon, onTap, onKeyboardHeightChange, className = '', inputClassName = '', style, multiline = false, type = 'text', textAlign, showPassword = false, autoHeight = false, height = 150, minHeight = 20, maxHeight, maxlines = 2147483647, onLineChange }, ref) {
  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false, error = errorProp ?? field?.error ?? false, compact = compactProp ?? field?.compact ?? false;
  const [inner, setInner] = useState(textValue(defaultValue)), [focused, setFocused] = useState(false), [visiblePassword, setVisiblePassword] = useState(false);
  const [composing, setComposing] = useState(false), [measuredHeight, setMeasuredHeight] = useState(20);
  // Even an identical rejected edit/clear must reconcile the native editor.
  const [editVersion, setEditVersion] = useState(0);
  const text = composing ? inner : textValue(value ?? inner);
  const initial = useRef(text), native = useRef<NodesRef | null>(null), nativeValue = useRef<string | null>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout>>();
  const blocked = disabled || readonly;
  const writeNative = (next: string) => { 'background only'; nativeValue.current = next; native.current?.invoke({ method: 'setValue', params: { value: next } }).exec(); };
  const requestFocus = () => { 'background only'; if (!disabled) native.current?.invoke({ method: 'focus' }).exec(); };
  const requestBlur = () => { 'background only'; native.current?.invoke({ method: 'blur' }).exec(); };
  const setSelection = (start: number, end: number) => { 'background only'; const from = Math.max(0, Math.min(text.length, Math.trunc(start))), to = Math.max(from, Math.min(text.length, Math.trunc(end))); if (Number.isFinite(from) && Number.isFinite(to)) native.current?.invoke({ method: 'setSelectionRange', params: { selectionStart: from, selectionEnd: to } }).exec(); };
  useImperativeHandle(ref, () => ({ focus: requestFocus, blur: requestBlur, setSelectionRange: setSelection }), [disabled, text]);
  useEffect(() => { if (!composing && nativeValue.current !== text) writeNative(text); }, [text, inner, composing, editVersion]);
  useEffect(() => { if (focus === true) requestFocus(); else if (focus === false) requestBlur(); }, [focus, disabled]);
  useEffect(() => { if (selectionStart !== undefined && selectionEnd !== undefined) setSelection(selectionStart, selectionEnd); }, [selectionStart, selectionEnd, text]);
  useEffect(() => () => clearTimeout(blurTimer.current), []);
  const change = (event: { detail: TextFieldEvent }) => {
    'background only';
    if (blocked) return;
    const detail = event.detail; nativeValue.current = detail.value; setInner(detail.value);
    setEditVersion(version => version + 1);
    setComposing(!!detail.isComposing);
    if (ignoreCompositionEvent && detail.isComposing) return;
    onInput?.(detail); onChange?.(detail.value);
  };
  const clear = () => { 'background only'; if (blocked || !text) return; clearTimeout(blurTimer.current); setComposing(false); setInner(''); setEditVersion(version => version + 1); writeNative(''); onInput?.({ value: '' }); onChange?.(''); onClear?.(); if (focusWhenClear) requestFocus(); };
  const showClear = clearable && !blocked && text.length > 0 && (clearTrigger === 'always' || focused);
  const count = showWordLimit && Number.isFinite(maxlength) && maxlength >= 0;
  const textareaHeight = autoHeight ? Math.min(maxHeight === undefined ? Infinity : nonnegative(maxHeight, Infinity), Math.max(nonnegative(minHeight, 20), measuredHeight)) : nonnegative(height, 150);
  const common = {
    ref: native, 'default-value': initial.current, placeholder, maxlength: Number.isFinite(maxlength) ? Math.max(-1, Math.trunc(maxlength)) : -1, disabled, readonly,
    'input-filter': inputFilter, 'confirm-type': confirmType, 'confirm-enter': confirmHold, 'hold-keyboard': holdKeyboard,
    'show-soft-input-on-focus': showSoftInputOnFocus, 'set-soft-input-mode': softInputMode, 'avoid-keyboard': avoidKeyboard, 'avoid-keyboard-spacing': `${nonnegative(cursorSpacing, 0)}px`,
    bindinput: change,
    bindfocus: (event: { detail: TextFieldEvent }) => { 'background only'; clearTimeout(blurTimer.current); setFocused(true); onFocus?.(event.detail); },
    bindblur: (event: { detail: TextFieldEvent }) => { 'background only'; clearTimeout(blurTimer.current); if (clearTrigger === 'focus' && clearable) blurTimer.current = setTimeout(() => setFocused(false), 120); else setFocused(false); onBlur?.(event.detail); field?.onBlur(); },
    bindconfirm: (event: { detail: TextFieldEvent }) => { 'background only'; if (!blocked) onConfirm?.(event.detail); },
    bindkeyboardheightchange: (event: { detail: { height: number } }) => { 'background only'; onKeyboardHeightChange?.(event.detail); },
    className: `ui-textfield-native ${inputClassName}`,
  };
  // Native line is documented by Lynx; @lynx-js/types 4.1 omits this event.
  const lineBinding = { bindline: (event: { detail: { line: number } }) => { 'background only'; onLineChange?.({ lineCount: event.detail.line }); } };
  return <view className={`ui-textfield ui-${multiline ? 'textarea' : 'input'} ${compact ? 'ui-textfield-compact' : ''} ${disabled ? 'ui-textfield-disabled' : ''} ${readonly ? 'ui-textfield-readonly' : ''} ${error ? 'ui-textfield-error' : ''} ${className}`} style={{ ...style, ...(placeholderColor ? { '--ui-textfield-placeholder': placeholderColor } : {}) }} bindtap={() => { 'background only'; if (!disabled) onTap?.(); }}>
    <view className="ui-textfield-body">
      {prefix !== undefined ? <view className="ui-textfield-prefix">{node(prefix)}</view> : prefixIcon ? <view className="ui-textfield-prefix" bindtap={() => { 'background only'; if (!disabled) onClickPrefixIcon?.(); }}><Icon name={prefixIcon} size={18} /></view> : null}
      <view className="ui-textfield-editor">
        {multiline ? <textarea {...common} type={type === 'password' ? 'text' : type} maxlines={maxlines} style={{ height: `${textareaHeight}px`, textAlign: textAlign ?? (alignRight ? 'right' : 'left') }} {...lineBinding} /> : <input {...common} type={showPassword ? visiblePassword ? 'text' : 'password' : type} style={{ textAlign: textAlign ?? (alignRight ? 'right' : 'left') }} />}
        {multiline && autoHeight ? <view className="ui-textfield-mirror" user-interaction-enabled={false} accessibility-elements-hidden bindlayoutchange={event => { 'background only'; setMeasuredHeight(event.detail.height); }}>{text.split('\n').map((line, i) => <text key={i} className="ui-textfield-mirror-line">{line || '\u200b'}</text>)}</view> : null}
      </view>
      {showClear ? <view className="ui-textfield-clear" catchtap={clear} accessibility-element accessibility-traits="button" accessibility-label="清空输入"><Icon name="close-circle" size={18} /></view> : null}
      {!multiline && showPassword && !disabled ? <view className="ui-textfield-eye" catchtap={() => { 'background only'; setVisiblePassword(v => !v); }} accessibility-element accessibility-traits="button" accessibility-label={visiblePassword ? '隐藏密码' : '显示密码'}><Icon name={visiblePassword ? 'eye' : 'eye-invisible'} size={18} /></view> : null}
      {suffix !== undefined ? <view className="ui-textfield-suffix">{node(suffix)}</view> : suffixIcon ? <view className="ui-textfield-suffix" bindtap={() => { 'background only'; if (!disabled) onClickSuffixIcon?.(); }}><Icon name={suffixIcon} size={18} /></view> : null}
      {!multiline && count ? <text className="ui-textfield-count">{text.length}/{maxlength}</text> : null}
    </view>
    {multiline && count ? <text className="ui-textfield-count">{text.length}/{maxlength}</text> : null}
  </view>;
});
