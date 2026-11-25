export function badgeLabel(value: string | number | undefined, max?: number, showZero = false): string | null {
  if (value === undefined || value === '' || (!showZero && (value === 0 || value === '0'))) return null;
  if (typeof value === 'number' && !Number.isFinite(value)) return null;
  return typeof value === 'number' && typeof max === 'number' && Number.isFinite(max) && value > max ? `${max}+` : String(value);
}

export function badgeOffset(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return Number.isFinite(value) ? `${value}px` : undefined;
  const input = value.trim();
  if (/^-?\d+(?:\.\d+)?$/.test(input)) return `${input}px`;
  const rpx = /^(-?\d+(?:\.\d+)?)rpx$/.exec(input);
  return rpx ? `${Number(rpx[1]) / 7.5}vw` : input || undefined;
}
