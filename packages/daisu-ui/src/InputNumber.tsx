import { useLocale } from './useLocale.js';
import { FormFieldContext } from './formContext.js';
import { useContext, useEffect, useRef, useState } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { TextField } from './TextField.js';
import type { TextFieldEvent } from './TextField.js';
import { addNumber, normalizeNumber, numberDisplay, numberDraft, numberRules, sameNumber } from './inputNumberModel.js';
import type { InputNumberValue, NumberRules } from './inputNumberModel.js';
export type { InputNumberValue } from './inputNumberModel.js';
export type InputNumberTheme = 'default' | 'primary' | 'outline-split' | 'outline';
export type InputNumberProps = NumberRules & {
  value?: InputNumberValue; defaultValue?: InputNumberValue; onChange?: (event: { value: InputNumberValue }) => void;
  disabled?: boolean; disableInput?: boolean; disableMinus?: boolean; disablePlus?: boolean; withoutInput?: boolean;
  inputWidth?: number | string; placeholder?: string; avoidKeyboard?: boolean;
  beforeChange?: (value: InputNumberValue) => boolean | Promise<boolean>;
  longPress?: boolean; immediateChange?: boolean; updateOnInit?: boolean; inputType?: 'number' | 'digit';
  theme?: InputNumberTheme; round?: boolean; className?: string; style?: CSSProperties;
  onFocus?: (event: TextFieldEvent) => void; onBlur?: (event: TextFieldEvent) => void;
};

