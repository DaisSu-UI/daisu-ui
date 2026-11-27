import { test, expect } from '@playwright/test';

test('Sticky dynamic insertion keeps intrinsic button width and restores after scrolling', async ({ page }, testInfo) => {
  await page.goto('demo/#/ui-demo/sticky');
  const scroll = page.locator('.ui-demo-component-scroll');
  const content = page.locator('.demo-sticky-dynamic .ui-sticky-content');
  await page.locator('.demo-sticky-dynamic .ui-button').first().click();
  const inserted = content.locator('.ui-button');
  await expect(inserted).toBeVisible();
  // Intrinsic width depends on the available CJK font. Check that the whole
  // label and padding fit instead of assuming one runner's glyph metrics.
  await expect.poll(() => inserted.evaluate(node => {
    const label = node.querySelector('.ui-button-label');
    const rect = node.getBoundingClientRect(), text = label?.getBoundingClientRect();
    const style = getComputedStyle(node);
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    return !!text && text.width > 0 && rect.width >= text.width + padding - 1;
  })).toBe(true);
  const label = inserted.locator('.ui-button-label');
  await expect.poll(async () => (await label.boundingBox())?.height ?? 1000).toBeLessThan(50);
  const first = page.locator('.ui-sticky').first();
  const firstContainer = first.locator('.ui-sticky-container');
  await page.screenshot({ path: testInfo.outputPath('sticky-dynamic-inserted.png') });
  await scroll.evaluate(node => node.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(firstContainer).toHaveCSS('position', 'relative');
  const original = await first.boundingBox();
  await scroll.evaluate(node => node.scrollTo({ top: 180, behavior: 'instant' }));
  await expect.poll(async () => (await firstContainer.boundingBox())?.y ?? 1000).toBeCloseTo(44, 0);
  await scroll.evaluate(node => node.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(async () => (await firstContainer.boundingBox())?.y ?? 1000).toBeCloseTo(original.y, 0);
  await expect(firstContainer).toHaveCSS('position', 'relative');
  await page.screenshot({ path: testInfo.outputPath('sticky-restored.png') });
});

test('Fab keeps every upward action above the trigger and clears offsets when changing direction', async ({ page }, testInfo) => {
  await page.goto('demo/#/ui-demo/fab');
  await page.locator('[accessibility-label="下中"]').click();
  const trigger = page.locator('.ui-fab-trigger');
  await expect(trigger).toBeVisible();
  await trigger.click();
  const menu = page.locator('.ui-fab-actions');
  await expect(menu).toBeVisible();
  await expect.poll(async () => {
    const button = await trigger.boundingBox();
    const actions = await page.locator('.demo-fab-action').evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return { bottom: r.bottom, height: r.height }; }));
    return !!button && actions.length === 4 && actions.every(action => action.height >= 30 && action.bottom <= button.y - 10);
  }).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('fab-top.png') });
  await page.locator('[accessibility-label="向左"]').click();
  await expect(menu).toBeHidden();
  await trigger.click();
  await expect(menu).toBeVisible();
  await expect.poll(async () => {
    const button = await trigger.boundingBox(), action = await page.locator('.demo-fab-action').first().boundingBox();
    return !!button && !!action && action.x + action.width <= button.x - 10;
  }).toBe(true);
});

test('Sticky respects the box bottom and offset then returns to natural flow', async ({ page }) => {
  await page.goto('demo/#/ui-demo/sticky');
  const scroll = page.locator('.ui-demo-component-scroll');
  const sticky = page.locator('.ui-sticky').nth(1);
  const box = page.locator('.ui-sticky-box').first();
  const container = sticky.locator('.ui-sticky-container');
  await expect(container).toBeVisible();
  const anchor = await sticky.boundingBox();
  await scroll.evaluate((node, top) => node.scrollTo({ top, behavior: 'instant' }), anchor.y - 24);
  await expect(container).toHaveCSS('position', 'fixed');
  await expect.poll(async () => (await container.boundingBox()).y).toBeCloseTo(44, 0);
  await scroll.evaluate((node, top) => node.scrollTo({ top, behavior: 'instant' }), anchor.y + 80);
  await expect(container).toHaveCSS('position', 'absolute');
  await expect.poll(async () => {
    const child = await container.boundingBox(), boundary = await box.boundingBox();
    return Math.abs(child.y + child.height - boundary.y - boundary.height);
  }).toBeLessThan(2);
  await scroll.evaluate(node => node.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(container).toHaveCSS('position', 'relative');
  const offsetSticky = page.locator('.ui-sticky').nth(2);
  const offsetAnchor = await offsetSticky.boundingBox();
  await scroll.evaluate((node, top) => node.scrollTo({ top, behavior: 'instant' }), offsetAnchor.y - 74);
  await expect(offsetSticky.locator('.ui-sticky-container')).toHaveCSS('position', 'fixed');
  await expect.poll(async () => (await offsetSticky.locator('.ui-sticky-container').boundingBox()).y).toBeCloseTo(94, 0);
});

// Read the real built Demo geometry, including descendants with their own layer.
for (const [route, markerSelector] of [
  ['steps', '.ui-step-indicator'],
  ['swiper', '.ui-swiper-indicator'],
  ['avatar', '.ui-avatar-group-item'],
  ['slider', '.ui-slider-thumb'],
  ['tabs', '.ui-tabs-standard-header'],
  ['table', '.ui-table-header'],
  ['search', '.ui-search-outline'],
  ['calendar-view', '.ui-calendar-day-selected'],
]) {
  test(`${route} layered content follows the outer page scroll`, async ({ page }, testInfo) => {
    await page.goto(`demo/#/ui-demo/${route}`);
    const scroll = page.locator('.ui-demo-component-scroll');
    const marker = page.locator(markerSelector).first();
    await expect(marker).toBeAttached();
    await expect(scroll).toHaveCSS('z-index', '0');
    const sample = () => marker.evaluate(node => {
      const rect = node.getBoundingClientRect();
      const scroll = node.closest('.ui-demo-component-scroll');
      return { y: rect.y, width: rect.width, scrollTop: scroll.scrollTop };
    });
    await expect.poll(async () => (await sample()).width).toBeGreaterThan(0);
    const before = await sample();
    await scroll.evaluate(node => node.scrollTo({ top: 120, behavior: 'instant' }));
    await expect.poll(async () => (await sample()).scrollTop - before.scrollTop).toBeGreaterThan(50);
    await expect.poll(async () => {
      const after = await sample();
      return Math.abs(after.y - before.y + after.scrollTop - before.scrollTop);
    }).toBeLessThan(2);
    await page.screenshot({ path: testInfo.outputPath(`${route}-scrolled.png`) });
  });
}
