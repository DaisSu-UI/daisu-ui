import { test, expect } from '@playwright/test';

test('ConfigProvider switches three languages including portaled default copy', async ({ page }, testInfo) => {
  const group = page.locator('.demo-group').filter({ has: page.locator('.demo-group-title', { hasText: /^(国际化|國際化|Internationalization)$/ }) });
  for (const [language, placeholder, finished, confirm, cancel] of [
    ['English', 'Please enter...', 'All loaded', 'Confirm', 'Cancel'],
    ['繁體中文', '請輸入...', '已載入完畢', '確定', '取消'],
    ['简体中文', '请输入...', '已加载完毕', '确定', '取消'],
  ]) {
    await page.goto('demo/#/ui-demo/about');
    await page.getByText(language, { exact: true }).click();
    await expect(page).toHaveTitle(`${language === 'English' ? 'About' : language === '繁體中文' ? '關於我們' : '关于我们'} · Daisu UI`);
    await page.goto('demo/#/ui-demo/config-provider');
    await expect(group.locator('.ui-textfield-native').first()).toHaveAttribute('placeholder', placeholder);
    await expect(group.getByText(finished, { exact: true })).toBeVisible();
    await group.getByText('Dialog', { exact: true }).click();
    const dialog = page.locator('.ui-dialog:visible');
    await expect(dialog.getByText(confirm, { exact: true })).toBeVisible();
    await dialog.getByText(cancel, { exact: true }).click();
    await expect(dialog).toBeHidden();
  }
  await page.goto('demo/#/ui-demo/about');
  await page.getByText('English', { exact: true }).click();
  await expect(page).toHaveTitle('About · Daisu UI');
  await page.goto('demo/#/ui-demo/config-provider');
  await group.getByText('Calendar', { exact: true }).click();
  const calendar = page.locator('.ui-calendar:visible');
  await expect(calendar.getByText('Select date', { exact: true })).toBeVisible();
  await expect(calendar.locator('.ui-calendar-weekdays')).toContainText('Sun');
  await page.screenshot({ path: testInfo.outputPath('internationalization-calendar-en.png') });
});

test('Slider value tooltip exists only during a gesture', async ({ page }, testInfo) => {
  await page.goto('demo/#/ui-demo/slider');
  await expect(page.locator('.ui-slider-tooltip')).toHaveCount(0);
  const slider = page.locator('.ui-slider').first(), rail = slider.locator('.ui-slider-rail');
  const rect = await rail.boundingBox();
  await page.mouse.move(rect.x + rect.width * .3, rect.y + rect.height / 2);
  await page.mouse.down();
  await expect(slider.locator('.ui-slider-tooltip')).toBeVisible();
  await page.mouse.move(rect.x + rect.width * .6, rect.y + rect.height / 2, { steps: 20 });
  await expect(slider.locator('.ui-slider-tooltip x-text').first()).toBeVisible();
  await expect(slider.locator('.ui-slider-tooltip')).toHaveText(/^\d+$/);
  await page.screenshot({ path: testInfo.outputPath('slider-active-value.png') });
  await page.mouse.up();
  await expect(page.locator('.ui-slider-tooltip')).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('slider-idle-no-tooltip.png') });
});


test('About is reachable from home, saves language and updates detail and browser-back titles', async ({ page }) => {
  await page.goto('demo/#/ui-demo/index');
  await page.locator('.ui-demo-tabbar').getByText('关于我们', { exact: true }).click();
  await expect(page).toHaveTitle('关于我们 · Daisu UI');
  await page.getByText('English', { exact: true }).click();
  await expect(page).toHaveTitle('About · Daisu UI');
  await expect(page.getByText('Preferences', { exact: true })).toBeVisible();
  await expect(page.getByText('https://github.com/DaisSu-UI/daisu-ui', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page).toHaveTitle('About · Daisu UI');
  await page.locator('.ui-demo-tabbar:visible [accessibility-label="Demo"]').click();
  await expect(page).toHaveTitle('Component examples · Daisu UI');
  await page.getByText('Basics', { exact: true }).click();
  await page.getByText('Button', { exact: true }).click();
  await expect(page).toHaveTitle('Button · Daisu UI');
  await expect(page.locator('.demo-group-title').first()).toHaveText('Component types');
  await page.goBack();
  await expect(page).toHaveTitle('Component examples · Daisu UI');
});
