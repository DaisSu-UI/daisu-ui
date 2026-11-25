import { createContext, useContext, useRef, useState } from '@lynx-js/react';
import { Choice, choiceDefaults } from './choice.js';
import type { ChoiceStyle, ChoiceValue } from './choice.js';
import { FormFieldContext } from './formContext.js';
import { RadioGroup as LegacyRadioGroup } from './legacy/RadioGroup.js';
import type { RadioOption } from './legacy/RadioGroup.js';
export type { RadioOption } from './legacy/RadioGroup.js';
export type RadioProps = ChoiceStyle & { value: ChoiceValue };
export type RadioGroupProps<T extends ChoiceValue = ChoiceValue> = ChoiceStyle & { value?: T | null; defaultValue?: T | null; onChange?: (value: T | null) => void; allowUncheck?: boolean; options?: RadioOption[] };
const Context = createContext<{ props: RadioGroupProps; value: ChoiceValue | null | undefined; select: (value: ChoiceValue) => void } | undefined>(undefined);
export function RadioGroup(props: { value: string; options: RadioOption[]; onChange: (value: string) => void; disabled?: boolean }): import('@lynx-js/react').ReactNode;
export function RadioGroup<T extends ChoiceValue = ChoiceValue>(props: RadioGroupProps<T>): import('@lynx-js/react').ReactNode;
export function RadioGroup(props: RadioGroupProps<any>) {
  const { value, defaultValue, allowUncheck = false, onChange, options, children, className = '', style, direction = 'vertical' } = props;
  const [inner,setInner] = useState<ChoiceValue | null | undefined>(defaultValue), field = useContext(FormFieldContext), current = value === undefined ? inner : value;
  const latest = useRef(current); latest.current = current;
  const select = (next: ChoiceValue) => { 'background only'; const changed = Object.is(latest.current,next) ? allowUncheck ? null : next : next; if (changed === latest.current) return; if (value === undefined) { latest.current = changed; setInner(changed); } onChange?.(changed); };
  // Existing business/Popover options API retains its original appearance and callback.
  if (options) return <LegacyRadioGroup value={String(value ?? '')} options={options} disabled={!!props.disabled || !!field?.disabled} onChange={next => onChange?.(next)} />;
  return <Context.Provider value={{ props: { ...props, disabled: props.disabled ?? field?.disabled }, value: current, select }}><view className={`ui-choice-group ui-choice-group-${direction} ${props.type === 'button' ? 'ui-choice-group-buttons' : ''} ${className}`} style={style}>{children}</view></Context.Provider>;
}
export function Radio(props: RadioProps) {
  const group = useContext(Context), field = useContext(FormFieldContext);
  const merged = { ...choiceDefaults(group?.props), ...Object.fromEntries(Object.entries(props).filter(([,v])=>v!==undefined && v!==null)) };
  return <Choice {...merged} disabled={field?.disabled || merged.disabled} checked={Object.is(group?.value,props.value)} onTap={() => { 'background only'; group?.select(props.value); }} />;
}
