import { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Cell } from './Cell.js';
import { Icon } from './Icon.js';
import { Toast } from './Toast.js';
import { useToast } from './useToast.js';
import { FormFieldContext } from './formContext.js';
import { copyFormValue, equalFormValue, formPath, formValue, includesFormPath } from './formModel.js';
import type { FormError, FormModel, FormSchema, FormValidateResult, FormValidateTrigger } from './formModel.js';
export type FormRef = { validate: (prop?: string | readonly string[]) => Promise<FormValidateResult>; reset: (prop?: string | readonly string[]) => void };
type FormLayout = { disabled?: boolean; border?: boolean; center?: boolean; size?: 'medium' | 'large'; titleWidth?: number | string; layout?: 'horizontal' | 'vertical'; valueAlign?: 'left' | 'center' | 'right'; asteriskPosition?: 'start' | 'end'; hideAsterisk?: boolean; ellipsis?: boolean };
export type FormProps = FormLayout & { model: FormModel; schema?: FormSchema; validateTrigger?: FormValidateTrigger | readonly FormValidateTrigger[]; resetOnChange?: boolean; errorType?: 'message' | 'toast' | 'none' | readonly ('message' | 'toast')[]; onValidate?: (result: FormValidateResult) => void; onValidateError?: (error: unknown) => void; className?: string; style?: CSSProperties; children?: ReactNode };
type Field = { trigger?: FormProps['validateTrigger']; token: object };
type Context = { props: FormProps; errors: FormError[]; register: (path: string, field: Field) => () => void; blur: (path: string) => void };
const FormContext = createContext<Context | undefined>(undefined);
const triggers = (value: FormProps['validateTrigger'], target: FormValidateTrigger) => Array.isArray(value) ? value.includes(target) : value === target;
const displays = (value: FormProps['errorType'], target: 'message' | 'toast') => Array.isArray(value) ? value.includes(target) : (value ?? 'message') === target;
export const Form = forwardRef<FormRef, FormProps>(function Form(props, ref) {
  const { model, schema, resetOnChange = true, errorType = 'message', className = '', style, children } = props;
  const [errors, setErrors] = useState<FormError[]>([]);
  const fields = useRef(new Map<string, Field>()), tickets = useRef(new Map<string, number>()), mounted = useRef(true), previous = useRef(copyFormValue(model)), latest = useRef(props);
  latest.current = props;
  const toast = useToast();
  const showMessages = displays(errorType, 'message'), showToast = displays(errorType, 'toast');
  useEffect(() => { if (!showToast) toast.close(); }, [showToast, toast.close]);
  const invalidate = (path: string) => { 'background only'; tickets.current.set(path, (tickets.current.get(path) ?? 0) + 1); };
  const selected = (prop?: string | readonly string[]) => { 'background only'; const paths = prop === undefined ? undefined : (typeof prop === 'string' ? [prop] : prop).map(formPath); return [...fields.current.keys()].filter(key => !paths || paths.some(path => includesFormPath(path, key) || includesFormPath(key, path))); };
  const reset: FormRef['reset'] = prop => { 'background only'; const keys = selected(prop); keys.forEach(invalidate); setErrors(old => old.filter(error => !keys.includes(error.prop))); toast.close(); };
  const validate: FormRef['validate'] = async prop => {
    'background only';
    const keys = selected(prop), snapshot = copyFormValue(latest.current.model), currentSchema = latest.current.schema;
    const versions = new Map(keys.map(key => { invalidate(key); return [key, tickets.current.get(key)] as const; }));
    const issues = currentSchema ? await currentSchema.validate(snapshot) : [];
    // A cross-field rule can depend on any model field. Never apply an old snapshot.
    const stale = !mounted.current || currentSchema !== latest.current.schema || !equalFormValue(snapshot, latest.current.model) || keys.some(key => !fields.current.has(key) || versions.get(key) !== tickets.current.get(key));
    if (stale) return { valid: false, errors: [], outOfDate: true };
    const next = keys.flatMap(key => { const issue = issues.find(issue => { const path = formPath(issue.path); return !path || includesFormPath(key, path); }); return issue ? [{ prop: key, message: issue.message }] : []; });
    setErrors(old => [...old.filter(error => !keys.includes(error.prop)), ...next]);
    // One validation result owns one toast; all inline field messages remain available.
    if (displays(latest.current.errorType, 'toast') && next.length) toast.show(next[0]!.message);
    else toast.close();
    const result = { valid: next.length === 0, errors: next }; latest.current.onValidate?.(result); return result;
  };
  const validateRef = useRef(validate); validateRef.current = validate;
  useImperativeHandle(ref, () => ({ validate, reset }), []);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; tickets.current.clear(); }; }, []);
  useEffect(() => {
    const changed = [...fields.current.keys()].filter(key => !equalFormValue(formValue(previous.current, key), formValue(model, key)));
    previous.current = copyFormValue(model);
    if (!changed.length) return;
    changed.forEach(invalidate);
    if (resetOnChange) setErrors(old => old.filter(error => !changed.includes(error.prop)));
    const automatic = changed.filter(key => triggers(fields.current.get(key)?.trigger ?? props.validateTrigger ?? 'submit', 'change'));
    if (automatic.length) void validateRef.current(automatic).catch(error => latest.current.onValidateError?.(error));
  });
  const register = (path: string, field: Field) => { 'background only'; if (fields.current.has(path)) throw new Error(`Duplicate FormItem prop: ${path}`); fields.current.set(path, field); return () => { 'background only'; if (fields.current.get(path)?.token !== field.token) return; fields.current.delete(path); invalidate(path); setErrors(old => fields.current.has(path) ? old : old.filter(error => error.prop !== path)); }; };
  const blur = (path: string) => { 'background only'; if (triggers(fields.current.get(path)?.trigger ?? latest.current.validateTrigger ?? 'submit', 'blur')) void validateRef.current(path).catch(error => latest.current.onValidateError?.(error)); };
  return <FormContext.Provider value={{ props, errors: showMessages ? errors : [], register, blur }}><view className={`ui-form ${className}`} style={style}>{children}{showToast && toast.props.show ? <Toast {...toast.props} /> : null}</view></FormContext.Provider>;
});
export type FormItemProps = FormLayout & { prop?: string; title?: ReactNode; value?: string | number; placeholder?: string; prefixIcon?: string; iconSize?: number; icon?: ReactNode; label?: string; required?: boolean; validateTrigger?: FormProps['validateTrigger']; clickable?: boolean; isLink?: boolean; onTap?: () => void; className?: string; style?: CSSProperties; children?: ReactNode };
export function FormItem({ prop, title, value, placeholder, prefixIcon, iconSize = 16, icon, label, required, validateTrigger, clickable, isLink, onTap, className = '', style, children, ...layout }: FormItemProps) {
  const form = useContext(FormContext), path = prop === undefined ? undefined : formPath(prop), stable = useRef({});
  const settings = { ...form?.props, ...Object.fromEntries(Object.entries(layout).filter(([, value]) => value !== undefined)) };
  const disabled = settings.disabled ?? false;
  const formRef = useRef(form); formRef.current = form;
  useEffect(() => { if (path !== undefined && formRef.current) return formRef.current.register(path, { trigger: validateTrigger, token: stable.current }); }, [path, validateTrigger]);
  const error = form?.errors.find(error => error.prop === path)?.message;
  const width = settings.titleWidth ?? 98;
  return <FormFieldContext.Provider value={{ disabled, compact: true, error: !!error, onBlur: () => { 'background only'; if (path !== undefined) formRef.current?.blur(path); } }}><view className={`ui-form-item ${disabled ? 'ui-form-item-disabled' : ''} ${className}`} style={style}>
    <Cell title={title} description={label} value={value === undefined ? undefined : String(value)} placeholder={placeholder} icon={icon ?? (prefixIcon ? <Icon name={prefixIcon} size={iconSize} /> : undefined)} required={!settings.hideAsterisk && (required ?? (path !== undefined ? form?.props.schema?.isRequired?.(path) : false) ?? false)} markerSide={settings.asteriskPosition === 'end' ? 'after' : 'before'} titleWidth={typeof width === 'number' ? `${width}px` : width} border={settings.border ?? false} center={settings.center} size={settings.size} vertical={settings.layout === 'vertical'} valueAlign={settings.valueAlign ?? 'left'} ellipsis={settings.ellipsis} clickable={!disabled && clickable} arrow={isLink} onTap={() => { 'background only'; if (!disabled) onTap?.(); }}>
      <view className="ui-form-item-content">{children ?? <text className={(value === undefined || value === '') && placeholder ? 'ui-form-item-placeholder' : 'ui-form-item-value'}>{value === undefined || value === '' ? placeholder ?? '' : value}</text>}{error ? <text className="ui-form-item-error">{error}</text> : null}</view>
    </Cell>
  </view></FormFieldContext.Provider>;
}
