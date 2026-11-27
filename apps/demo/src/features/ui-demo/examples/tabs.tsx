import { useDemoLocale } from '../demoLocale.js';
import { useState } from '@lynx-js/react';
import { Button, Popup, Tabs, Toast, useToast } from '@daisu-ui/ui';
import type { StandardTabsProps, TabsItem, TabsLineTheme, TabsValue } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

function Sample({ count = 4, initial = 0, names, numeric = false, next = false, badge = false, disabledFirst = false, ...props }: Omit<StandardTabsProps, 'items'> & { count?: number; initial?: TabsValue; names?: readonly string[]; numeric?: boolean; next?: boolean; badge?: boolean; disabledFirst?: boolean }) {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [value, setValue] = useState<TabsValue>(initial);
  const labels = names ?? Array.from({ length: count }, (_, i) => `标签${i + 1}`);
  const numbers = [-1, 0, 1, 3, 2];
  const items: TabsItem[] = labels.map((title, i) => ({ title, name: numeric ? numbers[i] : names ? title : undefined, disabled: disabledFirst ? i === 0 : numeric ? numbers[i] === 0 : false, badgeProps: badge ? i === 0 ? { value: 10, right: '-8px' } : i === 1 ? { value: 100, max: 99, right: '-8px' } : { isDot: true, right: '-8px' } : undefined, children: <view className={`demo-tabs-content ${next ? 'demo-tabs-content-next' : ''}`}><text className="demo-tabs-copy">{demoText(badge ? `${title}徽标` : `内容${numeric ? numbers[i] : names ? title : i + 1}`)}</text>{next ? <Button label={demoText("下一个")} onTap={() => { 'background only'; setValue((Number(value) + 1) % count); }} /> : null}</view> }));
  return <Tabs {...demoCopy(props)} style={props.sticky ? { paddingBottom: '4px' } : undefined} items={demoCopy(items)} value={value} onChange={(v, e) => { 'background only'; setValue(v); props.onChange?.(v, e); }} />;
}
export function TabsExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [popup, setPopup] = useState(false); const [legacy, setLegacy] = useState('all'); const toast = useToast();
  const themes: TabsLineTheme[] = ['normal', 'text', 'underline', 'dot'];
  return <view className="demo-tabs-page">
    <DemoGroup title="组件类型">
      <ExampleBlock title="基本用法" noPadding><Sample next /></ExampleBlock>
      <ExampleBlock title="name匹配" noPadding><Sample names={['this', 'is', 'a', 'individual', 'example']} initial="a" /></ExampleBlock>
      <ExampleBlock title="name匹配 (数字类型)" noPadding><Sample count={5} names={[-1, 0, 1, 3, 2].map(n => `标签${n}`)} numeric initial={-1} mapNum={5} swipeable /></ExampleBlock>
      <ExampleBlock title="使用徽标" noPadding><Sample names={['普通数值', '最大值', '点状']} initial="普通数值" badge /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="粘性布局" noPadding><Sample sticky /></ExampleBlock><ExampleBlock title="禁用tab" noPadding><Sample disabledFirst initial={1} /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="底部条样式" noPadding>{themes.map(lineTheme => <view key={lineTheme} className="demo-tabs-theme"><Sample names={Array.from({ length: 4 }, (_, i) => `${lineTheme} ${i + 1}`)} initial={`${lineTheme} 1`} lineTheme={lineTheme} /></view>)}</ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="点击事件" noPadding><Sample onClick={e => { 'background only'; toast.show(`点击了标签${e.index + 1}`); }} /></ExampleBlock>
      <ExampleBlock title="切换动画" noPadding><Sample animated /></ExampleBlock>
      <ExampleBlock title="手势滑动" noPadding><Sample animated swipeable /></ExampleBlock>
      <ExampleBlock title="数量大于6时可滚动" noPadding><Sample count={7} /></ExampleBlock>
      <ExampleBlock title="左对齐超出即可滚动" noPadding><Sample names={Array.from({ length: 5 }, (_, i) => `超大标签${i + 1}`)} initial="超大标签1" slidable="always" /></ExampleBlock>
      <ExampleBlock title="数量大于10时出现导航地图" noPadding><Sample count={12} mapTitle="全部标签" /></ExampleBlock>
      <ExampleBlock title="在弹出框中使用"><view className="demo-tabs-open"><Button label={demoText("打开弹窗")} onTap={() => { 'background only'; setPopup(true); }} /></view></ExampleBlock>
      <ExampleBlock title="原有默认样式"><Tabs value={legacy} options={demoCopy([{ label: '全部', value: 'all' }, { label: '进行中', value: 'active' }, { label: '已完成', value: 'done' }])} onChange={setLegacy} /></ExampleBlock>
    </DemoGroup>
    <Popup className="ui-demo-page demo-tabs-popup-panel" show={popup} onChange={setPopup} rootPortal closable position="bottom"><view className="demo-tabs-popup"><text className="demo-tabs-popup-title">{demoText("在弹出框中使用")}</text><Sample names={['这', '是', '一', '个', '例子']} initial="个" /></view></Popup>
    <Toast {...demoCopy(toast.props)} rootPortal />
  </view>;
}
