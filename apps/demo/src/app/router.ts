import { createRootRoute, createRoute } from '@tanstack/react-router';
import { createRouter, parseRoutePath, useRouter } from 'daisu-ui/router';
import type { RouterHistoryState } from 'daisu-ui/router';
import { isUiDemoCategory, isUiDemoComponent } from '../features/ui-demo/catalog.js';
import type { UiDemoPage } from '../features/ui-demo/catalog.js';
export type AppRoute = { name: 'ui-demo'; page: UiDemoPage };
const root = createRootRoute();
const home = createRoute({ getParentRoute: () => root, path: '/ui-demo/index' });
const page = createRoute({ getParentRoute: () => root, path: '/ui-demo/$page' });
const tree = root.addChildren([home, page]);
export function resolveRootRoute(input: unknown): AppRoute {
  const value = parseRoutePath(String(input ?? 'overview')).path.replace(/^\/?ui-demo(?:\/|$)/, '').replace(/^\/|\/$/g, '');
  return { name: 'ui-demo', page: isUiDemoCategory(value) || isUiDemoComponent(value) ? value : 'overview' };
}
export function stringifyAppRoute(route: AppRoute) { return `/ui-demo/${route.page === 'overview' ? 'index' : route.page}`; }
export function createAppRouter(input: unknown, historyState?: RouterHistoryState) {
  return createRouter<AppRoute, typeof tree>({
    routeTree: tree,
    initial: stringifyAppRoute(resolveRootRoute(input)),
    toPath: value => stringifyAppRoute(resolveRootRoute(value)),
    fromMatch: match => resolveRootRoute(match.params.page),
    stringify: stringifyAppRoute,
    initialRoutes: route => route.page === 'overview' ? [route] : [{ name: 'ui-demo', page: 'overview' }, route],
    historyState,
  });
}
export type AppRouter = ReturnType<typeof createAppRouter>;
export function useAppRouter() { return useRouter<AppRoute, typeof tree>(); }
