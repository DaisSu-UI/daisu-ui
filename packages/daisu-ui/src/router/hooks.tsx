import { useLocale } from '../useLocale.js';
import { createContext, useContext, useEffect, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import { RouterContextProvider as TanStackProvider } from '@tanstack/react-router';
import type { AnyRoute, AnyRouteMatch } from '@tanstack/react-router';
import type { Router, RouterSnapshot } from './core.js';

const RouterContext = createContext<Router<unknown> | null>(null);
export const MatchContext = createContext<readonly AnyRouteMatch[]>([]);
export const RouteContext = createContext<unknown>(undefined);

export function RouterProvider<R, TTree extends AnyRoute>({ router, children }: { router: Router<R, TTree>; children?: ReactNode }) {
  useEffect(() => { void router.load(); }, [router]);
  return <RouterContext.Provider value={router as unknown as Router<unknown>}>
    <TanStackProvider router={router.engine}>{children}</TanStackProvider>
  </RouterContext.Provider>;
}

export function useRouter<R = unknown, TTree extends AnyRoute = AnyRoute>(): Router<R, TTree> {
  const router = useContext(RouterContext);
  if (!router) throw new Error('useRouter requires a RouterProvider or RouterView');
  return router as unknown as Router<R, TTree>;
}

export function useRouterSnapshot<R, TTree extends AnyRoute = AnyRoute>(router: Router<R, TTree>): RouterSnapshot<R> {
  const [snapshot, setSnapshot] = useState(router.snapshot);
  useEffect(() => {
    const unsubscribe = router.subscribe(next => { 'background only'; setSnapshot(next); });
    setSnapshot(router.snapshot);
    return unsubscribe;
  }, [router]);
  return snapshot;
}

/** Kept-alive pages receive their own route, even while a different page is on top. */
export function useRoute<R = unknown>(): R {
  const router = useRouter<R>();
  const snapshot = useRouterSnapshot(router);
  const route = useContext(RouteContext);
  return (route === undefined ? snapshot.entries[snapshot.entries.length - 1]!.route : route) as R;
}

/** Each keepalive scene owns its match data; covered pages never read top-page params. */
export function useRouteMatch(): AnyRouteMatch {
  const matches = useContext(MatchContext);
  if (!matches.length) throw new Error('useRouteMatch requires a RouterView scene');
  return matches[matches.length - 1]!;
}

/** Render the leaf component registered on the TanStack route tree. */
export function RouteScreen() {
  const { t: localeText } = useLocale();
  const router = useRouter();
  const leaf = useRouteMatch();
  const matches = useContext(MatchContext);
  const match = matches.find(match => match.status === 'error' || match.status === 'notFound') || leaf;
  const route = router.engine.routesById[match.routeId];
  const Component = route.options.component;
  const ErrorComponent = route.options.errorComponent;
  if (match.status === 'pending') {
    const Pending = route.options.pendingComponent;
    return Pending ? <Pending /> : <view className="page"><text>{localeText('router.loading')}</text></view>;
  }
  if (match.status === 'notFound') return <view className="page"><text>{localeText('router.notFound')}</text></view>;
  if (match.status === 'error') {
    if (ErrorComponent) return <ErrorComponent error={match.error} reset={() => { 'background only'; void router.load(); }} info={{ componentStack: '' }} />;
    return <view className="page"><text bindtap={() => { 'background only'; void router.load(); }}>{localeText('router.failed')}</text></view>;
  }
  return Component ? <Component /> : null;
}
