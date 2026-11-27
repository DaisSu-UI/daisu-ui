import { test, expect } from '@playwright/test';

test('calendar view enters from the catalog without mounting offscreen calendars', async ({ page }, testInfo) => {
  await page.goto('demo/#/ui-demo/index');
  await page.locator('.ui-collapse-header').filter({ hasText: '录入' }).click();
  const started = await page.evaluate(() => performance.now());
  await page.getByText('CalendarView 日历面板', { exact: true }).click();
  await expect(page.locator('.ui-calendar-view').first()).toBeVisible();
  const initial = await page.locator('.demo-calendar-view-page').evaluate(node => ({
    calendars: node.querySelectorAll('.ui-calendar-view').length,
    dates: node.querySelectorAll('.ui-calendar-day').length,
    elements: node.querySelectorAll('*').length,
  }));
  const browserNavigationMs = await page.evaluate(start => performance.now() - start, started);
  await testInfo.attach('calendar-entry-work.json', { body: JSON.stringify({ initial, browserNavigationMs, note: 'Browser smoke measurement; not a native frame-time trace.' }, null, 2), contentType: 'application/json' });
  expect(initial.calendars).toBeLessThanOrEqual(3);
  expect(initial.calendars).toBeGreaterThan(0);
  await page.locator('.demo-calendar-view-page .demo-group').last().scrollIntoViewIfNeeded();
  const last = page.locator('.demo-calendar-view-page .demo-example').last();
  await expect(last.locator('.ui-calendar-view')).toBeVisible();
  await expect(last.locator('.ui-calendar-day').first()).toBeAttached();
  await page.screenshot({ path: testInfo.outputPath('calendar-deferred-last-panel.png') });
});

for (const mode of ['none', 'month', 'year-month']) {
  test(`calendar today resets the draft and reveals today repeatedly in ${mode} mode`, async ({ page }, testInfo) => {
    await page.goto('demo/#/ui-demo/calendar');
    if (mode !== 'none') await page.getByText(mode, { exact: true }).click();
    const dates = await page.evaluate(() => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
      const label = date => `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
      const value = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return { today: label(today), yesterday: label(yesterday), todayValue: value(today), yesterdayValue: value(yesterday) };
    });
    const row = page.locator('.ui-cell').filter({ hasText: '拓展确定区域' });
    const popup = page.locator('.ui-calendar:visible');
    const checkToday = async () => {
      const selected = popup.locator('.ui-calendar-day-selected');
      await expect(selected).toHaveAttribute('accessibility-label', dates.today);
      await expect.poll(async () => {
        const day = await selected.boundingBox(), viewport = await popup.locator('.ui-calendar-scroll').boundingBox();
        return !!day && !!viewport && day.y + day.height > viewport.y && day.y < viewport.y + viewport.height;
      }).toBe(true);
    };
    await row.click();
    await popup.locator(`[accessibility-label="${dates.yesterday}"]`).click();
    await popup.locator('.ui-calendar-confirm-button .ui-button').click();
    await expect(popup).toBeHidden();
    await expect(row).toContainText(dates.yesterdayValue);
    await row.click();
    for (let repeat = 0; repeat < 2; repeat++) {
      await popup.locator(`[accessibility-label="${dates.yesterday}"]`).click();
      await popup.getByText('选择今天', { exact: true }).click();
      await checkToday();
    }
    if (mode === 'none') await popup.locator('.ui-calendar-scroll').evaluate(node => node.scrollTo({ top: 0, behavior: 'instant' }));
    else await popup.locator('[accessibility-label="下一月"]').click();
    await popup.getByText('选择今天', { exact: true }).click();
    await checkToday();
    await page.screenshot({ path: testInfo.outputPath(`calendar-today-${mode}.png`) });
    await popup.locator('.ui-action-sheet-close').click();
    await expect(popup).toBeHidden();
    await expect(row).toContainText(dates.yesterdayValue);
    await row.click();
    await popup.getByText('选择今天', { exact: true }).click();
    await popup.locator('.ui-calendar-confirm-button .ui-button').click();
    await expect(popup).toBeHidden();
    await expect(row).toContainText(dates.todayValue);
  });
}
