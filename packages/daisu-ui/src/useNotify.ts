import { useCallback, useRef, useState } from '@lynx-js/react';
import type { NotifyOptions, NotifyProps } from './Notify.js';
/** Each caller owns its notification and defaults; there is no global selector registry. */
export function useNotify(initialOptions: NotifyOptions = {}) {
  const initial = useRef({ ...initialOptions }), defaults = useRef({ ...initialOptions });
  const [options,setOptions] = useState<NotifyOptions>({}), [visible,setVisible] = useState(false), [requestKey,setRequestKey] = useState(0);
  const showNotify = useCallback((input: string | number | NotifyOptions) => {
    'background only';
    setOptions({ ...defaults.current, ...(typeof input === 'object' ? input : { message:input }) }); setRequestKey(value => value + 1); setVisible(true);
  }, []);
  const closeNotify = useCallback(() => { 'background only'; setVisible(false); }, []);
  const setNotifyDefaultOptions = useCallback((input: NotifyOptions) => { 'background only'; defaults.current = { ...defaults.current, ...input }; }, []);
  const resetNotifyDefaultOptions = useCallback(() => { 'background only'; defaults.current = { ...initial.current }; }, []);
  const props: NotifyProps = { options, visible, requestKey, onChange:setVisible };
  return { props, showNotify, closeNotify, setNotifyDefaultOptions, resetNotifyDefaultOptions };
}
