import { forwardRef, useCallback, useEffect, useImperativeHandle, useMainThreadRef, useMemo, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, MainThread } from '@lynx-js/types';
import { Swiper as NativeSwiper, SwiperItem as NativeSwiperItem } from '@lynx-js/lynx-ui';
import type { SwiperRef as NativeSwiperRef } from '@lynx-js/lynx-ui';
import { SwiperNav } from './SwiperNav.js';
import { Img } from './Img.js';
import type { ImgMode } from './imgModel.js';
import { imgDimension } from './imgModel.js';
import { swiperIndex, swiperNumber } from './swiperModel.js';
import { swiperCardFrame } from './swiperAnimation.js' with { runtime:'shared' };
export type SwiperItem = string | Record<string,unknown>;
export type SwiperChangeSource = 'autoplay'|'touch'|'nav';
export type SwiperIndicator = {type?:'dots'|'dots-bar'|'fraction';minShowNum?:number;showControls?:boolean};
export type SwiperRef = {swipeTo:(index:number)=>void;swipeNext:()=>void;swipePrev:()=>void};
export type SwiperProps = {
 list:readonly SwiperItem[];current?:number;defaultCurrent?:number;onChange?:(current:number,source:SwiperChangeSource)=>void;onClick?:(index:number,item:SwiperItem)=>void;
 autoplay?:boolean;interval?:number;duration?:number;loop?:boolean;height?:number|string;displayMultipleItems?:number;previousMargin?:number;nextMargin?:number;neighborHeight?:number;
 indicator?:boolean|SwiperIndicator;indicatorPosition?:'left'|'top-left'|'top'|'top-right'|'bottom-left'|'bottom'|'bottom-right'|'right';
 valueKey?:string;textKey?:string;imageMode?:ImgMode;renderItem?:(options:{item:SwiperItem;index:number})=>ReactNode;renderIndicator?:(options:{current:number;total:number})=>ReactNode;
 customIndicatorClass?:string;customItemClass?:string;customPrevClass?:string;customNextClass?:string;customTextClass?:string;customTextStyle?:CSSProperties;className?:string;style?:CSSProperties;
};
type CardFrames = ReturnType<typeof useMainThreadRef<Record<number, MainThread.Element | undefined>>>;
function SwiperCardViewport({ frames, realIndex, value, height, neighborHeight, children, caption }: { frames: CardFrames; realIndex: number; value: number; height: number; neighborHeight: number; children: ReactNode; caption?: ReactNode }) {
 function attach(element: MainThread.Element | null) {
  'main thread';
  const registered=frames.current;
  if(!registered)return;
  if(element)registered[realIndex]=element;else delete registered[realIndex];
 }
 return <view className="ui-swiper-card-viewport ui-swiper-image" style={swiperCardFrame(value,height,neighborHeight)} flatten={false} main-thread:ref={attach}>
  <view className="ui-swiper-card-content" style={{height:`${height}px`}}>{children}</view>
  {caption}
 </view>;
}
/** Horizontal paging and touch animations run in lynx-ui's main-thread Swiper. */
export const Swiper=forwardRef<SwiperRef,SwiperProps>(function Swiper({list,current,defaultCurrent=0,onChange,onClick,autoplay=true,interval=5000,duration=300,loop=true,height=192,displayMultipleItems=1,previousMargin=0,nextMargin=0,neighborHeight,indicator=true,indicatorPosition='bottom',valueKey='value',textKey='text',imageMode='aspectFill',renderItem,renderIndicator,customIndicatorClass='',customItemClass='',customPrevClass='',customNextClass='',customTextClass='',customTextStyle,className='',style},ref){
 const count=list.length,[inner,setInner]=useState(defaultCurrent),actual=swiperIndex(current??inner,count,loop),[nativeIndex,setNativeIndex]=useState(actual),[box,setBox]=useState({width:0,height:0}),[dragging,setDragging]=useState(false),native=useRef<NativeSwiperRef>(null);
 const pending=useRef<{index:number;source:SwiperChangeSource;notify:boolean}|null>(null),previousCurrent=useRef(current),draggingRef=useRef(false),latest=useRef(actual),ready=box.width>0&&box.height>0&&count>0;latest.current=actual;
 const data=useMemo(()=>[...list],[list]);
 const before=swiperNumber(previousMargin,0,0,Math.max(0,box.width-1)),after=swiperNumber(nextMargin,0,0,Math.max(0,box.width-before-1)),viewport=Math.max(1,box.width-before-after),multiple=Math.max(1,Math.floor(swiperNumber(displayMultipleItems,1,1,Math.max(1,count)))),itemWidth=viewport/multiple;
 const card=neighborHeight!==undefined,smallHeight=swiperNumber(neighborHeight,box.height,0,box.height);
 const cardFrames=useMainThreadRef<Record<number,MainThread.Element|undefined>>({});
 function cardAnimation(value:number,index:number){
  'main thread';
  cardFrames.current[index]?.setStyleProperties(swiperCardFrame(value,box.height,smallHeight) as Record<string,string>);
  return {};
 }
 // First-screen card viewports get the same curve in their own inline style.
 // The native SwiperItem itself always retains its fixed paging geometry.
 const cardFirstFrame=()=>({});
 const change=useCallback((next:number)=>{
  'background only';
  const normalized=swiperIndex(next,count,loop),request=pending.current;
  if(request&&request.index!==normalized)return;
  pending.current=null;draggingRef.current=false;setDragging(false);setNativeIndex(normalized);
  if(normalized===latest.current&&!request)return;
  if(current===undefined){latest.current=normalized;setInner(normalized);}
  if(!request||request.notify)onChange?.(normalized,request?.source??'touch');
 },[count,loop,current,onChange]);
 const move=(target:number,source:SwiperChangeSource='nav')=>{
  'background only';if(!ready||(draggingRef.current&&!pending.current)||!native.current)return;
  const next=swiperIndex(target,count,loop);if(next===latest.current)return;
  pending.current={index:next,source,notify:true};if(loop&&target===latest.current+1)native.current.swipeNext();else if(loop&&target===latest.current-1)native.current.swipePrev();else native.current.swipeTo(next,{animate:true});
 };
 useImperativeHandle(ref,()=>({swipeTo:index=>move(index),swipeNext:()=>move(latest.current+1),swipePrev:()=>move(latest.current-1)}),[ready,count,loop,actual]);
 useEffect(()=>{
  if(!ready||dragging)return;
  const propChanged=previousCurrent.current!==current;previousCurrent.current=current;
  if(actual===nativeIndex||pending.current?.index===actual)return;
  pending.current={index:actual,source:'nav',notify:propChanged};native.current?.swipeTo(actual,{animate:propChanged});
 },[actual,current,nativeIndex,ready,count,loop,dragging]);
 useEffect(()=>{
  if(!ready||!autoplay||dragging||count<=1||(!loop&&actual===count-1))return;
  const timer=setTimeout(()=>move(latest.current+1,'autoplay'),swiperNumber(interval,5000,16));return()=>clearTimeout(timer);
 },[ready,autoplay,dragging,count,loop,actual,interval]);
 const swipeStart=useCallback(()=>{ 'background only';draggingRef.current=true;setDragging(true); },[]);
 const config=typeof indicator==='object'?indicator:{},slot=(node:ReactNode)=>typeof node==='string'||typeof node==='number'?<text>{node}</text>:node;
 const nativeLayer=useMemo(()=>ready?<view className="ui-swiper-clip"><view className="ui-swiper-native" style={{marginLeft:`${before}px`,width:`${viewport}px`,height:`${box.height}px`}}><NativeSwiper ref={native} swiperKey={`${count}:${loop}:${viewport}:${multiple}:${box.height}`} data={data} itemWidth={itemWidth} containerWidth={viewport} itemHeight={box.height} initialIndex={actual} loop={loop&&count>1} duration={swiperNumber(duration,300)} autoPlay={false} loopDuplicateCount={Math.min(count,Math.max(2,multiple+1))} main-thread:customAnimation={card?cardAnimation:undefined} customAnimationFirstScreen={card?cardFirstFrame:undefined} experimentalHorizontalSwipeOnly mode="normal" modeConfig={{align:'start'}} onSwipeStart={swipeStart} onSwipeStop={change} style={{overflow:'visible'}}>
   {({item,index,realIndex})=>{
    const content=renderItem?slot(renderItem({item,index})):<Img className={card?'ui-swiper-card-image':'ui-swiper-image'} width="100%" height={box.height} src={typeof item==='string'?item:typeof item[valueKey]==='string'?item[valueKey] as string:''} mode={imageMode} showLoading={false} showError={false}/>;
    const caption=typeof item!=='string'&&item[textKey]!==undefined?<text className={`ui-swiper-title ${customTextClass}`} style={customTextStyle}>{String(item[textKey])}</text>:null;
    return <NativeSwiperItem><view className={`ui-swiper-item ${customItemClass} ${index===swiperIndex(actual-1,count,loop)?customPrevClass:''} ${index===swiperIndex(actual+1,count,loop)?customNextClass:''}`} style={{width:`${itemWidth}px`,height:`${box.height}px`}} bindtap={()=>{ 'background only';if(!draggingRef.current)onClick?.(index,item); }}>
     {card?<SwiperCardViewport frames={cardFrames} realIndex={realIndex} value={realIndex-actual} height={box.height} neighborHeight={smallHeight} caption={caption}>{content}</SwiperCardViewport>:<>{content}{caption}</>}
    </view></NativeSwiperItem>;
   }}
  </NativeSwiper></view></view>:null,[ready,before,viewport,box.height,count,loop,multiple,itemWidth,data,actual,duration,card,smallHeight,swipeStart,change,renderItem,onClick,customItemClass,customPrevClass,customNextClass,valueKey,textKey,imageMode,customTextClass,customTextStyle]);
 return <view className={`ui-swiper ${card?'ui-swiper-card-motion':''} ${className}`} style={{height:imgDimension(height,192),...style}} flatten={false} bindtouchstart={()=>{ 'background only';pending.current=null; }}>
  <view className="ui-swiper-measure" flatten={false} user-interaction-enabled={false} event-through bindlayoutchange={event=>{const {width:w,height:h}=event.detail;if(w>=0&&h>=0&&Number.isFinite(w)&&Number.isFinite(h))setBox(previous=>previous.width===w&&previous.height===h?previous:{width:w,height:h});}}/>
  {nativeLayer}
  {renderIndicator?slot(renderIndicator({current:actual,total:count})):indicator!==false?<SwiperNav current={actual} total={count} type={config.type} minShowNum={config.minShowNum} showControls={config.showControls} indicatorPosition={indicatorPosition} className={customIndicatorClass} hidePrev={!loop&&actual===0} hideNext={!loop&&actual===count-1} onSelect={index=>move(index)} onChange={({dir})=>move(actual+(dir==='next'?1:-1))}/>:null}
 </view>;
});
