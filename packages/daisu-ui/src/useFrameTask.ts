import { useCallback, useEffect, useRef } from '@lynx-js/react';

/** Coalesce background render work while callers retain every input sample. */
export function useFrameTask(callback: () => void, delay = 16) {
  const latest = useRef(callback); latest.current = callback;
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const cancel = useCallback(() => { 'background only'; clearTimeout(timer.current); timer.current = undefined; }, []);
  const schedule = useCallback(() => {
    'background only';
    if (timer.current !== undefined) return;
    timer.current = setTimeout(() => { 'background only'; timer.current = undefined; latest.current(); }, delay);
  }, [delay]);
  useEffect(() => cancel, [cancel, delay]);
  return { schedule, cancel };
}
