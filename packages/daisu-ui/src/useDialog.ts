import { useCallback, useEffect, useRef, useState } from '@lynx-js/react';
import type { DialogOptions, DialogProps, DialogResult } from './Dialog.js';

export function useDialog() {
  const [options, setOptions] = useState<DialogOptions>({});
  const [requestKey, setRequestKey] = useState(0);
  const [visible, setVisible] = useState(false);
  const pending = useRef<{ resolve: (result: DialogResult) => void; reject: (result: DialogResult) => void } | null>(null);
  const settle = useCallback((result: DialogResult) => {
    'background only';
    const current = pending.current; pending.current = null; setVisible(false);
    if (result.action === 'confirm' || result.action === 'action') current?.resolve(result); else current?.reject(result);
  }, []);
  useEffect(() => () => { pending.current?.reject({ action: 'close', value: '' }); pending.current = null; }, []);
  const show = useCallback((input: string | DialogOptions) => {
    'background only';
    pending.current?.reject({ action: 'close', value: '' });
    const next = typeof input === 'string' ? { msg: input } : input;
    setOptions(next); setRequestKey(v => v + 1); setVisible(true);
    const promise = new Promise<DialogResult>((resolve, reject) => { pending.current = { resolve, reject }; });
    // Mark the original Promise handled even when a caller intentionally ignores cancellation.
    void promise.catch(() => {});
    return promise;
  }, []);
  const withType = (type: 'alert' | 'confirm' | 'prompt', input: string | DialogOptions) => show({ ...(typeof input === 'string' ? { msg: input } : input), type });
  const props: DialogProps = { ...options, requestKey, show: visible, onResult: settle };
  return { props, show, alert: (input: string | DialogOptions) => withType('alert', input), confirm: (input: string | DialogOptions) => withType('confirm', input), prompt: (input: string | DialogOptions) => withType('prompt', input), close: () => settle({ action: 'close', value: '' }) };
}
