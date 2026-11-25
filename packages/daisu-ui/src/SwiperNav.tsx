import type { CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
export type SwiperNavProps={current?:number;total?:number;type?:'dots'|'dots-bar'|'fraction';indicatorPosition?:'left'|'top-left'|'top'|'top-right'|'bottom-left'|'bottom'|'bottom-right'|'right';minShowNum?:number;showControls?:boolean;hidePrev?:boolean;hideNext?:boolean;onChange?:(event:{dir:'prev'|'next'})=>void;onSelect?:(index:number)=>void;className?:string;style?:CSSProperties};
export function SwiperNav({current=0,total=0,type='dots',indicatorPosition='bottom',minShowNum=2,showControls=false,hidePrev=false,hideNext=false,onChange,onSelect,className='',style}:SwiperNavProps){
 const count=Number.isFinite(total)?Math.max(0,Math.floor(total)):0,index=Number.isFinite(current)?Math.max(0,Math.min(count-1,Math.floor(current))):0;
 return <>
  {count>=Math.max(1,Number.isFinite(minShowNum)?minShowNum:2)?<view className={`ui-swiper-indicator ui-swiper-indicator-${type} ui-swiper-indicator-${indicatorPosition} ${className}`} style={style}>
   {type==='fraction'?<text className="ui-swiper-fraction">{`${index+1}/${count}`}</text>:Array.from({length:count},(_,i)=><view key={i} className={`ui-swiper-dot ${type==='dots-bar'?'ui-swiper-dot-bar':''} ${i===index?'ui-swiper-dot-active':''}`} catchtap={onSelect?()=>onSelect(i):undefined}/>)}
  </view>:null}
  {showControls&&count>1?<>{!hidePrev?<view className="ui-swiper-control ui-swiper-control-prev" catchtap={()=>onChange?.({dir:'prev'})} accessibility-element accessibility-traits="button" accessibility-label="上一张"><Icon name="arrow-left" size={16} color="#fff"/></view>:null}{!hideNext?<view className="ui-swiper-control ui-swiper-control-next" catchtap={()=>onChange?.({dir:'next'})} accessibility-element accessibility-traits="button" accessibility-label="下一张"><Icon name="arrow-right" size={16} color="#fff"/></view>:null}</>:null}
 </>;
}
