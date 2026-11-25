import { useEffect, useRef } from '@lynx-js/react';
import type { NodesRef } from '@lynx-js/types';

type InputEvent = { detail: { value: string } };

type SyncedTextareaProps = {
  className?: string;
  value: string;
  placeholder?: string;
  maxlength?: number;
  maxlines?: number;
  onInput: (value: string) => void;
  onBlur?: () => void;
};

export function SyncedTextarea({ className, value, placeholder, maxlength, maxlines, onInput, onBlur }: SyncedTextareaProps) {
  const textareaRef = useRef<NodesRef | null>(null);
  const nativeValue = useRef<string | null>(null);

  useEffect(() => {
    if (nativeValue.current === value) return;
    textareaRef.current?.invoke({
      method: 'setValue',
      params: { value },
      success: () => { nativeValue.current = value; },
    }).exec();
  }, [value]);

  return <textarea
    ref={textareaRef}
    className={className}
    default-value={value}
    placeholder={placeholder}
    maxlength={maxlength}
    maxlines={maxlines}
    set-soft-input-mode="nothing"
    avoid-keyboard={false}
    bindinput={(event: InputEvent) => {
      nativeValue.current = event.detail.value;
      onInput(event.detail.value);
    }}
    bindblur={() => onBlur?.()}
  />;
}
