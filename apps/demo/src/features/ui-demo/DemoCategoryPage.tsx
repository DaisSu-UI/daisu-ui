import type { UiDemoCategory, UiDemoComponent } from './catalog.js';
import { componentGroups } from './catalog.js';
import { Cell, CellGroup } from 'daisu-ui';

export function DemoCategoryPage({ category, onOpen }: { category: UiDemoCategory; onOpen: (page: UiDemoComponent) => void }) {
  const group = componentGroups.find(item => item.id === category)!;
  const open = (page: UiDemoComponent) => { 'background only'; onOpen(page); };
  return <scroll-view className="ui-demo-category-scroll" scroll-orientation="vertical" scroll-y={true}><view className="ui-demo-category-content"><text className="ui-demo-category-page-title">{group.label}</text><text className="ui-demo-category-page-description">选择一个组件查看独立示例</text><CellGroup>{group.items.map((item, index) => <Cell key={item.id} title={item.label} arrow last={index === group.items.length - 1} onTap={() => { 'background only'; open(item.id); }} />)}</CellGroup></view></scroll-view>;
}
