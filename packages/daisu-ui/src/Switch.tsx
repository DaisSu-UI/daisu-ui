import { useLocale } from './useLocale.js';
import { FormFieldContext } from './formContext.js';
import { useContext, useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { Loading } from './Loading.js';
import type { LoadingProps } from './Loading.js';
import { loadingDimension } from './loadingModel.js';

export type SwitchValue = boolean | string | number;
export type SwitchProps = {
  value?: SwitchValue;
  defaultValue?: SwitchValue;
  onChange?: (event: { value: SwitchValue }) => void;
  activeValue?: SwitchValue;
  inactiveValue?: SwitchValue;
  activeColor?: string;
  inactiveColor?: string;
  size?: number | string;
  shape?: 'round' | 'square';
  disabled?: boolean;
  loading?: boolean;
  loadingProps?: Partial<LoadingProps>;
  activeText?: string;
  inactiveText?: string;
  activeIcon?: string | ReactNode;
  inactiveIcon?: string | ReactNode;
  activeActionIcon?: string | ReactNode;
  inactiveActionIcon?: string | ReactNode;
  beforeChange?: (value: SwitchValue) => boolean | Promise<boolean>;
  className?: string;
  style?: CSSProperties;
  accessibilityLabel?: string;
};

export function Switch({ value, defaultValue = false, onChange, activeValue = true, inactiveValue = false, activeColor, inactiveColor, size = 26, shape = 'round', disabled: disabledProp, loading = false, loadingProps, activeText = '', inactiveText = '', activeIcon, inactiveIcon, activeActionIcon, inactiveActionIcon, beforeChange, className = '', style, accessibilityLabel }: SwitchProps) {
  const { t: localeText } = useLocale();
  accessibilityLabel ??= localeText('switch.label');

  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const [inner, setInner] = useState(defaultValue);
  const [pending, setPending] = useState(false);
  const sequence = useRef(0); const busy = useRef(false);
  useEffect(() => { sequence.current++; busy.current = false; setPending(false); return () => { sequence.current++; }; }, [value, activeValue, inactiveValue, disabled, loading]);
  const active = (value === undefined ? inner : value) === activeValue;
  const icon = active ? activeIcon : inactiveIcon;
  const actionIcon = active ? activeActionIcon : inactiveActionIcon;
  const toggle = async () => {
    'background only';
    if (disabled || loading || busy.current) return;
    const next = active ? inactiveValue : activeValue; const token = ++sequence.current; busy.current = true;
    try {
      const decision = beforeChange?.(next) ?? true;
      if (typeof decision !== 'boolean') setPending(true);
      if (!await decision || sequence.current !== token) return;
      if (value === undefined) setInner(next);
      onChange?.({ value: next });
    } catch { /* A rejected guard cancels the requested change. */ }
    finally { if (sequence.current === token) { busy.current = false; setPending(false); } }
  };
  const controlStyle = { '--ui-switch-size': loadingDimension(size), backgroundColor: active ? activeColor : inactiveColor, ...style };
  return <view className={`ui-switch ui-switch-${shape} ${active ? 'ui-switch-active' : ''} ${disabled ? 'ui-switch-disabled' : ''} ${className}`} style={controlStyle} bindtap={() => { void toggle(); }} accessibility-element accessibility-traits="button" accessibility-label={`${accessibilityLabel}，${active ? localeText('switch.on') : localeText('switch.off')}`}>
    <view className="ui-switch-label">{icon ? typeof icon === 'string' ? <Icon name={icon} size={13} color="#fff" /> : icon : <text>{active ? activeText : inactiveText}</text>}</view>
    <view className="ui-switch-action">{loading || pending ? <Loading size={14} color={activeColor ?? '#1c64fd'} {...loadingProps} /> : actionIcon ? typeof actionIcon === 'string' ? <Icon name={actionIcon} size={16} color={active ? activeColor ?? '#1c64fd' : 'var(--cso-ui-text-placeholder)'} /> : actionIcon : null}</view>
  </view>;
}
