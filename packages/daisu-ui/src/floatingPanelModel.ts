export function panelAnchors(input: readonly number[] | undefined, viewport: number): number[] {
  const values = (input ?? [100, viewport * .6]).filter(value => Number.isFinite(value) && value > 0).map(value => viewport > 0 ? Math.min(value, viewport) : value);
  return [...new Set(values.length ? values : [viewport > 0 ? Math.min(100, viewport) : 100])].sort((a, b) => a - b);
}
export function panelHeight(value: number | undefined, anchors: readonly number[]) {
  return Math.min(anchors[anchors.length - 1]!, Math.max(anchors[0]!, value && Number.isFinite(value) ? value : anchors[0]!));
}
export function nearestPanelAnchor(height: number, anchors: readonly number[]) {
  return anchors.reduce((nearest, value) => Math.abs(value - height) < Math.abs(nearest - height) ? value : nearest, anchors[0]!);
}
