import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { imgDimension } from './imgModel.js';
export type SkeletonTheme = 'avatar' | 'image' | 'text' | 'paragraph';
export type SkeletonCell = {
  type?: 'text' | 'rect' | 'circle'; size?: number | string; width?: number | string; height?: number | string;
  margin?: number | string; marginLeft?: number | string; marginRight?: number | string;
  borderRadius?: number | string; background?: string; backgroundColor?: string;
};
export type SkeletonRow = number | SkeletonCell | readonly SkeletonCell[];
export type SkeletonProps = {
  theme?: SkeletonTheme; rowCol?: readonly SkeletonRow[]; loading?: boolean;
  animation?: '' | 'gradient' | 'flashed'; children?: ReactNode; className?: string; style?: CSSProperties;
};
const themes: Record<SkeletonTheme, readonly SkeletonRow[]> = {
  avatar: [{ type:'circle',size:64 }], image: [{ type:'rect',size:64 }],
  text: [1,[{ width:'24%',height:16,marginRight:16 },{ width:'76%',height:16 }]], paragraph: [1,1,1,{ width:'55%' }],
};
export function skeletonRows(rowCol: readonly SkeletonRow[] | undefined, theme: SkeletonTheme): SkeletonCell[][] {
  return (rowCol?.length ? rowCol : themes[theme]).map(row => typeof row === 'number' ? Array.from({length:Number.isFinite(row) ? Math.max(0,Math.min(100,Math.floor(row))) : 0},()=>({})) : Array.isArray(row) ? [...row] : [row as SkeletonCell]);
}
function cellStyle(cell: SkeletonCell): CSSProperties {
  const style: CSSProperties = {};
  if (cell.size !== undefined) { style.width=imgDimension(cell.size,16);style.height=style.width; }
  for (const key of ['width','height','margin','marginLeft','marginRight','borderRadius'] as const) if (cell[key] !== undefined) style[key] = typeof cell[key] === 'number' && key.startsWith('margin') ? `${Number.isFinite(cell[key]) ? cell[key] : 0}px` : imgDimension(cell[key],0);
  if (cell.background !== undefined) style.background=cell.background;
  if (cell.backgroundColor !== undefined) style.backgroundColor=cell.backgroundColor;
  return style;
}
export function Skeleton({ theme='text',rowCol,loading=true,animation='',children,className='',style }: SkeletonProps) {
  const rows=skeletonRows(rowCol,theme);
  return <view className={`ui-skeleton ${className}`} style={style} accessibility-element={loading} accessibility-label={loading ? '加载中' : undefined}>
    {loading ? <view className="ui-skeleton-content">{rows.map((row,index)=><view className={`ui-skeleton-row ${index===rows.length-1 ? 'ui-skeleton-row-last' : ''}`} key={index}>{row.map((cell,col)=><view className={`ui-skeleton-col ui-skeleton-${cell.type || 'text'} ${animation ? `ui-skeleton-animation-${animation}` : ''}`} key={col} style={{...(row.length>1&&typeof (rowCol?.length?rowCol:themes[theme])[index] ==='number' ? {flex:1,width:undefined,marginRight:col<row.length-1?'12px':0} : {}),...cellStyle(cell)}}>{animation==='gradient' ? <view className="ui-skeleton-shimmer"/> : null}</view>)}</view>)}</view> : typeof children === 'string' || typeof children === 'number' ? <text>{children}</text> : children}
  </view>;
}
