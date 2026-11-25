import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { createAppRouter } from './router.js';
import { RouterView } from 'daisu-ui/router';
import { RouterExample } from '../features/ui-demo/examples/router.js';

test('router demo navigates with hooks and its guard blocks back until disabled', async () => {
  const router = createAppRouter('ui-demo/router');
  try {
    const screen = render(<RouterView router={router} canSwipeBack={() => false} renderRoute={route =>
      route.name === 'ui-demo' && route.page === 'router' ? <RouterExample /> : <text>{router.href(route)}</text>} />);
    fireEvent.tap(screen.getByText('开启返回拦截').closest('.ui-button')!);
    fireEvent.tap(screen.getByText('返回上一页').closest('.ui-button')!);
    expect(router.route).toEqual({ name: 'ui-demo', page: 'router' });
    await waitFor(() => expect(screen.getByText('已阻止返回，请先关闭导航守卫')).toBeTruthy());
    fireEvent.tap(screen.getByText('关闭返回拦截').closest('.ui-button')!);
    fireEvent.tap(screen.getByText('打开 Button 示例').closest('.ui-button')!);
    await waitFor(() => expect(router.route).toEqual({ name: 'ui-demo', page: 'button' }));
    await router.back();
    await waitFor(() => expect(screen.getByText('替换为 Cell 示例')).toBeTruthy());
    fireEvent.tap(screen.getByText('替换为 Cell 示例').closest('.ui-button')!);
    await waitFor(() => expect(router.route).toEqual({ name: 'ui-demo', page: 'cell' }));
    expect(router.routes).toHaveLength(2);
  } finally { cleanup(); }
});
