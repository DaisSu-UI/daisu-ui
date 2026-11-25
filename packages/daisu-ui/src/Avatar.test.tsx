import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Avatar, AvatarGroup } from './Avatar.js';
import { avatarMetrics, avatarVisibleCount } from './avatarModel.js';

test('Avatar sizes follow current presets and group count handles invalid bounds', () => {
  expect(avatarMetrics('large').dimension).toBe('56px');
  expect(avatarMetrics('medium').dimension).toBe('48px');
  expect(avatarMetrics('normal').dimension).toBe('36px');
  expect(avatarMetrics('small').dimension).toBe('24px');
  expect(avatarMetrics('75rpx')).toEqual({ dimension: '10vw', font: '4.5vw', line: '28px', overlap: '-2.5vw' });
  expect(avatarMetrics(-1).dimension).toBe('36px');
  expect(avatarVisibleCount(5, 0)).toBe(5);
  expect(avatarVisibleCount(5, 2.9)).toBe(2);
  expect(avatarVisibleCount(5, Infinity)).toBe(5);
});

test('Avatar slots take priority and failed images recover when source changes, including returning to an old URL', () => {
  let errors = 0;
  let taps = 0;
  try {
    const screen = render(<Avatar src="first.jpg" text="U" alt="游客" onError={() => errors++} onTap={() => taps++} />);
    const error = Object.assign(new Event('bindEvent:error'), { eventType: 'bindEvent', eventName: 'error', detail: { error_code: 1, errMsg: 'failed' } });
    fireEvent(screen.container.querySelector('.ui-avatar-image')!, error);
    expect(screen.getByText('游客')).toBeTruthy();
    expect(errors).toBe(1);
    fireEvent.tap(screen.container.querySelector('.ui-avatar')!);
    expect(taps).toBe(1);
    screen.rerender(<Avatar src="second.jpg" alt="游客" />);
    expect(screen.container.querySelector('.ui-avatar-image')).toBeTruthy();
    screen.rerender(<Avatar src="first.jpg" alt="游客" />);
    expect(screen.container.querySelector('.ui-avatar-image')).toBeTruthy();
    screen.rerender(<Avatar src="first.jpg" text="U"><text>VIP</text></Avatar>);
    expect(screen.getByText('VIP')).toBeTruthy();
    expect(screen.container.querySelector('.ui-avatar-image')).toBeNull();
  } finally { cleanup(); }
});

test('AvatarGroup caps data, preserves item handlers and applies size, shape and cascading to the overflow avatar', () => {
  let taps = 0;
  const items = [{ key: 'a', text: 'A', size: 'large', onTap: () => taps++ }, { key: 'b', text: 'B' }, { key: 'c', text: 'C' }];
  try {
    const screen = render(<AvatarGroup items={items} maxCount={1} vertical size={40} shape="square" />);
    expect(screen.container.querySelectorAll('.ui-avatar')).toHaveLength(2);
    expect(screen.getByText('+2')).toBeTruthy();
    expect(screen.container.querySelectorAll('.ui-avatar-square')).toHaveLength(2);
    fireEvent.tap(screen.container.querySelector('.ui-avatar')!);
    expect(taps).toBe(1);
    screen.rerender(<AvatarGroup items={items} maxCount={2} collapseAvatar="更多" cascading="right-up" />);
    expect(screen.getByText('更多')).toBeTruthy();
    expect(screen.container.querySelectorAll('.ui-avatar')).toHaveLength(3);
    screen.rerender(<AvatarGroup items={[]} />);
    expect(screen.container.querySelectorAll('.ui-avatar')).toHaveLength(0);
  } finally { cleanup(); }
});
