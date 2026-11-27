import { useDemoLocale } from '../demoLocale.js';
import { useRef } from '@lynx-js/react';
import { CountDown, Grid, GridItem, Toast, useToast } from '@daisu-ui/ui';
import type { CountDownRef } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
const time=30*60*60*1000;
export function CountDownExample(){
  const { text: demoText, copy: demoCopy } = useDemoLocale();const ref=useRef<CountDownRef>(null),toast=useToast();return <view className="demo-count-down-page">
  <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><CountDown time={time}/></ExampleBlock></DemoGroup>
  <DemoGroup title="组件变体"><ExampleBlock title="自定义格式"><CountDown time={time} format="DD 天 HH 时 mm 分 ss 秒"/></ExampleBlock><ExampleBlock title="毫秒级渲染"><CountDown time={time} millisecond format="HH:mm:ss:SS"/></ExampleBlock></DemoGroup>
  <DemoGroup title="组件样式"><ExampleBlock title="自定义样式"><CountDown time={time}>{current=><view className="demo-count-down-custom"><text className="demo-count-down-unit">{demoText(current.hours)}</text><text className="demo-count-down-colon">:</text><text className="demo-count-down-unit">{demoText(current.minutes)}</text><text className="demo-count-down-colon">:</text><text className="demo-count-down-unit">{demoText(current.seconds)}</text></view>}</CountDown></ExampleBlock></DemoGroup>
  <DemoGroup title="特殊样式"><ExampleBlock title="手动控制"><CountDown ref={ref} time={3000} millisecond autoStart={false} format="ss:SSS" onFinish={()=>{ 'background only';toast.show('倒计时结束');}}/><Grid clickable border><GridItem text={demoText("开始")} icon="play-circle" onItemClick={()=>{ 'background only';ref.current?.start();}}/><GridItem text={demoText("暂停")} icon="pause-circle" onItemClick={()=>{ 'background only';ref.current?.pause();}}/><GridItem text={demoText("重置")} icon="refresh" onItemClick={()=>{ 'background only';ref.current?.reset();}}/></Grid></ExampleBlock></DemoGroup><Toast {...demoCopy(toast.props)}/>
</view>;}
