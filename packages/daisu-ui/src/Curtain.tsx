import { useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { BaseEvent, CSSProperties, ImageErrorEvent, ImageLoadEvent } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { LayerCloseButton } from './LayerCloseButton.js';
import { Popup } from './Popup.js';
import type { LayerLifecycle } from './Overlay.js';
export type CurtainClosePosition = 'inset'|'top'|'bottom'|'top-left'|'top-right'|'bottom-left'|'bottom-right';
export type CurtainProps = LayerLifecycle & {
 value:boolean;onChange?:(value:boolean)=>void;src:string;width?:number;to?:string;
 closePosition?:CurtainClosePosition;closeOnClickModal?:boolean;closeOnClick?:boolean;zIndex?:number;rootPortal?:boolean;
 onNavigate?:(url:string)=>void;onClick?:()=>void;onClose?:(reason:'close'|'modal'|'image')=>void;onClickModal?:()=>void;onClosed?:()=>void;
 onLoad?:(event:BaseEvent<'load',ImageLoadEvent>)=>void;onError?:(event:BaseEvent<'error',ImageErrorEvent>)=>void;
 renderClose?:(close:()=>void)=>ReactNode;customCloseClass?:string;customCloseStyle?:CSSProperties;className?:string;style?:CSSProperties;
};
export function Curtain(props:CurtainProps){return <CurtainSource key={props.src} {...props}/>;}
function CurtainSource({value,onChange,src,width,closePosition='inset',closeOnClickModal=false,closeOnClick=true,zIndex=10,rootPortal=false,to,onNavigate,onClick,onClose,onClickModal,onClosed,onLoad,onError,renderClose,customCloseClass='',customCloseStyle,className='',style,onAfterLeave,...lifecycle}:CurtainProps){
 const [natural,setNatural]=useState({width:300,height:300}),[failed,setFailed]=useState(false);
 const actualWidth=width===undefined?natural.width:Number.isFinite(width)?Math.max(1,width):300;
 const close=(reason:'close'|'modal'|'image')=>{'background only';if(!value||failed)return;onChange?.(false);onClose?.(reason);};
 return <Popup {...lifecycle} show={value&&!failed} onChange={()=>{ 'background only';close('modal'); }} onClickModal={onClickModal} onAfterLeave={()=>{ 'background only';onAfterLeave?.();onClosed?.(); }} rootPortal={rootPortal} zIndex={zIndex} transition="zoom-in" closeOnClickModal={closeOnClickModal} className={`ui-curtain ${className}`} style={{width:`${actualWidth}px`,...style}}>
  <view className="ui-curtain-content">
   <image className="ui-curtain-image" src={src} mode="scaleToFill" style={{width:`${actualWidth}px`,height:`${actualWidth*natural.height/natural.width}px`}} bindload={event=>{ 'background only';const {width:w,height:h}=event.detail;if(w>0&&h>0)setNatural({width:w,height:h});setFailed(false);onLoad?.(event); }} binderror={event=>{ 'background only';setFailed(true);onError?.(event); }} bindtap={()=>{ 'background only';if(!value||failed)return;if(to)onNavigate?.(to);onClick?.();if(closeOnClick)close('image'); }}/>
   {renderClose?renderClose(()=>{ 'background only';close('close'); }):<LayerCloseButton show={value&&!failed} className={`ui-curtain-close ui-curtain-close-${closePosition} ${customCloseClass}`} style={customCloseStyle} onClose={()=>{ 'background only';close('close'); }} label="关闭幕帘"><Icon name="close" size={24} color={typeof customCloseStyle?.color==='string'?customCloseStyle.color:undefined}/></LayerCloseButton>}
  </view>
 </Popup>;
}
