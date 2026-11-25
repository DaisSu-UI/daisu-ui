import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Badge } from './Badge.js';
import { badgeLabel, badgeOffset } from './badgeModel.js';
import { Sidebar } from './Sidebar.js';
import { Tabbar } from './Tabbar.js';

test('Badge only caps numbers and treats zero and invalid values explicitly', () => {
  expect(badgeLabel(200, 99)).toBe('99+');
  expect(badgeLabel('200', 99)).toBe('200');
  expect(badgeLabel(0, 0)).toBeNull();
  expect(badgeLabel('0', 99)).toBeNull();
  expect(badgeLabel(0, 99, true)).toBe('0');
  expect(badgeLabel(NaN)).toBeNull();
  expect(badgeLabel(3, 0)).toBe('0+');
  expect(badgeLabel('new')).toBe('new');
  expect(badgeOffset(8)).toBe('8px');
  expect(badgeOffset('-4')).toBe('-4px');
  expect(badgeOffset('30rpx')).toBe('4vw');
});

test('Badge dot overrides zero, hidden preserves its children and standalone badges stay in flow', () => {
  let taps = 0;
  try {
    const child = <view bindtap={() => taps++}><text>内容</text></view>;
    const screen = render(<Badge value={0} isDot>{child}</Badge>);
    expect(screen.container.querySelector('.ui-badge-dot')).toBeTruthy();
    fireEvent.tap(screen.getByText('内容').parentElement!);
    expect(taps).toBe(1);
    screen.rerender(<Badge value={12} isDot hidden>{child}</Badge>);
    expect(screen.getByText('内容')).toBeTruthy();
    expect(screen.container.querySelector('.ui-badge-content')).toBeNull();
    screen.rerender(<Badge value="new" shape="bubble" border />);
    expect(screen.getByText('new')).toBeTruthy();
    expect(screen.container.querySelector('.ui-badge-fixed')).toBeNull();
    expect(screen.container.querySelector('.ui-badge-bordered.ui-badge-bubble')).toBeTruthy();
  } finally { cleanup(); }
});

test('Sidebar and Tabbar pass full badge options while retaining legacy zero and numeric-string behavior', () => {
  try {
    const screen = render(<Sidebar items={[{ value: 'old', label: '旧参数', badge: '200' }, { value: 'full', label: '新参数', badgeProps: { value: '200', shape: 'square', border: true, top: 4, hidden: true } }]} />);
    expect(screen.getByText('99+')).toBeTruthy();
    expect(screen.container.querySelectorAll('.ui-badge-content')).toHaveLength(1);
    screen.rerender(<Tabbar items={[{ title: '旧参数', value: 0 }, { title: '新参数', badgeProps: { value: '200', max: 10, shape: 'bubble', border: true } }]} />);
    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.getByText('200')).toBeTruthy();
    expect(screen.container.querySelector('.ui-badge-bubble.ui-badge-bordered')).toBeTruthy();
  } finally { cleanup(); }
});
