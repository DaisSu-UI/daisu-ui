import { useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import { Popup } from './Popup.js';
import { Button } from './Button.js';
import type { ButtonProps } from './Button.js';
import { Icon } from './Icon.js';

export type DialogResult = { action: 'confirm' | 'cancel' | 'modal' | 'close' | 'action'; value: string; index?: number };
export type DialogAction = Omit<ButtonProps, 'onTap' | 'label'> & { text: string; action?: 'confirm' | 'cancel' | 'action' };
export type DialogInputProps = { placeholder?: string; maxlength?: number; type?: 'text' | 'number' | 'digit' | 'password' | 'tel' | 'email'; multiline?: boolean; maxlines?: number };
export type DialogOptions = {
  title?: ReactNode;
  msg?: string;
  type?: 'alert' | 'confirm' | 'prompt';
  theme?: 'button' | 'text';
  actionLayout?: 'horizontal' | 'vertical';
  actions?: readonly DialogAction[];
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonProps?: Partial<DialogAction> | string | null;
  cancelButtonProps?: Partial<DialogAction> | string | null;
  inputValue?: string | number;
  inputProps?: DialogInputProps;
  inputPattern?: RegExp;
  inputValidate?: (value: string) => boolean | string;
  inputError?: string;
  showErr?: boolean;
  beforeConfirm?: (value: string) => boolean | Promise<boolean>;
  icon?: string;
  iconColor?: string;
  headerImage?: string;
  closeOnClickModal?: boolean;
  showClose?: boolean;
  zIndex?: number;
  lazyRender?: boolean;
};
export type DialogProps = DialogOptions & {
  requestKey?: number;
  show?: boolean;
  onChange?: (show: boolean) => void;
  onResult?: (result: DialogResult) => void;
  rootPortal?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  header?: ReactNode;
  renderActions?: (controls: { confirm: () => void; cancel: () => void; close: () => void; pending: boolean }) => ReactNode;
};

function PromptInput({ value, onInput, ...props }: DialogInputProps & { value: string; onInput: (value: string) => void }) {
  const node = useRef<NodesRef | null>(null);
  const native = useRef(value);
  useEffect(() => { if (native.current !== value) node.current?.invoke({ method: 'setValue', params: { value }, success: () => { native.current = value; } }).exec(); }, [value]);
  const common = { ref: node, className: 'ui-dialog-input', 'default-value': value, placeholder: props.placeholder, maxlength: props.maxlength ?? -1, 'set-soft-input-mode': 'nothing' as const, 'avoid-keyboard': false, bindinput: (event: { detail: { value: string } }) => { 'background only'; native.current = event.detail.value; onInput(event.detail.value); } };
  return props.multiline ? <textarea {...common} maxlines={props.maxlines ?? 4} /> : <input {...common} type={props.type ?? 'text'} confirm-type="done" />;
}

export function Dialog({ requestKey = 0, show = false, onChange, onResult, title, msg, type = 'alert', theme = 'button', actionLayout = 'horizontal', actions, showCancelButton = type !== 'alert', confirmButtonText = '确定', cancelButtonText = '取消', confirmButtonProps, cancelButtonProps, inputValue = '', inputProps, inputPattern, inputValidate, inputError = '输入内容不正确', showErr = false, beforeConfirm, icon, iconColor, headerImage, closeOnClickModal = false, showClose = false, zIndex = 99, lazyRender = true, rootPortal = false, className = '', style, children, header, renderActions }: DialogProps) {
  const [value, setValue] = useState(String(inputValue));
  const [error, setError] = useState(showErr ? inputError : '');
  const [pending, setPending] = useState(false);
  const [generation, setGeneration] = useState(0);
  const request = useRef(0);
  const busy = useRef(false);
  useEffect(() => {
    request.current++; busy.current = false; setPending(false);
    if (show) { setValue(String(inputValue)); setError(showErr ? inputError : ''); setGeneration(v => v + 1); }
    return () => { request.current++; busy.current = false; };
  }, [show, inputValue, beforeConfirm, requestKey]);
  const finish = (action: DialogResult['action'], index?: number) => {
    'background only';
    if (!show) return;
    request.current++; busy.current = false; setPending(false);
    onChange?.(false); onResult?.({ action, value, ...(index === undefined ? {} : { index }) });
  };
  const confirm = async (action: 'confirm' | 'action' = 'confirm', index?: number) => {
    'background only';
    if (!show || busy.current) return;
    if (type === 'prompt') {
      const matched = !inputPattern || new RegExp(inputPattern.source, inputPattern.flags).test(value);
      let validated: boolean | string = true;
      try { validated = inputValidate?.(value) ?? true; } catch { validated = false; }
      if (!matched || validated !== true) { setError(typeof validated === 'string' ? validated : inputError); return; }
    }
    setError(''); const token = ++request.current; busy.current = true;
    try {
      const decision = beforeConfirm?.(value) ?? true;
      if (typeof decision !== 'boolean') setPending(true);
      const accepted = await decision;
      if (request.current !== token) return;
      busy.current = false; setPending(false);
      if (accepted) finish(action, index);
    } catch {
      if (request.current === token) { busy.current = false; setPending(false); setError('操作失败，请重试'); }
    }
  };
  const normalize = (props: Partial<DialogAction> | string | null | undefined, fallback: DialogAction): DialogAction | null => props === null ? null : typeof props === 'string' ? { ...fallback, text: props } : { ...fallback, ...props };
  const buttons = actions ?? [showCancelButton ? normalize(cancelButtonProps, { text: cancelButtonText, action: 'cancel', tone: 'info', variant: 'plain' }) : null, normalize(confirmButtonProps, { text: confirmButtonText, action: 'confirm', tone: 'primary' })].filter((item): item is DialogAction => item !== null);
  const iconNames: Record<string, string> = { success: 'check-circle-fill', danger: 'close-circle-fill', warning: 'exclamation-circle-fill', info: 'info-circle-fill' };
  const iconName = iconNames[icon ?? ''] ?? icon;
  const closeInBody = showClose && !header && !headerImage;
  return <Popup show={show} onClose={reason => finish(reason)} position="center" transition="zoom-in" duration={200} modal zIndex={zIndex} lazyRender={lazyRender} rootPortal={rootPortal} closable={showClose} closeOnClickModal={closeOnClickModal} className={`ui-dialog ${className}`} style={{ backgroundColor: 'transparent', ...style }}>
    <view className={`ui-dialog-container ui-dialog-theme-${theme}`}>
      {header ?? (headerImage ? <image className="ui-dialog-header-image" src={headerImage} mode="aspectFill" /> : null)}
      {title || msg || type === 'prompt' || children || icon ? <view className={`ui-dialog-body ${closeInBody && !title && !iconName ? 'ui-dialog-body-close-only' : ''}`}>
        {iconName ? <view className="ui-dialog-icon"><Icon name={iconName} size={40} color={iconColor} /></view> : null}
        {title ? <view className={`ui-dialog-heading ${closeInBody && !iconName ? 'ui-dialog-heading-closable' : ''}`}>{typeof title === 'string' || typeof title === 'number' ? <text className="ui-dialog-title">{title}</text> : title}</view> : null}
        {children ?? <>{msg ? <text className={`ui-dialog-message ${title ? 'ui-dialog-message-titled' : ''}`}>{msg}</text> : null}{type === 'prompt' ? <view className={`ui-dialog-input-wrap ${error ? 'ui-dialog-input-error' : ''}`}><PromptInput key={generation} {...inputProps} value={value} onInput={v => { setValue(v); setError(''); }} /></view> : null}</>}
        {error ? <text className="ui-dialog-error">{error}</text> : null}
      </view> : null}
      {renderActions ? renderActions({ confirm: () => { void confirm(); }, cancel: () => finish('cancel'), close: () => finish('close'), pending }) : buttons.length ? <view className={`ui-dialog-actions ui-dialog-actions-${actionLayout}`}>{buttons.map(({ text, action = 'action', ...props }, index) => <view key={index} className="ui-dialog-action"><Button {...props} round={props.round ?? false} block label={text} loading={props.loading || (pending && action !== 'cancel')} disabled={props.disabled || (pending && action === 'cancel')} variant={theme === 'text' ? 'text' : props.variant} onTap={() => { if (action === 'cancel') finish('cancel', index); else void confirm(action, index); }} /></view>)}</view> : null}
    </view>
  </Popup>;
}
