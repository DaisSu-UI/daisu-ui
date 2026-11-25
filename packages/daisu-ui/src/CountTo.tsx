import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { useCountDown } from './useCountDown.js';
import { countDownTime } from './countDownModel.js';
import { countToNumber, countToValue, formatCountTo } from './countToModel.js';
export type CountToRef={start:()=>void;pause:()=>void;reset:()=>void};
export type CountToProps={startVal?:number;endVal?:number;duration?:number;autoStart?:boolean;decimals?:number;decimal?:string;separator?:string;prefix?:ReactNode;suffix?:ReactNode;useEasing?:boolean;fontSize?:number;color?:string;type?:'default'|'primary'|'error'|'warning'|'success'|'info';onMounted?:()=>void;onFinish?:()=>void;children?:ReactNode|((value:number,formatted:string)=>ReactNode);className?:string;style?:CSSProperties};
export const CountTo=forwardRef<CountToRef,CountToProps>(function CountTo({startVal=0,endVal=2024,duration=3000,autoStart=true,decimals=0,decimal='.',separator=',',prefix,suffix,useEasing=true,fontSize,color,type='default',onMounted,onFinish,children,className='',style},ref){
  const callbacks=useRef({onMounted,onFinish});callbacks.current={onMounted,onFinish};const [done,setDone]=useState(false),milliseconds=countDownTime(duration);
  const timer=useCountDown({time:milliseconds,millisecond:true,onFinish:()=>{ 'background only';setDone(true);callbacks.current.onFinish?.();}});
  const reset=()=>{'background only';setDone(false);timer.reset(milliseconds);if(autoStart)timer.start();};
  useImperativeHandle(ref,()=>({start:timer.start,pause:timer.pause,reset}));
  useEffect(reset,[startVal,endVal,duration,autoStart]);
  useEffect(()=>{callbacks.current.onMounted?.();},[]);
  const progress=milliseconds?1-timer.current.total/milliseconds:done?1:0,value=countToValue(countToNumber(startVal),countToNumber(endVal),progress,useEasing),formatted=formatCountTo(value,decimals,decimal,separator);
  const slot=(node:ReactNode)=>typeof node==='string'||typeof node==='number'?<text className="ui-count-to-affix">{node}</text>:node;
  return <view className={`ui-count-to ui-count-to-${type} ${className}`} style={{color,...(fontSize!==undefined?{'--cso-ui-count-to-font-size':`${Number.isFinite(fontSize)?Math.max(0,fontSize):18}px`,'--cso-ui-count-to-line-height':`${Number.isFinite(fontSize)?Math.max(0,fontSize)+8:26}px`}:{}),...style}}>{slot(prefix)}{typeof children==='function'?children(value,formatted):children??<text className="ui-count-to-value">{formatted}</text>}{slot(suffix)}</view>;
});
