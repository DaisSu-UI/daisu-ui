import { useState } from '@lynx-js/react';
import { Button, Cell, SelectPicker, RootPortal } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

const categories = ['男装', '奢侈品', '女装', '鞋靴', '内衣配饰', '箱包', '美妆护肤', '个性清洁', '钟表珠宝', '手机', '数码', '电脑办公'];

const categoryOptions = categories.map(label => ({ value: label, label }));

export function RootPortalExample() {
  const [basic, setBasic] = useState(false);
  const [picker, setPicker] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  return <view className="demo-root-portal-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><view className="demo-root-portal-trigger"><Button label="显示基本弹窗" onTap={() => { 'background only'; setBasic(true); }} /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="与弹层组件配合使用" noPadding><Cell title="选择商品分类" value={selected.join('、')} arrow onTap={() => { 'background only'; setPicker(true); }} /></ExampleBlock></DemoGroup>
    <DemoGroup title="使用注意"><ExampleBlock title="适用场景"><view className="demo-root-portal-tips"><text>适用于弹窗、弹出层等 fixed 定位容易失效的场景。</text><text>建议只在需要脱离父层级或避免被 transform、overflow 影响时开启。</text></view></ExampleBlock></DemoGroup>
    {basic ? <RootPortal><view className="ui-demo-page demo-root-portal-modal"><view className="demo-root-portal-modal-content"><text className="demo-root-portal-modal-title">基本弹窗</text><text className="demo-root-portal-modal-text">这是一个使用 root-portal 的基本弹窗示例。</text><Button label="关闭" onTap={() => { 'background only'; setBasic(false); }} /></view></view></RootPortal> : null}
    <SelectPicker rootPortal visible={picker} onVisibleChange={setPicker} value={selected} title="选择商品分类" columns={categoryOptions} className="ui-demo-page" onConfirm={({ value }) => { 'background only'; setSelected(Array.isArray(value) ? value.map(String) : [String(value)]); }} />
  </view>;
}
