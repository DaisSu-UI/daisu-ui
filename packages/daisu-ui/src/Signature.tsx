import { useDragEvents } from './useDragEvents.js';
import { useFrameTask } from './useFrameTask.js';
import { useLocale } from './useLocale.js';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, NodesRef, TouchEvent, MouseEvent } from '@lynx-js/types';
import { Button } from './Button.js';
import { signatureNumber, signaturePng, signatureSvg, signatureWidth } from './signatureModel.js';
import type { SignaturePoint, SignatureResult, SignatureStroke } from './signatureModel.js';
export type { SignaturePoint, SignatureResult, SignatureStroke } from './signatureModel.js';
export type SignatureRef = { init: (forceUpdate?:boolean) => Promise<void>; clear:()=>void; confirm:()=>SignatureResult; revoke:()=>void; restore:()=>void };
export type SignatureFooter = SignatureRef & { currentStep:number; historyList:readonly SignatureStroke[]; canUndo:boolean; canRedo:boolean };
export type SignatureProps = {
  width?:number|string; height?:number; penColor?:string; lineWidth?:number; backgroundColor?:string; exportScale?:number;
  disabled?:boolean; disableScroll?:boolean; enableHistory?:boolean; step?:number; pressure?:boolean; minWidth?:number; maxWidth?:number; minSpeed?:number;
  clearText?:string; confirmText?:string; revokeText?:string; restoreText?:string; renderFooter?:(actions:SignatureFooter)=>ReactNode;
  onStart?:(event:TouchEvent|MouseEvent)=>void; onSigning?:(event:TouchEvent|MouseEvent)=>void; onEnd?:(event:TouchEvent|MouseEvent)=>void;
  onConfirm?:(result:SignatureResult)=>void; onClear?:()=>void; className?:string; style?:CSSProperties;
};
type Rect={left:number;top:number;width:number;height:number};
type Input=TouchEvent|MouseEvent;
type RawPoint={x:number;y:number;time:number};
type Gesture={id?:number;ticket:number;raw:RawPoint[];rect?:Rect;stroke:SignatureStroke;ended?:Input};
const emptyResult=(error:string):SignatureResult=>({success:false,dataUrl:'',width:0,height:0,error});
export const Signature=forwardRef<SignatureRef,SignatureProps>(function Signature({width='100%',height=150,penColor='#000',lineWidth=3,backgroundColor='transparent',exportScale=1,disabled=false,disableScroll=true,enableHistory=false,step=1,pressure=false,minWidth=2,maxWidth=6,minSpeed=1.5,clearText,confirmText,revokeText,restoreText,renderFooter,onStart,onSigning,onEnd,onConfirm,onClear,className='',style},ref){
  const { t: localeText } = useLocale();
  clearText ??= localeText('signature.clear');
  confirmText ??= localeText('common.confirmAction');
  revokeText ??= localeText('signature.undo');
  restoreText ??= localeText('signature.redo');

  const board=useRef<NodesRef>(null),size=useRef({width:300,height:signatureNumber(height,150,1)}),[dimensions,setDimensions]=useState(size.current);
  const history=useRef<SignatureStroke[]>([]),redo=useRef<SignatureStroke[]>([]),gesture=useRef<Gesture>(),sequence=useRef(0),mounted=useRef(true),[revision,redraw]=useState(0);
  const refresh=()=>{'background only';redraw(n=>n+1);};
  const drawFrame=useFrameTask(refresh);
  const cancel=()=>{'background only';drawFrame.cancel();sequence.current++;gesture.current=undefined;refresh();};
  const resize=(w:number,h:number)=>{'background only';if(!mounted.current||!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0)return;if(size.current.width!==w||size.current.height!==h){cancel();size.current={width:w,height:h};setDimensions(size.current);}};
  const measure=()=>{'background only';return new Promise<Rect|undefined>(resolve=>{if(!board.current){resolve(undefined);return;}board.current.invoke({method:'boundingClientRect',success:value=>{const r=value as Rect;resolve(Number.isFinite(r.left)&&Number.isFinite(r.top)&&r.width>0&&r.height>0?r:undefined);},fail:()=>resolve(undefined)}).exec();});};
  const init=async(forceUpdate=false)=>{'background only';const ticket=sequence.current,r=await measure();if(!r||ticket!==sequence.current||!mounted.current)return;resize(r.width,r.height);if(forceUpdate)refresh();};
  const clear=()=>{'background only';cancel();history.current=[];redo.current=[];refresh();onClear?.();};
  const confirm=()=>{'background only';let result:SignatureResult;try{if(gesture.current)result=emptyResult(localeText('signature.endDrawing'));else if(!history.current.length)result=emptyResult(localeText('signature.signFirst'));else result=signaturePng(history.current,size.current.width,size.current.height,exportScale,backgroundColor);}catch(error){result=emptyResult(error instanceof Error?error.message:localeText('signature.exportFailed'));}onConfirm?.(result);return result;};
  const revoke=()=>{'background only';if(!enableHistory||!history.current.length)return;cancel();const count=Math.min(history.current.length,Math.floor(signatureNumber(step,1,1)));redo.current=[...history.current.splice(-count),...redo.current];refresh();};
  const restore=()=>{'background only';if(!enableHistory||!redo.current.length)return;cancel();const count=Math.min(redo.current.length,Math.floor(signatureNumber(step,1,1)));history.current.push(...redo.current.splice(0,count));refresh();};
  useImperativeHandle(ref,()=>({init,clear,confirm,revoke,restore}));
  useEffect(()=>()=>{mounted.current=false;sequence.current++;gesture.current=undefined;},[]);
  useEffect(()=>{if(disabled)cancel();},[disabled]);
  const raw=(event:Input,id?:number):RawPoint|undefined=>{'background only';const e=event as TouchEvent;const touch=e.touches?.find(t=>id===undefined||t.identifier===id)??e.changedTouches?.find(t=>id===undefined||t.identifier===id);const p=touch??(event as MouseEvent);const x=p.clientX??p.x,y=p.clientY??p.y;return Number.isFinite(x)&&Number.isFinite(y)?{x,y,time:Date.now()}:undefined;};
  const append=(g:Gesture)=>{'background only';if(!g.rect)return;while(g.raw.length){const point=g.raw.shift()!,last=g.stroke.points[g.stroke.points.length - 1],x=Math.max(0,Math.min(g.rect.width,point.x-g.rect.left)),y=Math.max(0,Math.min(g.rect.height,point.y-g.rect.top));if(last&&Math.hypot(x-last.x,y-last.y)<.3)continue;const initial=pressure?(signatureNumber(minWidth,2,.1)+Math.max(signatureNumber(minWidth,2,.1),signatureNumber(maxWidth,6,.1)))/2:signatureNumber(lineWidth,3,.1);const next:SignaturePoint={x,y,time:point.time,width:pressure&&last?signatureWidth(Math.hypot(x-last.x,y-last.y)/Math.max(1,point.time-last.time),last.width,minWidth,maxWidth,minSpeed):initial};g.stroke.points.push(next);}drawFrame.schedule();};
  const commit=(g:Gesture)=>{'background only';if(g!==gesture.current||!g.ended||!g.rect)return;append(g);if(g.stroke.points.length){history.current.push(g.stroke);redo.current=[];}gesture.current=undefined;drawFrame.cancel();refresh();onEnd?.(g.ended);};
  const begin=async(event:Input)=>{'background only';if(disabled||gesture.current)return;const touch=event as TouchEvent;if((touch.touches?.length??1)>1)return;const p=raw(event);if(!p)return;const g:Gesture={ticket:++sequence.current,id:touch.touches?.[0]?.identifier,raw:[p],stroke:{color:penColor,points:[]}};gesture.current=g;onStart?.(event);const rect=await measure();if(!mounted.current||gesture.current!==g||sequence.current!==g.ticket)return;if(!rect){cancel();return;}size.current={width:rect.width,height:rect.height};setDimensions(size.current);g.rect=rect;append(g);commit(g);};
  const move=(event:Input)=>{'background only';const g=gesture.current;if(!g||disabled)return;if(((event as TouchEvent).touches?.length??1)>1){cancel();return;}const p=raw(event,g.id);if(!p)return;g.raw.push(p);append(g);onSigning?.(event);};
  const end=(event:Input)=>{'background only';const g=gesture.current;if(!g)return;const changed=(event as TouchEvent).changedTouches;if(g.id!==undefined&&changed?.length&&!changed.some(t=>t.identifier===g.id))return;const p=raw(event,g.id);if(p)g.raw.push(p);g.ended=event;commit(g);};
  const gestures=useDragEvents({disabled,onStart:event=>{'background only';void begin(event);return !!gesture.current;},onMove:move,onEnd:event=>{'background only';const id=gesture.current?.id,changed=(event as TouchEvent).changedTouches;if(id!==undefined&&changed?.length&&!changed.some(point=>point.identifier===id))return false;end(event);},onCancel:cancel});
  const strokes=[...history.current,...(gesture.current?.stroke.points.length?[gesture.current.stroke]:[])];
  void revision;
  const actions:SignatureFooter={init,clear,confirm,revoke,restore,currentStep:history.current.length,historyList:[...history.current,...redo.current],canUndo:enableHistory&&history.current.length>0,canRedo:enableHistory&&redo.current.length>0};
  return <view className={`ui-signature ${disabled?'ui-signature-disabled':''} ${className}`} style={{width:typeof width==='number'?`${signatureNumber(width,300)}px`:width,...style}}>
    <view className="ui-signature-content"><view ref={board} flatten={false} className="ui-signature-board" style={{height:`${signatureNumber(height,150,1)}px`}} bindlayoutchange={event=>resize(event.detail.width,event.detail.height)} consume-slide-event={!disabled&&disableScroll?[[-180,180]]:undefined} {...gestures} accessibility-element accessibility-label={disabled?localeText('signature.disabled'):localeText('signature.label')}>
      <svg className="ui-signature-svg" content={signatureSvg(strokes,dimensions.width,dimensions.height,backgroundColor)} style={{width:'100%',height:'100%'}} user-interaction-enabled={false}/>
    </view></view>
    <view className="ui-signature-footer">{renderFooter?renderFooter(actions):<>{enableHistory?<><Button size="small" label={revokeText} onTap={revoke} disabled={!actions.canUndo}/><Button size="small" label={restoreText} onTap={restore} disabled={!actions.canRedo}/></>:null}<Button size="small" label={clearText} onTap={clear}/><Button size="small" label={confirmText} onTap={()=>{ 'background only';confirm();}}/></>}</view>
  </view>;
});
