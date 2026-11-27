import { useDemoLocale } from '../demoLocale.js';
import { useRef, useState } from '@lynx-js/react';
import { Button, Popover, RadioGroup, Toast, useToast } from '@daisu-ui/ui';
import type { BubblePlacement, PopoverMenuItem, PopoverRef } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

const placements: BubblePlacement[] = ['bottom', 'bottom-start', 'bottom-end', 'top', 'top-start', 'top-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'];
const placementOptions = placements.map(value => ({ label: value, value }));
const menu: PopoverMenuItem[] = [{ iconClass: 'check', content: '全部标记已读' }, { iconClass: 'delete', content: '清空最近会话' }, { iconClass: 'subscribe', content: '消息订阅设置' }, { iconClass: 'scan', content: '消息异常检测' }];

export function PopoverExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const refs = useRef<Record<string, PopoverRef | null>>({});
  const [placement, setPlacement] = useState<BubblePlacement>('bottom');
  const [width, setWidth] = useState(150);
  const toast = useToast();
  const closeAll = (except?: string) => { 'background only'; for (const [key, value] of Object.entries(refs.current)) if (key !== except) value?.close(); };
  const props = (key: string) => ({ ref: (value: PopoverRef | null) => { 'background only'; refs.current[key] = value; }, onOpen: () => closeAll(key), placement });
  return <view className="demo-popover-page" bindtap={() => closeAll()}>
    <DemoGroup title="组件类型">
      <ExampleBlock title="基本用法"><view className="demo-popover-trigger"><Popover {...demoCopy(props('basic'))} content={demoText("这是一段内容。")}><Button label={demoText("点击展示")} /></Popover></view></ExampleBlock>
      <ExampleBlock title="列表展示"><view className="demo-popover-trigger"><Popover {...demoCopy(props('menu'))} mode="menu" content={demoText(menu)} onMenuClick={({ item }) => toast.show('选择了' + item.content)}><Button label={demoText("列表")} /></Popover></view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock title="位置"><view className="demo-popover-options"><RadioGroup value={placement} options={demoCopy(placementOptions)} onChange={value => setPlacement(value as BubblePlacement)} /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="嵌套信息"><view className="demo-popover-trigger"><Popover {...demoCopy(props('custom'))} contentNode={<view className="demo-popover-custom"><text>{demoText("这是一段自定义样式的内容。")}</text></view>}><Button label={demoText("点击展示")} /></Popover></view></ExampleBlock>
      <ExampleBlock title="显示关闭按钮"><view className="demo-popover-trigger"><Popover {...demoCopy(props('closable'))} content={demoText("这是一段内容。")} showClose><Button label={demoText("显示关闭按钮")} /></Popover></view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="动态内容与位置更新"><view className="demo-popover-trigger"><Popover {...demoCopy(props('dynamic'))} contentNode={<view className="demo-popover-custom" style={{ width: `${width}px` }}><text className="demo-popover-status">{demoText("当前宽度：")}{demoText(width)}px</text><Button label={demoText("改变大小并更新")} size="small" onTap={() => { 'background only'; setWidth(value => value === 150 ? 250 : 150); refs.current.dynamic?.updatePosition(); }} /></view>}><Button label={demoText("动态内容")} /></Popover></view></ExampleBlock></DemoGroup>
    <Toast {...demoCopy(toast.props)} rootPortal />
  </view>;
}
