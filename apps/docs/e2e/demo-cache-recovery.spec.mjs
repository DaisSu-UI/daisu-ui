import { test, expect } from '@playwright/test';

for (const legacy of [true, false]) {
  test(`Demo recovers ${legacy ? 'the published legacy entry' : 'a missing cached script'} and preserves its route`, async ({ page, request, baseURL }) => {
    const demo = new URL('demo/', baseURL);
    const response = await request.get(demo.href);
    expect(response.ok()).toBe(true);
    const current = await response.text();
    const entry = current.match(/\bsrc=["'](static\/js\/index(?:\.[a-f0-9]+)?\.js)["']/)?.[1];
    expect(entry).toBeTruthy();
    const replacement = legacy ? 'static/js/index.553eaa9829.js' : 'static/js/index.missing-cache.js';
    let stale = current.replace(`src="${entry}"`, `src="${replacement}"`);
    expect(stale).not.toBe(current);
    if (legacy) stale = stale.replace(/<script data-demo-recovery>[\s\S]*?<\/script>/, '');
    await page.route(url => url.pathname === demo.pathname && !url.searchParams.has('demoBuild'), route => route.fulfill({
      contentType: 'text/html', body: stale, headers: { 'Cache-Control': 'max-age=600' },
    }));
    demo.searchParams.set('locale', 'en-US');
    demo.searchParams.set('example', 'preserved');
    demo.hash = '/ui-demo/button';
    await page.goto(demo.href, { waitUntil: 'commit' });
    await expect(page).toHaveTitle('Button · Daisu UI');
    await expect(page.locator('.ui-demo-navbar-title:visible')).toHaveText('Button');
    const target = new URL(page.url());
    expect(target.pathname).toBe(demo.pathname);
    expect(target.hash).toBe('#/ui-demo/button');
    expect(target.searchParams.get('locale')).toBe('en-US');
    expect(target.searchParams.get('example')).toBe('preserved');
    expect(target.searchParams.get('demoBuild')).toBe(entry);
  });
}
