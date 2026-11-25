import type { CSSProperties } from '@lynx-js/types';

export type GapProps = {
  height?: number | string;
  bgColor?: string;
  safeAreaBottom?: boolean;
  bottomSafeAreaHeight?: number;
  className?: string;
  style?: CSSProperties;
};

/** Keep rpx examples portable: 750 design units equal the viewport width. */
function heightValue(value: number | string) {
  if (typeof value === 'number') return `${Number.isFinite(value) ? Math.max(0, value) : 14}px`;
  const input = value.trim();
  if (/^-?\d+(?:\.\d+)?$/.test(input)) return `${Math.max(0, Number(input))}px`;
  const rpx = /^(-?\d+(?:\.\d+)?)rpx$/.exec(input);
  return rpx ? `${Math.max(0, Number(rpx[1])) / 7.5}vw` : input || '14px';
}

export function Gap({ height = 14, bgColor, safeAreaBottom = false, bottomSafeAreaHeight = 0, className = '', style }: GapProps) {
  const safe = Number.isFinite(bottomSafeAreaHeight) ? Math.max(0, bottomSafeAreaHeight) : 0;
  return <view className={`ui-gap ${safeAreaBottom ? 'ui-gap-safe' : ''} ${className}`} style={{ height: heightValue(height), backgroundColor: bgColor, ...(safeAreaBottom ? { paddingBottom: `${safe}px` } : {}), ...style }} />;
}
