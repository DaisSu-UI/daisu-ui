export type ImgMode = 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
export type ImgSize = { width: number; height: number };
export function imgFrame(mode: ImgMode, box: ImgSize, natural: ImgSize) {
  let { width, height } = natural;
  if (mode === 'widthFix') { width = box.width; height = width * natural.height / natural.width; }
  if (mode === 'heightFix') { height = box.height; width = height * natural.width / natural.height; }
  if (mode === 'scaleToFill' || mode === 'aspectFit' || mode === 'aspectFill') return { width: box.width, height: box.height, left: 0, top: 0, mode };
  const scaled = mode === 'widthFix' || mode === 'heightFix';
  return { width, height, left: scaled || mode.includes('left') ? 0 : mode.includes('right') ? box.width - width : (box.width - width) / 2, top: scaled || mode.includes('top') ? 0 : mode.includes('bottom') ? box.height - height : (box.height - height) / 2, mode: 'scaleToFill' as const };
}
export function imgDimension(value: number | string | undefined, fallback: number) {
  if (typeof value === 'number') return `${Number.isFinite(value) ? Math.max(0, value) : fallback}px`;
  if (value === undefined || value.trim() === '') return `${fallback}px`;
  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}
