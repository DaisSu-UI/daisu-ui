import './runtime.js';
import 'url-search-params-polyfill';
import { parseRoutePath, routePath, parseRouterHistoryState } from './location.js';
import { createMemoryHistory, createRouter as createTanStackRouter } from '@tanstack/react-router';
import type { AnyRoute, AnyRouteMatch, NavigateOptions, Router as TanStackRouter } from '@tanstack/react-router';

export type RouteQuery = Record<string, string | number | boolean | null | undefined>;
export type NavigationAction = 'push' | 'replace' | 'back' | 'reset' | 'restore';
export type NavigationResult = Promise<boolean>;
export type SceneNavigateOptions<TTree extends AnyRoute, TTo extends string | undefined, TFrom extends string = string> = NavigateOptions<TanStackRouter<TTree>, TFrom, TTo> & {
  hash?: never; state?: never; href?: never; reloadDocument?: never; mask?: never;
  hashScrollIntoView?: never; resetScroll?: never; startTransition?: never;
  viewTransition?: never; ignoreBlocker?: never; publicHref?: never;
};
export type RouterHistoryState = { entries: { key: string; path: string }[] };
export type RouterEntry<R> = { key: string; route: R; matches: readonly AnyRouteMatch[] };
export type RouterSnapshot<R> = {
  entries: readonly RouterEntry<R>[];
  action: NavigationAction;
  direction: 'forward' | 'back' | 'none';
  revision: number;
};
export type Navigation<R> = { to: R; from: R; action: NavigationAction; source: 'app' | 'history' };
export type NavigationGuard<R> = (navigation: Navigation<R>) => boolean | void | Promise<boolean | void>;
export type RouterOptions<R, TTree extends AnyRoute = AnyRoute> = {
  routeTree: TTree;
  initial: string;
  /** Normalize host path aliases. Matching belongs to TanStack. */
  toPath(location: string): string | null;
  fromMatch(match: AnyRouteMatch): R | null;
  stringify(route: R): string;
  initialRoutes?(route: R): R[];
  historyState?: RouterHistoryState;
};
export type Router<R, TTree extends AnyRoute = AnyRoute> = ReturnType<typeof createRouter<R, TTree>>;

export { parseRoutePath, routePath, parseRouterHistoryState } from './location.js';

/** TanStack owns route matching, validation, loading and memory history.
 * This adapter owns scene identities, keepalive and guards for every host entry point.
 * Construction is pure; load/navigation is started only on the background thread.
 */
