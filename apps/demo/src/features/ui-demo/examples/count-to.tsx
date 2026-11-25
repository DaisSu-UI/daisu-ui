import { useRef } from '@lynx-js/react';
import { CountTo, Grid, GridItem } from 'daisu-ui';
import type { CountToRef } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';
export function CountToExample(){const ref=useRef<CountToRef>(null);return <view className="demo-count-to-page">
  <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><CountTo endVal={2024} suffix="年" color="var(--cso-ui-success)"/><CountTo prefix="￥" decimals={2} endVal={186.321} suffix="%" color="var(--cso-ui-primary)"/><CountTo prefix="￥" decimals={2} endVal={21286.321} suffix="%" color="var(--cso-ui-danger)"/><CountTo prefix="￥" decimals={2} endVal={21286.321} suffix="%" color="var(--cso-ui-warning)" duration={2000}/></ExampleBlock></DemoGroup>
  <DemoGroup title="组件样式"><ExampleBlock title="设置主题">{(['primary','error','success','warning','default'] as const).map(type=><CountTo key={type} type={type} prefix="￥" endVal={888888} suffix="%"/>)}</ExampleBlock></DemoGroup>
  <DemoGroup title="特殊样式"><ExampleBlock title="手动控制"><CountTo ref={ref} autoStart={false} prefix="￥" startVal={1000} decimals={3} endVal={9999.32} suffix="%" color="var(--cso-ui-primary)"/><Grid clickable border><GridItem text="开始" icon="play-circle" onItemClick={()=>{ 'background only';ref.current?.start();}}/><GridItem text="暂停" icon="pause-circle" onItemClick={()=>{ 'background only';ref.current?.pause();}}/><GridItem text="重置" icon="refresh" onItemClick={()=>{ 'background only';ref.current?.reset();}}/></Grid></ExampleBlock></DemoGroup>
</view>;}
