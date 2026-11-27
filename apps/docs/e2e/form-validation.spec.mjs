import { test, expect } from '@playwright/test';

test('optional and required Form labels align and combined validation shows one toast', async ({ page }, testInfo) => {
  await page.goto('demo/#/ui-demo/form-errors');
  const form = page.locator('.ui-form');
  await expect(form.locator('.ui-cell-title')).toHaveCount(4);
  const positions = await form.locator('.ui-cell-title').evaluateAll(labels => labels.map(label => {
    const rect = label.getBoundingClientRect();
    const star = label.parentElement.querySelector('.ui-cell-required-before')?.getBoundingClientRect();
    return { x: rect.x, markerTopDifference: star ? Math.abs(star.y - rect.y) : null };
  }));
  expect(Math.max(...positions.map(item => item.x)) - Math.min(...positions.map(item => item.x))).toBeLessThan(1);
  expect(positions.filter(item => item.markerTopDifference !== null).every(item => item.markerTopDifference < 1)).toBe(true);
  await page.getByText('message+toast', { exact: true }).click();
  const submit = page.locator('.demo-form-footer .ui-button');
  await submit.click();
  await expect(form.locator('.ui-form-item-error')).toHaveCount(2);
  await expect(page.locator('.ui-toast:visible')).toHaveCount(1);
  await expect(page.locator('.ui-toast-msg:visible')).toHaveText('请输入歪比巴卜');
  await submit.click();
  await expect(page.locator('.ui-toast:visible')).toHaveCount(1);
  const inputs = form.locator('.ui-textfield-native');
  await inputs.nth(0).fill('first');
  await inputs.nth(1).fill('second');
  await submit.click();
  await expect(page.locator('.ui-toast-msg:visible')).toHaveText('校验通过');
  await expect(page.locator('.ui-toast:visible')).toHaveCount(1);
  await expect(form.locator('.ui-form-item-error')).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('form-alignment-message-toast.png') });
});
