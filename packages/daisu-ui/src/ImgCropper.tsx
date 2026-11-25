import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from '@lynx-js/react';
import type { CSSProperties, NodesRef, StandardProps } from '@lynx-js/types';
import { Overlay } from './Overlay.js';
import { cropperAspect } from './imgCropperModel.js';
import type { ImgCropperConfig, ImgCropperResult, ImgCropperSignal } from './imgCropperModel.js';
export type { ImgCropperResult } from './imgCropperModel.js';
type BrowserCropperProps=StandardProps&{'cropper-config':string;ref?:{current:NodesRef|null};bindcropperevent?:(event:{detail:ImgCropperSignal})=>void};
declare module '@lynx-js/types' {interface IntrinsicElements {'daisu-img-cropper':BrowserCropperProps}}
declare global {namespace JSX {interface IntrinsicElements {'daisu-img-cropper':BrowserCropperProps}}}
export type ImgCropperProps={
  show?:boolean;onShowChange?:(show:boolean)=>void;imgSrc?:string;imgWidth?:number|string;imgHeight?:number|string;
  aspectRatio?:string;disabledRotate?:boolean;exportScale?:number;maxScale?:number;quality?:number;fileType?:'png'|'jpg'|'jpeg';
  cancelButtonText?:string;confirmButtonText?:string;autoChoose?:boolean;mode?:'browser'|'none';rootPortal?:boolean;topInset?:number;zIndex?:number;
  onConfirm?:(result:ImgCropperResult)=>void;onCancel?:()=>void;onImgLoaded?:(event:{res:{width:number;height:number}})=>void;
  onImgLoadError?:(event:{err:string})=>void;onError?:(error:{message:string;phase?:string})=>void;className?:string;style?:CSSProperties;
};
export type ImgCropperRef={open:(src?:string)=>boolean;close:()=>void;chooseImage:()=>boolean;confirm:()=>boolean;setRotate:(deg:number)=>boolean;resetImg:()=>boolean;revertIsAnimation:(animation:boolean)=>boolean;downloadResult:(url:string)=>boolean;revokeResult:(url:string)=>void};

/** Browser canvas editor. The browser host must call registerImgCropper(). */
export const ImgCropper=forwardRef<ImgCropperRef,ImgCropperProps>(function ImgCropper({show,onShowChange,imgSrc='',imgWidth,imgHeight,aspectRatio='1:1',disabledRotate=false,exportScale=2,maxScale=3,quality=1,fileType='png',cancelButtonText='取消',confirmButtonText='完成',autoChoose=false,mode='none',rootPortal=false,topInset=0,zIndex=1000,onConfirm,onCancel,onImgLoaded,onImgLoadError,onError,className='',style},ref){
 const [innerShow,setShow]=useState(false),[override,setOverride]=useState<string>(),node=useRef<NodesRef|null>(null),closing=useRef(false);
 const visible=show??innerShow;
 const error=useMemo(()=>{try{cropperAspect(aspectRatio);if(!['png','jpg','jpeg'].includes(fileType))throw new Error('fileType 应为 png 或 jpg');for(const dimension of [imgWidth,imgHeight])if(dimension!==undefined&&!(typeof dimension==='number'&&Number.isFinite(dimension)&&dimension>0)&&!(typeof dimension==='string'&&/^\d+(\.\d+)?%$/.test(dimension)&&parseFloat(dimension)>0))throw new Error('初始图片尺寸应为正数 px 或百分比');if(!Number.isFinite(exportScale)||exportScale<=0||exportScale>8)throw new Error('exportScale 应为0–8内的正数');if(!Number.isFinite(maxScale)||maxScale<1||maxScale>20)throw new Error('maxScale 应为1–20');if(!Number.isFinite(quality)||quality<0||quality>1)throw new Error('quality 应为0–1');return '';}catch(reason){return String(reason);}},[aspectRatio,exportScale,maxScale,quality,fileType,imgWidth,imgHeight]);
 const state=useRef({visible,onShowChange,onConfirm,onCancel,onImgLoaded,onImgLoadError,onError,mode,error});state.current={visible,onShowChange,onConfirm,onCancel,onImgLoaded,onImgLoadError,onError,mode,error};
 const change=(value:boolean)=>{'background only';setShow(value);state.current.onShowChange?.(value);};
 const cancel=()=>{'background only';if(!state.current.visible||closing.current)return;closing.current=true;change(false);state.current.onCancel?.();};
 const invoke=(method:string,params:Record<string,unknown>={},closed=false)=>{'background only';if(state.current.mode!=='browser'||!node.current||(!closed&&!state.current.visible))return false;node.current.invoke({method,params}).exec();return true;};
 useImperativeHandle(ref,()=>({
  open(src){'background only';if(state.current.mode!=='browser'||state.current.error){state.current.onError?.({message:state.current.error||'当前环境不支持图片裁剪'});return false;}setOverride(src);closing.current=false;change(true);return true;},close:cancel,
  chooseImage(){'background only';return invoke('chooseImage');},confirm(){'background only';return invoke('confirm');},
  setRotate(deg){'background only';return Number.isFinite(deg)&&!disabledRotate&&invoke('setRotate',{deg});},resetImg(){'background only';return invoke('resetImg');},
  revertIsAnimation(animation){'background only';return invoke('revertIsAnimation',{animation});},downloadResult(url){'background only';return invoke('downloadResult',{url},true);},revokeResult(url){'background only';invoke('revokeResult',{url},true);}
 }),[disabledRotate]);
 useEffect(()=>{if(visible)closing.current=false;if(visible&&(error||mode!=='browser'))state.current.onError?.({message:error||'当前环境不支持图片裁剪',phase:'config'});},[visible,error,mode]);
 const inset=Math.max(0,Number.isFinite(topInset)?topInset:0),config:ImgCropperConfig&{topInset:number;autoChoose:boolean}={show:visible&&!error,imgSrc:override??imgSrc,imgWidth,imgHeight,aspectRatio,disabledRotate,exportScale,maxScale,quality,fileType:fileType==='jpeg'?'jpg':fileType,cancelButtonText,confirmButtonText,topInset:inset,autoChoose};
 return <Overlay show={visible&&mode==='browser'&&!error} rootPortal={rootPortal} duration={0} zIndex={zIndex} style={{top:`${inset}px`,backgroundColor:'#000'}} lockScroll>
  {mode==='browser'?<daisu-img-cropper ref={node} className={`ui-img-cropper ${className}`} style={style} cropper-config={JSON.stringify(config)} bindcropperevent={({detail:event}:{detail:ImgCropperSignal})=>{
   'background only';if(!state.current.visible||closing.current)return;
   if(event.kind==='confirm'&&event.result){closing.current=true;try{state.current.onConfirm?.(event.result);}finally{change(false);}}
   else if(event.kind==='cancel')cancel();
   else if(event.kind==='loaded')state.current.onImgLoaded?.({res:{width:event.width||0,height:event.height||0}});
   else if(event.kind==='error'){if(event.phase!=='export')state.current.onImgLoadError?.({err:event.message||'图片处理失败'});state.current.onError?.({message:event.message||'图片处理失败',phase:event.phase});}
  }}/>:null}
 </Overlay>;
});
