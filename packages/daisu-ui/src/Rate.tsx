import { FormFieldContext } from './formContext.js';
import { useContext, useState } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { iconPaths } from './icons/paths.js';
import type { IconName } from './icons/paths.js';
import { loadingDimension } from './loadingModel.js';
import { nextRateValue, rateCount, rateScore, rateSvg } from './rateModel.js';

export type RateProps = {
  value?: number | null;
  defaultValue?: number;
  onChange?: (event: { value: number }) => void;
  num?: number;
  readonly?: boolean;
  disabled?: boolean;
  size?: number | string;
  space?: number | string;
  color?: string;
  activeColor?: string | readonly string[];
  disabledColor?: string;
  icon?: IconName;
  activeIcon?: IconName;
  allowHalf?: boolean;
  clearable?: boolean;
  block?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Rate({ value, defaultValue = 0, onChange, num = 5, readonly = false, disabled: disabledProp, size = 24, space = 6, color, activeColor = '#faad14', disabledColor, icon = 'star-fill', activeIcon = 'star-fill', allowHalf = false, clearable = false, block = false, className = '', style }: RateProps) {
  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const [inner, setInner] = useState(defaultValue);
  const count = rateCount(num); const score = rateScore(value === undefined ? inner : value, count);
  const chosen = typeof activeColor === 'string' ? activeColor : activeColor[score <= count / 2 ? 0 : 1] ?? activeColor[0] ?? '#faad14';
  const select = (next: number) => { 'background only'; if (readonly || disabled) return; const nextValue = nextRateValue(score, next, allowHalf, clearable); if (nextValue === score) return; if (value === undefined) setInner(nextValue); onChange?.({ value: nextValue }); };
  const controlStyle = { '--ui-rate-size': loadingDimension(size), '--ui-rate-space': typeof space === 'number' ? `${Math.max(0, space)}px` : loadingDimension(space), ...style };
  const idle = rateSvg(iconPaths[icon] ?? '', color ?? '#c9cbd4'); const filled = rateSvg(iconPaths[activeIcon] ?? '', disabled && disabledColor ? disabledColor : chosen);
  return <view className={`ui-rate ${block ? 'ui-rate-block' : ''} ${disabled ? 'ui-rate-disabled' : ''} ${className}`} style={controlStyle}>
    {Array.from({ length: count }, (_, index) => {
      const fraction = Math.max(0, Math.min(1, score - index));
      return <view className="ui-rate-item" key={index}>
      {fraction < 1 ? <view className="ui-rate-empty" style={{ width: `${(1 - fraction) * 100}%` }}>
        {color ? <svg className="ui-rate-glyph" content={idle} /> : <><svg className="ui-rate-glyph ui-rate-default-light" content={idle} /><svg className="ui-rate-glyph ui-rate-default-dark" content={rateSvg(iconPaths[icon] ?? '', '#6b7085')} /></>}
      </view> : null}
      {fraction > 0 ? <view className="ui-rate-fill" style={{ width: `${fraction * 100}%` }}><svg className="ui-rate-glyph" content={filled} /></view> : null}
      {allowHalf ? <view className="ui-rate-hit ui-rate-hit-half" bindtap={() => select(index + .5)} accessibility-element accessibility-traits="button" accessibility-label={`${index + .5}分`} /> : null}
      <view className={`ui-rate-hit ${allowHalf ? 'ui-rate-hit-full' : ''}`} bindtap={() => select(index + 1)} accessibility-element accessibility-traits="button" accessibility-label={`${index + 1}分`} />
    </view>;
    })}
  </view>;
}
