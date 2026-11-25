import { expect, test } from '@rstest/core';
import { componentGroups } from '../features/ui-demo/catalog.js';
import { createAppRouter, resolveRootRoute } from './router.js';

test('standalone Demo accepts every catalog deep link without a business route', async () => {
  for (const group of componentGroups) {
    for (const item of group.items) {
      const router = createAppRouter(`/ui-demo/${item.id}`);
      expect(router.routes.at(-1)).toEqual({ name: 'ui-demo', page: item.id });
      await router.back();
      expect(router.routes.at(-1)).toEqual({ name: 'ui-demo', page: 'overview' });
    }
  }
  expect(resolveRootRoute('unknown')).toEqual({ name: 'ui-demo', page: 'overview' });
});

test('standalone Demo supports typed navigation and guards used by Router examples', async () => {
  const router = createAppRouter('router');
  await router.navigate({ to: '/ui-demo/$page', params: { page: 'button' } });
  expect(router.routes.at(-1)?.page).toBe('button');
  const remove = router.beforeEach(navigation => navigation.action === 'back' ? false : undefined);
  await router.back();
  expect(router.routes.at(-1)?.page).toBe('button');
  remove();
  await router.back();
  expect(router.routes.at(-1)?.page).toBe('router');
});

test('all UI demo categories and components have restorable routes including the router demo', async () => {
  for (const group of componentGroups) {
    for (const page of [group.id, ...group.items.map(item => item.id)]) {
      const router = createAppRouter(`/ui-demo/${page}`);
      expect(router.route).toEqual({ name: 'ui-demo', page });
      expect(router.href(router.route)).toBe(`/ui-demo/${page}`);
      const restored = createAppRouter(router.href(router.route), router.serialize());
      expect(restored.route).toEqual({ name: 'ui-demo', page });
      expect(await restored.back()).toBe(true);
      expect(restored.route).toEqual({ name: 'ui-demo', page: 'overview' });
    }
  }
});
