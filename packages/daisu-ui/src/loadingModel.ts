const presets = { small: 14, medium: 20, large: 28 } as const;
export function loadingDimension(size: number | string = 28): string {
  if (typeof size === 'string' && Object.hasOwn(presets, size)) return `${presets[size as keyof typeof presets]}px`;
  const match = /^(\d+(?:\.\d+)?)(px|rpx|rem|vw|vh)?$/.exec(String(size).trim());
  if (!match || !Number.isFinite(Number(match[1]))) return '28px';
  const value = Number(match[1]);
  return match[2] === 'rpx' ? `${value / 7.5}vw` : `${value}${match[2] || 'px'}`;
}

// Match the conic ring with native SVG arcs; no CSS mask/conic-gradient dependency.
const arcs = Array.from({ length: 72 }, (_, index) => {
  const start = (90 + index * 3.75) * Math.PI / 180;
  const end = (90 + (index + 1) * 3.75 + .12) * Math.PI / 180;
  const point = (angle: number) => `${(50 + 46.25 * Math.sin(angle)).toFixed(4)} ${(50 - 46.25 * Math.cos(angle)).toFixed(4)}`;
  return `<path d="M${point(start)}A46.25 46.25 0 0 1 ${point(end)}" opacity="${Math.min(1, (index + .5) * 3.75 / 240).toFixed(4)}"/>`;
}).join('');
export function circularLoadingSvg(color: string) {
  const escaped = color.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="${escaped}" stroke-width="7.5">${arcs}</g></svg>`;
}
