import { createContext, useContext, useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode, RefObject } from '@lynx-js/react';
import type { CSSProperties, NodesRef, IntersectionObserver } from '@lynx-js/types';
export type StickyProps = { offsetTop?: number; zIndex?: number; scrollTop?: number; children?: ReactNode; className?: string; style?: CSSProperties };
export type StickyBoxProps = { children?: ReactNode; className?: string; style?: CSSProperties };
type Rect = { top:number;left:number;bottom:number;right:number;width:number;height:number };
let stickySequence=0;
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
export function Sticky({offsetTop=0,zIndex=1,scrollTop,children,className='',style}:StickyProps){
 const id=useStickyId(),anchor=useRef<NodesRef>(null),box=useContext(BoxContext);
 const [size,setSize]=useState({width:0,height:0}),[placement,setPlacement]=useState<Placement>({position:'relative',top:0});
 const refresh=useRef<(() => void)|null>(null);
 const offset=Number.isFinite(offsetTop)?offsetTop:0,layer=Number.isFinite(zIndex)?zIndex:1;
 useEffect(()=>{
   let disposed=false,running=false,again=false,timer:ReturnType<typeof setTimeout>|undefined;const observers:IntersectionObserver[]=[];
   const request=()=>{
     'background only';
     if(disposed)return;
     if(running){again=true;return;}
     if(timer===undefined)timer=setTimeout(()=>{'background only';timer=undefined;void update();},16);
   };
   const update=async()=>{
     'background only';
     if(disposed||running)return;
     running=true;
     try{
       const [rect,boundary]=await Promise.all([measure(anchor.current),box?measure(box.node.current):Promise.resolve(undefined)]);
       if(disposed||!rect||rect.width<=0)return;
       let next:Placement={position:'relative',top:0};
       if(size.height>0&&rect.top<=offset&&(!boundary||boundary.height>size.height)){
         next=boundary&&boundary.bottom<=offset+size.height?{position:'absolute',top:boundary.bottom-rect.top-size.height}:{position:'fixed',top:offset,left:rect.left};
       }
       setPlacement(previous=>previous.position===next.position&&Math.abs(previous.top-next.top)<.5&&Math.abs((previous.left??0)-(next.left??0))<.5?previous:next);
     }finally{
       running=false;
       if(again&&!disposed){again=false;request();}
     }
   };
   refresh.current=request;
   const observe=(target:string)=>{
     'background only';
     // Omit thresholds to use the native [0] default. An empty list never
     // crosses a threshold on Android, so scrolling would not update Sticky.
     if(typeof lynx.createIntersectionObserver!=='function')return;
     try{
       const observer=lynx.createIntersectionObserver({componentId:''});
       observer.relativeToViewport({top:-(offset+Math.max(size.height,1))});observer.observe(`#${target}-sentinel`,request);observers.push(observer);
     }catch{/* Explicit scrollTop updates remain available on hosts without observers. */}
   };
   if(id)observe(id);if(box?.id)observe(box.id);void update();
   return()=>{disposed=true;clearTimeout(timer);if(refresh.current===request)refresh.current=null;for(const observer of observers)observer.disconnect();};
 },[id,offset,size.width,size.height,box?.id,box?.revision]);
 // Explicit native scroll events also correct missed/clipped observer crossings.
 useEffect(()=>{if(Number.isFinite(scrollTop))void refresh.current?.();},[scrollTop]);
 return <view id={id||undefined} ref={anchor} flatten={false} className={`ui-sticky ${className}`} style={{width:placement.position==='relative'?'auto':`${size.width}px`,height:placement.position==='relative'?'auto':`${size.height}px`,zIndex:0,...style}}>
   <view id={id?`${id}-sentinel`:undefined} className="ui-sticky-sentinel" flatten={false}/>
   <view className="ui-sticky-container" flatten={false} style={{position:placement.position,top:`${placement.top}px`,left:placement.position==='fixed'?`${placement.left}px`:'0px',right:'auto',bottom:'auto',width:placement.position==='relative'?'auto':`${size.width}px`,height:'auto',zIndex:placement.position==='relative'?0:layer}}>
     <view className="ui-sticky-content" flatten={false}>
       <view className="ui-sticky-content-measure" flatten={false} user-interaction-enabled={false} event-through bindlayoutchange={event=>{'background only';const {width,height}=event.detail;if(Number.isFinite(width)&&Number.isFinite(height)&&width>=0&&height>=0)setSize(previous=>Math.abs(previous.width-width)<.5&&Math.abs(previous.height-height)<.5?previous:{width,height});}}/>
       {typeof children==='string'||typeof children==='number'?<text>{children}</text>:children}
     </view>
   </view>
 </view>;
}
export function StickyBox({children,className='',style}:StickyBoxProps){
 const id=useStickyId(),node=useRef<NodesRef>(null),dimensions=useRef({width:0,height:0}),[revision,setRevision]=useState(0);
 return <BoxContext.Provider value={{id,node,revision}}><view id={id||undefined} ref={node} flatten={false} className={`ui-sticky-box ${className}`} style={style}>
   <view className="ui-sticky-box-measure" flatten={false} user-interaction-enabled={false} event-through bindlayoutchange={event=>{'background only';const {width,height}=event.detail;if(Number.isFinite(width)&&Number.isFinite(height)&&width>=0&&height>=0&&(Math.abs(dimensions.current.width-width)>=.5||Math.abs(dimensions.current.height-height)>=.5)){dimensions.current={width,height};setRevision(value=>value+1);}}}/>
   <view id={id?`${id}-sentinel`:undefined} className="ui-sticky-sentinel" flatten={false}/>{typeof children==='string'||typeof children==='number'?<text>{children}</text>:children}</view></BoxContext.Provider>;
}
