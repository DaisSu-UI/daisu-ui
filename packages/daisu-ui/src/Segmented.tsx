import { useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import { segmentedIndex, segmentedOptions } from './segmentedModel.js';
import type { SegmentedInput, SegmentedOption, SegmentedValue } from './segmentedModel.js';

export type SegmentedProps<T = unknown> = {
  options?: readonly SegmentedInput<T>[];
  value?: SegmentedValue;
  defaultValue?: SegmentedValue;
  onChange?: (option: SegmentedOption<T>) => void;
  onClick?: (option: SegmentedOption<T>) => void;
  disabled?: boolean;
  theme?: 'card' | 'outline';
  renderLabel?: (state: { option: SegmentedOption<T>; active: boolean; disabled: boolean }) => ReactNode;
  className?: string;
};

export function Segmented<T = unknown>({ options = [], value, defaultValue, onChange, onClick, disabled = false, theme = 'card', renderLabel, className = '' }: SegmentedProps<T>) {
  const [inner, setInner] = useState(defaultValue);
  const items = segmentedOptions(options);
  const selected = segmentedIndex(items, value ?? inner);
  const choose = (index: number) => {
    'background only';
    const option = items[index];
    if (!option || disabled || option.disabled) return;
    if (selected !== index) {
      if (value === undefined) setInner(option.value);
      onChange?.(option);
    }
    onClick?.(option);
  };
  return <view className={`ui-segmented ui-segmented-${theme} ${disabled ? 'ui-segmented-disabled' : ''} ${className}`}>
    <view className="ui-segmented-track">
      {theme === 'card' && selected >= 0 ? <view className="ui-segmented-slider" user-interaction-enabled={false} style={{ width: `${100 / items.length}%`, transform: `translateX(${selected * 100}%)` }} /> : null}
      {items.map((option, index) => {
        const active = selected === index;
        const blocked = disabled || !!option.disabled;
        return <view key={`${typeof option.value}:${option.value}`} className={`ui-segmented-item ${active ? 'ui-segmented-item-active' : ''} ${blocked ? 'ui-segmented-item-disabled' : ''} ${index === 0 ? 'ui-segmented-item-first' : ''} ${index === items.length - 1 ? 'ui-segmented-item-last' : ''}`} style={{ width: `${100 / items.length}%` }} accessibility-element accessibility-traits="button" accessibility-label={`${option.value}${active ? '，已选中' : ''}${blocked ? '，禁用' : ''}`} bindtap={() => { 'background only'; choose(index); }}>
          {renderLabel ? renderLabel({ option, active, disabled: blocked }) : <text className="ui-segmented-label">{option.value}</text>}
          {theme === 'outline' ? <view className="ui-segmented-outline-border" user-interaction-enabled={false} /> : null}
        </view>;
      })}
    </view>
  </view>;
}
