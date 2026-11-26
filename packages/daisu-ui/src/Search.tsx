import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { Input } from './Input.js';
import type { InputProps, InputRef, TextFieldEvent } from './Input.js';
export type SearchRef = InputRef;
export type SearchProps = {
  value?: string; defaultValue?: string; onChange?: (event: { value: string }) => void;
  type?: InputProps['type']; placeholder?: string; cancelTxt?: string; variant?: 'plain' | 'filled' | 'light';
  hideCancel?: boolean; disabled?: boolean; maxlength?: number | string; placeholderLeft?: boolean;
  focus?: boolean; focusWhenClear?: boolean; placeholderColor?: string;
  prefix?: ReactNode; inputSuffix?: ReactNode; suffix?: ReactNode;
  onSearch?: (event: { value: string }) => void; onCancel?: (event: { value: string }) => void; onClear?: () => void;
  onFocus?: (event: TextFieldEvent) => void; onBlur?: (event: TextFieldEvent) => void; onTap?: () => void;
  inputClassName?: string; className?: string; style?: CSSProperties;
};
const content = (node: ReactNode) => typeof node === 'string' || typeof node === 'number' ? <text>{node}</text> : node;
function Glyph({ clear = false }: { clear?: boolean }) {
  const name = clear ? 'close-circle-fill' : 'search-line';
  return <view className={`ui-search-glyph ${clear ? 'ui-search-clear-glyph' : ''}`}>
    <Icon name={name} size={clear ? 20 : 18} color={clear ? 'var(--cso-ui-disabled-text)' : 'var(--cso-ui-text-regular)'} className="ui-search-glyph-light" />
    <Icon name={name} size={clear ? 20 : 18} color={clear ? 'var(--cso-ui-disabled-text)' : 'var(--cso-ui-text-regular)'} className="ui-search-glyph-dark" />
  </view>;
}
export const Search = forwardRef<SearchRef, SearchProps>(function Search({ value, defaultValue = '', onChange, type = 'text', placeholder = '搜索', cancelTxt = '取消', variant = 'plain', hideCancel = false, disabled = false, maxlength = -1, placeholderLeft = false, focus, focusWhenClear = false, placeholderColor, prefix, inputSuffix, suffix, onSearch, onCancel, onClear, onFocus, onBlur, onTap, inputClassName = '', className = '', style }, ref) {
  const [inner, setInner] = useState(defaultValue), [active, setActive] = useState(!!focus && !disabled);
  const text = value === undefined ? inner : value;
  const input = useRef<InputRef>(null), blurTimer = useRef<ReturnType<typeof setTimeout>>();
  const requestFocus = () => { 'background only'; if (disabled) return; clearTimeout(blurTimer.current); setActive(true); input.current?.focus(); };
  const requestBlur = () => { 'background only'; input.current?.blur(); setActive(false); };
  useImperativeHandle(ref, () => ({ focus: requestFocus, blur: requestBlur, setSelectionRange: (start, end) => { 'background only'; input.current?.setSelectionRange(start, end); } }), [disabled]);
  useEffect(() => { if (focus === true) requestFocus(); else if (focus === false) requestBlur(); }, [focus, disabled]);
  useEffect(() => () => clearTimeout(blurTimer.current), []);
  const update = (next: string) => { 'background only'; if (disabled) return; setInner(next); onChange?.({ value: next }); };
  const clear = () => { 'background only'; if (disabled || !text) return; update(''); onClear?.(); if (focusWhenClear) requestFocus(); else requestBlur(); };
  const cover = !text && !active && !placeholderLeft;
  const limit = Number(maxlength);
  return <view className={`ui-search ui-search-${variant} ${disabled ? 'ui-search-disabled' : ''} ${className}`} style={style}>
    <view className="ui-search-block" bindtap={() => { 'background only'; if (disabled) onTap?.(); }}>
      {variant === 'plain' ? <view className="ui-search-outline" user-interaction-enabled={false} /> : null}
      {prefix !== undefined ? <view className="ui-search-prefix">{content(prefix)}</view> : null}
      <view className="ui-search-field">
        {!cover ? <Glyph /> : null}
        <view className="ui-search-edit-area">
          <Input ref={input} compact type={type} value={text} onChange={update} placeholder={cover ? '' : placeholder} placeholderColor={placeholderColor} maxlength={Number.isFinite(limit) ? limit : -1} disabled={disabled} confirmType="search" className="ui-search-editor" inputClassName={inputClassName} onFocus={event => { 'background only'; clearTimeout(blurTimer.current); setActive(true); onFocus?.(event); }} onBlur={event => { 'background only'; clearTimeout(blurTimer.current); blurTimer.current = setTimeout(() => { setActive(false); onBlur?.(event); }, 150); }} onConfirm={event => { 'background only'; if (!disabled) onSearch?.({ value: event.value }); }} />
          {cover ? <view className="ui-search-cover" bindtap={requestFocus} accessibility-element accessibility-traits="button" accessibility-label={placeholder}><Glyph /><text className="ui-search-placeholder" style={placeholderColor ? { color: placeholderColor } : undefined}>{placeholder}</text></view> : null}
        </view>
        {text && !disabled ? <view className="ui-search-clear" catchtap={clear} accessibility-element accessibility-traits="button" accessibility-label="清空搜索"><Glyph clear /></view> : null}
        {inputSuffix !== undefined ? <view className="ui-search-input-suffix">{content(inputSuffix)}</view> : null}
      </view>
    </view>
    {!hideCancel ? suffix !== undefined ? <view className="ui-search-suffix">{content(suffix)}</view> : <text className="ui-search-cancel" bindtap={() => { 'background only'; onCancel?.({ value: text }); }}>{cancelTxt}</text> : null}
  </view>;
});
