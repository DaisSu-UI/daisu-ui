import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { ConfigProvider } from './ConfigProvider.js';
import { useLocale } from './useLocale.js';
import { zhCN, enUS, zhTW, resolveLocale, translate, localeDate } from './locale.js';
import { Search } from './Search.js';
import { Signature } from './Signature.js';
import { Loadmore } from './Loadmore.js';
import { Calendar, CalendarView } from './Calendar.js';
import { Dialog } from './Dialog.js';
import { RootPortalHost } from './RootPortal.js';
import { Popup } from './Popup.js';
afterEach(() => { cleanup(); rstest.restoreAllMocks(); rstest.useRealTimers(); });
const date = new Date(2026, 10, 27).getTime();
function Copy() { const { locale, t } = useLocale(); return <text className="locale-copy">{`${locale.name}:${t('common.confirm')}:${t('common.cancel')}`}</text>; }

test('all three language packs contain every public message and work without Intl', () => {
  for (const pack of [enUS, zhTW]) expect(Object.keys(pack.messages).sort()).toEqual(Object.keys(zhCN.messages).sort());
  rstest.stubGlobal('Intl', undefined);
  expect(translate(enUS, 'common.confirm')).toBe('Confirm');
  expect(translate(zhTW, 'loadmore.loading')).toBe('正在載入中...');
  expect(localeDate(enUS, date)).toBe('November 27, 2026');
  expect(localeDate(zhCN, date)).toBe('2026年11月27日');
  rstest.unstubAllGlobals();
});

test('scoped locale inheritance, partial overrides and reset do not mutate siblings or builtins', () => {
  const tree = <><Copy /><ConfigProvider locale="en-US"><Copy /><ConfigProvider theme="dark" locale={{ messages: { 'common.confirm': 'Continue', 'common.cancel': '' } }}><Copy /></ConfigProvider><Copy /></ConfigProvider><ConfigProvider locale={zhTW}><Copy /></ConfigProvider></>;
  const screen = render(tree);
  expect([...screen.container.querySelectorAll('.locale-copy')].map(node => node.textContent)).toEqual(['zh-CN:确定:取消', 'en-US:Confirm:Cancel', 'en-US:Continue:', 'en-US:Confirm:Cancel', 'zh-TW:確定:取消']);
  expect(enUS.messages['common.confirm']).toBe('Confirm');
  expect(resolveLocale({ name: 'en-US', messages: { 'common.cancel': undefined } }).messages['common.cancel']).toBe('Cancel');
  screen.rerender(<ConfigProvider><Copy /></ConfigProvider>);
  expect(screen.container.querySelector('.locale-copy')?.textContent).toBe('zh-CN:确定:取消');
});

test('live language changes update defaults and accessibility while preserving input and explicit labels', () => {
  const tree = (locale: 'zh-CN' | 'en-US' | 'zh-TW') => <ConfigProvider locale={locale}><Search defaultValue="typed" /><Search cancelTxt="Keep" placeholder="Custom" /><Signature /><Loadmore state="finished" /></ConfigProvider>;
  const screen = render(tree('zh-CN'));
  screen.rerender(tree('en-US'));
  expect(screen.container.querySelector('input')?.getAttribute('default-value')).toBe('typed');
  expect(screen.container.querySelector('input')?.getAttribute('placeholder')).toBe('Search');
  expect(screen.getByText('Cancel')).toBeTruthy();
  expect(screen.getByText('Keep')).toBeTruthy();
  expect(screen.getByText('All loaded')).toBeTruthy();
  expect(screen.container.querySelector('.ui-signature-board')?.getAttribute('accessibility-label')).toBe('Signature pad');
  screen.rerender(tree('zh-TW'));
  expect(screen.container.querySelector('input')?.getAttribute('placeholder')).toBe('搜尋');
  expect(screen.getByText('已載入完畢')).toBeTruthy();
});

test('portaled overlays inherit and react to the source locale without being reopened', async () => {
  rstest.useFakeTimers();
  const tree = (locale: 'en-US' | 'zh-TW') => <ConfigProvider><RootPortalHost><ConfigProvider locale={locale}><Dialog show type="confirm" msg="Business text" rootPortal /><Popup show rootPortal closable><Copy /></Popup></ConfigProvider></RootPortalHost></ConfigProvider>;
  const screen = render(tree('en-US'));
  await rstest.advanceTimersByTimeAsync(400);
  expect(screen.getByText('Confirm')).toBeTruthy();
  expect(screen.getByText('Cancel')).toBeTruthy();
  expect(screen.container.querySelector('.ui-popup-close')?.getAttribute('accessibility-label')).toBe('Close popup');
  screen.rerender(tree('zh-TW'));
  expect(screen.getByText('確定')).toBeTruthy();
  expect(screen.getByText('取消')).toBeTruthy();
  expect(screen.container.querySelector('.locale-copy')?.textContent).toBe('zh-TW:確定:取消');
});

test('calendar weekday, month, controls and selection remain correct through locale changes', () => {
  const tree = (locale: 'en-US' | 'zh-TW') => <ConfigProvider locale={locale}><CalendarView value={date} minDate={new Date(2026, 10, 1).getTime()} maxDate={new Date(2026, 11, 31).getTime()} switchMode="year-month" /></ConfigProvider>;
  const screen = render(tree('en-US'));
  expect(screen.container.querySelector('.ui-calendar-weekdays')?.textContent).toBe('SunMonTueWedThuFriSat');
  expect(screen.container.querySelector('.ui-calendar-controls')?.textContent).toContain('November 2026');
  expect(screen.container.querySelector('[accessibility-label="Next month"]')).toBeTruthy();
  expect(screen.container.querySelector('.ui-calendar-day-selected')?.getAttribute('accessibility-label')).toBe('November 27, 2026');
  screen.rerender(tree('zh-TW'));
  expect(screen.container.querySelector('.ui-calendar-day-selected')?.textContent).toBe('27');
  expect(screen.container.querySelector('.ui-calendar-controls')?.textContent).toContain('2026年11月');
});

test('changing the open Calendar language preserves its edited draft', async () => {
  const tree = (locale: 'en-US' | 'zh-TW') => <ConfigProvider locale={locale}><Calendar visible value={date} minDate={new Date(2026, 10, 1).getTime()} maxDate={new Date(2026, 10, 30).getTime()} switchMode="month" /></ConfigProvider>;
  const screen = render(tree('en-US'));
  const day = screen.container.querySelector('[accessibility-label="November 26, 2026"]')!;
  fireEvent.tap(day);
  screen.rerender(tree('zh-TW'));
  await waitFor(() => expect(screen.container.querySelector('.ui-calendar-day-selected')?.textContent).toBe('26'));
  expect(screen.getByText('確定')).toBeTruthy();
});
