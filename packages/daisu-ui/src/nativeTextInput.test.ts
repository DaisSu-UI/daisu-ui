import { expect, test } from '@rstest/core';
import { nativeTextMaxLength } from './nativeTextInput.js';

test('native maxlength converts unlimited values into an Android-compatible positive bound', () => {
  for (const value of [undefined, -1, -100, NaN, Infinity]) expect(nativeTextMaxLength(value)).toBe(2147483647);
  expect(nativeTextMaxLength(0)).toBe(0);
  expect(nativeTextMaxLength(20.9)).toBe(20);
  expect(nativeTextMaxLength(Number.MAX_SAFE_INTEGER)).toBe(2147483647);
});
