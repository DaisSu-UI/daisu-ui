import { useEffect, useState } from '@lynx-js/react';

/** Explicit feedback works in both native Lynx and the H5 custom element runtime. */
export function usePressState(enabled: boolean) {
  const [pressed, setPressed] = useState(false);
  useEffect(() => { if (!enabled) setPressed(false); }, [enabled]);
  const start = () => { 'background only'; if (enabled) setPressed(true); };
  const end = () => { 'background only'; setPressed(false); };
  return { pressed: pressed && enabled, start, end };
}
