import {expect,test} from '@rstest/core';
import {act,cleanup,render} from '@lynx-js/react/testing-library';
import {createRootRoute,createRoute} from '@tanstack/react-router';
import {createRouter,RouterView,useRouteMatch} from '@daisu-ui/ui/router';
test('registered TanStack components receive scene-specific loader data while covered', async () => {
  function Item() {
    const match = useRouteMatch();
    return <text>{`${match.params.id}:${match.loaderData.title}`}</text>;
  }
  const root = createRootRoute();
  const item = createRoute({
    getParentRoute: () => root, path: '/items/$id', component: Item,
    loader: ({ params }) => ({ title: `item-${params.id}` }),
  });
  const router = createRouter({
    routeTree: root.addChildren([item]), initial: '/items/1',
    toPath: location => location,
    fromMatch: match => match.routeId === '__root__' ? null : { path: match.pathname },
    stringify: route => route.path,
  });
  await router.load();
  try {
    const screen = render(<RouterView router={router} canSwipeBack={() => false} />);
    await act(async () => { await router.push('/items/2'); });
    expect(screen.getByText('1:item-1')).toBeTruthy();
    expect(screen.getByText('2:item-2')).toBeTruthy();
    await act(async () => { await router.back(); });
    expect(screen.getByText('1:item-1')).toBeTruthy();
    expect(screen.queryByText('2:item-2')).toBeNull();
  } finally { cleanup(); }
});
