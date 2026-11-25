import { useState } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { RootPortal } from './RootPortal.js';
export type WatermarkProps = {
 content?:string;image?:string;imageWidth?:number;imageHeight?:number;gutterX?:number;gutterY?:number;width?:number;height?:number;
 fullScreen?:boolean;color?:string;size?:number;fontStyle?:'normal'|'italic'|'oblique';fontWeight?:CSSProperties['fontWeight']|'bolder'|number;fontFamily?:string;
 rotate?:number;zIndex?:number;opacity?:number;layout?:'grid'|'staggered';rootPortal?:boolean;className?:string;style?:CSSProperties;
};
const number=(value:number,fallback:number,min=-Infinity,max=Infinity)=>Number.isFinite(value)?Math.min(max,Math.max(min,value)):fallback;
export function watermarkGrid(viewport:{width:number;height:number},width:number,height:number,gutterX:number,gutterY:number){
 const cellWidth=number(width,100,1)+number(gutterX,0,0),cellHeight=number(height,100,1)+number(gutterY,0,0);
 const columns=Math.min(2048,Math.ceil(Math.max(0,viewport.width)/cellWidth)),rows=Math.min(2048,Math.ceil(Math.max(0,viewport.height)/cellHeight));
 return {cellWidth,cellHeight,columns,rows,count:Math.min(2048,columns*rows)};
}
/** Repeated native content. No Canvas, DOM, downloaded executable code or touch interception. */
export function Watermark({content='',image='',imageWidth=100,imageHeight=100,gutterX=0,gutterY=0,width=100,height=100,fullScreen=true,color='#c9cbd4',size=14,fontStyle='normal',fontWeight='normal',fontFamily='PingFang SC',rotate=-25,zIndex=1100,opacity=.6,layout='grid',rootPortal=false,className='',style}:WatermarkProps){
 const [viewport,setViewport]=useState({width:0,height:0}),grid=watermarkGrid(viewport,width,height,gutterX,gutterY),tileWidth=number(width,100,1),tileHeight=number(height,100,1),fontSize=number(size,14,1),svg=/\.svg(?:[?#]|$)|^data:image\/svg\+xml/i.test(image);
 const weight:CSSProperties['fontWeight']=typeof fontWeight==='number'?String(Math.round(number(fontWeight,400,100,900)/100)*100) as CSSProperties['fontWeight']:fontWeight==='bolder'?'bold':fontWeight;
 const layer=<view className={`ui-watermark ${fullScreen?'ui-watermark-fullscreen':''} ${className}`} style={{zIndex:number(zIndex,1100),opacity:number(opacity,.6,0,1),...style}} event-through user-interaction-enabled={false} accessibility-element={false} bindlayoutchange={event=>{const {width:w,height:h}=event.detail;if(w>=0&&h>=0&&Number.isFinite(w)&&Number.isFinite(h))setViewport(previous=>previous.width===w&&previous.height===h?previous:{width:w,height:h});}}>
  {Array.from({length:grid.count},(_,index)=>{const row=Math.floor(index/(grid.columns||1)),column=index%(grid.columns||1);return layout==='staggered'&&(row+column)%2!==0?null:<view className="ui-watermark-tile" key={index} style={{left:`${column*grid.cellWidth}px`,top:`${row*grid.cellHeight}px`,width:`${tileWidth}px`,height:`${tileHeight}px`}}><view className="ui-watermark-mark" style={{width:`${tileWidth}px`,height:`${tileHeight}px`,transform:`rotate(${number(rotate,-25)}deg)`}}>{image?(svg?<svg className="ui-watermark-image" src={image} style={{width:`${number(imageWidth,100,1)}px`,height:`${number(imageHeight,100,1)}px`}}/>:<image className="ui-watermark-image" src={image} mode="scaleToFill" style={{width:`${number(imageWidth,100,1)}px`,height:`${number(imageHeight,100,1)}px`}}/>):<text className="ui-watermark-text" style={{color,fontSize:`${fontSize}px`,lineHeight:`${fontSize*1.2}px`,fontStyle,fontWeight:weight,fontFamily}}>{content}</text>}</view></view>;})}
 </view>;
 return fullScreen&&rootPortal?<RootPortal>{layer}</RootPortal>:layer;
}
