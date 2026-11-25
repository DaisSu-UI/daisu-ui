import { useState } from '@lynx-js/react';
import { Button, Circle, Dialog, useDialog } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
const gradient = { '0': '#f14646', '100': '#ffffff' };
export function CircleExample() {
  const [value,setValue] = useState(20), dialog = useDialog();
  return <view className="demo-circle-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><view className="demo-circle-grid"><Circle value={value} text={`${value}%`} /><Circle value={value} color="#f57f00" text={`${value}%`} /><Circle value={value} color="#f14646" text={`${value}%`} /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="样式定制"><view className="demo-circle-grid"><Circle value={value} strokeWidth={6} text="宽度定制" /><Circle value={value} layerColor="#f2f3f5" color="#f14646" text="颜色定制" /><Circle value={value} color={gradient} text="渐变色" /><Circle value={value} color="#12b886" clockwise={false} text="逆时针" /><Circle value={value} size={120} text="大小定制" /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="内容形态"><ExampleBlock title="使用slot"><view className="demo-circle-grid"><Circle value={value} strokeWidth={6}><text className="demo-circle-value">{`${value}%`}</text></Circle></view></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="进度控制"><view className="demo-circle-actions"><Button size="small" label="增加" onTap={() => { 'background only'; setValue(value => Math.min(100,value+10)); }} /><Button size="small" tone="danger" label="减少" onTap={() => { 'background only'; setValue(value => Math.max(0,value-10)); }} /></view></ExampleBlock><ExampleBlock title="alert 验证层级"><view className="demo-circle-actions"><Button label="alert" onTap={() => { 'background only'; void dialog.alert('操作成功'); }} /></view></ExampleBlock></DemoGroup>
    <Dialog {...dialog.props} />
  </view>;
}
