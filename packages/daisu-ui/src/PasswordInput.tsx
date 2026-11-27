import { useLocale } from './useLocale.js';
import { useContext } from '@lynx-js/react';
import type { CSSProperties, CommonEvent } from '@lynx-js/types';
import { FormFieldContext } from './formContext.js';
import { passwordGutter, passwordLength } from './passwordInputModel.js';

export type PasswordInputProps = {
  value?: string;
  mask?: boolean;
  info?: string;
  errorInfo?: string;
  gutter?: number | string;
  length?: number;
  focused?: boolean;
  disabled?: boolean;
  onFocus?: (event: CommonEvent) => void;
  className?: string;
  style?: CSSProperties;
};

/** Display only: pair with a controlled Keyboard to handle input. */
export function PasswordInput({ value = '', mask = true, info = '', errorInfo = '', gutter = 0, length = 6, focused = true, disabled: disabledProp, onFocus, className = '', style }: PasswordInputProps) {
  const { t: localeText } = useLocale();

  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const count = passwordLength(length), gap = passwordGutter(gutter), characters = Array.from(value).slice(0, count);
  return <view className={`ui-password-input ${disabled ? 'ui-password-input-disabled' : ''} ${className}`} style={style}>
    <view className="ui-password-input-security" accessibility-element accessibility-traits={disabled ? 'none' : 'button'}
      accessibility-label={localeText('password.progress', { label: mask ? localeText('password.label') : localeText('password.code'), entered: characters.length, total: count, value: mask || !characters.length ? '' : `, ${characters.join('')}`, disabled: disabled ? localeText('common.isDisabled') : '' })}
      bindtap={(event: CommonEvent) => { 'background only'; if (!disabled) onFocus?.(event); }}>
      {Array.from({ length: count }, (_, index) => <view key={index} className={`ui-password-input-item ${gap.spaced ? '' : 'ui-password-input-bordered'} ${index === 0 ? 'ui-password-input-first' : ''} ${index === count - 1 ? 'ui-password-input-last' : ''}`} style={index > 0 && gap.spaced ? { marginLeft: gap.value } : undefined}>
        {focused && !disabled && index === characters.length ? <view className="ui-password-input-cursor" /> : characters[index] ? mask ? <view className="ui-password-input-dot" /> : <text className="ui-password-input-value">{characters[index]}</text> : null}
      </view>)}
    </view>
    {errorInfo || info ? <text className={`ui-password-input-info ${errorInfo ? 'ui-password-input-error' : ''}`} accessibility-element accessibility-label={errorInfo || info}>{errorInfo || info}</text> : null}
  </view>;
}
