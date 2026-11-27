import { useCallback, useEffect, useRef, useState } from '@lynx-js/react';
import { useTouchEmulation } from '@lynx-js/react-use';
import type { MouseEvent, TouchEvent } from '@lynx-js/types';

type Pointer = TouchEvent | MouseEvent;
type Options = {
  disabled?: boolean;
  mode?: 'bind' | 'catch';
  startMode?: 'bind' | 'catch';
  endMode?: 'bind' | 'catch';
  onStart: (event: Pointer) => boolean | void;
  onMove: (event: Pointer) => void;
  onEnd: (event: Pointer) => boolean | void;
  onCancel: (event: Pointer) => void;
};

/** One gesture owns outside mouse events; native touch keeps its original target. */
export function useDragEvents(options: Options) {
  const latest = useRef(options); latest.current = options;
  const pressed = useRef(false), ending = useRef(false), last = useRef<Pointer>(), lastTouch = useRef<number>();
  const [tracking, setTracking] = useState(false);
  const start = useCallback((event: Pointer) => {
    'background only';
    if (pressed.current || latest.current.disabled) return;
    last.current = event;
    if (latest.current.onStart(event) === false) return;
    pressed.current = true; setTracking(true);
  }, []);
  const move = useCallback((event: Pointer) => {
    'background only';
    if (!pressed.current || latest.current.disabled) return;
    last.current = event; latest.current.onMove(event);
  }, []);
  const end = useCallback((event: Pointer) => {
    'background only';
    if (!pressed.current || ending.current) return;
    ending.current = true;
    let accepted = true;
    try { accepted = latest.current.onEnd(event) !== false; }
    finally { ending.current = false; if (accepted) { pressed.current = false; setTracking(false); } }
  }, []);
  const cancel = useCallback((event: Pointer) => {
    'background only';
    if (!pressed.current) return;
    pressed.current = false; setTracking(false); latest.current.onCancel(event);
  }, []);
  useEffect(() => { if (options.disabled && pressed.current && last.current) cancel(last.current); }, [options.disabled, cancel]);
  useEffect(() => () => { pressed.current = false; last.current = undefined; }, []);
  const mode = options.mode ?? 'catch', startMode = options.startMode ?? mode;
  const startEvents = useTouchEmulation(startMode === 'bind' ? { onTouchStart: start } : { catchTouchStart: start });
  const touchStart = useCallback((event: TouchEvent) => { 'background only'; lastTouch.current = Date.now(); start(event); }, [start]);
  const mouseStart = useCallback((event: MouseEvent) => {
    'background only';
    if (lastTouch.current !== undefined && Date.now() - lastTouch.current < 500) return;
    (startEvents.bindmousedown ?? startEvents.catchmousedown)?.(event);
  }, [startEvents]);
  const starts = startMode === 'bind' ? { ...startEvents, bindtouchstart: touchStart, bindmousedown: mouseStart } : { ...startEvents, catchtouchstart: touchStart, catchmousedown: mouseStart };
  const motion = useTouchEmulation(mode === 'bind' ? { onTouchMove: move } : { catchTouchMove: move });
  const endMode = options.endMode ?? mode;
  const ends = useTouchEmulation(endMode === 'bind' ? { onTouchEnd: end, onTouchCancel: cancel } : { catchTouchEnd: end, catchTouchCancel: cancel });
  const local = mode === 'bind' ? { ...motion, bindmousemove: tracking ? undefined : motion.bindmousemove } : { ...motion, catchmousemove: tracking ? undefined : motion.catchmousemove };
  return { ...starts, ...local, ...ends, 'global-bindmousemove': tracking ? move : undefined, 'global-bindmouseup': tracking ? end : undefined };
}