export function createRouter<R, TTree extends AnyRoute = AnyRoute>(options: RouterOptions<R, TTree>) {
  const engine: TanStackRouter<AnyRoute> = createTanStackRouter({
    routeTree: options.routeTree as AnyRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
    isServer: false,
    origin: 'http://localhost',
    // IDs must remain strings: TanStack's default JSON search parser coerces numbers.
    parseSearch: search => parseRoutePath(`/${search}`).query,
    stringifySearch: search => routePath('', search),
    defaultPendingMinMs: 0,
  });
  let sequence = 0;
  let attempt = 0;
  let pending: Promise<boolean> = Promise.resolve(true);
  const listeners = new Set<(snapshot: RouterSnapshot<R>, navigation: Navigation<R>) => void>();
  const guards = new Set<NavigationGuard<R>>();
  const after = new Set<(navigation: Navigation<R>) => void>();
  let resolveError: unknown;
  const resolveEntry = (location: string, key?: string): RouterEntry<R> | null => {
    resolveError = undefined;
    const path = options.toPath(location);
    if (!path || !path.startsWith('/') || path.startsWith('//')) return null;
    try {
      const parsed = parseRoutePath(path);
      const matches = engine.matchRoutes(parsed.path, parsed.query, { throwOnError: true });
      if (matches.some(match => match._notFound)) return null;
      const match = matches[matches.length - 1];
      const route = match && options.fromMatch(match);
      if (!route) return null;
      return { key: key || `route-${++sequence}`, route, matches };
    } catch (error) { resolveError = error; return null; }
  };
  const makeInitial = (route: R) => {
    const routes = options.initialRoutes?.(route);
    return (routes?.length ? routes : [route]).map(item => {
      const entry = resolveEntry(options.stringify(item));
      if (!entry) throw new Error('Router initial scene is invalid');
      return entry;
    });
  };
  const initial = resolveEntry(options.initial);
  if (!initial) {
    const reason = resolveError instanceof Error ? `${resolveError.name}: ${resolveError.message}` : String(resolveError ?? 'no matching route');
    throw new Error(`Router initial location is invalid (${options.initial}): ${reason}`);
  }
  let entries = makeInitial(initial.route);
  const decode = (value: unknown): RouterEntry<R>[] | null => {
    const state = parseRouterHistoryState(value);
    if (!state) return null;
    const restored: RouterEntry<R>[] = [];
    for (const item of state.entries) {
      const next = resolveEntry(item.path, item.key);
      if (!next) return null;
      const existing = entries.find(old => old.key === item.key && options.stringify(old.route) === options.stringify(next.route));
      restored.push(existing || next);
      const id = /^route-(\d+)$/.exec(item.key);
      if (id && Number.isSafeInteger(Number(id[1]))) sequence = Math.max(sequence, Number(id[1]));
    }
    return restored;
  };
  if (options.historyState) entries = decode(options.historyState) || entries;
  const installHistory = (next: RouterEntry<R>[]) => {
    engine.update({ history: createMemoryHistory({ initialEntries: next.map(item => options.stringify(item.route)) }) });
    engine.updateLatestLocation();
  };
  installHistory(entries);
  let snapshot: RouterSnapshot<R> = { entries, action: 'reset', direction: 'none', revision: 0 };
  const run = (next: RouterEntry<R>[], action: NavigationAction, source: 'app' | 'history' = 'app'): NavigationResult => {
    'background only';
    const ticket = ++attempt;
    const navigation: Navigation<R> = { to: next[next.length - 1]!.route, from: entries[entries.length - 1]!.route, action, source };
    const checks = [...guards];
    pending = (async () => {
      for (const guard of checks) {
        try { if (await guard(navigation) === false) return false; } catch { return false; }
        if (ticket !== attempt) return false;
      }
      if (ticket !== attempt) return false;
      const previousTop = entries[entries.length - 1]!.key;
      const goingBack = action === 'back' || action === 'restore' && !next.some(item => item.key === previousTop) && next.length < entries.length;
      const goingForward = action === 'push' || action === 'restore' && next.length > entries.length;
      const top = next[next.length - 1]!;
      let loading: Promise<void>;
      if (action === 'push' || action === 'replace') {
        const { path, query } = parseRoutePath(options.stringify(top.route));
        // Unique state deliberately allows pushing the same URL as a new scene.
        loading = engine.navigate({ to: path, search: query, state: { sceneKey: top.key }, replace: action === 'replace' } as unknown as Parameters<typeof engine.navigate>[0]);
      } else {
        if (action === 'back') engine.history.back();
        else installHistory(next);
        loading = engine.load();
      }
      const publish = () => {
        entries = next;
        snapshot = { entries, action, direction: goingForward ? 'forward' : goingBack ? 'back' : 'none', revision: snapshot.revision + 1 };
        [...listeners].forEach(listener => listener(snapshot, navigation));
      };
      // History commits synchronously. Publish the accepted scenes now so a second
      // navigation sees the same stack/index as TanStack while loaders are pending.
      publish();
      await loading;
      if (ticket !== attempt) return false;
      const resolved = resolveEntry(engine.history.location.href, top.key);
      if (!resolved) return false;
      const matches = engine.state.matches;
      next = [...next.slice(0, -1), options.stringify(top.route) === options.stringify(resolved.route)
        ? { ...top, matches } : { ...resolved, matches }];
      navigation.to = next[next.length - 1]!.route;
      publish();
      [...after].forEach(listener => listener(navigation));
      return true;
    })();
    return pending;
  };
  const push = (location: string, replace = false): NavigationResult => {
    'background only';
    if (!replace && entries.length >= 100) return Promise.resolve(false);
    const next = resolveEntry(location);
    return next ? run([...(replace ? entries.slice(0, -1) : entries), next], replace ? 'replace' : 'push') : Promise.resolve(false);
  };
  const navigate = async <const TTo extends string | undefined, const TFrom extends string = string>(navigation: SceneNavigateOptions<TTree, TTo, TFrom>): Promise<boolean> => {
    'background only';
    // A single typed entry point; external/document navigation belongs to the host.
    if (typeof navigation.to === 'string' && (navigation.to.includes('://') || navigation.to.startsWith('//'))) throw new Error('Use the host to open external URLs');
    const location = engine.buildLocation(navigation as Parameters<typeof engine.buildLocation>[0]);
    return push(location.href, navigation.replace);
  };
  return {
    /** Diagnostic/advanced TanStack access. Route changes must use the guarded facade. */
    engine,
    navigate,
    get route() { return entries[entries.length - 1]!.route; },
    get routes() { return entries.map(item => item.route); },
    get snapshot() { return snapshot; },
    href: options.stringify,
    serialize(): RouterHistoryState { return { entries: entries.map(item => ({ key: item.key, path: options.stringify(item.route) })) }; },
    /** Wait for an openBusiness navigation, whose return value means "handled". */
    whenIdle() { 'background only'; return pending; },
    async load() {
      'background only';
      const ticket = attempt;
      await engine.load();
      if (ticket !== attempt) return false;
      const top = entries[entries.length - 1]!;
      const resolved = resolveEntry(engine.history.location.href, top.key);
      if (!resolved) return false;
      entries = [...entries.slice(0, -1), { ...top, route: options.stringify(top.route) === options.stringify(resolved.route) ? top.route : resolved.route, matches: engine.state.matches }];
      snapshot = { ...snapshot, entries, revision: snapshot.revision + 1 };
      const navigation: Navigation<R> = { to: entries[entries.length - 1]!.route, from: top.route, action: 'restore', source: 'app' };
      [...listeners].forEach(listener => listener(snapshot, navigation));
      return true;
    },
    push,
    replace(location: string) { 'background only'; return push(location, true); },
    back(): NavigationResult { 'background only'; return entries.length > 1 ? run(entries.slice(0, -1), 'back') : Promise.resolve(false); },
    reset(location: string): NavigationResult {
      'background only';
      const route = resolveEntry(location)?.route;
      return route ? run(makeInitial(route), 'reset') : Promise.resolve(false);
    },
    restore(state: RouterHistoryState): NavigationResult {
      'background only';
      const next = decode(state);
      return next ? run(next, 'restore', 'history') : Promise.resolve(false);
    },
    subscribe(listener: (snapshot: RouterSnapshot<R>, navigation: Navigation<R>) => void) {
      'background only'; listeners.add(listener); return () => { listeners.delete(listener); };
    },
    beforeEach(guard: NavigationGuard<R>) {
      'background only'; guards.add(guard); return () => { guards.delete(guard); };
    },
    afterEach(listener: (navigation: Navigation<R>) => void) {
      'background only'; after.add(listener); return () => { after.delete(listener); };
    },
  };
}

