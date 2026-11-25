import { useEffect, useRef, useState } from '@lynx-js/react';
import { List } from '@lynx-js/lynx-ui';
import type { ListRef } from '@lynx-js/lynx-ui';
import { Button, Cell, Icon, Loading, RootPortal, Sidebar } from '@daisu-ui/ui';
import type { SidebarItem } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
import { sidebarCategories, sidebarHeaderIndexes, sidebarRowCounts, sidebarSectionAtOffset } from './sidebarModel.js';

import type { sidebarExamplePages } from '../catalog.js';
export type SidebarExamplePage = typeof sidebarExamplePages[number]['id'];
const basicItems: readonly SidebarItem[] = [0, 1, 2].map(value => ({ value, label: '标签名称' }));
const badgeItems: readonly SidebarItem[] = basicItems.map((item, index) => ({ ...item, ...(index === 0 ? { isDot: true } : index === 1 ? { badge: 5 } : { badgeProps: { value: 55, type: 'warning' as const } }) }));
const disabledItems: readonly SidebarItem[] = basicItems.map((item, index) => ({ ...item, disabled: index === 1 }));

export function SidebarExample({ onOpen }: { onOpen: (page: SidebarExamplePage) => void }) {
  const [loading, setLoading] = useState(false);
  const timers = useRef(new Map<ReturnType<typeof setTimeout>, (allowed: boolean) => void>());
  useEffect(() => () => { for (const [timer, resolve] of timers.current) { clearTimeout(timer); resolve(false); } timers.current.clear(); }, []);
  const beforeChange = () => {
    'background only';
    setLoading(true);
    return new Promise<boolean>(resolve => {
      const timer = setTimeout(() => { 'background only'; timers.current.delete(timer); setLoading(timers.current.size > 0); resolve(true); }, 2000);
      timers.current.set(timer, resolve);
    });
  };
  return <view className="demo-sidebar-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基础用法"><view className="demo-sidebar-row"><Sidebar items={basicItems} /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="徽标与禁用"><view className="demo-sidebar-row"><Sidebar items={badgeItems} /><Sidebar items={disabledItems} beforeChange={beforeChange} /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="锚点用法示例"><view className="demo-sidebar-button"><Button label="锚点用法" size="large" block onTap={() => { 'background only'; onOpen('sidebar-anchor'); }} /></view></ExampleBlock>
      <ExampleBlock title="切换页面用法示例"><view className="demo-sidebar-button"><Button label="切换页面" size="large" block onTap={() => { 'background only'; onOpen('sidebar-page'); }} /></view></ExampleBlock>
      <ExampleBlock title="自定义图标示例"><view className="demo-sidebar-button"><Button label="自定义图标" size="large" block onTap={() => { 'background only'; onOpen('sidebar-icons'); }} /></view></ExampleBlock>
    </DemoGroup>
    {loading ? <RootPortal><view className="demo-sidebar-loading"><Loading /><text>切换中</text></view></RootPortal> : null}
  </view>;
}

const icons = ['thumb-up', 'qrcode', 'location', 'desktop', 'code', 'cloud', 'mobile'];
const rows = sidebarRowCounts.flatMap((count, section) => [{ section, row: -1 }, ...Array.from({ length: count }, (_, row) => ({ section, row }))]);

function SidebarRows({ section, theme }: { section?: number; theme: 'light' | 'dark' }) {
  const visibleRows = section === undefined ? rows : rows.filter(row => row.section === section);
  return <>{visibleRows.map(({ section: current, row }) => <list-item key={`${current}:${row}`} item-key={`${current}:${row}`} estimated-main-axis-size-px={row === -1 ? 44 : 68} style={{ height: `${row === -1 ? 44 : 68}px` }}>
    {row === -1 ? <view className="demo-sidebar-section-title"><text>{`标题${sidebarCategories[current]}`}</text><view /></view> : <Cell title="标题文字" description="这是描述这是描述" border={row > 0} className="demo-sidebar-cell"><Icon name="code" size={24} color={theme === 'dark' ? '#e5e6eb' : '#4e5369'} /></Cell>}
  </list-item>)}</>;
}

function SidebarPageList({ section, mode, theme }: { section: number; mode: string; theme: 'light' | 'dark' }) {
  return <List listId={`sidebar-${mode}-${section}`} listType="single" spanCount={1} scrollOrientation="vertical" className="demo-sidebar-list"><SidebarRows section={section} theme={theme} /></List>;
}

export function SidebarLinkedExample({ page, theme }: { page: SidebarExamplePage; theme: 'light' | 'dark' }) {
  const [active, setActive] = useState(1);
  const [visited, setVisited] = useState<readonly number[]>([1]);
  const list = useRef<ListRef>(null);
  const initialized = useRef(false);
  const pages = page === 'sidebar-page';
  const items: readonly SidebarItem[] = sidebarCategories.map((name, index) => ({
    value: index, label: `分类${name}`, disabled: pages && index === 6,
    ...(page === 'sidebar-anchor' ? {} : { renderIcon: ({ active: selected, disabled }) => <Icon name={pages ? 'thumb-up' : icons[index]!} size={18} color={disabled ? theme === 'dark' ? '#4e5369' : '#c9cbd4' : selected ? theme === 'dark' ? '#5b90ff' : '#1c64fd' : undefined} /> }),
  }));
  return <view className={`demo-sidebar-linked ${pages ? 'demo-sidebar-pages' : 'demo-sidebar-anchors'}`}>
    <Sidebar items={items} value={active} onChange={({ value }) => {
      'background only';
      const section = Number(value);
      setActive(section);
      if (pages) setVisited(current => [...new Set([...current, ...sidebarCategories.map((_, index) => index).filter(index => index >= Math.min(active, section) && index <= Math.max(active, section))])]);
      else list.current?.scrollTo(false, 'top', sidebarHeaderIndexes[section], 0);
    }} />
    <view className="demo-sidebar-content">
      {pages ? <view className="demo-sidebar-page-stack" style={{ transform: `translateY(-${active * 100}%)` }}>{sidebarCategories.map((_, section) => <view key={section} className="demo-sidebar-panel">{visited.includes(section) ? <SidebarPageList key={active === section ? 'active' : 'inactive'} section={section} mode={page} theme={theme} /> : null}</view>)}</view> : <List ref={list} listId={`sidebar-${page}`} listType="single" spanCount={1} scrollOrientation="vertical" className="demo-sidebar-list" initialScrollIndex={sidebarHeaderIndexes[1]} scrollEventThrottle={16} onLayoutComplete={() => {
        'background only';
        if (initialized.current) return;
        initialized.current = true;
        list.current?.scrollTo(false, 'top', sidebarHeaderIndexes[1], 0);
      }} onScroll={event => {
        'background only';
        setActive(sidebarSectionAtOffset(event.detail.scrollTop));
      }}><SidebarRows theme={theme} /></List>}
    </view>
  </view>;
}
