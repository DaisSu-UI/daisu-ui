import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { useState } from '@lynx-js/react';
import { Input, RootPortalHost } from '@daisu-ui/ui';
import { RouterView } from '@daisu-ui/ui/router';
import { version } from '@daisu-ui/ui/package.json';
import { createAppRouter } from '../../app/router.js';
import { DemoLocaleProvider, useDemoLocale } from './demoLocale.js';
import { DemoAboutPage } from './DemoAboutPage.js';
import { DemoHomePage } from './DemoHomePage.js';
import { DemoPresentation } from './DemoPresentation.js';
import { DemoNavbar } from './DemoNavbar.js';
import { InputExample } from './examples/input.js';
import { SliderExample } from './examples/slider.js';
import { DialogExample } from './examples/dialog.js';
import { ConfigProviderExample } from './examples/config-provider.js';
import { createDemoCopy } from './demoCopy.js';
import { translateDemo } from './demoMessages.js';
import { demoProjectLinks } from './demoProject.js';

afterEach(() => { cleanup(); rstest.unstubAllGlobals(); });

test('About changes the whole Demo language and exposes real project metadata and links', async () => {
  const router = createAppRouter('about');
  const posted: { title?: string; locale?: string }[] = [];
  rstest.stubGlobal('NativeModules', { DemoBridge: { postMessage: (value: string) => { posted.push(JSON.parse(value)); } } });
  const screen = render(<DemoLocaleProvider><DemoPresentation router={router} browser /><RootPortalHost>
    <RouterView router={router} renderRoute={route => route.page === 'about'
      ? <DemoAboutPage onBack={() => { void router.back(); }} onHome={() => { void router.reset('/ui-demo/index'); }} theme="light" onThemeChange={() => {}} />
      : route.page === 'overview' ? <DemoHomePage onOpen={page => { void router.push(`/ui-demo/${page}`); }} />
      : <><DemoNavbar title="Input 输入框" /><InputExample /></>} />
  </RootPortalHost></DemoLocaleProvider>);
  expect(screen.getByText(`v${version}`)).toBeTruthy();
  for (const link of demoProjectLinks) expect(screen.getByText(link.url)).toBeTruthy();
  fireEvent.tap(screen.getByText('English').closest('.ui-choice')!, { eventType: 'catchEvent' });
  await waitFor(() => expect(screen.getByText('Preferences')).toBeTruthy());
  await waitFor(() => expect(posted[posted.length - 1]).toMatchObject({ title: 'About · Daisu UI', locale: 'en-US' }));
  fireEvent.tap(screen.container.querySelector('.page .ui-demo-tabbar [accessibility-label="Demo"]')!);
  await waitFor(() => expect(router.route.page).toBe('overview'));
  expect(screen.getByText('About')).toBeTruthy();
  await router.push('/ui-demo/input');
  await waitFor(() => expect(posted[posted.length - 1]?.title).toBe('Input · Daisu UI'));
  expect(screen.container.querySelector('.demo-group-title')?.textContent).toBe('Component types');
  expect(screen.container.querySelector('input')?.getAttribute('placeholder')).toBe('Enter some text');
  await router.back();
  await waitFor(() => expect(posted[posted.length - 1]?.title).toBe('Component examples · Daisu UI'));
});

function SwitchLanguage() {
  const { setLocale } = useDemoLocale();
  return <view><text bindtap={() => { setLocale?.('en-US'); }}>EN</text><text bindtap={() => { setLocale?.('zh-TW'); }}>TW</text></view>;
}

function RetainedInput() {
  const [value, setValue] = useState('');
  return <view><Input value={value} onChange={setValue} /><text className="retained-value">{value}</text></view>;
}

test('live Demo language changes keep user input and update captions, defaults and dialog copy', async () => {
  const screen = render(<DemoLocaleProvider><RootPortalHost><SwitchLanguage /><RetainedInput /><InputExample /><SliderExample /><DialogExample /></RootPortalHost></DemoLocaleProvider>);
  const input = screen.container.querySelector('input')!;
  fireEvent(lynx.createSelectorQuery().select('.ui-textfield-native') as unknown as Element, Object.assign(new Event('bindEvent:input'), { eventName: 'input', eventType: 'bindEvent', detail: { value: 'my retained input' } }));
  fireEvent.tap(screen.getByText('EN'));
  expect(screen.getAllByText('Component types').length).toBeGreaterThan(1);
  expect(screen.getByText('Range slider')).toBeTruthy();
  expect(screen.getByText('Range slider').getAttribute('data-demotitle')).toBe('双向滑块');
  expect(screen.container.querySelector('.retained-value')?.textContent).toBe('my retained input');
  expect(screen.container.querySelector('input')).toBe(input);
  fireEvent.tap(screen.getByText('Alert dialog').closest('.ui-button')!);
  await waitFor(() => expect(screen.getByText('This is a notification')).toBeTruthy());
  fireEvent.tap(screen.getByText('TW'));
  expect(screen.getAllByText('元件類型').length).toBeGreaterThan(1);
  expect(screen.container.querySelector('.retained-value')?.textContent).toBe('my retained input');
  expect(screen.getByText('這是一條消息提示')).toBeTruthy();
});

test('presentation translation preserves business values, callbacks and source objects', () => {
  const click = () => {};
  const source = { title: '提示', value: '提示', inputValue: '提示', onTap: click, options: { message: '通知内容' }, items: [{ label: '选项1', value: '选项1', disabled: true }] };
  const copy = createDemoCopy(text => translateDemo(text, 'en-US'));
  const result = copy(source);
  expect(result.title).toBe('Notice');
  expect(result.value).toBe('提示');
  expect(result.inputValue).toBe('提示');
  expect(result.onTap).toBe(click);
  expect(result.options.message).toBe('Notification content');
  expect(result.items[0]).toEqual({ label: 'Option 1', value: '选项1', disabled: true });
  expect(source.items[0]!.label).toBe('选项1');
  expect(copy(source)).toBe(result);
});

test('ConfigProvider previews inherit the Demo language and do not expose a second language switch', () => {
  const screen = render(<DemoLocaleProvider initialLocale="en-US"><RootPortalHost><ConfigProviderExample /></RootPortalHost></DemoLocaleProvider>);
  expect(screen.getByText('Internationalization')).toBeTruthy();
  expect(screen.getByText('All loaded')).toBeTruthy();
  expect(screen.queryByText('English')).toBeNull();
  expect(screen.getByText('Default component text and calendars follow the language selected in About.')).toBeTruthy();
});
