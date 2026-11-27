import { useLocale } from './useLocale.js';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { useConfigProvider } from './configContext.js';

export type NoticeBarClick = { index: number; text: string };
export type NoticeBarRef = { reset: () => void };
export type NoticeBarProps = {
  text?: string | readonly string[]; type?: 'warning' | 'info' | 'danger'; scrollable?: boolean;
  delay?: number; speed?: number; closable?: boolean; wrapable?: boolean; direction?: 'horizontal' | 'vertical';
  prefix?: ReactNode; suffix?: ReactNode; color?: string; backgroundColor?: string; children?: ReactNode;
  onClose?: () => void; onNext?: (index: number) => void; onClick?: (event: NoticeBarClick) => void;
  className?: string; style?: CSSProperties;
};
const colors = { warning: ['#f57f00','#ffa94d'], danger: ['#f14646','#ff6b6b'], info: ['#1c64fd','#5b90ff'] };
export const NoticeBar = forwardRef<NoticeBarRef, NoticeBarProps>(function NoticeBar({ text = '', type = 'warning', scrollable = true, delay = 1, speed = 50, closable = false, wrapable = false, direction = 'horizontal', prefix, suffix, color, backgroundColor, children, onClose, onNext, onClick, className = '', style }, ref) {
  const { t: localeText } = useLocale();

  const [closed, setClosed] = useState(false), [revision, setRevision] = useState(0), closedRef = useRef(false);
  const config = useConfigProvider(), foreground = color ?? colors[type][config.theme === 'dark' ? 1 : 0]!;
  useImperativeHandle(ref, () => ({ reset() { 'background only'; setRevision(value => value + 1); } }), []);
  const close = () => { 'background only'; if (closedRef.current) return; closedRef.current = true; setClosed(true); onClose?.(); };
  const items = Array.isArray(text) ? [...text] : [text as string];
  const durationSpeed = Number.isFinite(speed) && speed > 0 ? speed : 50, wait = Number.isFinite(delay) ? Math.max(0,delay) : 1;
  const multiLine = direction === 'horizontal' && !scrollable && wrapable;
  if (closed) return null;
  return <view className={`ui-notice-bar ui-notice-bar-${type} ${multiLine ? 'ui-notice-bar-wrap' : ''} ${className}`} style={{ color: foreground, backgroundColor, ...style }}>
    {prefix !== undefined && prefix !== null && prefix !== false ? <view className="ui-notice-bar-prefix">{typeof prefix === 'string' ? <Icon name={prefix} size={20} color={foreground}/> : prefix}</view> : null}
    <NoticeContent key={JSON.stringify([items,scrollable,direction,multiLine,durationSpeed,wait,revision])} items={items} scrollable={scrollable} multiLine={multiLine} direction={direction} speed={durationSpeed} delay={wait} onNext={onNext} onClick={onClick}>{children}</NoticeContent>
    {suffix !== undefined && suffix !== null ? <view className="ui-notice-bar-suffix">{typeof suffix === 'string' || typeof suffix === 'number' ? <text>{suffix}</text> : suffix}</view> : closable ? <view className="ui-notice-bar-suffix ui-notice-bar-close" catchtap={close} accessibility-element accessibility-traits="button" accessibility-label={localeText('close.noticeBar')}><Icon name="close" size={20} color={foreground}/></view> : null}
  </view>;
});

type ContentProps = Pick<NoticeBarProps,'children'|'onNext'|'onClick'> & { items: string[]; scrollable: boolean; multiLine: boolean; direction: 'horizontal'|'vertical'; speed:number; delay:number };
function NoticeContent({ items, scrollable, multiLine, direction, speed, delay, onNext, onClick, children }: ContentProps) {
  const [index,setIndex] = useState(0), [cycle,setCycle] = useState(0), [wrapWidth,setWrapWidth] = useState(0);
  const [measure,setMeasure] = useState({ index:0,width:0 }), [lineHeight,setLineHeight] = useState(20);
  const [motion,setMotion] = useState({ offset:0,duration:0,delay:0 });
  const callbacks = useRef({onNext,onClick}); callbacks.current={onNext,onClick};
  const vertical=direction==='vertical', moving=items.length>0&&(vertical ? items.length>1 : scrollable), outside=cycle>0;
  const current=items[index] ?? '';
  useEffect(()=>{
    if (!moving || wrapWidth<=0 || (!vertical && (measure.index!==index || measure.width<=0))) return;
    let cancelled=false,completion:ReturnType<typeof setTimeout>|undefined;
    const start = vertical ? -lineHeight*index : outside ? wrapWidth+1 : 0;
    const end = vertical ? -lineHeight*(index+1) : -measure.width;
    const duration=Math.max(1,Math.abs(end-start)/speed*1000);
    setMotion({offset:start,duration:0,delay:0});
    const frame=setTimeout(()=>{
      if(cancelled)return;
      setMotion({offset:end,duration,delay:delay*1000});
      completion=setTimeout(()=>{
        if(cancelled)return;
        const next=(index+1)%items.length;
        setMotion({offset:vertical ? -lineHeight*next : wrapWidth+1,duration:0,delay:0});
        setIndex(next);setCycle(value=>value+1);callbacks.current.onNext?.(next);
      },duration+delay*1000);
    },32);
    return()=>{cancelled=true;clearTimeout(frame);clearTimeout(completion);};
  },[moving,vertical,index,cycle,wrapWidth,measure.index,measure.width,lineHeight,speed,delay,children]);
  const click=()=>{ 'background only'; callbacks.current.onClick?.({index,text:current}); };
  const label=(value:string,key?:number)=><text key={key} className="ui-notice-bar-label" text-maxline={multiLine ? undefined : '1'} text-overflow={moving&&!vertical ? 'clip' : 'ellipsis'} bindlayoutchange={vertical && key===0 ? event=>{ 'background only'; if(event.detail.height>0)setLineHeight(event.detail.height); } : undefined}>{value}</text>;
  return <view className={`ui-notice-bar-viewport ${multiLine ? 'ui-notice-bar-viewport-wrap' : ''}`} flatten={false} bindlayoutchange={event=>{ 'background only'; if(event.detail.width>0)setWrapWidth(event.detail.width); }}>
    <view key={index} accessibility-element accessibility-label={current} className={`ui-notice-bar-content ${moving&&!vertical ? 'ui-notice-bar-marquee' : ''} ${vertical ? 'ui-notice-bar-vertical' : ''}`} flatten={false} style={moving ? { transform: `${vertical ? 'translateY' : 'translateX'}(${motion.offset}px)`, transitionProperty:'transform',transitionDuration:`${motion.duration}ms`,transitionDelay:`${motion.delay}ms`,transitionTimingFunction:'linear' } : undefined}
      bindlayoutchange={!vertical ? event=>{ 'background only'; const width=event.detail.width;if(Number.isFinite(width)&&width>0)setMeasure(previous=>previous.index===index&&previous.width===width?previous:{index,width}); } : undefined}
      bindtap={click}>
      {vertical ? [...items,...(items.length>1 ? [items[0]!] : [])].map((item,key)=>label(item,key)) : children === undefined ? label(current) : typeof children === 'string' || typeof children === 'number' ? <text className="ui-notice-bar-label" text-maxline={multiLine?undefined:'1'} text-overflow="ellipsis">{children}</text> : children}
    </view>
  </view>;
}
