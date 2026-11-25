import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { Img } from './Img.js';
import { Overlay } from './Overlay.js';
import { Swiper } from './Swiper.js';
import { swiperIndex } from './swiperModel.js';
const emptyImages:readonly string[]=[];
export type ImagePreviewOptions={
 images?:readonly string[];startPosition?:number;showIndex?:boolean;loop?:boolean;closeable?:boolean;closeIcon?:string;closeIconPosition?:'top-left'|'top-right';closeOnClick?:boolean;zIndex?:number;
 onOpen?:()=>void;onClose?:()=>void;onChange?:(index:number)=>void;onClick?:(index:number)=>void;onLongPress?:(index:number)=>void;
};
export type ImagePreviewSlot={current:number;total:number;images:readonly string[];close:()=>void};
export type ImagePreviewProps=ImagePreviewOptions&{
 show?:boolean;onShowChange?:(show:boolean)=>void;options?:ImagePreviewOptions;requestKey?:number;rootPortal?:boolean;duration?:number;
 renderClose?:(close:()=>void)=>ReactNode;renderIndicator?:(info:{current:number;total:number})=>ReactNode;renderContent?:(info:ImagePreviewSlot)=>ReactNode;
 className?:string;style?:CSSProperties;
};
export type ImagePreviewRef={open:(input?:readonly string[]|ImagePreviewOptions)=>void;close:()=>void;setActive:(index:number)=>void};
/** Native image fitting, main-thread paging and the shared scroll-locking overlay. */
export const ImagePreview=forwardRef<ImagePreviewRef,ImagePreviewProps>(function ImagePreview({show,onShowChange,options,requestKey=0,rootPortal=false,duration=300,renderClose,renderIndicator,renderContent,className='',style,...defaults},ref){
 const [innerShow,setInnerShow]=useState(false),[imperative,setImperative]=useState<ImagePreviewOptions>({}),[revision,setRevision]=useState(0);
 const settings={...defaults,...options,...imperative},visible=show??innerShow;
 const [active,setActive]=useState(visible);
 const {images=emptyImages,startPosition=0,showIndex=true,loop=true,closeable=true,closeIcon='close',closeIconPosition='top-right',closeOnClick=true,zIndex=1000}=settings;
 const [current,setCurrent]=useState(()=>swiperIndex(startPosition,images.length,false)),index=swiperIndex(current,images.length,false);
 const state=useRef({visible,index,settings,onShowChange}),closing=useRef(false),wasVisible=useRef(false);state.current={visible,index,settings,onShowChange};
 const close=()=>{
  'background only';
  if(!state.current.visible||closing.current)return;
  closing.current=true;setInnerShow(false);state.current.onShowChange?.(false);
 };
 useImperativeHandle(ref,()=>({open(input){
  'background only';setImperative(input===undefined?{}:Array.isArray(input)?{images:input}:input as ImagePreviewOptions);setRevision(value=>value+1);closing.current=false;setInnerShow(true);state.current.onShowChange?.(true);
 },close,setActive(value){ 'background only';setCurrent(swiperIndex(value,state.current.settings.images?.length??0,false)); }}),[]);
 useEffect(()=>{
  if(!visible)return;
  setActive(true);closing.current=false;setCurrent(swiperIndex(startPosition,images.length,false));
 },[visible,requestKey,revision,startPosition,images]);
 useEffect(()=>{
  if(visible&&!wasVisible.current)state.current.settings.onOpen?.();
  else if(!visible&&wasVisible.current)state.current.settings.onClose?.();
  wasVisible.current=visible;
 },[visible]);
 const slot=(node:ReactNode)=>typeof node==='string'||typeof node==='number'?<text>{node}</text>:node;
 return <Overlay show={visible} duration={duration} rootPortal={rootPortal} zIndex={zIndex} lockScroll className={`ui-image-preview ${className}`} style={style} onAfterLeave={()=>{ 'background only';closing.current=false;setActive(false); }}>
  {active?<Swiper key={`${requestKey}:${revision}`} list={images} height="100%" current={index} autoplay={false} loop={loop} indicator={false} className="ui-image-preview-swiper" onChange={next=>{ 'background only';if(!state.current.visible||closing.current)return;setCurrent(next);state.current.settings.onChange?.(next); }} onClick={clicked=>{ 'background only';if(!state.current.visible||closing.current)return;state.current.settings.onClick?.(clicked);if(closeOnClick)close(); }} renderItem={({item,index:itemIndex})=><view className="ui-image-preview-item" bindlongpress={()=>{ 'background only';if(state.current.visible&&!closing.current)state.current.settings.onLongPress?.(itemIndex); }}><Img src={String(item)} width="100%" height="100%" mode="aspectFit" showLoading={false} showError={false}/></view>}/>:null}
  {renderIndicator?<view className="ui-image-preview-custom-indicator" event-through>{slot(renderIndicator({current:index,total:images.length}))}</view>:showIndex&&images.length>1?<text className="ui-image-preview-index">{`${index+1} / ${images.length}`}</text>:null}
  {renderClose?<view className="ui-image-preview-custom-close" catchtap={()=>{}}>{slot(renderClose(close))}</view>:closeable?<view className={`ui-image-preview-close ui-image-preview-close-${closeIconPosition}`} catchtap={close} accessibility-element accessibility-traits="button" accessibility-label="关闭图片预览"><Icon name={closeIcon} size={24} color="#fff"/></view>:null}
  {renderContent?<view className="ui-image-preview-content" event-through>{slot(renderContent({current:index,total:images.length,images,close}))}</view>:null}
 </Overlay>;
});
