import { useDemoLocale } from '../demoLocale.js';
import { useEffect, useRef, useState } from '@lynx-js/react';
import { Switch, SwitchThumb, SwitchTrack } from '@lynx-js/lynx-ui';
import { Button, Fab, Icon } from '@daisu-ui/ui';
import type { FabDirection, FabPosition, FabProps } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

function Choices<T extends string>({ value, options, onChange }: { value: T; options: readonly (readonly [T,string])[]; onChange: (value:T)=>void }) {
  const { text: demoText } = useDemoLocale();
  return <view className="demo-fab-choices">{options.map(([id,label]) => <view key={id} className="demo-fab-choice" accessibility-element accessibility-traits="button" accessibility-label={demoText(label)} bindtap={() => { 'background only'; onChange(id); }}><view className={`demo-fab-radio ${value===id?'demo-fab-radio-checked':''}`}>{value===id?<view />:null}</view><text>{demoText(label)}</text></view>)}</view>;
}
function Toggle({ value, onChange, label }: { value: boolean; onChange:(value:boolean)=>void; label: string }) {
  return <view className="demo-fab-switch-row" catchtap={() => { 'background only'; }}><Switch className="demo-fab-switch" checked={value} onChange={onChange} switchProps={{'accessibility-label':label}}><SwitchTrack className="demo-fab-switch-track"/><SwitchThumb className="demo-fab-switch-thumb"/></Switch></view>;
}

export function FabExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [type,setType] = useState<NonNullable<FabProps['type']>>('primary');
  const [position,setPosition] = useState<FabPosition>('left-bottom');
  const [direction,setDirection] = useState<FabDirection>('top');
  const [disabled,setDisabled] = useState(false);
  const [draggable,setDraggable] = useState(false);
  const [active,setActive] = useState(false);
  const [custom,setCustom] = useState('default');
  const [notice,setNotice] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current),[]);
  const toast = (message:string) => { 'background only'; clearTimeout(timer.current); setNotice(message); timer.current=setTimeout(()=>setNotice(''),1500); };
  const iconButton = (icon:string,tone:'primary'|'info'|'success'|'danger'|'warning',message:string,variant:'solid'|'plain'|'text'='solid') => <Button key={icon} className="demo-fab-action" tone={tone} variant={variant} round disabled={disabled} icon={<Icon name={icon} size={22} color={variant==='solid'?'#fff':tone==='success'?'#12b886':tone==='warning'?'#f57f00':tone==='danger'?'#f14646':tone==='info'?'#868a9c':'#1c64fd'} />} onTap={()=>{ 'background only';toast(message); }} />;
  return <view className="demo-fab-page" bindtap={()=>{ 'background only';setActive(false); }}>
    <DemoGroup title="组件类型"><ExampleBlock title="悬浮按钮主题色"><Choices<NonNullable<FabProps['type']>> value={type} options={demoCopy([["primary","主要按钮"],["success","成功按钮"],["warning","警告按钮"],["danger","危险按钮"],["info","信息按钮"]])} onChange={setType}/></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体">
      <ExampleBlock title="悬浮按钮位置"><Choices<FabPosition> value={position} options={demoCopy([["left-top","左上"],["right-top","右上"],["left-center","左中"],["right-center","右中"],["top-center","上中"],["bottom-center","下中"],["left-bottom","左下"],["right-bottom","右下"]])} onChange={setPosition}/></ExampleBlock>
      <ExampleBlock title="菜单弹出方向"><Choices<FabDirection> value={direction} options={demoCopy([["top","向上"],["bottom","向下"],["right","向右"],["left","向左"]])} onChange={setDirection}/></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件状态">
      <ExampleBlock title="禁用"><Toggle label={demoText("禁用悬浮按钮")} value={disabled} onChange={setDisabled}/></ExampleBlock>
      <ExampleBlock title="可拖动"><Toggle label={demoText("可拖动悬浮按钮")} value={draggable} onChange={setDraggable}/></ExampleBlock>
      <ExampleBlock title="切换展示"><view className="demo-fab-inline" catchtap={()=>{ 'background only'; }}><Button label={demoText("切换")} onTap={()=>{ 'background only';setActive(value=>!value); }}/></view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="自定义触发器"><view catchtap={()=>{ 'background only'; }}><Choices value={custom} options={demoCopy([["default","默认样式"],["withText","带文字按钮"],["plain","plain 变体"],["text","text 变体"]])} onChange={value=>{ 'background only';setCustom(value);setActive(false); }}/></view></ExampleBlock></DemoGroup>
    {custom==='default'?<Fab key="default" active={active} onActiveChange={setActive} disabled={disabled} draggable={draggable} type={type} position={position} direction={direction} gap={{top:60}}>{iconButton('heart-fill','primary','一键三连')}{iconButton('star','success','我要收藏')}{iconButton('gift','danger','我要投币')}{iconButton('thumb-up','warning','我要点赞')}</Fab>:custom==='withText'?<Fab key="withText" disabled={disabled} draggable={draggable} position="left-bottom" gap={{top:60}} expandable={false} trigger={<Button tone="danger" label={demoText("分享给朋友")} disabled={disabled} icon={<Icon name="share-alt" color="#fff" size={18}/>} onTap={()=>{ 'background only';toast('分享给朋友'); }}/>} />:custom==='plain'?<Fab key="plain" active={active} onActiveChange={setActive} disabled={disabled} draggable={draggable} position="right-bottom" gap={{top:60}} trigger={<Button tone="primary" variant="plain" round disabled={disabled} icon={<Icon name="menu" color="#1c64fd" size={18}/>} />}>{iconButton('settings','info','设置','plain')}{iconButton('share-alt','success','分享','plain')}{iconButton('edit','warning','编辑','plain')}</Fab>:<Fab key="text" active={active} onActiveChange={setActive} disabled={disabled} draggable={draggable} position="right-bottom" direction="bottom" gap={{top:60}} trigger={<Button tone="primary" variant="text" size="large" round disabled={disabled} icon={<Icon name="heart-fill" color="#1c64fd" size={18}/>} />}>{iconButton('copy','info','复制','text')}{iconButton('delete','danger','删除','text')}</Fab>}
    {notice?<view className="demo-cell-toast" user-interaction-enabled={false}><text>{demoText(notice)}</text></view>:null}
  </view>;
}
