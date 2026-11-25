import { Gap } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function GapExample() {
  return <view className="demo-gap-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本使用"><Gap bgColor="var(--cso-ui-danger)" /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体">
      <ExampleBlock title="自定义背景颜色"><Gap bgColor="var(--cso-ui-primary)" /></ExampleBlock>
      <ExampleBlock title="自定义高度"><Gap bgColor="var(--cso-ui-primary)" height="120rpx" /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="自定义样式"><Gap className="demo-gap-custom" /></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式" />
    <view className="demo-gap-bottom"><ExampleBlock title="底部安全区"><Gap bgColor="var(--cso-ui-surface)" height="120rpx" safeAreaBottom /></ExampleBlock></view>
  </view>;
}
