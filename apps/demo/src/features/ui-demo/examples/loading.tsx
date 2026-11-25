import { Loading } from '@daisu-ui/ui';
import type { LoadingType } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
const types: readonly LoadingType[] = ['circular', 'spinner', 'dots', 'wave'];
export function LoadingExample() {
  return <view className="demo-loading-page">
    <DemoGroup title="组件类型"><ExampleBlock title="类型"><view className="demo-loading-row">{types.map(type => <Loading key={type} type={type} />)}</view></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="颜色"><view className="demo-loading-row">{types.map(type => <Loading key={type} type={type} color="#ff357c" />)}</view></ExampleBlock>
      <ExampleBlock title="大小">{[20, 30, '50px'].map(size => <view key={String(size)} className="demo-loading-row">{types.map(type => <Loading key={type} type={type} size={size} />)}</view>)}</ExampleBlock>
    </DemoGroup>
    <DemoGroup title="内容形态">
      <ExampleBlock title="显示文字"><view className="demo-loading-row"><Loading text="加载中..." />{(['circular', 'spinner', 'wave'] as const).map((type, index) => <Loading key={index} type={type}>加载中...</Loading>)}</view></ExampleBlock>
      <ExampleBlock title="水平方向"><view className="demo-loading-row demo-loading-horizontal"><Loading direction="horizontal" text="加载中..." />{(['circular', 'spinner', 'wave'] as const).map((type, index) => <Loading key={index} type={type} direction="horizontal">加载中...</Loading>)}</view></ExampleBlock>
    </DemoGroup>
  </view>;
}
