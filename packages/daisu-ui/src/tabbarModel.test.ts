import { describe, expect, it } from '@rstest/core';
import { createTabbarGuard, tabbarBadge } from './tabbarModel.js';

describe('tabbar asynchronous selection', () => {
  it('keeps the latest tap when confirmations resolve out of order', async () => {
    const guard = createTabbarGuard();
    let finish!: (allowed: boolean) => void;
    let selected = 0;
    const old = guard.request(1, () => new Promise(resolve => { finish = resolve; }), () => { selected = 1; });
    await guard.request(2, undefined, () => { selected = 2; });
    finish(true); await old;
    expect(selected).toBe(2);
  });
  it('does not commit vetoes, failed confirmations or disposed requests', async () => {
    const guard = createTabbarGuard();
    let commits = 0;
    await guard.request('home', () => false, () => { commits++; });
    await guard.request('home', () => Promise.reject(new Error('failed')), () => { commits++; });
    let finish!: (allowed: boolean) => void;
    const request = guard.request('home', () => new Promise(resolve => { finish = resolve; }), () => { commits++; });
    guard.cancel(); finish(true); await request;
    expect(commits).toBe(0);
  });
  it('caps numeric badges while preserving text and zero', () => {
    expect(tabbarBadge(200)).toBe('99+');
    expect(tabbarBadge(8, 5)).toBe('5+');
    expect(tabbarBadge(0)).toBe('0');
    expect(tabbarBadge('NEW')).toBe('NEW');
    expect(tabbarBadge(undefined)).toBe('');
  });
});
