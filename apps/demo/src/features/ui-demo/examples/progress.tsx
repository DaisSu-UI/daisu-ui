import { useState } from '@lynx-js/react';
import { Button, Progress } from 'daisu-ui';
import type { ProgressColor } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';
const colors = ['var(--cso-ui-success)', 'var(--cso-ui-warning)', 'var(--cso-ui-danger)', 'var(--cso-ui-primary)'];
const colorStops: ProgressColor = [{ color: 'var(--cso-ui-warning)', percentage: 30 }, { color: 'var(--cso-ui-danger)', percentage: 60 }, { color: 'var(--cso-ui-primary)', percentage: 80 }, { color: 'var(--cso-ui-text)', percentage: 90 }];
export function ProgressExample() {
  const [percentage, setPercentage] = useState(50);
  return <view className="demo-progress-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><Progress percentage={50} /></ExampleBlock><ExampleBlock title="内置百分比"><view className="demo-progress-rows"><Progress percentage={50} percentPosition={{ type: 'inner', align: 'center' }} /><Progress percentage={50} status="success" percentPosition={{ type: 'inner', align: 'right' }} /><Progress percentage={50} status="danger" percentPosition={{ type: 'inner', align: 'left' }} /><Progress percentage={0} percentPosition={{ type: 'inner', align: 'center' }} /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="进度条状态"><view className="demo-progress-rows">{(['success','danger','warning'] as const).map(status => <Progress key={status} percentage={50} status={status} hideText />)}</view></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="不显示进度文字"><Progress percentage={50} hideText /></ExampleBlock><ExampleBlock title="修改颜色"><view className="demo-progress-rows">{['var(--cso-ui-primary)', 'var(--cso-ui-success)', 'var(--cso-ui-warning)'].map(color => <Progress key={color} percentage={50} color={color} />)}</view></ExampleBlock><ExampleBlock title="颜色数组"><view className="demo-progress-rows"><Progress percentage={50} color={colors} /><Progress percentage={50} color={colorStops} /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="动态控制"><Progress percentage={percentage} /><view className="demo-progress-actions"><Button size="small" tone="danger" label="-10" onTap={() => { 'background only'; setPercentage(value => Math.max(0, value - 10)); }} /><Button size="small" tone="success" label="+10" onTap={() => { 'background only'; setPercentage(value => Math.min(100, value + 10)); }} /></view></ExampleBlock></DemoGroup>
  </view>;
}
