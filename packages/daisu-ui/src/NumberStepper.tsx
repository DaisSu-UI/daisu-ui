import { useEffect } from '@lynx-js/react';
import { SyncedInput } from './SyncedInput.js';

type NumberStepperProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
};

function numericValue(value: string, fallback: number) {
  const parsed = Number(value);
  return value !== '' && Number.isFinite(parsed) ? parsed : fallback;
}

export function NumberStepper({ value, onChange, onBlur, min = 0, max = Number.MAX_SAFE_INTEGER, step = 1, disabled = false }: NumberStepperProps) {
  const precision = (String(step).split('.')[1] ?? '').length;
  useEffect(() => {
    if (value === '') onChange(min.toFixed(precision));
  }, []);
  const current = numericValue(value, min);
  const decreaseDisabled = disabled || current <= min;
  const increaseDisabled = disabled || current >= max;
  const update = (next: number) => {
    const factor = 10 ** precision;
    const bounded = Math.min(max, Math.max(min, next));
    onChange((Math.round(bounded * factor) / factor).toFixed(precision));
  };
  const normalize = () => {
    update(numericValue(value, min));
    onBlur?.();
  };

  return <view className={`number-stepper ${disabled ? 'number-stepper-disabled' : ''}`}>
    <view className={`number-stepper-button ${decreaseDisabled ? 'number-stepper-button-disabled' : ''}`} bindtap={() => { if (!decreaseDisabled) update(current - step); }}><text>−</text></view>
    <SyncedInput
      className="number-stepper-input"
      value={value}
      maxlength={precision ? undefined : String(Math.max(Math.abs(min), Math.abs(max))).length}
      onInput={next => {
        if (disabled) return;
        if (!precision) { onChange(next.replace(/[^0-9]/g, '')); return; }
        if (/^-?\d*(\.\d*)?$/.test(next)) onChange(next);
      }}
      onBlur={normalize}
    />
    <view className={`number-stepper-button ${increaseDisabled ? 'number-stepper-button-disabled' : ''}`} bindtap={() => { if (!increaseDisabled) update(current + step); }}><text>＋</text></view>
  </view>;
}
