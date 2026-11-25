import { describe, expect, it } from '@rstest/core';
import { resolveRootRoute } from '../../../apps/demo/src/app/router.js';
import { createSidebarGuard, sidebarBadge } from './sidebarModel.js';
import { sidebarHeaderIndexes, sidebarSectionAtOffset, sidebarSectionOffsets } from '../../../apps/demo/src/features/ui-demo/examples/sidebarModel.js';
import { categoryForComponent, componentGroups } from '../../../apps/demo/src/features/ui-demo/catalog.js';

describe('Sidebar selection', () => {
  it('prevents stale confirmations from replacing a newer selection', async () => {
    const guard = createSidebarGuard();
    let finish!: (value: boolean) => void;
    let selected: string | number = 0;
    const old = guard.request(1, () => new Promise(resolve => { finish = resolve; }), () => { selected = 1; });
    await guard.request('2', undefined, () => { selected = '2'; });
    finish(true); await old;
    expect(selected).toBe('2');
  });
  it('cancels vetoes, rejections and confirmations invalidated by props or unmount', async () => {
    const guard = createSidebarGuard();
    let commits = 0;
    await guard.request(1, () => false, () => { commits++; });
    await guard.request(1, () => Promise.reject(new Error('cancelled')), () => { commits++; });
    let finish!: (value: boolean) => void;
    const request = guard.request(1, () => new Promise(resolve => { finish = resolve; }), () => { commits++; });
    guard.cancel(); finish(true); await request;
    expect(commits).toBe(0);
  });
  it('caps numeric and numeric-string badges without losing zero or custom text', () => {
    expect(sidebarBadge(100)).toBe('99+');
    expect(sidebarBadge('101', 10)).toBe('10+');
    expect(sidebarBadge(0)).toBe('0');
    expect(sidebarBadge('NEW')).toBe('NEW');
    expect(sidebarBadge(undefined)).toBe('');
  });
});

describe('Sidebar linked examples', () => {
  it('tracks section boundaries with the reference 50px threshold', () => {
    expect(sidebarHeaderIndexes).toEqual([0, 25, 50, 69, 91, 116, 135]);
    expect(sidebarSectionAtOffset(-100)).toBe(0);
    expect(sidebarSectionAtOffset(sidebarSectionOffsets[1]! - 51)).toBe(0);
    expect(sidebarSectionAtOffset(sidebarSectionOffsets[1]! - 50)).toBe(1);
    expect(sidebarSectionAtOffset(100000)).toBe(6);
    expect(sidebarSectionAtOffset(NaN)).toBe(0);
  });
  it('accepts direct links to child examples without listing them on the home page', () => {
    for (const id of ['sidebar-anchor', 'sidebar-page', 'sidebar-icons'] as const) {
      expect(resolveRootRoute(`ui-demo/${id}`)).toEqual({ name: 'ui-demo', page: id });
      expect(categoryForComponent(id)).toBe('navigation');
      expect(componentGroups.some(group => group.items.some(item => String(item.id) === id))).toBe(false);
    }
  });
});
