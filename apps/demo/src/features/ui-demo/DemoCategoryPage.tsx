import { useDemoLocale } from './demoLocale.js';
import type { UiDemoCategory, UiDemoComponent } from './catalog.js';
import { componentGroups } from './catalog.js';
import { Cell, CellGroup } from '@daisu-ui/ui';

export function DemoCategoryPage({ category, onOpen }: { category: UiDemoCategory; onOpen: (page: UiDemoComponent) => void }) {
  const { t } = useDemoLocale();
  const group = componentGroups.find(item => item.id === category)!;
  const open = (page: UiDemoComponent) => { 'background only'; onOpen(page); };
  return <scroll-view style={{ zIndex: 0 }} className="ui-demo-category-scroll" scroll-orientation="vertical" scroll-y={true}><view className="ui-demo-category-content"><text className="ui-demo-category-page-title">{t(group.label)}</text><text className="ui-demo-category-page-description">{t('选择一个组件查看独立示例')}</text><CellGroup>{group.items.map((item, index) => <Cell key={item.id} title={t(item.label)} arrow last={index === group.items.length - 1} onTap={() => { 'background only'; open(item.id); }} />)}</CellGroup></view></scroll-view>;
}
