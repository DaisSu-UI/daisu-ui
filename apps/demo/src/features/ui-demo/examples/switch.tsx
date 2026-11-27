import { useDemoLocale } from '../demoLocale.js';
import { useState } from '@lynx-js/react';
import { Cell, Dialog, Switch, useDialog } from '@daisu-ui/ui';
import type { SwitchValue } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function SwitchExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [work, setWork] = useState<SwitchValue>('上班');
  const dialog = useDialog();
  const guard = () => dialog.confirm('是否切换开关').then(() => true).catch(() => false);
  return <view>
    <DemoGroup title="组件类型">
      <ExampleBlock title="基本用法"><view className="demo-switch-row"><Switch defaultValue /></view></ExampleBlock>
      <ExampleBlock title="修改值 active-value 、 inactive-value"><text className="demo-switch-value">{demoText(String(work))}</text><view className="demo-switch-row"><Switch value={work} activeValue="上班" inactiveValue="下班" onChange={({ value }) => setWork(value)} /></view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件状态">
      <ExampleBlock title="加载状态"><view className="demo-switch-row"><Switch defaultValue loading activeText="上班" inactiveText="下班" /><Switch loading activeText="上班" inactiveText="下班" /></view></ExampleBlock>
      <ExampleBlock title="禁用状态"><view className="demo-switch-row"><Switch defaultValue disabled /><Switch disabled /></view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="自定义颜色 active-color 、 inactive-color"><view className="demo-switch-row"><Switch defaultValue activeColor="#13ce66" inactiveColor="#f00" /></view></ExampleBlock>
      <ExampleBlock title="文字描述"><view className="demo-switch-row"><Switch defaultValue activeText="上班" inactiveText="下班" /></view></ExampleBlock>
      <ExampleBlock title="自定义显示图标"><view className="demo-switch-row"><Switch activeIcon="check" inactiveIcon="close" /></view></ExampleBlock>
      <ExampleBlock title="自定义动作图标"><view className="demo-switch-row"><Switch activeActionIcon="check" inactiveActionIcon="close" /></view></ExampleBlock>
      <ExampleBlock title="形状"><view className="demo-switch-row"><Switch defaultValue activeText="全圆" inactiveText="全圆" /><Switch shape="square" activeText="直角" inactiveText="直角" /></view></ExampleBlock>
      <ExampleBlock title="自定义大小"><view className="demo-switch-row demo-switch-row-bottom">{[24, 32, 40, 48].map(size => <Switch key={size} size={size} defaultValue />)}</view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="搭配表单使用" noPadding><Cell title={demoText("搭配表单使用")} center><Switch size={20} /></Cell></ExampleBlock>
      <ExampleBlock title="before-change 修改前钩子函数"><view className="demo-switch-row"><Switch beforeChange={guard} /></view></ExampleBlock>
    </DemoGroup>
    <Dialog {...demoCopy(dialog.props)} rootPortal className="ui-demo-page" />
  </view>;
}
