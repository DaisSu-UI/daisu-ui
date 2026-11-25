import { expect, test } from '@rstest/core';
import { circularLoadingSvg, loadingDimension } from './loadingModel.js';

test('Loading lengths preserve legacy presets, normalize native units and reject invalid values', () => {
  expect(loadingDimension()).toBe('28px');
  expect(['small', 'medium', 'large'].map(loadingDimension)).toEqual(['14px', '20px', '28px']);
  expect(loadingDimension(0)).toBe('0px');
  expect(loadingDimension('75rpx')).toBe('10vw');
  expect(loadingDimension('1.5rem')).toBe('1.5rem');
  expect([-1, Infinity, NaN, 'auto', 'calc(1px)'].map(loadingDimension)).toEqual(Array(5).fill('28px'));
});

test('Loading SVG treats custom color as an attribute value rather than markup', () => {
  const svg = circularLoadingSvg('"/><image href="https://example.invalid/"/>');
  expect(svg.includes('<image')).toBe(false);
  expect(svg.includes('&quot;')).toBe(true);
  expect(svg.includes('&lt;image')).toBe(true);
});
