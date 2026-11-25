import { useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';

export type TransitionName = 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in' | 'zoom-out';
export type TransitionProps = {
  show: boolean;
  name?: TransitionName | readonly TransitionName[];
  duration?: number | boolean | { enter: number; leave: number };
  lazyRender?: boolean;
  destroy?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Keep a modal's hit target until its leave animation has finished. */
  interactiveDuringLeave?: boolean;
  enterClassName?: string;
  enterActiveClassName?: string;
  enterToClassName?: string;
  leaveClassName?: string;
  leaveActiveClassName?: string;
  leaveToClassName?: string;
  children?: ReactNode;
  onBeforeEnter?: () => void;
  onEnter?: () => void;
  onAfterEnter?: () => void;
  onBeforeLeave?: () => void;
  onLeave?: () => void;
  onAfterLeave?: () => void;
  onTap?: () => void;
};

type Phase = 'hidden' | 'enter-from' | 'enter-to' | 'entered' | 'leave-from' | 'leave-to';

export function Transition({ show, name = 'fade', duration = 300, lazyRender = false, destroy = true, className = '', style, interactiveDuringLeave = false, enterClassName = '', enterActiveClassName = '', enterToClassName = '', leaveClassName = '', leaveActiveClassName = '', leaveToClassName = '', children, onBeforeEnter, onEnter, onAfterEnter, onBeforeLeave, onLeave, onAfterLeave, onTap }: TransitionProps) {
  const [state, setState] = useState<{ rendered: boolean; phase: Phase }>({ rendered: !lazyRender || show, phase: 'hidden' });
  const shown = useRef(false);
  const callbacks = useRef({ onBeforeEnter, onEnter, onAfterEnter, onBeforeLeave, onLeave, onAfterLeave });
  useEffect(() => { callbacks.current = { onBeforeEnter, onEnter, onAfterEnter, onBeforeLeave, onLeave, onAfterLeave }; });
  const milliseconds = (enter: boolean) => {
    const value = typeof duration === 'object' ? duration[enter ? 'enter' : 'leave'] : typeof duration === 'boolean' ? duration ? 300 : 0 : duration;
    return Number.isFinite(value) ? Math.max(0, value) : 300;
  };
  useEffect(() => {
    if (!show && !shown.current) return;
    shown.current = show;
    let cancelled = false;
    let completion: ReturnType<typeof setTimeout> | undefined;
    const events = callbacks.current;
    (show ? events.onBeforeEnter : events.onBeforeLeave)?.();
    setState({ rendered: true, phase: show ? 'enter-from' : 'leave-from' });
    const frame = setTimeout(() => {
      if (cancelled) return;
      setState({ rendered: true, phase: show ? 'enter-to' : 'leave-to' });
      (show ? callbacks.current.onEnter : callbacks.current.onLeave)?.();
      completion = setTimeout(() => {
        if (cancelled) return;
        setState({ rendered: show || !destroy, phase: show ? 'entered' : 'hidden' });
        (show ? callbacks.current.onAfterEnter : callbacks.current.onAfterLeave)?.();
      }, milliseconds(show));
    }, 32);
    return () => { cancelled = true; clearTimeout(frame); clearTimeout(completion); };
  }, [show]);
  if (!state.rendered) return null;
  const names = typeof name === 'string' ? [name] : name;
  const entering = state.phase.startsWith('enter-');
  const leaving = state.phase.startsWith('leave-');
  const from = state.phase.endsWith('-from');
  const custom = entering ? `${from ? enterClassName : enterToClassName} ${enterActiveClassName}` : leaving ? `${from ? leaveClassName : leaveToClassName} ${leaveActiveClassName}` : '';
  const classes = names.map(item => `ui-transition-${item}-${state.phase}`).join(' ');
  return <view className={`ui-transition ${classes} ${custom} ${className}`} style={{ ...style, display: state.phase === 'hidden' ? 'none' : 'flex', transitionDuration: `${from ? 0 : milliseconds(entering)}ms` }} user-interaction-enabled={(!leaving || interactiveDuringLeave) && state.phase !== 'hidden'} bindtap={onTap}>{children}</view>;
}
