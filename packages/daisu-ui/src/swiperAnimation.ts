import type { CSSProperties } from '@lynx-js/types';
/** Visual viewport height; the slide and image keep their full layout height. */
export function swiperCardFrame(value: number, height: number, neighborHeight: number): CSSProperties {
  const neighbor = Math.max(0, 1 - Math.abs(Math.abs(value) - 1));
  return { height: `${height - Math.max(0, height - neighborHeight) * neighbor}px` };
}
