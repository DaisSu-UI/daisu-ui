import { useDemoLocale } from '../demoLocale.js';
import { useState } from '@lynx-js/react';
import { Button, Circle, Dialog, useDialog } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
const gradient = { '0': '#f14646', '100': '#ffffff' };
export function CircleExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [value,setValue] = useState(20), dialog = useDialog();
  return <view className="demo-circle-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><view className="demo-circle-grid"><Circle value={value} text={demoText(`${value}%`)} /><Circle value={value} color="#f57f00" text={demoText(`${value}%`)} /><Circle value={value} color="#f14646" text={demoText(`${value}%`)} /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="样式定制"><view className="demo-circle-grid"><Circle value={value} strokeWidth={6} text={demoText("宽度定制")} /><Circle value={value} layerColor="#f2f3f5" color="#f14646" text={demoText("颜色定制")} /><Circle value={value} color={gradient} text={demoText("渐变色")} /><Circle value={value} color="#12b886" clockwise={false} text={demoText("逆时针")} /><Circle value={value} size={120} text={demoText("大小定制")} /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="内容形态"><ExampleBlock title="使用slot"><view className="demo-circle-grid"><Circle value={value} strokeWidth={6}><text className="demo-circle-value">{demoText(`${value}%`)}</text></Circle></view></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="进度控制"><view className="demo-circle-actions"><Button size="small" label={demoText("增加")} onTap={() => { 'background only'; setValue(value => Math.min(100,value+10)); }} /><Button size="small" tone="danger" label={demoText("减少")} onTap={() => { 'background only'; setValue(value => Math.max(0,value-10)); }} /></view></ExampleBlock><ExampleBlock title="alert 验证层级"><view className="demo-circle-actions"><Button label="alert" onTap={() => { 'background only'; void dialog.alert('操作成功'); }} /></view></ExampleBlock></DemoGroup>
    <Dialog {...demoCopy(dialog.props)} />
  </view>;
}
