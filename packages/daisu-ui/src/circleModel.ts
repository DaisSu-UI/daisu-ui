import { progressPercentage } from './progressModel.js';
export type CircleColor = string | Readonly<Record<string, string>>;
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export function circleStops(color: CircleColor): { offset: number; color: string }[] {
  if (typeof color === 'string') return [];
  return Object.entries(color).flatMap(([key, value]) => {
    const number = /^(?:\d+(?:\.\d+)?|\.\d+)%?$/.test(key) ? Number.parseFloat(key) : NaN;
    return Number.isFinite(number) ? [{ offset: progressPercentage(number), color: value }] : [];
  }).sort((a,b) => a.offset - b.offset);
}
export function circleSvg({ value, size, color, layerColor, fill, strokeWidth, strokeLinecap, clockwise }: { value: number; size: number; color: CircleColor; layerColor: string; fill?: string; strokeWidth: number; strokeLinecap: 'round' | 'butt' | 'square'; clockwise: boolean }): string {
  const diameter = Number.isFinite(size) ? Math.max(0,size) : 120;
  if (!diameter) return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>';
  const width = Number.isFinite(strokeWidth) ? Math.min(diameter, Math.max(0,strokeWidth)) : 18;
  const center = diameter / 2, stroke = width / 2, radius = center - stroke / 2, rate = progressPercentage(value);
  const stops = circleStops(color), paint = typeof color === 'string' ? escape(color) : stops.length ? 'url(#circle-gradient)' : '#1c64fd';
  const definitions = stops.length ? `<defs><linearGradient id="circle-gradient" gradientUnits="userSpaceOnUse" x1="${diameter}" y1="0" x2="0" y2="0">${stops.map(stop => `<stop offset="${stop.offset}%" stop-color="${escape(stop.color)}"/>`).join('')}</linearGradient></defs>` : '';
  const trackStroke = fill ? width : stroke, track = `<circle cx="${center}" cy="${center}" r="${center - trackStroke / 2}" fill="${fill ? escape(fill) : 'none'}" stroke="${escape(layerColor)}" stroke-width="${trackStroke}"/>`;
  const attributes = `fill="none" stroke="${paint}" stroke-width="${stroke}" stroke-linecap="${strokeLinecap}"`;
  let path = '';
  if (stroke > 0 && rate === 0 && strokeLinecap === 'round') path = `<circle cx="${center}" cy="${stroke / 2}" r="${stroke / 2}" fill="${paint}"/>`;
  else if (stroke > 0 && rate === 100) path = `<circle cx="${center}" cy="${center}" r="${radius}" ${attributes}/>`;
  else if (stroke > 0 && rate > 0) {
    const angle = rate / 100 * Math.PI * 2 * (clockwise ? 1 : -1), x = center + radius * Math.sin(angle), y = center - radius * Math.cos(angle);
    path = `<path d="M${center} ${stroke / 2}A${radius} ${radius} 0 ${rate > 50 ? 1 : 0} ${clockwise ? 1 : 0} ${x.toFixed(5)} ${y.toFixed(5)}" ${attributes}/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${diameter} ${diameter}">${definitions}${track}${path}</svg>`;
}
