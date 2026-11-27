import { version } from '@daisu-ui/ui/package.json';
import { DemoTabbar } from './DemoTabbar.js';
import { useDemoLocale } from './demoLocale.js';
import { useState } from '@lynx-js/react';
import type { UiDemoComponent } from './catalog.js';
import { componentGroups } from './catalog.js';
import { Cell, Collapse } from '@daisu-ui/ui';
import { DemoIcon } from './DemoIcon.js';
import { DemoNavbar } from './DemoNavbar.js';

export function DemoHomePage({ onOpen, statusBarHeight = 0 }: { onOpen: (page: UiDemoComponent) => void; statusBarHeight?: number }) {
  const { t } = useDemoLocale();
  const [expanded, setExpanded] = useState<string[]>([]);
  const open = (page: UiDemoComponent) => { 'background only'; onOpen(page); };
  const change = (value: string[]) => { 'background only'; setExpanded(value); };
  const groups = componentGroups.map(group => ({
    name: group.id,
    title: t(group.label),
    icon: <DemoIcon name={group.id} />,
    content: <view className="ui-demo-category-components">{group.items.map((item, index) => <Cell key={item.id} title={t(item.label)} arrow last={index === group.items.length - 1} onTap={() => { 'background only'; open(item.id); }} />)}</view>,
  }));
  return <view className="ui-demo-home">
    <DemoNavbar title="Daisu UI" statusBarHeight={statusBarHeight} />
    <scroll-view style={{ zIndex: 0 }} className="ui-demo-home-scroll" scroll-orientation="vertical" scroll-y={true}>
      <view className="ui-demo-home-hero"><view className="ui-demo-brand-row"><view className="ui-demo-logo-mark"><view className="ui-demo-logo-bar ui-demo-logo-bar-a" /><view className="ui-demo-logo-bar ui-demo-logo-bar-b" /><view className="ui-demo-logo-bar ui-demo-logo-bar-c" /></view><text className="ui-demo-home-name">Daisu UI <text className="ui-demo-home-version">v{version}</text></text></view><text className="ui-demo-home-description">{t('面向 Flutter 宿主的 ReactLynx 组件库，提供统一的业务控件、主题与 AI 协作规范。')}</text></view>
      <view className="ui-demo-category-list"><Collapse className="ui-demo-category-collapse" items={groups} value={expanded} onChange={change} /></view>
      <view className="ui-demo-home-bottom-space" />
    </scroll-view>
    <DemoTabbar active="demo" onAbout={() => { 'background only'; open('about'); }} />
  </view>;
}
