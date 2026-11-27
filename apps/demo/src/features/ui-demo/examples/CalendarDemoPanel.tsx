import { useEffect, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { IntersectionObserver } from '@lynx-js/types';
let panelSequence = 0;
const pendingPanels = new Set<() => void>();
let mountTimer: ReturnType<typeof setTimeout> | undefined;
function schedulePanel(mount: () => void) {
  'background only';
  const flush = () => {
    'background only';
    mountTimer = undefined;
    const next = pendingPanels.values().next().value;
    if (next) { pendingPanels.delete(next); next(); }
    if (pendingPanels.size) mountTimer = setTimeout(flush, 64);
  };
  pendingPanels.add(mount);
  if (!mountTimer) mountTimer = setTimeout(flush, 64);
  return () => { 'background only'; pendingPanels.delete(mount); if (!pendingPanels.size) { clearTimeout(mountTimer); mountTimer = undefined; } };
}

/** Mount nearby examples once; preserve offscreen selections after their first visit. */
export function CalendarDemoPanel({ initial = false, height, children }: { initial?: boolean; height: number; children: ReactNode }) {
  const [mounted, setMounted] = useState(initial), [laidOut, setLaidOut] = useState(false), [id, setId] = useState('');
  useEffect(() => { setId(`demo-calendar-panel-${++panelSequence}`); }, []);
  useEffect(() => {
    if (mounted || !id) return;
    let active = true, observer: IntersectionObserver | undefined, cancelMount: (() => void) | undefined;
    const mount = () => { 'background only'; if (active) { active = false; setMounted(true); } };
    const request = () => { 'background only'; if (active && !cancelMount) cancelMount = schedulePanel(mount); };
    // Some hosts accept observe() before the node is available and never call back.
    // A bounded, staggered fallback prevents permanently empty examples.
    const fallback = setTimeout(request, 1000);
    try {
      if (typeof lynx.createIntersectionObserver !== 'function') request();
      else {
        observer = lynx.createIntersectionObserver({ componentId: '' });
        observer.relativeToViewport({ top: 200, bottom: 200 });
        observer.observe(`#${id}`, entry => { 'background only'; if (entry.isIntersecting || entry.intersectionRatio > 0) request(); else { cancelMount?.(); cancelMount = undefined; } });
      }
    } catch { request(); }
    return () => { active = false; clearTimeout(fallback); cancelMount?.(); observer?.disconnect(); };
  }, [mounted, id, laidOut]);
  return <view id={id || undefined} className="demo-calendar-deferred" flatten={false} bindlayoutchange={event => { 'background only'; if (event.detail.width > 0 && event.detail.height > 0) setLaidOut(true); }} style={{ width: '100%', minHeight: `${height}px`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>{mounted ? children : null}</view>;
}
