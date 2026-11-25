export type RadioOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type RadioGroupProps = {
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function RadioGroup({ value, options, onChange, disabled = false }: RadioGroupProps) {
  return <view className={`radio-group ${disabled ? 'radio-group-disabled' : ''}`}>
    {options.map(option => {
      const active = value === option.value;
      const optionDisabled = disabled || option.disabled;
      return <view
        className={`radio-option ${active ? 'radio-option-active' : ''} ${optionDisabled ? 'radio-option-disabled' : ''}`}
        key={option.value}
        bindtap={() => { if (!optionDisabled) onChange(option.value); }}
      >
        <view className="radio-option-icon">{active ? <view className="radio-option-dot" /> : null}</view>
        <text>{option.label}</text>
      </view>;
    })}
  </view>;
}
