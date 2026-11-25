import { parseRoutePath, parseRouterHistoryState, routePath } from '@daisu-ui/ui/router/location';
import type { NavigationAction, RouterHistoryState } from '@daisu-ui/ui/router/location';

type RecordState = { scope: string; index: number; state: RouterHistoryState; positions: Record<string, number> };
type Browser = Pick<Window, 'history' | 'location' | 'addEventListener' | 'removeEventListener'>;
const stateKey = '__lynxRouter';
const top = (state: RouterHistoryState) => state.entries[state.entries.length - 1]!;
// A successful restore may normalize legacy paths while preserving scene identity.
const sameEntries = (a: RouterHistoryState, b: RouterHistoryState) =>
  a.entries.length === b.entries.length && a.entries.every((entry, index) => entry.key === b.entries[index]!.key);

/** Clean paths are the default; existing Hash links keep their original history mode. */
export function readBrowserRoute(location: Pick<Location, 'pathname' | 'search' | 'hash'>, fallbackPage = '/ui-demo/index') {
  const hash = location.hash.slice(1);
  if (hash.startsWith('/') && !hash.startsWith('//')) return { mode: 'hash' as const, page: hash };
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  if (pathname === '/' || pathname === '/index.html') return { mode: 'history' as const, page: fallbackPage };
  const query = new URLSearchParams(location.search);
  for (const key of ['debug', 'demo', 'component', 'page']) query.delete(key);
  const parsed = parseRoutePath(`${pathname}${query.size ? `?${query}` : ''}`);
  return { mode: 'history' as const, page: routePath(parsed.path, parsed.query) };
}

function readRecord(value: unknown): RecordState | null {
  if (!value || typeof value !== 'object') return null;
  const record = (value as Record<string, unknown>)[stateKey] as RecordState | undefined;
  const state = parseRouterHistoryState(record?.state);
  if (!record || !state || typeof record.scope !== 'string' || !Number.isSafeInteger(record.index) || record.index < 0 || !record.positions || typeof record.positions !== 'object') return null;
  const positions: Record<string, number> = {};
  for (const { key } of state.entries) {
    const position = record.positions[key];
    if (Number.isSafeInteger(position) && position! >= 0 && position! <= record.index) positions[key] = position!;
  }
  return { scope: record.scope, index: record.index, state, positions };
}

/** Browser APIs live in the Web host, never in the shared Lynx bundle. */
export function createBrowserRouterHistory(browser: Browser, fallbackPage: string, navigate: (state: RouterHistoryState) => void) {
  const { mode, page: initialPage } = readBrowserRoute(browser.location, fallbackPage);
  const saved = readRecord(browser.history.state);
  const restored = saved && top(saved.state).path === initialPage ? saved : null;
  const scope = restored?.scope || `lynx-${Date.now()}-${Math.random()}`;
  let externalSequence = 0;
  let committed: RecordState = restored || { scope, index: 0, state: { entries: [{ key: 'route-1', path: initialPage.startsWith('/') ? initialPage : `/${initialPage}` }] }, positions: {} };
  let pending: { from: RecordState; to: RecordState } | null = null;
  let traversal: RecordState | null = null;
  const queue: { state: RouterHistoryState; action: NavigationAction | 'sync' }[] = [];
  let disposed = false;

  const writeRecord = (record: RecordState, push: boolean) => {
    const current = browser.history.state;
    const state = { ...(current && typeof current === 'object' ? current : {}), [stateKey]: record };
    const target = parseRoutePath(top(record.state).path);
    const debug = new URLSearchParams(browser.location.search).get('debug');
    const url = mode === 'hash' ? `${browser.location.pathname}${browser.location.search}#${top(record.state).path}` :
      routePath(target.path, { ...target.query, ...(debug === null ? {} : { debug }) });
    if (push) browser.history.pushState(state, '', url);
    else browser.history.replaceState(state, '', url);
    committed = record;
  };
  const flush = () => {
    while (!traversal && queue.length) {
      const next = queue.shift()!;
      sync(next.state, next.action);
    }
  };
  const sync = (value: RouterHistoryState, action: NavigationAction | 'sync') => {
    if (disposed) return;
    const state = parseRouterHistoryState(value);
    if (!state) throw new Error('路由历史状态无效');
    if (traversal) { queue.push({ state, action }); return; }
    if (pending) {
      const { from, to } = pending;
      pending = null;
      if (sameEntries(state, to.state)) {
        writeRecord({ ...to, state }, false);
      } else if (from.index !== to.index) {
        // The page guard consumed/cancelled browser back. Return to its original entry.
        traversal = { ...from, state };
        browser.history.go(from.index - to.index);
      } else writeRecord({ ...from, state }, false);
      if (action !== 'sync') queue.push({ state, action });
      flush();
      return;
    }
    if (action === 'back') {
      const index = committed.positions[top(state).key];
      if (index !== undefined && index < committed.index) {
        traversal = { ...committed, index, state };
        browser.history.go(index - committed.index);
        return;
      }
    }
    const index = committed.index + (action === 'push' ? 1 : 0);
    const positions = { ...committed.positions, [top(state).key]: index };
    writeRecord({ scope, index, state, positions }, action === 'push');
  };
  const pop = () => {
    if (disposed) return;
    if (traversal) {
      const expected = traversal;
      traversal = null;
      writeRecord(expected, false);
      flush();
      return;
    }
    const record = readRecord(browser.history.state);
    const path = readBrowserRoute(browser.location).page;
    const to = record?.scope === scope && top(record.state).path === path ? record : {
      scope, index: committed.index + 1,
      state: { entries: [{ key: `external-${++externalSequence}`, path: path.startsWith('/') && !path.startsWith('//') ? path : '/ui-demo/index' }] },
      positions: {},
    };
    pending = { from: committed, to };
    navigate(to.state);
  };
  browser.addEventListener('popstate', pop);
  return {
    initialPage,
    initialState: restored?.state,
    sync,
    dispose() { disposed = true; queue.length = 0; browser.removeEventListener('popstate', pop); },
  };
}
