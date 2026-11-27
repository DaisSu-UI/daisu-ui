import { useDragEvents } from './useDragEvents.js';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';

export type SwipeActionStatus = 'left' | 'close' | 'right';
export type SwipeActionReason = 'click' | 'swipe' | 'value';
export type SwipeActionPosition = 'left' | 'right' | 'inside';
export type SwipeActionBeforeClose = (reason: SwipeActionReason, position: SwipeActionPosition) => boolean | Promise<boolean>;
export type SwipeActionClickEvent = { value: SwipeActionPosition };
export type SwipeActionRef = { close: (reason?: SwipeActionReason, position?: SwipeActionPosition) => Promise<boolean> };
export type SwipeActionProps = {
  value?: SwipeActionStatus;
  defaultValue?: SwipeActionStatus;
  disabled?: boolean;
  beforeClose?: SwipeActionBeforeClose;
  onChange?: (value: SwipeActionStatus) => void;
  onClick?: (event: SwipeActionClickEvent) => void;
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  duration?: number;
  className?: string;
  style?: CSSProperties;
};
type Point = { x?: number; y?: number; clientX?: number; clientY?: number; pageX?: number; pageY?: number };
type Pointer = Point & { detail?: Point; touches?: Point[]; changedTouches?: Point[] };
function point(event: Pointer) {
  'background only';
  const touch = event.touches?.[0] ?? event.changedTouches?.[0] ?? event.detail ?? event;
  const x = touch.clientX ?? touch.pageX ?? touch.x, y = touch.clientY ?? touch.pageY ?? touch.y;
  return Number.isFinite(x) && Number.isFinite(y) ? { x: x!, y: y! } : undefined;
}

