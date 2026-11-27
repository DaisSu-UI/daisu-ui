import assert from 'node:assert/strict';
import { createMemoryHistory, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

// Node's default server export and global scheduler would hide native failures.
assert.equal(typeof window, 'undefined');
assert.equal(typeof document, 'undefined');
delete globalThis.queueMicrotask;
await import('../packages/daisu-ui/dist/router/runtime.js');
assert.equal(typeof globalThis.queueMicrotask, 'function');

const root = createRootRoute();
const home = createRoute({ getParentRoute: () => root, path: '/ui-demo/index' });
const detail = createRoute({ getParentRoute: () => root, path: '/ui-demo/button' });
const router = createRouter({
  routeTree: root.addChildren([home, detail]),
  history: createMemoryHistory({ initialEntries: ['/ui-demo/index'] }),
  isServer: false,
  origin: 'http://localhost',
});
await router.load();
assert.equal(router.state.matches.at(-1).status, 'success');
await router.navigate({ to: '/ui-demo/button' });
assert.equal(router.state.matches.at(-1).routeId, detail.id);
assert.equal(router.state.matches.at(-1).status, 'success');
router.history.back();
await router.load();
assert.equal(router.state.matches.at(-1).routeId, home.id);
console.log('Native router compatibility: home → detail → back without a global queueMicrotask');
