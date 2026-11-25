export type FabPosition = 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom' | 'left-center' | 'right-center' | 'top-center' | 'bottom-center';
export type FabDirection = 'top' | 'bottom' | 'left' | 'right';
export type FabGap = { top?: number; left?: number; right?: number; bottom?: number };
export type FabPoint = { x: number; y: number };
export type FabBounds = { minX: number; minY: number; maxX: number; maxY: number };

export function fabBounds(width: number, height: number, triggerWidth: number, triggerHeight: number, gap: FabGap): FabBounds {
  const edge = (value?: number) => Number.isFinite(value) ? Math.max(0, value!) : 16;
  const minX = Math.min(edge(gap.left), Math.max(0, width - triggerWidth));
  const minY = Math.min(edge(gap.top), Math.max(0, height - triggerHeight));
  return { minX, minY, maxX: Math.max(minX, width - triggerWidth - edge(gap.right)), maxY: Math.max(minY, height - triggerHeight - edge(gap.bottom)) };
}
export function fabPosition(position: FabPosition, bounds: FabBounds): FabPoint {
  return { x: position.startsWith('left-') ? bounds.minX : position.startsWith('right-') ? bounds.maxX : (bounds.minX + bounds.maxX) / 2, y: position.endsWith('-top') || position === 'top-center' ? bounds.minY : position.endsWith('-bottom') || position === 'bottom-center' ? bounds.maxY : (bounds.minY + bounds.maxY) / 2 };
}
export function clampFab(point: FabPoint, bounds: FabBounds): FabPoint {
  return { x: Math.min(bounds.maxX, Math.max(bounds.minX, point.x)), y: Math.min(bounds.maxY, Math.max(bounds.minY, point.y)) };
}
export function snapFab(point: FabPoint, bounds: FabBounds) {
  const left = point.x <= (bounds.minX + bounds.maxX) / 2;
  return { ...clampFab(point, bounds), x: left ? bounds.minX : bounds.maxX, direction: (left ? 'right' : 'left') as FabDirection };
}
