import { useLocale } from './useLocale.js';
import { Children, createContext, useContext } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { useConfigProvider } from './configContext.js';
export type StepStatus = 'finished' | 'process' | 'wait' | 'error';
export type StepsProps = { active?: number; vertical?: boolean; dot?: boolean; space?: number | string; alignCenter?: boolean; children?: ReactNode; className?: string; style?: CSSProperties };
export type StepProps = { title?: ReactNode; description?: ReactNode; icon?: ReactNode; status?: StepStatus; className?: string; style?: CSSProperties };
const StepContext = createContext<{ index: number; count: number; active: number; vertical: boolean; dot: boolean; space?: number | string; alignCenter: boolean } | undefined>(undefined);
export function Steps({ active=0, vertical=false, dot=false, space, alignCenter=false, children, className='', style }: StepsProps) {
  const items=(Children.toArray(children) as unknown as ReactNode[]).filter(item=>item!==null&&item!==undefined&&typeof item!=='boolean');
  return <view className={`ui-steps ${vertical?'ui-steps-vertical':''} ${className}`} style={style}>{items.map((item,index)=><StepContext.Provider key={typeof item==='object'&&item!==null&&'key' in item&&item.key!==null&&item.key!==undefined?String(item.key):index} value={{index,count:items.length,active,vertical,dot,space,alignCenter}}>{item}</StepContext.Provider>)}</view>;
}
const titles: Record<StepStatus,import('./locale.js').UiMessageKey> = { finished:'steps.finished',process:'steps.process',wait:'steps.wait',error:'steps.error' };
export function Step({ title, description, icon, status, className='', style }: StepProps) {
  const { t: localeText } = useLocale();
  const group=useContext(StepContext), config=useConfigProvider(), index=group?.index??0, vertical=group?.vertical??false, dot=group?.dot??false;
  const state=status??(index<(group?.active??0)?'finished':index===(group?.active??0)?'process':'wait');
  const primary=config.tokens['--cso-ui-primary']??(config.theme==='dark'?'#4d80f0':'#1c64fd');
  const danger=config.tokens['--cso-ui-danger']??'#f14646';
  const glyphColor=state==='error'?danger:state==='wait'?'var(--cso-ui-text-muted)':primary;
  const spacing=group?.space, dimension=typeof spacing==='number'?`${Math.max(0,Number.isFinite(spacing)?spacing:0)}px`:spacing;
  const copy=(value:ReactNode,cls:string)=><view className={cls}>{typeof value==='string'||typeof value==='number'?<text className={`${cls}-text`}>{value}</text>:value}</view>;
  return <view className={`ui-step ui-step-${state} ${vertical?'ui-step-vertical':''} ${dot?'ui-step-dotted':''} ${group?.alignCenter&&!vertical?'ui-step-center':''} ${className}`} style={{width:vertical?'100%':dimension??`${100/(group?.count||1)}%`,...(vertical&&dimension?{height:dimension}:{}),...style}} accessibility-element accessibility-label={`${index+1}，${typeof title==='string'?title:localeText(titles[state])}，${localeText(titles[state])}`}>
    <view className="ui-step-header">
      {index<(group?.count??1)-1?<view className="ui-step-line"/>:null}
      <view className="ui-step-indicator">{icon!==undefined&&icon!==null ? typeof icon==='string'?<Icon name={icon} size={18} color={glyphColor}/>:icon : dot?<view className="ui-step-dot"/>:<view className="ui-step-circle">{state==='finished'||state==='error'?<Icon name={state==='finished'?'check':'close'} size={12} color={state==='finished'?primary:'#fff'}/>:<text className="ui-step-number">{index+1}</text>}</view>}</view>
    </view>
    <view className="ui-step-content">{copy(title??localeText(titles[state]),'ui-step-title')}{description!==undefined&&description!==null&&description!==''?copy(description,'ui-step-description'):null}</view>
  </view>;
}
