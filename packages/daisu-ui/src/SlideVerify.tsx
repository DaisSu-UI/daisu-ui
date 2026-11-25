import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { NodesRef, CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { FormFieldContext } from './formContext.js';
export type SlideVerifyRef = { init: () => Promise<void>; reset: () => void };
export type SlideVerifyProps = {
  width?: number | string; height?: number | string; tolerance?: number; text?: ReactNode; successText?: ReactNode; disabled?: boolean;
  backgroundColor?: string; activeBackgroundColor?: string; icon?: string; successIcon?: string; iconSize?: number; successIconSize?: number;
  renderIcon?: ReactNode; renderSuccessIcon?: ReactNode; onSuccess?: () => void; onFail?: () => void; className?: string; style?: CSSProperties;
};
type Pointer = { x?: number; clientX?: number; touches?: { x?: number; clientX?: number; identifier?: number }[]; changedTouches?: { x?: number; clientX?: number; identifier?: number }[] };
type Dimensions = { width: number; height: number };
type Drag = { start: number; last: number; offset: number; max: number; ready: boolean };
const dimension = (value: number | string) => typeof value === 'number' ? `${Number.isFinite(value) ? Math.max(0, value) : 0}px` : /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
export const SlideVerify = forwardRef<SlideVerifyRef, SlideVerifyProps>(function SlideVerify({ width = '100%', height = 40, tolerance = 10, text = '向右滑动验证', successText = '验证通过', disabled: disabledProp, backgroundColor, activeBackgroundColor, icon = 'double-right', successIcon = 'check-circle-fill', iconSize = 20, successIconSize = 20, renderIcon, renderSuccessIcon, onSuccess, onFail, className = '', style }, ref) {
  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false, node = useRef<NodesRef>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 }), measured = useRef(dimensions), [offset, setOffset] = useState(0), [success, setSuccess] = useState(false), [dragging, setDragging] = useState(false);
  const drag = useRef<Drag>(), sequence = useRef(0), mounted = useRef(true);
  const reset = () => { 'background only'; sequence.current++; drag.current = undefined; setSuccess(false); setOffset(0); setDragging(false); };
  const record = (next: Dimensions) => {
    'background only'; if (!mounted.current || !Number.isFinite(next.width) || !Number.isFinite(next.height) || next.width <= 0 || next.height <= 0) return;
    if (next.width !== measured.current.width || next.height !== measured.current.height) { measured.current = next; setDimensions(next); reset(); }
  };
  const measure = () => {
    'background only'; return new Promise<Dimensions | undefined>(resolve => {
      if (!node.current) { resolve(undefined); return; }
      node.current.invoke({ method: 'boundingClientRect', success: result => { const rect = result as Dimensions; resolve(Number.isFinite(rect.width) && Number.isFinite(rect.height) && rect.width > 0 && rect.height > 0 ? { width: rect.width, height: rect.height } : undefined); }, fail: () => resolve(undefined) }).exec();
    });
  };
  const init = async () => { 'background only'; const ticket = sequence.current, next = await measure(); if (ticket === sequence.current && next) record(next); };
  useImperativeHandle(ref, () => ({ init, reset }), []);
  useEffect(() => { if (disabled) reset(); }, [disabled]);
  useEffect(() => () => { mounted.current = false; sequence.current++; drag.current = undefined; }, []);
  const point = (event: Pointer) => { 'background only'; const touch = event.touches?.[0] ?? event.changedTouches?.[0]; return touch?.clientX ?? event.clientX ?? touch?.x ?? event.x; };
  const move = (event: Pointer) => {
    'background only'; const current = drag.current, x = point(event); if (!current || x === undefined) return;
    if ((event.touches?.length ?? 1) > 1) { reset(); return; }
    current.last = x; if (current.ready) { current.offset = Math.max(0, Math.min(current.max, x - current.start)); setOffset(current.offset); }
  };
  const begin = async (event: Pointer) => {
    'background only'; const x = point(event); if (disabled || success || x === undefined || drag.current || (event.touches?.length ?? 1) > 1) return;
    const ticket = ++sequence.current, current: Drag = { start: x, last: x, offset: 0, max: 0, ready: false }; drag.current = current; setDragging(true);
    let size = measured.current;
    if (size.width <= 0 || size.height <= 0) { const next = await measure(); if (ticket !== sequence.current || !mounted.current) return; if (!next) { reset(); return; } size = next; measured.current = next; setDimensions(next); }
    if (size.width <= size.height) { reset(); return; }
    current.max = size.width - size.height; current.ready = true; current.offset = Math.max(0, Math.min(current.max, current.last - current.start)); setOffset(current.offset);
  };
  const end = (event?: Pointer, cancelled = false) => {
    'background only'; if (event && !cancelled) move(event); const current = drag.current; drag.current = undefined; sequence.current++; setDragging(false);
    if (!current) return;
    if (!current.ready) { setOffset(0); return; }
    const allowed = Math.max(0, Number.isFinite(tolerance) ? tolerance : 10);
    if (!cancelled && current.offset >= current.max - allowed) { setOffset(current.max); setSuccess(true); onSuccess?.(); }
    else { setOffset(0); if (!cancelled) onFail?.(); }
  };
  const content = (value: ReactNode) => typeof value === 'string' || typeof value === 'number' ? <text>{value}</text> : value;
  const buttonSize = dimensions.height || (typeof height === 'number' ? Math.max(0, height) : 40);
  return <view ref={node} flatten={false} className={`ui-slide-verify ${disabled ? 'ui-slide-verify-disabled' : ''} ${success ? 'ui-slide-verify-success' : ''} ${className}`} style={{ width: dimension(width), height: dimension(height), ...style, backgroundColor: backgroundColor ?? style?.backgroundColor }} bindlayoutchange={event => record({ width: event.detail.width, height: event.detail.height })}>
    <view className="ui-slide-verify-copy">{content(text)}</view>
    <view className="ui-slide-verify-track" style={{ width: `${offset + buttonSize}px`, backgroundColor: offset ? activeBackgroundColor : 'transparent', transitionDuration: dragging ? '0ms' : '300ms' }}><view className="ui-slide-verify-success-copy" style={{ width: `${dimensions.width}px` }}>{content(successText)}</view></view>
    <view className="ui-slide-verify-button" style={{ width: `${buttonSize}px`, height: `${buttonSize}px`, transform: `translateX(${offset}px)`, transitionDuration: dragging ? '0ms' : '300ms' }} consume-slide-event={disabled ? undefined : [[-180, 180]]} catchtouchstart={event => { 'background only'; void begin(event); }} catchtouchmove={move} catchtouchend={event => end(event)} catchtouchcancel={event => end(event, true)} catchmousedown={event => { 'background only'; void begin(event); }} global-bindmousemove={dragging ? move : undefined} global-bindmouseup={dragging ? event => end(event) : undefined} global-bindtouchmove={dragging ? move : undefined} global-bindtouchend={dragging ? event => end(event) : undefined} global-bindtouchcancel={dragging ? event => end(event, true) : undefined} accessibility-element accessibility-traits="adjustable" accessibility-label={success ? typeof successText === 'string' ? successText : '验证通过' : typeof text === 'string' ? text : '向右滑动验证'}>
      {success ? renderSuccessIcon ?? <Icon name={successIcon} size={successIconSize} color="#12b886" /> : renderIcon ?? <Icon name={icon} size={iconSize} />}
    </view>
  </view>;
});
