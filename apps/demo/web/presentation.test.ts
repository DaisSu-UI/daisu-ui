import { expect, test } from '@rstest/core';
import { applyDemoPresentation, readDemoLocale } from './presentation.js';
import { demoPageTitle } from '../src/features/ui-demo/demoPageTitle.js';

test('browser presentation follows the route and language, persists preference and restores it on reload', () => {
  let saved: string | null = null;
  const browser = { location: { search: '' }, localStorage: { getItem: () => saved, setItem: (_key: string, value: string) => { saved = value; } } };
  const page = { title: '', documentElement: { lang: '' } } as Pick<Document, 'title' | 'documentElement'>;
  expect(readDemoLocale(browser)).toBe('zh-CN');
  for (const [route, locale, expected] of [
    ['about', 'en-US', 'About · Daisu UI'],
    ['button', 'en-US', 'Button · Daisu UI'],
    ['calendar', 'zh-TW', 'Calendar 日曆選擇器 · Daisu UI'],
    ['overview', 'zh-CN', '组件示例 · Daisu UI'],
  ] as const) {
    expect(applyDemoPresentation(page, browser, { type: 'presentation', title: demoPageTitle(route, locale), locale })).toBe(true);
    expect(page.title).toBe(expected);
    expect(page.documentElement.lang).toBe(locale);
    expect(readDemoLocale(browser)).toBe(locale);
  }
  browser.location.search = '?locale=zh-TW';
  expect(readDemoLocale(browser)).toBe('zh-TW');
  browser.location.search = '?locale=invalid';
  expect(readDemoLocale(browser)).toBe('zh-CN');
  expect(applyDemoPresentation(page, browser, { action: 'push' })).toBe(false);
  expect(() => applyDemoPresentation(page, browser, { type: 'presentation', title: '', locale: 'en-US' })).toThrow();
});

test('blocked browser storage still allows language and title updates', () => {
  const browser = { location: { search: '' }, get localStorage(): Storage { throw new Error('Storage disabled'); } };
  const page = { title: '', documentElement: { lang: '' } } as Pick<Document, 'title' | 'documentElement'>;
  expect(readDemoLocale(browser)).toBe('zh-CN');
  expect(applyDemoPresentation(page, browser, { type: 'presentation', title: 'About · Daisu UI', locale: 'en-US' })).toBe(true);
  expect(page.title).toBe('About · Daisu UI');
});
