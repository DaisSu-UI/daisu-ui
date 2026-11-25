import { useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import { RootPortal } from './RootPortal.js';
import { nearestPanelAnchor, panelAnchors, panelHeight } from './floatingPanelModel.js';

export type FloatingPanelProps = {
  height?: number;
  defaultHeight?: number;
  anchors?: readonly number[];
  duration?: number;
  contentDraggable?: boolean;
  safeAreaInsetBottom?: boolean;
  safeAreaBottom?: number;
  showScrollbar?: boolean;
  zIndex?: number;
  rootPortal?: boolean;
  onHeightChange?: (event: { height: number }) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};
type Point = { x?: number; y?: number; clientX?: number; clientY?: number; pageX?: number; pageY?: number };
type Pointer = Point & { detail?: Point; touches?: Point[]; changedTouches?: Point[] };
function point(event: Pointer) {
  'background only';
  const touch = event.touches?.[0] ?? event.changedTouches?.[0] ?? event.detail ?? event;
  const x = touch.clientX ?? touch.pageX ?? touch.x, y = touch.clientY ?? touch.pageY ?? touch.y;
  return Number.isFinite(x) && Number.isFinite(y) ? { x: x!, y: y! } : undefined;
}

export function FloatingPanel({ height, defaultHeight = 0, anchors: anchorProps, duration = 300, contentDraggable = true, safeAreaInsetBottom = false, safeAreaBottom = 0, showScrollbar = true, zIndex = 10, rootPortal = false, onHeightChange, className = '', style, children }: FloatingPanelProps) {
  const viewport = useRef<NodesRef>(null);
  const scroll = useRef<NodesRef>(null);
  const scrollTop = useRef(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [inner, setInner] = useState(defaultHeight);
  const [dragHeight, setDragHeight] = useState<number>();
  const [dragging, setDragging] = useState(false);
  const anchors = panelAnchors(anchorProps, viewportHeight);
  const key = anchors.join(',');
  const max = anchors[anchors.length - 1]!;
  const current = panelHeight(height ?? inner, anchors);
  const shownHeight = dragHeight ?? current;
  const atMax = shownHeight >= max - .5;
  const drag = useRef<{ x: number; y: number; height: number; next: number; source: 'header' | 'content'; active: boolean }>();
  const measured = (value: number) => { 'background only'; if (Number.isFinite(value) && value > 0) setViewportHeight(value); };
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => viewport.current?.invoke({ method: 'boundingClientRect', success: (value: unknown) => { 'background only'; if (!cancelled) measured((value as { height: number }).height); } }).exec(), 32);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);
  useEffect(() => { drag.current = undefined; setDragging(false); setDragHeight(undefined); }, [height, key, contentDraggable]);
  useEffect(() => {
    if (!atMax && scrollTop.current > 0) { scrollTop.current = 0; scroll.current?.invoke({ method: 'scrollTo', params: { offset: 0, smooth: false } }).exec(); }
  }, [atMax]);
  const start = (event: Pointer, source: 'header' | 'content') => {
    'background only';
    const p = point(event);
    if (!p || source === 'content' && !contentDraggable || drag.current) return;
    drag.current = { ...p, height: current, next: current, source, active: false };
  };
  const move = (event: Pointer) => {
    'background only';
    const state = drag.current, p = point(event);
    if (!state || !p) return;
    const dy = p.y - state.y, dx = p.x - state.x;
    if (!state.active) {
      if (Math.max(Math.abs(dy), Math.abs(dx)) < 5) return;
      if (Math.abs(dx) >= Math.abs(dy) || state.source === 'content' && (scrollTop.current > 0 || state.height >= max - .5 && dy < 0)) { drag.current = undefined; return; }
      state.active = true; setDragging(true);
    }
    state.next = panelHeight(state.height - dy, anchors); setDragHeight(state.next);
  };
  const finish = (cancelled = false) => {
    'background only';
    const state = drag.current;
    if (!state) return;
    drag.current = undefined; setDragging(false); setDragHeight(undefined);
    if (!state.active || cancelled) return;
    const next = nearestPanelAnchor(state.next, anchors);
    if (height === undefined) setInner(next);
    if (next !== current) onHeightChange?.({ height: next });
  };
  const inset = safeAreaInsetBottom && Number.isFinite(safeAreaBottom) ? Math.max(0, safeAreaBottom) : 0;
  const layer = <>
    <view ref={viewport} flatten={false} className="ui-floating-panel-viewport" bindlayoutchange={event => measured(event.detail.height)} />
    <view className={`ui-floating-panel ${className}`} style={{ ...style, height: `${max}px`, transform: `translateY(${max - shownHeight}px)`, transitionDuration: `${dragging ? 0 : Math.max(0, Number.isFinite(duration) ? duration : 300)}ms`, paddingBottom: `${inset}px`, zIndex }}>
      <view className="ui-floating-panel-header" consume-slide-event={[[-180, 180]]} catchtouchstart={event => start(event, 'header')} catchtouchmove={move} catchtouchend={() => finish()} catchtouchcancel={() => finish(true)} catchmousedown={event => start(event, 'header')} global-bindmousemove={move} global-bindmouseup={() => finish()} global-bindtouchmove={move} global-bindtouchend={() => finish()} global-bindtouchcancel={() => finish(true)} accessibility-element accessibility-traits="adjustable" accessibility-label={`浮动面板，高度${Math.round(shownHeight)}`}><view className="ui-floating-panel-bar" /></view>
      <scroll-view ref={scroll} className="ui-floating-panel-scroll" scroll-orientation="vertical" scroll-bar-enable={showScrollbar} enable-scroll={!contentDraggable || atMax && !dragging} bounces={false} bindscroll={event => { 'background only'; scrollTop.current = Math.max(0, event.detail.scrollTop); }}>
        <view className="ui-floating-panel-content" consume-slide-event={contentDraggable && !atMax ? [[-180, 180]] : undefined} bindtouchstart={event => start(event, 'content')} bindtouchmove={move} bindtouchend={() => finish()} bindtouchcancel={() => finish(true)} bindmousedown={event => start(event, 'content')}>{children}</view>
      </scroll-view>
    </view>
  </>;
  return rootPortal ? <RootPortal>{layer}</RootPortal> : layer;
}
