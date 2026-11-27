import { useCallback, useEffect, useState } from '@lynx-js/react';
import { useTouchEmulation } from '@lynx-js/react-use';

/** Shared feedback and release handling for buttons, cells, grids and close controls. */
export function usePressState(enabled: boolean) {
  const [pressed, setPressed] = useState(false);
  useEffect(() => { if (!enabled) setPressed(false); }, [enabled]);
  const start = useCallback(() => { 'background only'; if (enabled) setPressed(true); }, [enabled]);
  const end = useCallback(() => { 'background only'; setPressed(false); }, []);
  const events = useTouchEmulation({ onTouchStart: start, onTouchEnd: end, onTouchCancel: end });
  return { pressed: pressed && enabled, start, end, events: { ...events, bindmouseleave: end, 'global-bindmouseup': pressed && enabled ? end : undefined } };
}
