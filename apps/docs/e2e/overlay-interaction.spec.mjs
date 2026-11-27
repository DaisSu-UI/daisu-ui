import { test, expect } from '@playwright/test';

test('Notify close button dismisses a persistent notification across reopenings', async ({ page }, testInfo) => {
  await page.goto('demo/#/ui-demo/notify');
  const row = page.locator('.ui-cell').filter({ hasText: '显示关闭按钮' }).first();
  for (let repeat = 0; repeat < 2; repeat++) {
    await row.click();
    const close = page.locator('[accessibility-label="关闭通知"]:visible');
    await expect(close).toBeVisible();
    const banner = page.locator('.ui-notify-anchor:visible').filter({ has: close });
    await expect.poll(async () => (await banner.boundingBox())?.height ?? 0).toBeGreaterThan(25);
    await close.click();
    await expect(close).toBeHidden();
  }
  await page.screenshot({ path: testInfo.outputPath('notify-closed.png') });
});

test('Notify component example never suppresses later hook notifications', async ({ page }, testInfo) => {
  await page.goto('demo/#/ui-demo/notify');
  const custom = page.locator('.ui-cell').filter({ hasText: '使用 Notify 组件' });
  for (let repeat = 0; repeat < 2; repeat++) {
    await custom.click();
    await expect(page.locator('.demo-notify-custom-content:visible')).toBeVisible();
    await page.waitForTimeout(2400);
    const basic = page.locator('.ui-cell').filter({ hasText: '基础用法' }).first();
    await basic.click();
    const banner = page.locator('.ui-notify:visible').filter({ hasText: '测试' });
    await expect(banner).toBeVisible();
    await expect(banner).toBeInViewport();
    await expect.poll(() => banner.evaluate(node => {
      const rect = node.getBoundingClientRect();
      const root = node.getRootNode();
      let hit = root.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      // Native Web elements may introduce another open shadow root. Walk the
      // composed ancestry so a text element's inner box still hits its banner.
      while (hit) {
        if (node.contains(hit)) return true;
        hit = hit.getRootNode().host;
      }
      return false;
    })).toBe(true);
  }
  await page.screenshot({ path: testInfo.outputPath('notify-after-component.png') });
});

for (const kind of ['popover', 'tooltip']) {
  test(`${kind} background covers its measured text including a content resize`, async ({ page }, testInfo) => {
    await page.goto(`demo/#/ui-demo/${kind}`);
    const target = page.locator(`.ui-${kind}-target`).first();
    await target.click();
    const panel = page.locator(`.ui-${kind}-panel:visible`).first();
    const text = panel.locator('.ui-bubble-text');
    await expect(panel).toBeVisible();
    await expect(panel).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect.poll(async () => {
      const background = await panel.boundingBox(), body = await text.boundingBox();
      return !!background && !!body && background.height >= body.height - 1 && background.width >= body.width - 1 && background.height > 25;
    }).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`${kind}-background.png`) });
    await target.click();
    const dynamic = page.locator(`.demo-${kind}-page .demo-example`).filter({ hasText: '动态内容与位置更新' });
    await dynamic.locator(`.ui-${kind}-target`).click();
    const dynamicPanel = page.locator(`.ui-${kind}-panel:visible`).last();
    await expect(dynamicPanel).toBeVisible();
    const content = dynamicPanel.locator(kind === 'popover' ? '.demo-popover-custom' : '.demo-tooltip-lines');
    await expect(content).toHaveCSS('width', kind === 'popover' ? '150px' : '90px');
    await dynamicPanel.getByText(kind === 'popover' ? '改变大小并更新' : '改变大小', { exact: true }).click();
    await expect.poll(async () => (await dynamicPanel.boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(kind === 'popover' ? 250 : 150);
  });
}

test('Sticky restores every example after repeated scroll round trips', async ({ page }, testInfo) => {
  await page.goto('demo/#/ui-demo/sticky');
  const scroll = page.locator('.ui-demo-component-scroll');
  await page.locator('.demo-sticky-dynamic .ui-button').first().click();
  for (let repeat = 0; repeat < 3; repeat++) {
    await scroll.evaluate(node => node.scrollTo({ top: node.scrollHeight, behavior: 'instant' }));
    await expect.poll(() => scroll.evaluate(node => node.scrollTop)).toBeGreaterThan(100);
    await scroll.evaluate(node => node.scrollTo({ top: 0, behavior: 'instant' }));
    await expect.poll(async () => page.locator('.ui-sticky-container').evaluateAll(nodes => nodes.every(node => getComputedStyle(node).position === 'relative'))).toBe(true);
  }
  await page.screenshot({ path: testInfo.outputPath('sticky-round-trip.png') });
});

test('a smaller second Popup dims and blocks the first Popup without a manual layer number', async ({ page }, testInfo) => {
  await page.goto('demo/#/ui-demo/popup');
  await page.getByText('嵌套弹窗测试', { exact: true }).click();
  const parent = page.locator('.demo-popup-parent');
  await expect(parent).toBeVisible();
  await parent.getByText('打开传送子弹窗', { exact: true }).click();
  const child = page.locator('.ui-popup:visible').filter({ hasText: '子弹窗' }).last();
  await expect(child).toBeVisible();
  await expect.poll(() => page.locator('.ui-overlay:visible').evaluateAll(nodes => {
    const masks = nodes.map(node => Number(getComputedStyle(node).zIndex));
    const root = nodes[0]?.getRootNode();
    const anchors = [...(root?.querySelectorAll('.ui-popup-anchor') ?? [])].filter(node => node.querySelector('.ui-popup') && getComputedStyle(node.querySelector('.ui-popup')).display !== 'none');
    const layers = anchors.map(node => Number(getComputedStyle(node).zIndex));
    return masks.length === 2 && Math.max(...masks) > Math.min(...layers) && Math.max(...masks) < Math.max(...layers);
  })).toBe(true);
  const coversParent = await parent.evaluate(node => {
    const rect = node.getBoundingClientRect(), hit = node.getRootNode().elementFromPoint(rect.x + 8, rect.y + 8);
    return !!hit?.closest('.ui-overlay');
  });
  expect(coversParent).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('nested-popup-mask.png') });
  await child.locator('.ui-popup-close').click();
  await expect(child).toBeHidden();
  await expect(parent).toBeVisible();
});