export type RouterHistoryAdapter = {
  write(state: RouterHistoryState, action: NavigationAction | 'sync'): void;
  subscribe(listener: (state: RouterHistoryState) => void): () => void;
};

export function connectRouterHistory<R>(router: Router<R>, adapter: RouterHistoryAdapter) {
  'background only';
  let disposed = false;
  let historyAttempt = 0;
  let previous = JSON.stringify(router.serialize());
  const unsubscribeRouter = router.subscribe((snapshot, navigation) => {
    const state = router.serialize();
    const serialized = JSON.stringify(state);
    if (navigation.source === 'app' && serialized !== previous) {
      const before = JSON.parse(previous) as RouterHistoryState;
      const sameKeys = before.entries.length === state.entries.length && before.entries.every((entry, index) => entry.key === state.entries[index]!.key);
      // Loading/redirect completion can canonicalize an already committed entry.
      adapter.write(state, sameKeys ? 'sync' : snapshot.action);
    }
    previous = serialized;
  });
  const unsubscribeHistory = adapter.subscribe(state => {
    const ticket = ++historyAttempt;
    void router.restore(state).then(() => {
      if (!disposed && ticket === historyAttempt) adapter.write(router.serialize(), 'sync');
    });
  });
  adapter.write(router.serialize(), 'sync');
  return () => { disposed = true; unsubscribeRouter(); unsubscribeHistory(); };
}
