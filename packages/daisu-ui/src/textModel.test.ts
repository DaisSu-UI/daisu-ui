import { expect, test } from '@rstest/core';
import { formatUiText } from './textModel.js';

test('text formatting masks names and valid phones without losing short values', () => {
  expect(formatUiText('18888888888', 'phone', true)).toBe('188****8888');
  expect(formatUiText('188', 'phone', true)).toBe('188');
  expect(formatUiText('张长三', 'name', true)).toBe('张**三');
  expect(formatUiText('李', 'name', true)).toBe('李');
  expect(formatUiText('👩李', 'name', true)).toBe('👩**李');
});

test('price and date formatting handle signs, zero, rounding and invalid inputs', () => {
  expect(formatUiText('16354.156', 'price')).toBe('16,354.16');
  expect(formatUiText(-1234.5, 'price')).toBe('-1,234.50');
  expect(formatUiText(0, 'price')).toBe('0.00');
  expect(formatUiText('abc', 'price')).toBe('abc');
  expect(formatUiText(new Date(2024, 6, 3).getTime(), 'date')).toBe('2024-07-03');
  expect(formatUiText('invalid', 'date')).toBe('invalid');
});
