import { useLocale } from './useLocale.js';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
export type ChoiceValue = string | number | boolean;
export type ChoiceType = 'circle' | 'square' | 'dot' | 'button';
export type ChoiceStyle = { type?: ChoiceType; checkedColor?: string; uncheckedColor?: string; disabled?: boolean | null; readonly?: boolean | null; placement?: 'left' | 'right'; direction?: 'horizontal' | 'vertical'; size?: 'large'; maxWidth?: string; labelClassName?: string; className?: string; style?: CSSProperties; renderIcon?: (state: { isChecked: boolean }) => ReactNode; children?: ReactNode };
export function choiceDefaults(props?: ChoiceStyle): ChoiceStyle { if (!props) return {}; const { type, checkedColor, uncheckedColor, disabled, readonly, placement, direction, size, maxWidth } = props; return { type, checkedColor, uncheckedColor, disabled, readonly, placement, direction, size, maxWidth }; }
export function Choice({ checked, indeterminate = false, type = 'circle', disabled = false, readonly = false, placement = 'left', direction = 'vertical', checkedColor, uncheckedColor, size, maxWidth, labelClassName = '', className = '', style, renderIcon, children, onTap }: ChoiceStyle & { checked: boolean; indeterminate?: boolean; onTap: () => void }) {
  const { t: localeText } = useLocale();

  const glyph = indeterminate && type !== 'button' ? 'minus-circle-fill' : type === 'button' ? 'check' : checked ? type === 'dot' ? 'check-circle-radio-fill' : type === 'square' ? 'check-square-fill' : 'check-circle-fill' : type === 'square' ? 'uncheck-square' : 'uncheck-circle';
  const active = checked || indeterminate;
  const color = active ? checkedColor : uncheckedColor, dimension = type === 'button' ? 10 : size === 'large' ? 26 : 22;
  const icon = renderIcon ? renderIcon({ isChecked: checked }) : type !== 'button' || checked ? <view className="ui-choice-shape">{color || type === 'button' ? <Icon name={glyph} size={dimension} color={type === 'button' ? '#fff' : color} /> : <><Icon className="ui-choice-light" name={glyph} size={dimension} color={active ? '#1c64fd' : '#e5e6eb'} /><Icon className="ui-choice-dark" name={glyph} size={dimension} color={active ? '#5b90ff' : '#3b4055'} /></>}</view> : null;
  return <view className={`ui-choice ui-choice-${type} ui-choice-${placement} ui-choice-${direction} ${active ? 'ui-choice-checked' : ''} ${disabled ? 'ui-choice-disabled' : ''} ${size === 'large' ? 'ui-choice-large' : ''} ${className}`} style={{ ...(checkedColor ? { '--ui-choice-color': checkedColor } : {}), ...style }} catchtap={() => { 'background only'; if (!disabled && !readonly) onTap(); }} accessibility-element accessibility-traits="button" accessibility-label={`${typeof children === 'string' ? children : ''}${checked ? localeText('common.selected') : localeText('common.unselected')}${disabled ? localeText('common.disabled') : ''}`}>
    {children !== undefined ? <view className={`ui-choice-label ${labelClassName}`} style={maxWidth ? { maxWidth } : undefined}>{typeof children === 'string' || typeof children === 'number' ? <text>{children}</text> : children}</view> : null}{icon}
  </view>;
}
