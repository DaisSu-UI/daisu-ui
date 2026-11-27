import { test, expect } from '@playwright/test';

test('optional and required Form labels align and combined validation shows one toast', async ({ page }, testInfo) => {
  await page.goto('demo/#/ui-demo/form-errors');
  const form = page.locator('.ui-form');
  await expect(form.locator('.ui-cell-title')).toHaveCount(4);
  const positions = await form.locator('.ui-cell-title').evaluateAll(labels => labels.map(label => {
    const rect = label.getBoundingClientRect();
    const star = label.parentElement.querySelector('.ui-cell-required-before')?.getBoundingClientRect();
    const cell = label.closest('.ui-cell'), box = cell.getBoundingClientRect();
    const contentLeft = box.x + parseFloat(getComputedStyle(cell).paddingLeft);
    return { x: rect.x, contentLeft, markerInGutter: !star || star.x >= box.x && star.right <= rect.x, markerTopDifference: star ? Math.abs(star.y - rect.y) : null };
  }));
  expect(Math.max(...positions.map(item => item.x)) - Math.min(...positions.map(item => item.x))).toBeLessThan(1);
  expect(positions.filter(item => item.markerTopDifference !== null).every(item => item.markerTopDifference < 1)).toBe(true);
  expect(positions.every(item => Math.abs(item.x - item.contentLeft) < 1 && item.markerInGutter)).toBe(true);
  await page.getByText('message+toast', { exact: true }).click();
  const submit = page.locator('.demo-form-footer .ui-button');
  await submit.click();
  await expect(form.locator('.ui-form-item-error')).toHaveCount(2);
  await expect(page.locator('.ui-toast:visible')).toHaveCount(1);
  await expect(page.locator('.ui-toast-msg:visible')).toHaveText('请输入歪比巴卜');
  await submit.click();
  await expect(page.locator('.ui-toast:visible')).toHaveCount(1);
  // x-input uses display:contents; its editable input lives in an open shadow root.
  const inputs = form.locator('.ui-textfield-native input');
  await inputs.nth(0).fill('first');
  await inputs.nth(1).fill('second');
  await submit.click();
  await expect(page.locator('.ui-toast-msg:visible')).toHaveText('校验通过');
  await expect(page.locator('.ui-toast:visible')).toHaveCount(1);
  await expect(form.locator('.ui-form-item-error')).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('form-alignment-message-toast.png') });
});

test('vertical Form labels and fields share the same content edge', async ({ page }, testInfo) => {
  await page.goto('demo/#/ui-demo/form-complex');
  const form = page.locator('.demo-form-complex .ui-form');
  const layout = form.locator('.ui-form-item').filter({ has: page.locator('.ui-cell-title', { hasText: /^表单项布局$/ }) });
  await layout.locator('.ui-switch').click();
  await expect(page.getByText('上下布局', { exact: true })).toBeVisible();
  await expect.poll(() => form.locator('.ui-form-item').evaluateAll(items => items.flatMap(item => {
    const title = item.querySelector('.ui-cell-title');
    if (!title) return [];
    const content = item.querySelector('.ui-form-item-content');
    const titleLeft = title.getBoundingClientRect().x, contentLeft = content.getBoundingClientRect().x;
    return item.querySelector('.ui-cell-vertical') && Math.abs(titleLeft - contentLeft) < 1
      ? [] : [{ title: title.textContent, titleLeft, contentLeft }];
  }))).toEqual([]);
  const coupon = form.locator('.ui-form-item').filter({ has: page.locator('.ui-cell-title', { hasText: /^优惠券名称$/ }) });
  const title = await coupon.locator('.ui-cell-title').boundingBox();
  const input = await coupon.locator('.ui-textfield-native input').boundingBox();
  expect(Math.abs(title.x - input.x)).toBeLessThan(1);
  await page.screenshot({ path: testInfo.outputPath('form-vertical-label-alignment.png') });
});
