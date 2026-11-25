import { useCallback, useState } from '@lynx-js/react';
import type { ToastIconType, ToastOptions, ToastProps } from './Toast.js';

export function useToast() {
  const [options, setOptions] = useState<ToastOptions>({});
  const [visible, setVisible] = useState(false);
  const [requestKey, setRequestKey] = useState(0);
  const show = useCallback((input: string | ToastOptions) => {
    'background only';
    setOptions(typeof input === 'string' ? { msg: input } : input);
    setRequestKey(value => value + 1); setVisible(true);
  }, []);
  const close = useCallback(() => { 'background only'; setVisible(false); }, []);
  const withIcon = (iconName: ToastIconType, input: string | ToastOptions) => {
    'background only';
    const next = typeof input === 'string' ? { msg: input } : input;
    show({ ...(iconName === 'loading' ? { duration: 0 } : {}), ...next, iconName });
  };
  const props: ToastProps = { show: visible, options, requestKey, onChange: setVisible };
  return { props, show, close, success: (input: string | ToastOptions) => withIcon('success', input), error: (input: string | ToastOptions) => withIcon('error', input), warning: (input: string | ToastOptions) => withIcon('warning', input), info: (input: string | ToastOptions) => withIcon('info', input), loading: (input: string | ToastOptions) => withIcon('loading', input) };
}
