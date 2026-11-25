export function passwordLength(length: number): number {
  return Number.isFinite(length) ? Math.max(0, Math.min(1000, Math.trunc(length))) : 6;
}

/** Numeric strings use px; convert rpx to viewport units for native/H5 parity. */
export function passwordGutter(gutter: number | string): { value: string; spaced: boolean } {
  const match = /^([+-]?(?:\d+\.?\d*|\.\d+))(px|rpx|rem|em|vw|vh|%)?$/.exec(String(gutter).trim());
  const amount = match ? Number(match[1]) : 0;
  if (!Number.isFinite(amount) || amount <= 0) return { value: '0px', spaced: false };
  return { value: match![2] === 'rpx' ? `${amount / 7.5}vw` : `${amount}${match![2] ?? 'px'}`, spaced: true };
}
