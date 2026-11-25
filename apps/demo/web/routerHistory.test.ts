import { expect, test } from '@rstest/core';
import { createAppRouter } from '../src/app/router.js';
import { connectRouterHistory } from 'daisu-ui/router';
import type { RouterHistoryState } from 'daisu-ui/router';
import { createBrowserRouterHistory, readBrowserRoute } from './routerHistory.js';

/** A deterministic browser session: history.go dispatches popstate asynchronously via flush(). */
function browserSession(initial = 'https://test.invalid/?debug=1#/workbench') {
  const records: { url: string; state: unknown }[] = [{ url: initial, state: null }];
  let index = 0;
  const listeners = new Set<() => void>();
  const jobs: (() => void)[] = [];
  const browser = {
    get location() { return new URL(records[index]!.url); },
    history: {
      get state() { return records[index]!.state; },
      pushState(state: unknown, _title: string, url: string) {
        records.splice(index + 1);
        records.push({ state, url: new URL(url, records[index]!.url).href });
        index++;
      },
      replaceState(state: unknown, _title: string, url: string) {
        records[index] = { state, url: new URL(url, records[index]!.url).href };
      },
      go(delta: number) {
        jobs.push(() => {
          const next = index + delta;
          if (next < 0 || next >= records.length) return;
          index = next;
          [...listeners].forEach(listener => listener());
        });
      },
    },
    addEventListener(_type: string, listener: () => void) { listeners.add(listener); },
    removeEventListener(_type: string, listener: () => void) { listeners.delete(listener); },
  };
  return { browser: browser as unknown as Window, records, flush() { while (jobs.length) jobs.shift()!(); } };
}

test('clean demo paths open directly, normalize the old homepage alias and survive reload', async () => {
  for (const path of ['/ui-demo', '/ui-demo/', '/ui-demo/index', '/ui-demo/index/', '/ui-demo/overview', '/ui-demo/router']) {
    const session = browserSession(`https://test.invalid${path}`);
    const app = start(session);
    expect(app.router.route).toEqual({ name: 'ui-demo', page: path.endsWith('/router') ? 'router' : 'overview' });
    expect(session.browser.location.pathname).toBe(path.endsWith('/router') ? '/ui-demo/router' : '/ui-demo/index');
    expect(session.browser.location.hash).toBe('');
    await app.router.navigate({ to: '/ui-demo/$page', params: { page: 'button' } });
    expect(session.browser.location.pathname).toBe('/ui-demo/button');
    app.dispose();
    const restored = start(session);
    expect(restored.router.route).toEqual({ name: 'ui-demo', page: 'button' });
    session.browser.history.go(-1); session.flush(); await restored.router.whenIdle(); await Promise.resolve();
    expect(restored.router.route).toEqual({ name: 'ui-demo', page: path.endsWith('/router') ? 'router' : 'overview' });
    restored.dispose();
  }
});

function start(session: ReturnType<typeof browserSession>, fallback = 'workbench') {
  let navigate = (_state: RouterHistoryState) => {};
  const history = createBrowserRouterHistory(session.browser, fallback, state => navigate(state));
  const router = createAppRouter(history.initialPage, history.initialState);
  const disconnect = connectRouterHistory(router, {
    write: history.sync,
    subscribe(listener) { navigate = listener; return () => { navigate = () => {}; }; },
  });
  return { router, history, dispose() { disconnect(); history.dispose(); } };
}

test('deep UI demo links have a usable internal back even without earlier browser history', async () => {
  const session = browserSession('https://test.invalid/#/ui-demo/button');
  const app = start(session);
  expect(app.router.routes).toHaveLength(2);
  await app.router.back();
  expect(session.browser.location.hash).toBe('#/ui-demo/index');
  expect(session.records).toHaveLength(1);
  app.dispose();
});

test('returning to a saved legacy demo homepage normalizes its URL without cancelling browser back', async () => {
  const session = browserSession('https://test.invalid/#/ui-demo/overview');
  const app = start(session);
  await app.router.navigate({ to: '/ui-demo/$page', params: { page: 'router' } });
  const savedHome = session.records[0]!;
  savedHome.url = 'https://test.invalid/#/ui-demo/overview';
  const legacy = savedHome.state as { __lynxRouter: { state: RouterHistoryState } };
  legacy.__lynxRouter.state.entries[0]!.path = '/ui-demo/overview';
  session.browser.history.go(-1);
  session.flush();
  await app.router.whenIdle(); await Promise.resolve();
  session.flush();
  expect(app.router.route).toEqual({ name: 'ui-demo', page: 'overview' });
  expect(session.browser.location.hash).toBe('#/ui-demo/index');
  session.browser.history.go(1);
  session.flush();
  await app.router.whenIdle(); await Promise.resolve();
  expect(app.router.route).toEqual({ name: 'ui-demo', page: 'router' });
  app.dispose();
});

test('replace removes only the top instance when multiple Router demo pages were pushed', async () => {
  const session = browserSession('https://test.invalid/#/ui-demo/overview');
  const app = start(session);
  await app.router.navigate({ to: '/ui-demo/$page', params: { page: 'router' } });
  const previous = app.router.snapshot.entries[1]!;
  await app.router.navigate({ to: '/ui-demo/$page', params: { page: 'router' } });
  const replaced = app.router.snapshot.entries[2]!;
  await app.router.replace('ui-demo/cell');
  expect(app.router.snapshot.entries.map(entry => entry.key)).not.toContain(replaced.key);
  await app.router.back();
  session.flush();
  expect(app.router.snapshot.entries[1]!.key).toBe(previous.key);
  expect(app.router.snapshot.entries[1]!.route).toBe(previous.route);
  expect(app.router.route).toEqual({ name: 'ui-demo', page: 'router' });
  expect(session.browser.location.hash).toBe('#/ui-demo/router');
  app.dispose();
});
