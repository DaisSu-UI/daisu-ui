import { useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { MutableRefObject, ReactNode } from '@lynx-js/react';
import type { TouchEvent } from '@lynx-js/types';
import type { AnyRoute } from '@tanstack/react-router';
import type { Router } from './core.js';
import { RouterProvider, RouteContext, MatchContext, RouteScreen, useRouterSnapshot } from './hooks.js';
import './router.css';

export type RouterViewController = { back(): void; isBusy(): boolean };
export type RouterViewProps<R, TTree extends AnyRoute = AnyRoute> = {
  router: Router<R, TTree>;
  renderRoute?(route: R): ReactNode;
  controllerRef?: MutableRefObject<RouterViewController | null>;
  onExit?(): void;
  canSwipeBack?(route: R): boolean;
  sceneClassName?(route: R): string;
  viewportWidth?: number;
  platform?: string;
  systemGestureInsetLeft?: number;
};

export function shouldFinishBack(distance: number, width: number, velocity: number) {
  return distance >= width * 0.35 || (distance >= 24 && velocity >= 0.55);
}

/** Retains covered pages and unmounts only entries actually removed from the stack. */
export function RouterView<R, TTree extends AnyRoute = AnyRoute>({ router, renderRoute, controllerRef, onExit, canSwipeBack = () => true,
  sceneClassName = () => '', viewportWidth = 375, platform, systemGestureInsetLeft = 0 }: RouterViewProps<R, TTree>) {
  const snapshot = useRouterSnapshot(router);
  const entries = snapshot.entries;
  const currentRoute = entries[entries.length - 1]!.route;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag = useRef<{ x: number; y: number; lastX: number; lastTime: number; velocity: number; locked: boolean } | null>(null);
  const settling = useRef(false);
  const suppressAnimation = useRef(false);
  const [swipe, setSwipe] = useState({ x: 0, settling: false, active: false });
  const localController = useRef<RouterViewController | null>(null);
  useImperativeHandle(controllerRef || localController, () => ({
    back() {
      'background only';
      if (settling.current || drag.current?.locked) return;
      if (router.routes.length <= 1) onExit?.();
      else void router.back();
    },
    isBusy() { 'background only'; return settling.current || Boolean(drag.current?.locked); },
  }), [router, onExit]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const width = viewportWidth || 375;
  const insetGesture = platform !== 'iOS' && platform !== 'ios';
  const gestureLeft = insetGesture ? Math.max(40, systemGestureInsetLeft + 16) : 0;
  const gestureWidth = insetGesture ? 32 : 24;
  const finishSwipe = (complete: boolean) => {
    'background only';
    if (!drag.current?.locked) { drag.current = null; return; }
    drag.current = null;
    settling.current = true;
    setSwipe({ x: complete ? width : 0, settling: true, active: true });
    timer.current = setTimeout(() => {
      if (complete) {
        suppressAnimation.current = true;
        void router.back().finally(() => { suppressAnimation.current = false; });
      }
      if (!complete) suppressAnimation.current = false;
      settling.current = false;
      setSwipe({ x: 0, settling: false, active: false });
      timer.current = null;
    }, 240);
  };
  const startSwipe = (event: TouchEvent) => {
    'background only';
    if (entries.length < 2 || settling.current) return;
    const point = event.touches[0];
    if (!point || event.touches.length !== 1 || point.clientX < gestureLeft || point.clientX > gestureLeft + gestureWidth) return;
    if (!canSwipeBack(currentRoute)) return;
    drag.current = { x: point.clientX, y: point.clientY, lastX: point.clientX, lastTime: Date.now(), velocity: 0, locked: false };
  };
  const moveSwipe = (event: TouchEvent) => {
    'background only';
    const state = drag.current;
    if (!state) return;
    if (event.touches.length !== 1) { finishSwipe(false); return; }
    const point = event.touches[0]!;
    const dx = point.clientX - state.x;
    const dy = point.clientY - state.y;
    if (!state.locked) {
      if (Math.abs(dy) > 8 && Math.abs(dy) >= Math.abs(dx) || dx < -8) { drag.current = null; return; }
      if (dx < 8 || dx <= Math.abs(dy)) return;
      state.locked = true;
      suppressAnimation.current = true;
    }
    const now = Date.now();
    state.velocity = (point.clientX - state.lastX) / Math.max(1, now - state.lastTime);
    state.lastX = point.clientX; state.lastTime = now;
    setSwipe({ x: Math.min(width, Math.max(0, dx)), settling: false, active: true });
  };
  const endSwipe = () => {
    'background only';
    const state = drag.current;
    if (!state) return;
    const velocity = Date.now() - state.lastTime < 100 ? state.velocity : 0;
    finishSwipe(shouldFinishBack(Math.max(0, state.lastX - state.x), width, velocity));
  };

  return <RouterProvider router={router}>
    {entries.map((entry, index) => {
      const top = index === entries.length - 1;
      const previous = index === entries.length - 2;
      const x = top ? swipe.x : previous && swipe.active ? -width * 0.25 + swipe.x * 0.25 : 0;
      return <RouteContext.Provider key={entry.key} value={entry.route}>
        <view className={`route-scene ${sceneClassName(entry.route)} ${top && !swipe.active && !suppressAnimation.current ? `route-${snapshot.direction}` : ''}`}
          style={{ visibility: top || previous && swipe.active ? 'visible' : 'hidden', transform: `translateX(${x}px)`, transitionProperty: 'transform', transitionDuration: swipe.settling ? '240ms' : '0ms', transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)', zIndex: index }}>
          <MatchContext.Provider value={entry.matches}>{renderRoute ? renderRoute(entry.route) : <RouteScreen />}</MatchContext.Provider>
        </view>
      </RouteContext.Provider>;
    })}
    {entries.length > 1 && canSwipeBack(currentRoute) ? <view className={`route-back-edge ${insetGesture ? 'route-back-inset' : ''}`} flatten={false}
      style={{ left: `${gestureLeft}px`, width: `${gestureWidth}px` }}
      bindtouchstart={startSwipe} bindtouchmove={moveSwipe} bindtouchend={endSwipe} bindtouchcancel={() => finishSwipe(false)} /> : null}
  </RouterProvider>;
}