export const SwipeAction = forwardRef<SwipeActionRef, SwipeActionProps>(function SwipeAction({ value, defaultValue = 'close', disabled = false, beforeClose, onChange, onClick, left, right, children, duration = 600, className = '', style }, ref) {
  const normalize = (status: SwipeActionStatus): SwipeActionStatus => status === 'left' && left ? 'left' : status === 'right' && right ? 'right' : 'close';
  const [status, setStatus] = useState(() => normalize(value ?? defaultValue));
  const [widths, setWidths] = useState({ left: 0, right: 0 });
  const [offset, setOffset] = useState<number>();
  const [retainSides, setRetainSides] = useState(status !== 'close');
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState(false);
  const leftRef = useRef<NodesRef>(null), rightRef = useRef<NodesRef>(null);
  const mounted = useRef(true), generation = useRef(0), busy = useRef(false);
  const suppressTap = useRef(false);
  const releaseTimer = useRef<ReturnType<typeof setTimeout>>();
  const drag = useRef<{ x: number; y: number; initial: number; next: number; active: boolean }>();
  const callbacks = useRef({ beforeClose, onChange, onClick }); callbacks.current = { beforeClose, onChange, onClick };
  const live = useRef({ status, disabled, value, left: !!left, right: !!right }); live.current = { status, disabled, value, left: !!left, right: !!right };
  const base = status === 'left' ? widths.left : status === 'right' ? -widths.right : 0;
  const sidesVisible = status !== 'close' || offset !== undefined || retainSides;
  useEffect(() => {
    if (status !== 'close' || offset !== undefined) { setRetainSides(true); return; }
    const timer = setTimeout(() => setRetainSides(false), Number.isFinite(duration) ? Math.max(0, duration) : 600);
    return () => clearTimeout(timer);
  }, [status, offset, duration]);
  const updateWidth = (side: 'left' | 'right', width: number) => {
    'background only';
    if (!mounted.current || !Number.isFinite(width) || width < 0) return;
    setWidths(previous => previous[side] === width ? previous : { ...previous, [side]: width });
  };
  useEffect(() => {
    mounted.current = true;
    const timer = setTimeout(() => {
      for (const [side, node] of [['left', leftRef], ['right', rightRef]] as const) node.current?.invoke({ method: 'boundingClientRect', success: (rect: unknown) => { 'background only'; updateWidth(side, (rect as { width: number }).width); } }).exec();
    }, 32);
    return () => { mounted.current = false; generation.current++; clearTimeout(timer); clearTimeout(releaseTimer.current); };
  }, []);
  const request = async (next: SwipeActionStatus, reason: SwipeActionReason, position: SwipeActionPosition, fromProp = false) => {
    'background only';
    if (!mounted.current || live.current.disabled && !fromProp || busy.current) return false;
    const previous = live.current.status;
    next = next === 'left' && live.current.left ? 'left' : next === 'right' && live.current.right ? 'right' : 'close';
    if (next === previous) return false;
    const token = ++generation.current;
    if (previous !== 'close' && callbacks.current.beforeClose) {
      busy.current = true;
      let accepted = false;
      try {
        const result = callbacks.current.beforeClose(reason, position);
        if (typeof result !== 'boolean') setPending(true);
        accepted = await result;
      } catch { /* A rejected guard keeps the opened side visible. */ }
      if (!mounted.current || token !== generation.current) return false;
      busy.current = false; setPending(false);
      if (!accepted) { if (fromProp) callbacks.current.onChange?.(previous); return false; }
    }
    if (!mounted.current || token !== generation.current) return false;
    if (fromProp || live.current.value === undefined) { live.current.status = next; setStatus(next); }
    if (!fromProp) callbacks.current.onChange?.(next);
    if (reason === 'click' && previous !== 'close' && next === 'close') callbacks.current.onClick?.({ value: position });
    return true;
  };
  const requestRef = useRef(request); requestRef.current = request;
  const previousValue = useRef(value);
  useEffect(() => {
    if (previousValue.current === value) return;
    previousValue.current = value; generation.current++; busy.current = false; setPending(false); drag.current = undefined; setOffset(undefined); setDragging(false);
    if (value !== undefined) void requestRef.current(value, 'value', live.current.status === 'close' ? value === 'left' ? 'left' : 'right' : live.current.status, true);
  }, [value]);
  useEffect(() => {
    generation.current++; busy.current = false; setPending(false); drag.current = undefined; setOffset(undefined); setDragging(false);
    if (live.current.status === 'left' && !left || live.current.status === 'right' && !right) {
      live.current.status = 'close'; setStatus('close'); callbacks.current.onChange?.('close');
    }
  }, [disabled, !!left, !!right]);
  useImperativeHandle(ref, () => ({ close: (reason = 'value', position) => { 'background only'; const state = live.current.status; return requestRef.current('close', reason, position ?? (state === 'close' ? 'inside' : state)); } }), []);
  const start = (event: Pointer) => {
    'background only';
    const p = point(event);
    if (!p || disabled || busy.current || drag.current) return;
    clearTimeout(releaseTimer.current); suppressTap.current = false;
    drag.current = { ...p, initial: base, next: base, active: false };
  };
  const move = (event: Pointer) => {
    'background only';
    const state = drag.current, p = point(event);
    if (!state || !p || disabled) return;
    const dx = p.x - state.x, dy = p.y - state.y;
    if (!state.active) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 5) return;
      if (Math.abs(dy) >= Math.abs(dx)) { drag.current = undefined; return; }
      state.active = true; suppressTap.current = true; setDragging(true);
    }
    state.next = Math.max(-widths.right, Math.min(widths.left, state.initial + dx)); setOffset(state.next);
  };
  const finish = (cancelled = false) => {
    'background only';
    const state = drag.current;
    if (!state) return;
    drag.current = undefined; setDragging(false); setOffset(undefined);
    if (!state.active) return;
    clearTimeout(releaseTimer.current); releaseTimer.current = setTimeout(() => { suppressTap.current = false; }, 250);
    if (cancelled) return;
    const next: SwipeActionStatus = widths.left > 0 && state.next > widths.left / 2 ? 'left' : widths.right > 0 && state.next < -widths.right / 2 ? 'right' : 'close';
    const current = live.current.status;
    void requestRef.current(next, 'swipe', current === 'close' ? next === 'left' ? 'left' : 'right' : current);
  };
  const click = (position: SwipeActionPosition) => {
    'background only';
    if (suppressTap.current || disabled || live.current.status === 'close') return;
    void requestRef.current('close', 'click', position);
  };
  const gestures = useDragEvents({ disabled, mode: 'bind', onStart: event => { 'background only'; start(event); return !!drag.current; }, onMove: move, onEnd: () => { 'background only'; finish(); }, onCancel: () => { 'background only'; finish(true); } });
  return <view className={`ui-swipe-action ${disabled ? 'ui-swipe-action-disabled' : ''} ${pending ? 'ui-swipe-action-pending' : ''} ${className}`} style={style}>
    <view className="ui-swipe-track" style={{ transform: `translateX(${offset ?? base}px)`, transitionDuration: `${dragging ? 0 : Number.isFinite(duration) ? Math.max(0, duration) : 600}ms` }} consume-slide-event={disabled ? undefined : [[-45, 45], [135, 180], [-180, -135]]} {...gestures}>
      {left ? <view ref={leftRef} flatten={false} className="ui-swipe-side ui-swipe-left" style={{ visibility: sidesVisible ? 'visible' : 'hidden' }} bindlayoutchange={event => updateWidth('left', event.detail.width)} catchtap={() => click('left')}>{left}</view> : null}
      <view className="ui-swipe-body" catchtap={() => click('inside')}>{children}</view>
      {right ? <view ref={rightRef} flatten={false} className="ui-swipe-side ui-swipe-right" style={{ visibility: sidesVisible ? 'visible' : 'hidden' }} bindlayoutchange={event => updateWidth('right', event.detail.width)} catchtap={() => click('right')}>{right}</view> : null}
    </view>
  </view>;
});
