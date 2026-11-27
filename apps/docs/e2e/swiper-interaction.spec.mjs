import { test, expect } from '@playwright/test';

for (const title of ['卡片样式', '同时展示2个滑块']) {
  test(`Swiper ${title} keeps image layout and visible content through manual loop gestures`, async ({ page }, testInfo) => {
    await page.goto('demo/#/ui-demo/swiper');
    const example = page.locator('.demo-example').filter({ has: page.locator('.demo-example-title', { hasText: title }) });
    const swiper = example.locator('.ui-swiper');
    await swiper.scrollIntoViewIfNeeded();
    await expect(swiper.locator('.lynx-ui-swiper__track')).toBeVisible();
    await expect.poll(() => swiper.locator('.ui-img-success').count()).toBeGreaterThanOrEqual(5);
    const count = await swiper.locator('.ui-swiper-item').count();
    for (let repeat = 0; repeat < 3; repeat++) {
      const box = await swiper.boundingBox();
      const samples = swiper.evaluate(node => new Promise(resolve => {
        const frames = [], started = performance.now();
        const sample = () => {
          const viewport = node.getBoundingClientRect();
          const items = [...node.querySelectorAll('.ui-swiper-item')];
          const widths = items.map(item => item.getBoundingClientRect()).map(rect => Math.max(0, Math.min(rect.right, viewport.right) - Math.max(rect.left, viewport.left)));
          const crops = [...node.querySelectorAll('.ui-swiper-card-viewport')].map(item => item.clientHeight);
          const images = [...node.querySelectorAll('.ui-swiper-card-image')].map(item => item.clientHeight);
          frames.push({ visibleWidth: widths.reduce((sum, width) => sum + width, 0), minLayoutHeight: Math.min(...items.map(item => item.clientHeight)), minImageHeight: Math.min(...images), minCropHeight: Math.min(...crops), maxCropHeight: Math.max(...crops) });
          if (performance.now() - started < 800) requestAnimationFrame(sample); else resolve(frames);
        };
        requestAnimationFrame(sample);
      }));
      const from = repeat === 1 ? .25 : .75, to = repeat === 1 ? .75 : .25;
      await page.mouse.move(box.x + box.width * from, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * to, box.y + box.height / 2, { steps: 18 });
      await page.mouse.up();
      const frames = await samples;
      expect(frames.length).toBeGreaterThan(5);
      expect(frames.every(frame => frame.visibleWidth > box.width / 2 && frame.minLayoutHeight === 192 && frame.minImageHeight === 192 && frame.minCropHeight >= 168 && frame.maxCropHeight <= 192)).toBe(true);
      await expect(swiper.locator('.ui-swiper-item')).toHaveCount(count);
      await testInfo.attach(`gesture-${repeat}.json`, { body: JSON.stringify(frames), contentType: 'application/json' });
    }
    await page.screenshot({ path: testInfo.outputPath(title === '卡片样式' ? 'swiper-card-after-gestures.png' : 'swiper-double-after-gestures.png') });
  });
}
