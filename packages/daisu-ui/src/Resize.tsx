import { useRef } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';

export type ResizeRect = { width: number; height: number; top: number; right: number; bottom: number; left: number };
export type ResizeProps = { children?: ReactNode; className?: string; containerClassName?: string; onResize?: (rect: ResizeRect) => void };

/** Reports initial geometry and subsequent size changes using native layout events. */
export function Resize({ children, className = '', containerClassName = '', onResize }: ResizeProps) {
  const previous = useRef<ResizeRect | null>(null);
  const handleLayout = (event: { detail: ResizeRect }) => {
    'background only';
    const { width, height, top, right, bottom, left } = event.detail;
    if (![width, height, top, right, bottom, left].every(Number.isFinite)) return;
    if (previous.current?.width === width && previous.current.height === height) return;
    const rect = { width, height, top, right, bottom, left };
    previous.current = rect;
    onResize?.(rect);
  };
  return <view className={`ui-resize ${className}`}><view className={`ui-resize-container ${containerClassName}`} flatten={false} bindlayoutchange={handleLayout}>{children}</view></view>;
}
