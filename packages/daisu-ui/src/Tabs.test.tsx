import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { Tabs } from './Tabs.js';
import { nextTab, tabsIndex } from './tabsModel.js';

test('Tabs resolves explicit names strictly before numeric indices and skips disabled entries', () => {
  const items = [{ name: -1 }, { name: 0, disabled: true }, { name: '1' }, { name: 1 }];
  expect(tabsIndex(items, 1)).toBe(3); expect(tabsIndex(items, '1')).toBe(2);
  expect(tabsIndex(items, 0)).toBe(0); expect(tabsIndex(items, 50)).toBe(0);
  expect(tabsIndex([{ disabled: true }], 0)).toBe(-1);
  expect(nextTab(items, 0, 1)).toBe(2); expect(nextTab(items, 3, 1)).toBe(3);
});

test('Tabs preserves the original API, adds disabled/click events, and retains visited page state', async () => {
  const events: unknown[] = [];
  try {
    const screen = render(<Tabs items={[{ title: 'A', name: 'a', children: <text>页面A</text> }, { title: 'B', name: 'b', disabled: true }, { title: 'C', name: 'c', children: <text>页面C</text> }]} defaultValue="a" onChange={(v, e) => events.push([v, e])} onClick={e => events.push(['click', e.name])} onDisabled={e => events.push(['disabled', e.name])} />);
    fireEvent.tap(screen.container.querySelectorAll('.ui-tabs-nav-item')[1]!);
    expect(events).toEqual([['disabled', 'b']]);
    expect(screen.queryByText('页面C')).toBeNull();
    fireEvent.tap(screen.container.querySelectorAll('.ui-tabs-nav-item')[2]!);
    await waitFor(() => expect(screen.getByText('页面C')).toBeTruthy());
    expect(screen.getByText('页面A')).toBeTruthy();
    expect(events.slice(1)).toEqual([['c', { index: 2, name: 'c' }], ['click', 'c']]);
    fireEvent.tap(screen.container.querySelectorAll('.ui-tabs-nav-item')[2]!);
    expect(events.length).toBe(4);
    screen.rerender(<Tabs value="a" options={[{ label: '原样式', value: 'a' }]} onChange={v => events.push(v)} />);
    expect(screen.container.querySelector('.ui-tabs')).toBeTruthy();
    expect(screen.container.querySelector('.ui-tabs-standard')).toBeNull();
  } finally { cleanup(); }
});

test('Tabs controlled changes wait for owner and horizontal swipes skip disabled pages', async () => {
  const changes: unknown[] = [];
  try {
    const items = [{ title: 'A' }, { title: 'B', disabled: true }, { title: 'C' }].map(item => ({ ...item, children: <text>{item.title}页面</text> }));
    const screen = render(<Tabs items={items} value={0} swipeable onChange={value => changes.push(value)} />);
    const content = screen.container.querySelector('.ui-tabs-content')!;
    fireEvent.touchstart(content, { touches: [{ clientX: 290, clientY: 10 }] });
    fireEvent.touchend(content, { changedTouches: [{ clientX: 100, clientY: 15 }] });
    expect(changes).toEqual([2]);
    expect(screen.container.querySelector('.ui-tabs-nav-active')?.textContent).toBe('A');
    screen.rerender(<Tabs items={items} value={2} swipeable onChange={value => changes.push(value)} />);
    await waitFor(() => expect(screen.container.querySelector('.ui-tabs-nav-active')?.textContent).toBe('C'));
  } finally { cleanup(); }
});
