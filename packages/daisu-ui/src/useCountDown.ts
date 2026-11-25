import { useCallback, useEffect, useRef, useState } from '@lynx-js/react';
import { countDownTime, parseCountDown } from './countDownModel.js';
import type { TimeData } from './countDownModel.js';
export type UseCountDownOptions={time?:number;millisecond?:boolean;onChange?:(current:TimeData)=>void;onFinish?:()=>void};
/** Deadline based: slow/background timers do not extend the requested duration. */
export function useCountDown(options:UseCountDownOptions={}){
  const settings=useRef(options);settings.current=options;
  const [current,setCurrent]=useState(()=>parseCountDown(options.time??0)),remaining=useRef(current.total),deadline=useRef(0),running=useRef(false),finished=useRef(false),generation=useRef(0),timer=useRef<ReturnType<typeof setTimeout>>(),mounted=useRef(true);
  const publish=(value:number)=>{'background only';const next=countDownTime(value);if(next===remaining.current)return;remaining.current=next;const data=parseCountDown(next);setCurrent(data);settings.current.onChange?.(data);};
  const tick=(ticket:number)=>{'background only';if(!mounted.current||ticket!==generation.current||!running.current)return;const value=Math.max(0,deadline.current-Date.now());publish(value);if(ticket!==generation.current||!running.current||!mounted.current)return;if(value<=0){running.current=false;finished.current=true;settings.current.onFinish?.();return;}const delay=settings.current.millisecond?Math.min(value,16):Math.min(value,value%1000||1000);timer.current=setTimeout(()=>tick(ticket),Math.max(1,delay));};
  const start=useCallback(()=>{'background only';if(!mounted.current||running.current||finished.current)return;if(remaining.current<=0){finished.current=true;settings.current.onFinish?.();return;}running.current=true;deadline.current=Date.now()+remaining.current;const ticket=++generation.current;tick(ticket);},[]);
  const pause=useCallback(()=>{'background only';if(!running.current)return;running.current=false;generation.current++;clearTimeout(timer.current);const value=Math.max(0,deadline.current-Date.now());publish(value);if(!value&&!finished.current){finished.current=true;settings.current.onFinish?.();}},[]);
  const reset=useCallback((time?:number)=>{'background only';generation.current++;clearTimeout(timer.current);running.current=false;finished.current=false;publish(time??settings.current.time??0);},[]);
  useEffect(()=>()=>{mounted.current=false;generation.current++;running.current=false;clearTimeout(timer.current);},[]);
  return{current,start,pause,reset};
}
