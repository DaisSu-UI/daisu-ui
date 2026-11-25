import { useEffect, useRef } from '@lynx-js/react';
import type { NodesRef } from '@lynx-js/types';

type InputEvent = { detail: { value: string } };

type SyncedInputProps = {
  className?: string;
  value: string;
  placeholder?: string;
  maxlength?: number;
  softInputMode?: 'unspecified' | 'nothing' | 'pan' | 'resize';
  avoidKeyboard?: boolean;
  onInput: (value: string) => void;
  onBlur?: () => void;
};

export function SyncedInput({ className, value, placeholder, maxlength, softInputMode = 'nothing', avoidKeyboard = false, onInput, onBlur }: SyncedInputProps) {
  const inputRef = useRef<NodesRef | null>(null);
  const nativeValue = useRef<string | null>(null);

  useEffect(() => {
    if (nativeValue.current === value) return;
    inputRef.current?.invoke({
      method: 'setValue',
      params: { value },
      success: () => { nativeValue.current = value; },
    }).exec();
  }, [value]);

  return <input
    ref={inputRef}
    className={className}
    default-value={value}
    placeholder={placeholder}
    maxlength={maxlength}
    set-soft-input-mode={softInputMode}
    avoid-keyboard={avoidKeyboard}
    bindinput={(event: InputEvent) => {
      nativeValue.current = event.detail.value;
      onInput(event.detail.value);
    }}
    bindblur={() => onBlur?.()}
  />;
}
