import { Children, createContext, useContext, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, TouchEvent } from '@lynx-js/types';
import { Badge } from './Badge.js';
import type { BadgeProps } from './Badge.js';
import { Icon } from './Icon.js';
import { usePressState } from './usePressState.js';
export type GridNavigation = (url:string,options:{replace:boolean})=>void;
export type GridProps={column?:number;border?:boolean;gutter?:number;square?:boolean;clickable?:boolean;bgColor?:string;hoverClass?:string;center?:boolean;direction?:'vertical'|'horizontal';reverse?:boolean;iconSize?:number;onNavigate?:GridNavigation;children?:ReactNode;className?:string;style?:CSSProperties};
type GridContextValue=GridProps&{columns:number;count:number;index:number;cellSize:number;spacing:number};
const GridContext=createContext<GridContextValue|undefined>(undefined);
export type GridItemProps={text?:ReactNode;icon?:string;iconColor?:string;iconSize?:number;renderIcon?:ReactNode;children?:ReactNode;isDot?:boolean;value?:string|number;max?:number;type?:BadgeProps['type'];badgeProps?:BadgeProps;ellipsis?:boolean;url?:string;linkType?:'push'|'replace';onNavigate?:GridNavigation;onItemClick?:(event:TouchEvent)=>void;className?:string;textClassName?:string;iconClassName?:string;style?:CSSProperties};
export function Grid({column,border=false,gutter=0,square=false,clickable=false,bgColor,hoverClass='',center=true,direction='vertical',reverse=false,iconSize=32,onNavigate,children,className='',style}:GridProps){
  const items=(Children.toArray(children) as unknown as ReactNode[]).filter(item=>item!==null&&item!==undefined&&typeof item!=='boolean'),count=items.length;
  const columns=column!==undefined&&Number.isFinite(column)&&column>0?Math.max(1,Math.floor(column)):Math.max(1,count),spacing=Number.isFinite(gutter)?Math.max(0,gutter):0,[width,setWidth]=useState(0);
  const shared={columns,count,spacing,column,border,square,clickable,bgColor,hoverClass,center,direction,reverse,iconSize,onNavigate,cellSize:Math.max(0,width-spacing)/columns};
  return <view className={`ui-grid ${className}`} style={{paddingLeft:`${spacing}px`,marginBottom:square&&spacing?`${-spacing}px`:undefined,...style}} bindlayoutchange={event=>setWidth(event.detail.width)}>{items.map((item,index)=><GridContext.Provider key={typeof item==='object'&&item!==null&&'key' in item&&item.key!==null&&item.key!==undefined?String(item.key):index} value={{...shared,index}}>{item}</GridContext.Provider>)}</view>;
}
export function GridItem({text,icon,iconColor,iconSize,renderIcon,children,isDot,value,max,type,badgeProps,ellipsis=false,url,linkType='push',onNavigate,onItemClick,className='',textClassName='',iconClassName='',style}:GridItemProps){
  const grid=useContext(GridContext),press=usePressState(grid?.clickable??false),spacing=grid?.spacing??0,columns=grid?.columns??1,index=grid?.index??0,hasIcon=renderIcon!==undefined||!!icon;
  const badge={max:99,...badgeProps,...(value!==undefined?{value}:{}),...(isDot!==undefined?{isDot}:{}),...(max!==undefined?{max}:{}),...(type!==undefined?{type}:{})};
  const tap=(event:TouchEvent)=>{'background only';if(grid&&!grid.clickable)return;onItemClick?.(event);if(url)(onNavigate??grid?.onNavigate)?.(url,{replace:linkType==='replace'});};
  const horizontal=grid?.direction==='horizontal',reverse=grid?.reverse;
  return <view className={`ui-grid-item ${grid?.square?'ui-grid-item-square':''} ${className}`} style={{width:`${100/columns}%`,flexBasis:`${100/columns}%`,paddingRight:`${spacing}px`,...(grid?.square?{height:`${grid.cellSize}px`}:index>=columns?{marginTop:`${spacing}px`}:{}),...style}} bindtap={tap} accessibility-element={!!grid?.clickable} accessibility-traits={grid?.clickable?'button':undefined} accessibility-label={typeof text==='string'?text:undefined}>
    <view className={`ui-grid-item-content ${horizontal?'ui-grid-horizontal':''} ${reverse?'ui-grid-reverse':''} ${grid?.center===false?'':'ui-grid-center'} ${press.pressed?`ui-grid-item-pressed ${grid?.hoverClass??''}`:''}`} style={{backgroundColor:grid?.bgColor,...(grid?.square&&spacing?{marginBottom:`${spacing}px`}:{}),...(grid?.border&&spacing?{borderWidth:'.5px',borderStyle:'solid',borderColor:'var(--cso-ui-line)'}:{})}} {...press.events}>
      {children??<>{hasIcon?<view className={`ui-grid-item-icon ${iconClassName}`}><Badge {...badge}>{renderIcon??<Icon name={icon!} size={iconSize??grid?.iconSize??32} color={iconColor??'var(--cso-ui-text-regular)'}/>}</Badge></view>:null}{text!==undefined?<view className={`ui-grid-item-text ${hasIcon?'ui-grid-item-text-spaced':''} ${textClassName}`}><>{typeof text==='string'||typeof text==='number'?<text className="ui-grid-item-label" text-maxline={ellipsis?'1':undefined} text-overflow={ellipsis?'ellipsis':undefined}>{text}</text>:text}</></view>:null}</>}
      {grid?.border&&!spacing?<>{index>=columns?<view className="ui-grid-line-top"/>:null}{index%columns!==columns-1&&index!==grid.count-1?<view className="ui-grid-line-right"/>:null}</>:null}
    </view>
  </view>;
}
