import { useEffect, useRef } from '@lynx-js/react';
import type { NodesRef } from '@lynx-js/types';
import { nativeTextMaxLength } from './nativeTextInput.js';

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
  const initial = useRef(value);
  const nativeValue = useRef(value);

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
    default-value={initial.current}
    placeholder={placeholder}
    maxlength={nativeTextMaxLength(maxlength)}
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
