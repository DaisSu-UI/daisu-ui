export type AvatarSize = 'large' | 'medium' | 'normal' | 'small' | (string & {}) | number;
const sizes = { large: [56, 24, 34], medium: [48, 20, 28], normal: [36, 20, 28], small: [24, 18, 26] } as const;

export function avatarMetrics(size: AvatarSize = 'normal'): { dimension: string; font: string; line: string; overlap: string } {
  if (typeof size === 'string' && size in sizes) {
    const [dimension, font, line] = sizes[size as keyof typeof sizes];
    return { dimension: `${dimension}px`, font: `${font}px`, line: `${line}px`, overlap: `${-dimension / 4}px` };
  }
  const raw = typeof size === 'number' ? `${size}` : size.trim();
  const match = /^(\d+(?:\.\d+)?)(px|rpx|rem|vw|vh)?$/.exec(raw);
  if (!match || !Number.isFinite(Number(match[1]))) return avatarMetrics('normal');
  const value = Number(match[1]) / (match[2] === 'rpx' ? 7.5 : 1);
  const unit = match[2] === 'rpx' ? 'vw' : match[2] || 'px';
  return { dimension: `${value}${unit}`, font: `${value * .45}${unit}`, line: '28px', overlap: `${value * -.25}${unit}` };
}

export function avatarVisibleCount(length: number, maxCount?: number) {
  return typeof maxCount === 'number' && Number.isFinite(maxCount) && maxCount >= 1 ? Math.min(length, Math.floor(maxCount)) : length;
}
