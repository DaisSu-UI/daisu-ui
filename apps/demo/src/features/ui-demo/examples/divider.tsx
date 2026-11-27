import { useDemoLocale } from '../demoLocale.js';
import { Divider, Icon } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function DividerExample() {
  const { text: demoText } = useDemoLocale();
  return <view className="demo-divider-page">
    <DemoGroup title="组件类型">
      <ExampleBlock title="基本用法"><Divider /></ExampleBlock>
      <ExampleBlock title="展示文本"><Divider>{demoText("展示文本")}</Divider></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件变体">
      <ExampleBlock title="内容位置"><Divider>{demoText("中间")}</Divider><Divider contentPosition="left">{demoText("左侧")}</Divider><Divider contentPosition="right">{demoText("右侧")}</Divider></ExampleBlock>
      <ExampleBlock title="虚线"><Divider dashed>{demoText("虚线分割")}</Divider></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="自定义渲染内容"><Divider><Icon name="down" size={20} color="#868a9c" /></Divider></ExampleBlock>
      <ExampleBlock title="自定义颜色"><Divider color="#1c64fd">{demoText("自定义颜色")}</Divider></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="垂直分割线"><view className="demo-divider-vertical"><text>{demoText("文本")}</text><Divider vertical /><text>{demoText("文本")}</text><Divider vertical dashed /><text>{demoText("文本")}</text><Divider vertical hairline={false} /><text>{demoText("文本")}</text><Divider vertical color="#1c64fd" /><text>{demoText("文本")}</text></view></ExampleBlock></DemoGroup>
  </view>;
}