export function InputNumber({ value, defaultValue = 1, onChange, min = 1, max = Number.MAX_SAFE_INTEGER, step = 1, precision = 0, stepStrictly = false, allowNull = false, disabled: disabledProp, disableInput = false, disableMinus = false, disablePlus = false, withoutInput = false, inputWidth = 36, placeholder = '', avoidKeyboard = true, beforeChange, longPress = false, immediateChange = true, updateOnInit = true, inputType = 'digit', theme = 'default', round = false, className = '', style, onFocus, onBlur }: InputNumberProps) {
  const { t: localeText } = useLocale();

  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const rules = numberRules({ min, max, step, precision, stepStrictly, allowNull });
  const [inner, setInner] = useState<InputNumberValue>(updateOnInit ? normalizeNumber(defaultValue, rules) : defaultValue);
  const source = value === undefined ? inner : value;
  const [draft, setDraft] = useState(() => numberDisplay(source, rules, updateOnInit));
  const [settled, setSettled] = useState(0);
  const first = useRef(true), generation = useRef(0), mounted = useRef(true), pending = useRef<InputNumberValue | null>(null);
  const currentDraft = useRef(draft); currentDraft.current = draft;
  const latest = useRef({ rules, source, disabled, disableMinus, disablePlus, beforeChange, onChange, controlled: value !== undefined });
  latest.current = { rules, source, disabled, disableMinus, disablePlus, beforeChange, onChange, controlled: value !== undefined };
  const timer = useRef<ReturnType<typeof setTimeout>>(), repeat = useRef(false);
  const [pressDirection, setPressDirection] = useState<-1 | 1 | null>(null);
  const stop = () => { 'background only'; clearTimeout(timer.current); timer.current = undefined; if (mounted.current) setPressDirection(null); };
  const display = (next: string) => { 'background only'; currentDraft.current = next; setDraft(next); };
  useEffect(() => {
    generation.current++; pending.current = null;
    if (first.current) {
      first.current = false;
      if (updateOnInit) {
        const next = normalizeNumber(source, rules);
        if (!sameNumber(source, next)) onChange?.({ value: next });
      }
      return;
    }
    display(numberDisplay(source, rules));
  }, [value, min, max, step, precision, stepStrictly, allowNull, disabled]);
  useEffect(() => { stop(); }, [disabled, longPress, min, max, step, precision, stepStrictly]);
  // A parent may reject even an identical edit. Reconcile after each transaction.
  useEffect(() => {
    if (settled && value !== undefined && !sameNumber(value, currentDraft.current)) display(numberDisplay(value, rules));
  }, [settled]);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; generation.current++; stop(); }; }, []);

  const commit = async (raw: InputNumberValue, preserveDraft = false) => {
    'background only';
    const state = latest.current;
    if (state.disabled) return;
    const next = normalizeNumber(raw, state.rules);
    if (pending.current !== null && sameNumber(pending.current, next)) return;
    const token = ++generation.current;
    pending.current = null;
    if (sameNumber(state.source, next)) { display(preserveDraft ? String(raw) : numberDisplay(next, state.rules)); setSettled(n => n + 1); return; }
    pending.current = next;
    try {
      const decision = state.beforeChange?.(next) ?? true;
      const accepted = typeof decision === 'boolean' ? decision : await decision;
      if (!mounted.current || generation.current !== token) return;
      if (accepted) {
        if (!state.controlled) { latest.current.source = next; setInner(next); }
        display(preserveDraft && sameNumber(raw, next) ? String(raw) : numberDisplay(next, state.rules));
        latest.current.onChange?.({ value: next });
      } else display(numberDisplay(latest.current.source, latest.current.rules));
    } catch { if (mounted.current && generation.current === token) display(numberDisplay(latest.current.source, latest.current.rules)); }
    finally { if (mounted.current && generation.current === token) { pending.current = null; setSettled(n => n + 1); } }
  };
  const buttonDisabled = (direction: -1 | 1) => {
    const state = latest.current, base = normalizeNumber(currentDraft.current, state.rules);
    if (base === '') return state.disabled || (direction < 0 ? state.disableMinus : state.disablePlus);
    const next = addNumber(base, direction * state.rules.step);
    return state.disabled || (direction < 0 ? state.disableMinus || next < state.rules.min : state.disablePlus || next > state.rules.max);
  };
  const changeBy = (direction: -1 | 1) => {
    'background only';
    if (buttonDisabled(direction) || pending.current !== null) return;
    const state = latest.current, base = normalizeNumber(currentDraft.current, state.rules);
    void commit(base === '' ? state.rules.min : addNumber(base, direction * state.rules.step));
  };
  const start = (direction: -1 | 1) => {
    'background only'; stop(); repeat.current = false;
    if (!longPress || buttonDisabled(direction)) return;
    setPressDirection(direction);
    const tick = () => { 'background only'; repeat.current = true; changeBy(direction); timer.current = setTimeout(tick, 250); };
    timer.current = setTimeout(tick, 600);
  };
  const tap = (direction: -1 | 1) => { 'background only'; stop(); if (repeat.current) { repeat.current = false; return; } changeBy(direction); };
  const edit = (text: string) => {
    'background only';
    if (disabled || disableInput) return;
    generation.current++; pending.current = null;
    const clean = numberDraft(text, rules.precision); display(clean);
    if (!immediateChange || clean === '-' || clean.endsWith('.') || (clean === '' && !allowNull)) return;
    void commit(clean, true);
  };
  const action = (direction: -1 | 1) => <view className={`ui-input-number-action ui-input-number-${direction < 0 ? 'minus' : 'plus'} ${buttonDisabled(direction) ? 'ui-input-number-action-disabled' : ''}`} accessibility-element accessibility-traits="button" accessibility-label={direction < 0 ? localeText('inputNumber.decrease') : localeText('inputNumber.increase')} catchtap={() => { 'background only'; tap(direction); }} bindtouchstart={() => { 'background only'; start(direction); }} bindtouchend={stop} bindtouchcancel={stop} bindtouchmove={stop} bindmousedown={() => { 'background only'; start(direction); }} bindmouseup={stop} global-bindmouseup={pressDirection === direction ? stop : undefined}>
    <view className="ui-input-number-horizontal" />{direction > 0 ? <view className="ui-input-number-vertical" /> : null}<view className="ui-input-number-divider" />
  </view>;
  return <view className={`ui-input-number ui-input-number-${theme} ${disabled ? 'ui-input-number-disabled' : ''} ${round ? 'ui-input-number-round' : ''} ${withoutInput ? 'ui-input-number-without-input' : ''} ${className}`} style={style}>
    {action(-1)}
    {!withoutInput ? <view className="ui-input-number-inner"><TextField compact type={inputType} textAlign="center" className="ui-input-number-editor" style={{ width: typeof inputWidth === 'number' ? `${Math.max(0, inputWidth)}px` : inputWidth }} value={draft} onChange={edit} disabled={disabled || disableInput} placeholder={placeholder} avoidKeyboard={avoidKeyboard} onFocus={onFocus} onBlur={event => { 'background only'; void commit(event.value); onBlur?.(event); }} onConfirm={event => { 'background only'; void commit(event.value); }} /></view> : null}
    {action(1)}
  </view>;
}
