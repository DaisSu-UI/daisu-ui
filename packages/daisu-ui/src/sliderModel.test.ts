import { expect, test } from '@rstest/core';
import { moveSliderValue, normalizeSliderValue, sliderBounds, snapSliderValue } from './sliderModel.js';

test('slider clamps and snaps relative to the configured minimum without decimal drift', () => {
  expect(snapSliderValue(0.26, -0.1, 1, 0.1)).toBe(0.3);
  expect(snapSliderValue(200, -10, 10, 3)).toBe(10);
  expect(snapSliderValue(-100, -10, 10, 3)).toBe(-10);
  expect(normalizeSliderValue([80, 10], 0, 100, 25)).toEqual([0, 75]);
  expect(sliderBounds(Number.NaN, -1, 0)).toEqual({ min: 0, max: 100, step: 1 });
});

test('range handles stop at each other and can separate after meeting', () => {
  expect(moveSliderValue([20, 60], 90, 0, 0, 100, 1)).toEqual([60, 60]);
  expect(moveSliderValue([20, 60], 0, 1, 0, 100, 1)).toEqual([20, 20]);
  expect(moveSliderValue([60, 60], 40, 0, 0, 100, 1)).toEqual([40, 60]);
  expect(moveSliderValue([60, 60], 80, 1, 0, 100, 1)).toEqual([60, 80]);
});
