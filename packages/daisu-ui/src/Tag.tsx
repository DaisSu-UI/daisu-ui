import { useLocale } from './useLocale.js';
import { useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import { useConfigProvider } from './configContext.js';
import { Icon } from './Icon.js';

export type TagTone = 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'neutral';
export type TagType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'volcano' | 'lightblue' | 'cyan' | 'pink' | 'purple';
export type TagSize = 'small' | 'medium' | 'default' | 'large' | 'extra-large';
export type TagVariant = 'light' | 'dark' | 'plain' | 'dashed' | 'text';
export type TagProps = {
  type?: TagType;
  size?: TagSize;
  variant?: TagVariant;
  /** Compatibility aliases. Explicit type / variant take priority. */
  tone?: TagTone;
  plain?: boolean;
  label?: string;
  children?: ReactNode;
  icon?: string;
  iconSlot?: ReactNode;
  add?: ReactNode;
  color?: string;
  bgColor?: string;
  round?: boolean;
  mark?: boolean;
  closable?: boolean;
  dynamic?: boolean;
  onTap?: () => void;
  onClose?: () => void;
  onConfirm?: (detail: { value: string }) => void;
  className?: string;
  style?: CSSProperties;
};
const palette = { default: '#4e5369', primary: '#1c64fd', danger: '#f14646', warning: '#f57f00', success: '#12b886', volcano: '#fd5c1c', lightblue: '#1cb2fd', cyan: '#22b8cf', pink: '#ff357c', purple: '#8059f3' } as const;

/** Editor mounts afresh for each addition; native focus and confirm work in Flutter. */
function TagEditor({ finish }: { finish: (value?: string) => void }) {
  const { t: localeText } = useLocale();

  const input = useRef<NodesRef>(null);
  const completed = useRef(false);
  useEffect(() => { input.current?.invoke({ method: 'focus' }).exec(); }, []);
  const complete = (value?: string) => {
    'background only';
    if (completed.current) return;
    completed.current = true;
    finish(value);
  };
  return <input ref={input} className="ui-tag-input" type="text" default-value="" placeholder={localeText('tag.input')} maxlength={-1} confirm-type="done" avoid-keyboard avoid-keyboard-spacing="12px" bindconfirm={event => { 'background only'; complete(event.detail.value); }} bindblur={() => { 'background only'; complete(); }} />;
}

export function Tag({ type, tone, size: sizeProp, variant, plain, label = '', children, icon = '', iconSlot, add, color, bgColor, round: roundProp, mark = false, closable = false, dynamic = false, onTap, onClose, onConfirm, className = '', style }: TagProps) {
  const { t: localeText } = useLocale();

  const config = useConfigProvider().tag;
  const size = sizeProp ?? config.size ?? 'default', round = roundProp ?? config.round ?? false;
  const [editing, setEditing] = useState(false);
  const effectiveType = type ?? (tone === 'info' ? 'primary' : tone === 'neutral' ? 'default' : tone) ?? 'default';
  const effectiveVariant = variant ?? (plain !== undefined ? plain ? 'plain' : 'dark' : config.variant ?? 'dark');
  const content = children ?? label;
  const glyphSize = size === 'small' ? 11 : size === 'large' || size === 'extra-large' ? 14 : 12;
  const outlined = effectiveVariant === 'plain' || effectiveVariant === 'dashed';
  const foreground: CSSProperties = { color };
  const rootStyle: CSSProperties = { ...foreground, ...(bgColor && (effectiveVariant === 'dark' || effectiveVariant === 'light') ? { backgroundColor: bgColor } : {}), ...style };
  const glyphColor = color || (effectiveVariant === 'dark' ? '#fff' : effectiveType === 'default' ? 'var(--cso-ui-text-regular)' : palette[effectiveType]);
  const glyph = (name: string) => <view className="ui-tag-glyph"><Icon name={name} size={glyphSize} color={glyphColor} className="ui-tag-glyph-light" />{!color && effectiveType === 'default' && effectiveVariant !== 'dark' ? <Icon name={name} size={glyphSize} color="var(--cso-ui-text-regular)" className="ui-tag-glyph-dark" /> : null}</view>;
  const tap = () => {
    'background only';
    if (dynamic) { setEditing(true); return; }
    onTap?.();
  };
  const finish = (value?: string) => {
    'background only';
    setEditing(false);
    if (value !== undefined) onConfirm?.({ value });
  };
  return <view className={`ui-tag ui-tag-${effectiveType} ui-tag-${effectiveVariant} ui-tag-size-${size} ${round ? 'ui-tag-round' : ''} ${mark ? 'ui-tag-mark' : ''} ${dynamic ? 'ui-tag-dynamic' : ''} ${editing && dynamic ? 'ui-tag-editing' : ''} ${!color && effectiveType === 'default' && effectiveVariant !== 'dark' ? 'ui-tag-auto-glyph' : ''} ${className}`} style={rootStyle} bindtap={tap} accessibility-element={dynamic || !!onTap} accessibility-traits={dynamic || onTap ? 'button' : 'text'} accessibility-label={dynamic ? localeText('tag.add') : typeof content === 'string' ? content : undefined}>
    {outlined ? <view className="ui-tag-border" style={{ borderColor: bgColor }} /> : null}
    {dynamic ? editing ? <TagEditor finish={finish} /> : add !== undefined ? <view className="ui-tag-content" style={foreground}>{add}</view> : <view className="ui-tag-content" style={foreground}>{glyph('plus')}<text className="ui-tag-label" style={foreground}>{localeText('tag.add')}</text></view> : <>
      {iconSlot !== undefined ? <view className="ui-tag-icon" style={foreground}>{iconSlot}</view> : icon ? glyph(icon) : null}
      {typeof content === 'string' || typeof content === 'number' ? <text className="ui-tag-label" style={foreground}>{content}</text> : <view className="ui-tag-content" style={foreground}>{content}</view>}
      {closable ? <view className="ui-tag-close" accessibility-element accessibility-traits="button" accessibility-label={localeText('tag.close')} catchtap={() => { 'background only'; onClose?.(); }}>{glyph('close')}</view> : null}
    </>}
  </view>;
}
