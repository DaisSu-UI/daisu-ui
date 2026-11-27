import { useLocale } from './useLocale.js';
import type { JSX } from '@lynx-js/react';
import { NumberStepper } from './NumberStepper.js';
import { RadioGroup } from './legacy/RadioGroup.js';
import type { RadioOption } from './legacy/RadioGroup.js';
import { SyncedInput } from './SyncedInput.js';
import { SyncedTextarea } from './SyncedTextarea.js';

type CommonProps = {
  label: string;
  required?: boolean;
  last?: boolean;
  disabled?: boolean;
  error?: string;
};

type FormInputRowProps = CommonProps & {
  value: string;
  onInput: (value: string) => void;
  maxlength?: number;
  placeholder?: string;
  clearable?: boolean;
  onBlur?: () => void;
};

type FormSelectRowProps = CommonProps & {
  value?: string;
  placeholder: string;
  onTap: () => void;
  onClear: () => void;
  clearable?: boolean;
};

type FormTextareaRowProps = CommonProps & {
  value: string;
  onInput: (value: string) => void;
  onBlur?: () => void;
  maxlength?: number;
  maxlines?: number;
  placeholder?: string;
  showWordLimit?: boolean;
};

type FormRadioRowProps = CommonProps & {
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
};

type FormNumberRowProps = CommonProps & {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
};

type FormFieldRowProps = CommonProps & {
  children: JSX.Element;
};

function FieldLabel({ label, required }: Pick<CommonProps, 'label' | 'required'>) {
  return <view className="form-field-label">{required ? <text className="form-field-required">*</text> : null}<text>{label}</text></view>;
}

export function FormFieldRow({ label, required = false, disabled = false, last = false, error, children }: FormFieldRowProps) {
  return <view className={`form-field-row ${last ? 'form-field-row-last' : ''} ${disabled ? 'form-field-disabled' : ''} ${error ? 'form-field-row-error' : ''}`}>
    <FieldLabel label={label} required={required} />
    <view className="form-field-body">
      {children}
      {error ? <text className="form-field-error">{error}</text> : null}
    </view>
    <view className="form-field-divider" />
  </view>;
}

function ClearButton({ onClear }: { onClear: () => void }) {
  return <view className="form-field-clear" bindtap={onClear}><text>×</text></view>;
}

export function FormInputRow({ label, value, onInput, onBlur, error, required = false, disabled = false, last = false, maxlength, placeholder, clearable = true }: FormInputRowProps) {
  const { t: localeText } = useLocale();
  placeholder ??= localeText('common.input');

  return <FormFieldRow label={label} required={required} disabled={disabled} last={last} error={error}>
    <view className="form-field-control">
      <SyncedInput className="form-field-input" value={value} maxlength={maxlength} placeholder={placeholder} onInput={onInput} onBlur={onBlur} />
      {clearable && value ? <ClearButton onClear={() => onInput('')} /> : null}
    </view>
  </FormFieldRow>;
}

export function FormSelectRow({ label, value, placeholder, onTap, onClear, error, required = false, disabled = false, last = false, clearable = true }: FormSelectRowProps) {
  return <FormFieldRow label={label} required={required} disabled={disabled} last={last} error={error}>
    <view className="form-field-control form-field-select-control">
      <view className="form-field-select-value" bindtap={() => { if (!disabled) onTap(); }}>
        <text className={value ? 'form-field-value' : 'form-field-placeholder'}>{value || placeholder}</text>
      </view>
      {clearable && value && !disabled ? <ClearButton onClear={onClear} /> : null}
      <view className="form-field-chevron" bindtap={() => { if (!disabled) onTap(); }}><text>›</text></view>
    </view>
  </FormFieldRow>;
}

export function FormRadioRow({ label, value, options, onChange, error, required = false, disabled = false, last = false }: FormRadioRowProps) {
  return <FormFieldRow label={label} required={required} disabled={disabled} last={last} error={error}>
    <RadioGroup value={value} options={options} onChange={onChange} disabled={disabled} />
  </FormFieldRow>;
}

export function FormNumberRow({ label, value, onChange, onBlur, min, max, step, error, required = false, disabled = false, last = false }: FormNumberRowProps) {
  return <FormFieldRow label={label} required={required} disabled={disabled} last={last} error={error}>
    <NumberStepper value={value} onChange={onChange} onBlur={onBlur} min={min} max={max} step={step} disabled={disabled} />
  </FormFieldRow>;
}

export function FormTextareaRow({ label, value, onInput, onBlur, error, required = false, disabled = false, last = false, maxlength = 2000, maxlines = 6, placeholder, showWordLimit = true }: FormTextareaRowProps) {
  const { t: localeText } = useLocale();
  placeholder ??= localeText('common.input');

  return <view className={`form-textarea-row ${last ? 'form-field-row-last' : ''} ${disabled ? 'form-field-disabled' : ''} ${error ? 'form-field-row-error' : ''}`}>
    <FieldLabel label={label} required={required} />
    <view className="form-textarea-box">
      <SyncedTextarea className="form-textarea-input" value={value} maxlength={maxlength} maxlines={maxlines} placeholder={placeholder} onInput={next => { if (!disabled) onInput(next); }} onBlur={onBlur} />
      {showWordLimit ? <text className="form-textarea-count">{value.length} / {maxlength}</text> : null}
    </view>
    {error ? <text className="form-textarea-error">{error}</text> : null}
    <view className="form-field-divider" />
  </view>;
}
