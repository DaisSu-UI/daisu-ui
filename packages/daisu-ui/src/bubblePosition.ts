export type BubblePlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';
export type BubbleOffset = number | readonly number[] | { x: number; y: number };
export type BubbleRect = { left: number; top: number; width: number; height: number };
export type BubblePosition = { x: number; y: number; arrow: number; side: 'top' | 'bottom' | 'left' | 'right' };
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(Math.max(min, max), n));
const finite = (n: number | undefined) => typeof n === 'number' && Number.isFinite(n) ? n : 0;

/** Viewport geometry comes from native NodesRef measurements, never the DOM. */
export function bubblePosition(target: BubbleRect, content: BubbleRect, viewport: BubbleRect, placement: BubblePlacement, offset: BubbleOffset = 0, arrow = true): BubblePosition {
  let side = placement.split('-')[0] as BubblePosition['side'];
  const alignment = placement.split('-')[1];
  const gap = (arrow ? 14 : 6) + (typeof offset === 'number' ? finite(offset) : 0);
  const horizontal = side === 'left' || side === 'right';
  const before = horizontal ? target.left - viewport.left : target.top - viewport.top;
  const after = horizontal ? viewport.left + viewport.width - target.left - target.width : viewport.top + viewport.height - target.top - target.height;
  const needed = (horizontal ? content.width : content.height) + gap;
  // Prefer the requested direction, flipping only when the opposite side fits.
  if ((side === 'top' || side === 'left') && before < needed && after >= needed) side = side === 'top' ? 'bottom' : 'right';
  else if ((side === 'bottom' || side === 'right') && after < needed && before >= needed) side = side === 'bottom' ? 'top' : 'left';
  let x = target.left + (target.width - content.width) / 2;
  let y = target.top + (target.height - content.height) / 2;
  if (horizontal) {
    x = side === 'left' ? target.left - content.width - gap : target.left + target.width + gap;
    if (alignment === 'start') y = target.top;
    if (alignment === 'end') y = target.top + target.height - content.height;
  } else {
    y = side === 'top' ? target.top - content.height - gap : target.top + target.height + gap;
    if (alignment === 'start') x = target.left;
    if (alignment === 'end') x = target.left + target.width - content.width;
  }
  if (typeof offset !== 'number') {
    const point = offset as { x?: number; y?: number };
    x += finite(Array.isArray(offset) ? offset[0] : point.x);
    y += finite(Array.isArray(offset) ? offset[1] : point.y);
  }
  x = clamp(x, viewport.left, viewport.left + viewport.width - content.width);
  y = clamp(y, viewport.top, viewport.top + viewport.height - content.height);
  return { x, y, side, arrow: horizontal ? clamp(target.top + target.height / 2 - y, 12, content.height - 12) : clamp(target.left + target.width / 2 - x, 12, content.width - 12) };
}
