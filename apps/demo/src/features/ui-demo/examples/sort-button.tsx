import { useDemoLocale } from '../demoLocale.js';
import { SortButton } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function SortButtonExample() {
  const { text: demoText } = useDemoLocale();
  return <view className="demo-sort-button-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基础用法"><SortButton title={demoText("价格")} /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体">
      <ExampleBlock title="设置 allow-reset 允许重置按钮"><SortButton title={demoText("价格")} allowReset /></ExampleBlock>
      <ExampleBlock title="设置 desc-first 优先切换为降序"><SortButton title={demoText("价格")} descFirst /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="显示下划线"><SortButton title={demoText("价格")} line /></ExampleBlock></DemoGroup>
  </view>;
}
