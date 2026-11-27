import { useConfigProvider } from './configContext.js';
import type { ReactNode } from '@lynx-js/react';
import { usePressState } from './usePressState.js';

export type ButtonTone = 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'neutral';
export type ButtonVariant = 'solid' | 'plain' | 'dashed' | 'soft' | 'subtle' | 'text';
export type ButtonSize = 'mini' | 'small' | 'medium' | 'large';

export type ButtonProps = {
  label?: string;
  onTap?: () => void;
  tone?: ButtonTone;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  round?: boolean;
  hairline?: boolean;
  className?: string;
  accessibilityLabel?: string;
};

/** A Lynx-native command button using bindtap rather than browser click events. */
export function Button({ label, onTap, tone: toneProp, variant: variantProp, size: sizeProp, block = false, loading = false, disabled = false, icon, round: roundProp, hairline = false, className = '', accessibilityLabel }: ButtonProps) {
  const config = useConfigProvider().button;
  const tone = toneProp ?? config.tone ?? config.type ?? 'primary', variant = variantProp ?? (config.variant === 'base' ? 'solid' : config.variant) ?? 'solid', size = sizeProp ?? config.size ?? 'medium', round = roundProp ?? config.round ?? false;
  const inactive = disabled || loading;
  const press = usePressState(!inactive);
  const handleTap = () => {
    'background only';
    if (!inactive) onTap?.();
  };
  return <view
    className={`ui-button ui-button-${tone} ui-button-${variant} ui-button-${size} ${block ? 'ui-button-block' : ''} ${disabled ? 'ui-button-disabled' : ''} ${inactive ? '' : 'ui-button-interactive'} ${press.pressed ? 'ui-button-pressed' : ''} ${round ? 'ui-button-round' : ''} ${hairline ? 'ui-button-hairline' : ''} ${!label && icon ? 'ui-button-icon-only' : ''} ${className}`}
    bindtap={handleTap}
    {...press.events}


    bindtouchmove={press.end}


    accessibility-element
    accessibility-traits="button"
    accessibility-label={accessibilityLabel ?? label}
  >
    <view className="ui-button-border" />
    {loading ? <view className="ui-button-spinner"><view className="ui-button-spinner-ring" /></view> : icon ? <view className="ui-button-icon">{typeof icon === 'string' ? <text>{icon}</text> : icon}</view> : null}
    {label ? <text className="ui-button-label">{label}</text> : null}
  </view>;
}
