import { createContext, useContext, useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode, RefObject } from '@lynx-js/react';
import type { CSSProperties, NodesRef, IntersectionObserver } from '@lynx-js/types';
export type StickyProps = { offsetTop?: number; zIndex?: number; children?: ReactNode; className?: string; style?: CSSProperties };
export type StickyBoxProps = { children?: ReactNode; className?: string; style?: CSSProperties };
type Rect = { top:number;left:number;bottom:number;right:number;width:number;height:number };
let stickySequence=0;
// Allocate only after commit on the background thread; initial dual-thread renders agree.
function useStickyId(){
 const [id,setId]=useState('');
 useEffect(()=>{setId(`ui-sticky-${++stickySequence}`);},[]);
 return id;
}
type Placement = { position:'relative'|'fixed'|'absolute';top:number;left?:number };
const BoxContext=createContext<{id:string;node:RefObject<NodesRef>;revision:number}|undefined>(undefined);
function measure(node:NodesRef|null):Promise<Rect|undefined>{
  'background only';
  return new Promise(resolve=>{if(!node){resolve(undefined);return;}try{node.invoke({method:'boundingClientRect',success:value=>{const rect=value as Rect;resolve([rect.top,rect.left,rect.bottom,rect.right,rect.width,rect.height].every(Number.isFinite)?rect:undefined);},fail:()=>resolve(undefined)}).exec();}catch{resolve(undefined);}});
}
/** Keeps the same child mounted through normal, pinned and container-end positions. */
export function Sticky({offsetTop=0,zIndex=1,children,className='',style}:StickyProps){
 const id=useStickyId(),anchor=useRef<NodesRef>(null),box=useContext(BoxContext);
 const [size,setSize]=useState({width:0,height:0}),[placement,setPlacement]=useState<Placement>({position:'relative',top:0});
 const offset=Number.isFinite(offsetTop)?offsetTop:0,layer=Number.isFinite(zIndex)?zIndex:1;
 useEffect(()=>{
   let disposed=false,sequence=0;const observers:IntersectionObserver[]=[];
   const update=async()=>{
     'background only';
     const request=++sequence,[rect,boundary]=await Promise.all([measure(anchor.current),box?measure(box.node.current):Promise.resolve(undefined)]);
     if(disposed||request!==sequence||!rect||rect.width<=0)return;
     let next:Placement={position:'relative',top:0};
     if(size.height>0&&rect.top<=offset&&(!boundary||boundary.height>size.height)){
       next=boundary&&boundary.bottom<=offset+size.height?{position:'absolute',top:boundary.bottom-rect.top-size.height}:{position:'fixed',top:offset,left:rect.left};
     }
     setPlacement(previous=>previous.position===next.position&&Math.abs(previous.top-next.top)<.1&&previous.left===next.left?previous:next);
   };
   const observe=(target:string)=>{
     'background only';
     const observer=lynx.createIntersectionObserver({componentId:''},{thresholds:[]});
     observer.relativeToViewport({top:-(offset+Math.max(size.height,1))});observer.observe(`#${target}-sentinel`,()=>{void update();});observers.push(observer);
   };
   if(id)observe(id);if(box?.id)observe(box.id);void update();
   return()=>{disposed=true;sequence++;for(const observer of observers)observer.disconnect();};
 },[id,offset,size.width,size.height,box?.id,box?.revision]);
 return <view id={id||undefined} ref={anchor} flatten={false} className={`ui-sticky ${className}`} style={{...(size.width?{width:`${size.width}px`,height:`${size.height}px`}:{}),zIndex:layer,...style}}>
   <view id={id?`${id}-sentinel`:undefined} className="ui-sticky-sentinel" flatten={false}/>
   <view className="ui-sticky-container" style={{position:placement.position,top:`${placement.top}px`,...(placement.position==='fixed'?{left:`${placement.left}px`,width:`${size.width}px`}:{}),zIndex:layer}}>
     <view className="ui-sticky-content" flatten={false} bindlayoutchange={event=>{const {width,height}=event.detail;setSize(previous=>previous.width===width&&previous.height===height?previous:{width,height});}}>{typeof children==='string'||typeof children==='number'?<text>{children}</text>:children}</view>
   </view>
 </view>;
}
export function StickyBox({children,className='',style}:StickyBoxProps){
 const id=useStickyId(),node=useRef<NodesRef>(null),dimensions=useRef({width:0,height:0}),[revision,setRevision]=useState(0);
 return <BoxContext.Provider value={{id,node,revision}}><view id={id||undefined} ref={node} flatten={false} className={`ui-sticky-box ${className}`} style={style} bindlayoutchange={event=>{const {width,height}=event.detail;if(dimensions.current.width!==width||dimensions.current.height!==height){dimensions.current={width,height};setRevision(value=>value+1);}}}><view id={id?`${id}-sentinel`:undefined} className="ui-sticky-sentinel" flatten={false}/>{typeof children==='string'||typeof children==='number'?<text>{children}</text>:children}</view></BoxContext.Provider>;
}
