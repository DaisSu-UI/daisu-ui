import { Rate } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
const yellow = 'linear-gradient(180deg, rgba(255,238,0,1) 0%, rgba(250,176,21,1) 100%)';
const red = 'linear-gradient(315deg, rgba(245,34,34,1) 0%, rgba(255,117,102,1) 100%)';
export function RateExample() {
  return <view>
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><Rate defaultValue={5} /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="只读状态 readonly"><Rate defaultValue={3} readonly /></ExampleBlock><ExampleBlock title="禁用状态"><Rate defaultValue={2} disabled /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="修改选中颜色"><view className="demo-rate-stack"><Rate defaultValue={4} activeColor={yellow} /><Rate defaultValue={3} activeColor={[yellow, red]} /></view></ExampleBlock>
      <ExampleBlock title="修改icon和选中颜色"><view className="demo-rate-stack"><Rate defaultValue={3} block icon="heart-fill" activeIcon="heart-fill" activeColor="#f14646" /><Rate defaultValue={3} block icon="thumb-down-fill" activeIcon="thumb-up-fill" activeColor="#12b886" /></view></ExampleBlock>
      <ExampleBlock title="修改size、space"><Rate defaultValue={3} size={36} space="12px" /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="允许半选"><Rate defaultValue={2.5} allowHalf /></ExampleBlock>
      <ExampleBlock title="允许清空评分"><view className="demo-rate-stack"><Rate defaultValue={1} clearable /><Rate defaultValue={.5} clearable allowHalf /></view></ExampleBlock>
    </DemoGroup>
  </view>;
}
