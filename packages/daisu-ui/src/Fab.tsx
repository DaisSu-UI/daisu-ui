import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import { Button } from './Button.js';
import type { ButtonTone } from './Button.js';
import { Icon } from './Icon.js';
import { Transition } from './Transition.js';
import { clampFab, fabBounds, fabPosition, snapFab } from './fabModel.js';
import type { FabDirection, FabGap, FabPoint, FabPosition } from './fabModel.js';

export type FabProps = {
  active?: boolean;
  defaultActive?: boolean;
  onActiveChange?: (active: boolean) => void;
  type?: ButtonTone | 'default' | 'error';
  position?: FabPosition;
  direction?: FabDirection;
  disabled?: boolean;
  draggable?: boolean;
  expandable?: boolean;
  inactiveIcon?: string;
  activeIcon?: string;
  zIndex?: number;
  gap?: FabGap;
  className?: string;
  children?: ReactNode;
  trigger?: ReactNode | ((state: { active: boolean; disabled: boolean }) => ReactNode);
  onTap?: () => void;
};
export type FabRef = { open: () => void; close: () => void };
type PointerEvent = { clientX?: number; clientY?: number; x?: number; y?: number; touches?: {clientX?: number; clientY?: number; x?: number; y?: number}[]; changedTouches?: {clientX?: number; clientY?: number; x?: number; y?: number}[] };
const pointOf = (event: PointerEvent, end = false): FabPoint | null => {
  const p = (end ? event.changedTouches?.[0] : event.touches?.[0]) ?? event;
  const x = p.clientX ?? p.x, y = p.clientY ?? p.y;
  return Number.isFinite(x) && Number.isFinite(y) ? { x: x!, y: y! } : null;
};

export const Fab = forwardRef<FabRef, FabProps>(function Fab({ active, defaultActive = false, onActiveChange, type = 'primary', position = 'right-bottom', direction = 'top', disabled = false, draggable = false, expandable = true, inactiveIcon = 'add', activeIcon = 'close', zIndex = 99, gap = {}, className = '', children, trigger, onTap }, ref) {
  const [inner, setInner] = useState(defaultActive);
  const expanded = active ?? inner;
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [size, setSize] = useState({ width: 60, height: 60 });
  const [location, setLocation] = useState<FabPoint>({ x: 0, y: 0 });
  const [dragDirection, setDragDirection] = useState<FabDirection | null>(null);
  const [attract, setAttract] = useState(false);
  const drag = useRef<{ start: FabPoint; origin: FabPoint; last: FabPoint; moved: boolean } | null>(null);
  const suppressTap = useRef(false);
  const bounds = fabBounds(viewport.width, viewport.height, size.width, size.height, gap);
  useEffect(() => { setLocation(fabPosition(position, bounds)); setDragDirection(null); setAttract(false); drag.current = null; }, [position, viewport.width, viewport.height, size.width, size.height, gap.top, gap.left, gap.right, gap.bottom]);
  useEffect(() => { if (disabled || !draggable) drag.current = null; }, [disabled, draggable]);
  const update = (next: boolean) => { 'background only'; if (next && (disabled || !expandable)) return; if (next === expanded) return; if (active === undefined) setInner(next); onActiveChange?.(next); };
  useImperativeHandle(ref, () => ({ open: () => { 'background only'; update(true); }, close: () => { 'background only'; update(false); } }), [active, expanded, disabled, expandable, onActiveChange]);
  const start = (event: PointerEvent) => {
    'background only';
    suppressTap.current = false;
    const point = pointOf(event);
    if (!draggable || disabled || !point) return;
    drag.current = { start: point, origin: location, last: location, moved: false }; setAttract(false);
  };
  const move = (event: PointerEvent, end = false) => {
    'background only';
    const state = drag.current, point = pointOf(event, end);
    if (!state || !point) return;
    if (Math.abs(point.x - state.start.x) + Math.abs(point.y - state.start.y) > 5) state.moved = true;
    if (!state.moved) return;
    suppressTap.current = true;
    state.last = clampFab({ x: state.origin.x + point.x - state.start.x, y: state.origin.y + point.y - state.start.y }, bounds);
    setLocation(state.last);
  };
  const finish = (event: PointerEvent, cancel = false) => {
    'background only';
    if (!cancel) move(event, true);
    const state = drag.current; drag.current = null;
    if (!state?.moved) return;
    const snap = snapFab(state.last, bounds);
    setAttract(true); setLocation({ x: snap.x, y: snap.y }); setDragDirection(snap.direction);
  };
  const toggle = () => { 'background only'; if (disabled || suppressTap.current) return; if (expandable) update(!expanded); else onTap?.(); };
  const menuDirection = draggable && dragDirection ? dragDirection : direction;
  const tone = type === 'error' ? 'danger' : type === 'default' ? 'neutral' : type;
  return <>
    <view className="ui-fab-viewport" flatten={false} user-interaction-enabled={false} bindlayoutchange={event => { 'background only'; const { width } = event.detail; setViewport(old => old.width === width ? old : { ...old, width }); }} />
    <view className="ui-fab-viewport ui-fab-viewport-vertical" flatten={false} user-interaction-enabled={false} bindlayoutchange={event => { 'background only'; const { height } = event.detail; setViewport(old => old.height === height ? old : { ...old, height }); }} />
    <view className={`ui-fab ${draggable ? 'ui-fab-draggable' : ''} ${disabled ? 'ui-fab-disabled' : ''} ${className}`} style={{ left: `${location.x}px`, top: `${location.y}px`, zIndex, visibility: viewport.width && viewport.height ? 'visible' : 'hidden', transitionDuration: attract ? '300ms' : '0ms' }} catchtap={() => { 'background only'; }}>
      <view className="ui-fab-trigger" flatten={false}
        bindlayoutchange={event => { 'background only'; const { width, height } = event.detail; setSize(old => old.width === width && old.height === height ? old : { width, height }); }}
        bindtap={toggle} bindtouchstart={start}
        catchtouchmove={event => { 'background only'; move(event); }}
        bindtouchend={event => { 'background only'; finish(event); }}
        bindtouchcancel={event => { 'background only'; finish(event, true); }}
        bindmousedown={start}
        global-bindmousemove={draggable ? event => { 'background only'; move(event); } : undefined}
        global-bindmouseup={draggable ? event => { 'background only'; finish(event); } : undefined}
        consume-slide-event={draggable ? [[0, 360]] : undefined}>
        {trigger ? typeof trigger === 'function' ? trigger({ active: expanded, disabled }) : trigger : <Button className="ui-fab-default-trigger" tone={tone} round disabled={disabled} icon={<Icon name={expanded ? activeIcon : inactiveIcon === 'add' ? 'plus' : inactiveIcon} size={32} color={tone === 'neutral' ? 'var(--cso-ui-text-regular)' : '#fff'} />} accessibilityLabel={expanded ? '收起动作菜单' : '展开动作菜单'} />}
      </view>
      {expandable ? <Transition show={expanded} name={[]} className={`ui-fab-actions ui-fab-actions-${menuDirection}`} enterClassName={`ui-fab-offset-${menuDirection}`} leaveToClassName={`ui-fab-offset-${menuDirection}`} enterActiveClassName="ui-fab-actions-animating" leaveActiveClassName="ui-fab-actions-animating"><view className="ui-fab-action-content" user-interaction-enabled={!disabled}>{children}</view></Transition> : null}
    </view>
  </>;
});
