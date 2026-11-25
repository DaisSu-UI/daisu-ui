import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Loadmore } from './Loadmore.js';

test('Loadmore only retries errors, preserves custom slots and composes public Loading configuration', () => {
  let reloads = 0;
  try {
    const screen = render(<Loadmore onReload={() => reloads++} />);
    fireEvent.tap(screen.container.querySelector('.ui-loadmore')!);
    expect(reloads).toBe(0);
    expect(screen.container.querySelector('.ui-loading')).toBeNull();
    screen.rerender(<Loadmore state="loading" loadingText="正在读取" loadingProps={{ type: 'wave', className: 'caller-loading', size: 20 }} onReload={() => reloads++} />);
    expect(screen.getByText('正在读取')).toBeTruthy();
    expect(screen.container.querySelector('.ui-loadmore-loading.caller-loading .ui-loading-spinner-wave')).toBeTruthy();
    fireEvent.tap(screen.container.querySelector('.ui-loadmore')!);
    expect(reloads).toBe(0);
    screen.rerender(<Loadmore state="error" errorText="读取失败" onReload={() => reloads++} />);
    expect(screen.getByText('读取失败')).toBeTruthy();
    expect(screen.getByText('点击重试')).toBeTruthy();
    fireEvent.tap(screen.container.querySelector('.ui-loadmore')!);
    expect(reloads).toBe(1);
    screen.rerender(<Loadmore state="error" error={<text>重试读取</text>} onReload={() => reloads++} />);
    expect(screen.getByText('重试读取')).toBeTruthy();
    fireEvent.tap(screen.container.querySelector('.ui-loadmore')!);
    expect(reloads).toBe(2);
    screen.rerender(<Loadmore state="finished" finishedText="全部读完" onReload={() => reloads++} />);
    expect(screen.getByText('全部读完')).toBeTruthy();
    expect(screen.container.querySelector('.ui-divider')).toBeTruthy();
    fireEvent.tap(screen.container.querySelector('.ui-loadmore')!);
    expect(reloads).toBe(2);
    screen.rerender(<Loadmore state="loading" loading={0} />);
    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.container.querySelector('.ui-loading')).toBeNull();
  } finally { cleanup(); }
});
