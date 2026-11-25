import { forwardRef, useEffect, useImperativeHandle } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { useCountDown } from './useCountDown.js';
import { formatCountDown } from './countDownModel.js';
import type { TimeData } from './countDownModel.js';
export type CountDownRef={start:()=>void;pause:()=>void;reset:()=>void};
export type CountDownProps={time?:number;millisecond?:boolean;autoStart?:boolean;format?:string;onChange?:(current:TimeData)=>void;onFinish?:()=>void;children?:ReactNode|((current:TimeData)=>ReactNode);className?:string;style?:CSSProperties};
export const CountDown=forwardRef<CountDownRef,CountDownProps>(function CountDown({time=0,millisecond=false,autoStart=true,format='HH:mm:ss',onChange,onFinish,children,className='',style},ref){
  const timer=useCountDown({time,millisecond,onChange,onFinish});
  const reset=()=>{'background only';timer.reset(time);if(autoStart)timer.start();};
  useImperativeHandle(ref,()=>({start:timer.start,pause:timer.pause,reset}));
  useEffect(reset,[time,autoStart]);
  return <view className={`ui-count-down ${className}`} style={style}>{typeof children==='function'?children(timer.current):children??<text className="ui-count-down-text">{formatCountDown(format,timer.current)}</text>}</view>;
});
