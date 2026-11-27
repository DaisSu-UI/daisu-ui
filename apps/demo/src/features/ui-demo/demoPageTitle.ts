import { componentGroups, formExamplePages, sidebarExamplePages } from './catalog.js';
import type { UiDemoPage } from './catalog.js';
import { translateDemo } from './demoMessages.js';

export function labelForDemoPage(page: UiDemoPage): string {
  if (page === 'about') return '关于我们';
  if (page === 'signature-landscape') return '横屏签名';
  if (page === 'stepper') return 'InputNumber 计数器';
  const extra = [...formExamplePages, ...sidebarExamplePages].find(item => item.id === page);
  if (extra) return extra.label;
  for (const group of componentGroups) {
    if (group.id === page) return group.label;
    const item = group.items.find(item => item.id === page);
    if (item) return item.label;
  }
  return '组件示例';
}

export function demoPageTitle(page: UiDemoPage, locale: string) {
  return `${translateDemo(labelForDemoPage(page), locale)} · Daisu UI`;
}
