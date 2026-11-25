import type { CSSProperties } from '@lynx-js/types';
/** Same pure calculation is used for the first frame and native offset updates. */
export function swiperCardFrame(value:number,height:number,neighborHeight:number):CSSProperties {
  const weight=Math.max(0,1-Math.abs(Math.abs(value)-1));
  const size=height-(height-neighborHeight)*weight;
  return {height:`${size}px`,transform:`translateY(${(height-size)/2}px)`};
}
