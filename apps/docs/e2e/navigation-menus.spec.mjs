import { test, expect } from '@playwright/test';

test('guides, engineering and tools have separate compact menus on desktop and mobile', async ({ page }, testInfo) => {
  await page.goto('./#/introduction');
  await expect(page.locator('#guide-pages a')).toHaveCount(5);
  await expect(page.locator('#practice-pages a')).toHaveCount(8);
  await expect(page.locator('#composition-pages a')).toHaveCount(6);
  await expect(page.locator('#guide-pages')).not.toContainText('工程实践');
  await expect(page.locator('#guide-pages')).not.toContainText('组合与工具');
  for (const width of [360, 768, 1280, 505]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const section of ['guide', 'practice', 'composition']) {
      await page.locator(`#${section}-trigger`).click();
      const panel = page.locator(`#${section}-pages`);
      await expect(panel).toBeVisible();
      expect(await panel.evaluate(node => node.scrollHeight <= node.clientHeight)).toBe(true);
      const box = await panel.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      await page.keyboard.press('Escape');
    }
  }
  await page.locator('#practice-trigger').click();
  await page.locator('#practice-pages').getByRole('link', { name: '浏览器完整接入', exact: true }).click();
  await expect(page.locator('#practice-trigger')).toHaveClass(/active/);
  await expect(page.locator('#guide-trigger')).not.toHaveClass(/active/);
  await page.locator('#composition-trigger').click();
  await page.locator('#composition-pages').getByRole('link', { name: '工具与按压反馈', exact: true }).click();
  await expect(page.locator('#composition-trigger')).toHaveClass(/active/);
  await page.locator('#guide-trigger').click();
  await page.screenshot({ path: testInfo.outputPath('split-guide-menu.png') });
});
