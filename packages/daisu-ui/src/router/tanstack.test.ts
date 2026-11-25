import {expect,test} from '@rstest/core';
import {createRootRoute,createRoute,redirect} from '@tanstack/react-router';
import {createRouter,routePath} from '@daisu-ui/ui/router';
test('TanStack beforeLoad, redirects and loaders run through the scene adapter', async () => {
  const root = createRootRoute();
  const home = createRoute({ getParentRoute: () => root, path: '/home' });
  const redirecting = createRoute({ getParentRoute: () => root, path: '/old', beforeLoad: () => { throw redirect({ to: '/home' }); } });
  const item = createRoute({
    getParentRoute: () => root, path: '/items/$id',
    validateSearch: (search: Record<string, unknown>) => ({ tab: search.tab === 'history' ? 'history' : 'detail' }),
    loader: ({ params }) => ({ loadedId: params.id }),
  });
  const broken = createRoute({ getParentRoute: () => root, path: '/broken', loader: () => { throw new Error('loader failed'); } });
  const router = createRouter({
    routeTree: root.addChildren([home, redirecting, item, broken]), initial: '/home',
    toPath: location => location,
    fromMatch: match => match.routeId === '__root__' ? null : { path: routePath(match.pathname, match.search) },
    stringify: route => route.path,
  });
  expect(await router.push('/items/1901234567890123456?tab=history')).toBe(true);
  expect(router.snapshot.entries.at(-1)?.matches.at(-1)?.loaderData).toEqual({ loadedId: '1901234567890123456' });
  expect(router.snapshot.entries.at(-1)?.matches.at(-1)?.search.tab).toBe('history');
  expect(await router.push('/old')).toBe(true);
  expect(router.route.path).toBe('/home');
  expect(router.engine.history.location.pathname).toBe('/home');
  expect(await router.push('/broken')).toBe(true);
  expect(router.snapshot.entries.at(-1)?.matches.at(-1)?.status).toBe('error');
});

test('a second navigation while a loader is pending keeps history and scene indices aligned', async () => {
  let finish!: () => void;
  let started!: () => void;
  const entered = new Promise<void>(resolve => { started = resolve; });
  const waiting = new Promise<void>(resolve => { finish = resolve; });
  const root = createRootRoute();
  const home = createRoute({ getParentRoute: () => root, path: '/home' });
  const slow = createRoute({ getParentRoute: () => root, path: '/slow', loader: async () => { started(); await waiting; return 'ready'; } });
  const router = createRouter({
    routeTree: root.addChildren([home, slow]), initial: '/home',
    toPath: location => location,
    fromMatch: match => match.routeId === '__root__' ? null : { path: match.pathname },
    stringify: route => route.path,
  });
  const pending = router.push('/slow');
  await entered;
  await router.push('/home');
  expect(router.route.path).toBe('/home');
  expect(router.engine.history.location.state.__TSR_index).toBe(router.routes.length - 1);
  finish();
  expect(await pending).toBe(false);
  expect(router.route.path).toBe('/home');
  await router.back();
  expect(router.route.path).toBe('/slow');
  expect(router.snapshot.entries.at(-1)?.matches.at(-1)?.loaderData).toBe('ready');
});
