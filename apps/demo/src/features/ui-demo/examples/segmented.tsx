import { useState } from '@lynx-js/react';
import { Button, Icon, RootPortal, Segmented, Transition } from 'daisu-ui';
import type { SegmentedOption } from 'daisu-ui';
import redpanda from '../../../assets/demo-red-panda.jpg';
import capybara from '../../../assets/demo-capybara.jpg';
import panda from '../../../assets/demo-panda.jpg';
import meng from '../../../assets/demo-landscape.jpg';
import { DemoGroup, ExampleBlock } from './shared.js';

const options = ['评论', '点赞', '贡献', '打赏'];
const people: readonly SegmentedOption<{ avatar: string }>[] = [
  { value: '李雷', disabled: true, payload: { avatar: redpanda } },
  { value: '韩梅梅', payload: { avatar: capybara } },
  { value: '林涛', disabled: true, payload: { avatar: panda } },
  { value: 'Tom', payload: { avatar: meng } },
];

export function SegmentedExample() {
  const [outline, setOutline] = useState<string | number>('评论');
  const [person, setPerson] = useState<string | number>('韩梅梅');
  const [popup, setPopup] = useState(false);
  const [popupValue, setPopupValue] = useState<string | number>('点赞');
  const close = () => { 'background only'; setPopup(false); };
  return <view className="demo-segmented-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基础用法"><Segmented options={options} defaultValue="详情" /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="禁用分段器"><Segmented options={options} value="评论" disabled /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock title="轮廓主题"><Segmented options={options} value={outline} onChange={option => { 'background only'; setOutline(option.value); }} theme="outline" /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="自定义渲染分段器标签"><Segmented options={people} value={person} onChange={option => { 'background only'; setPerson(option.value); }} renderLabel={({ option, active }) => <view className={`demo-segmented-person ${active ? 'demo-segmented-person-active' : ''}`}><image className="demo-segmented-avatar" src={option.payload!.avatar} mode="scaleToFill" /><text className="demo-segmented-name">{option.value}</text></view>} /></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="选项切换（暂不支持振动）"><Segmented options={options} defaultValue="打赏" /></ExampleBlock>
      <ExampleBlock title="在弹出框中使用"><view className="demo-segmented-trigger"><Button label="打开弹窗" onTap={() => { 'background only'; setPopup(true); }} /></view></ExampleBlock>
    </DemoGroup>
    <RootPortal>
      <Transition show={popup} lazyRender name="fade" className="ui-demo-page demo-segmented-backdrop" onTap={close} />
      <Transition show={popup} lazyRender name="slide-up" className="ui-demo-page demo-segmented-popup">
        <view className="demo-segmented-popup-title"><text>在弹出框中使用</text><view className="demo-segmented-popup-close" accessibility-element accessibility-traits="button" accessibility-label="关闭弹窗" bindtap={close}><Icon name="close" size={20} /></view></view>
        <Segmented options={options} value={popupValue} onChange={option => { 'background only'; setPopupValue(option.value); }} />
      </Transition>
    </RootPortal>
  </view>;
}
