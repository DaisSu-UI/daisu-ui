export type ProgressColorStop = { color: string; percentage: number };
export type ProgressColor = string | readonly string[] | readonly ProgressColorStop[];
export function progressPercentage(value: number): number { return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0; }
export function progressStops(color?: ProgressColor): ProgressColorStop[] {
  if (typeof color === 'string') return color ? [{ color, percentage: 100 }] : [];
  if (!color?.length) return [];
  return color.flatMap((item, index) => typeof item === 'string' ? [{ color: item, percentage: (index + 1) * 100 / color.length }] : Number.isFinite(item.percentage) ? [{ color: item.color, percentage: progressPercentage(item.percentage) }] : []).sort((a, b) => a.percentage - b.percentage);
}
/** Increasing values animate through crossed thresholds, then use the last color. */
export function progressSegments(from: number, to: number, stops: readonly ProgressColorStop[]): { value: number; color?: string }[] {
  if (!stops.length) return [{ value: to }];
  if (to <= from) return [{ value: to, color: (stops.find(stop => to <= stop.percentage) ?? stops[stops.length - 1])?.color }];
  const crossed = stops.filter(stop => from < stop.percentage && stop.percentage <= to).map(stop => ({ value: stop.percentage, color: stop.color }));
  if (crossed[crossed.length - 1]?.value !== to) crossed.push({ value: to, color: stops[stops.length - 1]!.color });
  return crossed;
}
