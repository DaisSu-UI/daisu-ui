import { useState } from '@lynx-js/react';
import type { UiDemoComponent } from './catalog.js';
import { componentGroups } from './catalog.js';
import { Cell, Collapse } from '@daisu-ui/ui';
import { DemoIcon } from './DemoIcon.js';
import { DemoNavbar } from './DemoNavbar.js';

export function DemoHomePage({ onOpen, statusBarHeight = 0 }: { onOpen: (page: UiDemoComponent) => void; statusBarHeight?: number }) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const open = (page: UiDemoComponent) => { 'background only'; onOpen(page); };
  const change = (value: string[]) => { 'background only'; setExpanded(value); };
  const groups = componentGroups.map(group => ({
    name: group.id,
    title: group.label,
    icon: <DemoIcon name={group.id} />,
    content: <view className="ui-demo-category-components">{group.items.map((item, index) => <Cell key={item.id} title={item.label} arrow last={index === group.items.length - 1} onTap={() => { 'background only'; open(item.id); }} />)}</view>,
  }));
  return <view className="ui-demo-home">
    <DemoNavbar title="CSO Lynx UI" statusBarHeight={statusBarHeight} />
    <scroll-view className="ui-demo-home-scroll" scroll-orientation="vertical" scroll-y={true}>
      <view className="ui-demo-home-hero"><view className="ui-demo-brand-row"><view className="ui-demo-logo-mark"><view className="ui-demo-logo-bar ui-demo-logo-bar-a" /><view className="ui-demo-logo-bar ui-demo-logo-bar-b" /><view className="ui-demo-logo-bar ui-demo-logo-bar-c" /></view><text className="ui-demo-home-name">CSO Lynx UI <text className="ui-demo-home-version">@ 0.2</text></text></view><text className="ui-demo-home-description">面向 Flutter 宿主的 ReactLynx 组件库，提供统一的业务控件、主题与 AI 协作规范。</text></view>
      <view className="ui-demo-category-list"><Collapse className="ui-demo-category-collapse" items={groups} value={expanded} onChange={change} /></view>
      <view className="ui-demo-home-bottom-space" />
    </scroll-view>
    <view className="ui-demo-tabbar"><view className="ui-demo-tabbar-item ui-demo-tabbar-item-active"><DemoIcon name="demo" /><text>Demo</text></view><view className="ui-demo-tabbar-item"><DemoIcon name="about" /><text>关于我们</text></view></view>
  </view>;
}
