import { Divider, Icon } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function DividerExample() {
  return <view className="demo-divider-page">
    <DemoGroup title="组件类型">
      <ExampleBlock title="基本用法"><Divider /></ExampleBlock>
      <ExampleBlock title="展示文本"><Divider>展示文本</Divider></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件变体">
      <ExampleBlock title="内容位置"><Divider>中间</Divider><Divider contentPosition="left">左侧</Divider><Divider contentPosition="right">右侧</Divider></ExampleBlock>
      <ExampleBlock title="虚线"><Divider dashed>虚线分割</Divider></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="自定义渲染内容"><Divider><Icon name="down" size={20} color="#868a9c" /></Divider></ExampleBlock>
      <ExampleBlock title="自定义颜色"><Divider color="#1c64fd">自定义颜色</Divider></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="垂直分割线"><view className="demo-divider-vertical"><text>文本</text><Divider vertical /><text>文本</text><Divider vertical dashed /><text>文本</text><Divider vertical hairline={false} /><text>文本</text><Divider vertical color="#1c64fd" /><text>文本</text></view></ExampleBlock></DemoGroup>
  </view>;
}
