import { describe, expect, it } from '@rstest/core';
import { anchorKey, indexBarIndexAtPoint, indexBarLayout, indexBarSectionAtOffset, indexBarStickyOffset } from './indexBarModel.js';
import { indexBarCities } from '../../../apps/demo/src/features/ui-demo/examples/indexBarData.js';

describe('IndexBar scroll and pointer mapping', () => {
  it('locates the reference city groups by native list position and actual row size', () => {
    const layout = indexBarLayout(indexBarCities);
    expect(layout.map(item => item.offset)).toEqual([0, 432, 1084, 1956, 2564, 2732, 3076, 3552]);
    expect(layout.map(item => item.position)).toEqual([0, 10, 25, 45, 59, 63, 71, 82]);
    expect(indexBarSectionAtOffset(layout, 431)).toBe(0);
    expect(indexBarSectionAtOffset(layout, 432)).toBe(1);
    expect(indexBarSectionAtOffset(layout, 3552)).toBe(7);
    expect(indexBarSectionAtOffset(layout, -200)).toBe(0);
  });
  it('clamps dragged indexes and adapts to changed viewport geometry', () => {
    expect(indexBarIndexAtPoint(435, 372, 144, 8)).toBe(3);
    expect(indexBarIndexAtPoint(372, 372, 144, 8)).toBe(0);
    expect(indexBarIndexAtPoint(-10, 372, 144, 8)).toBe(0);
    expect(indexBarIndexAtPoint(900, 372, 144, 8)).toBe(7);
    expect(indexBarIndexAtPoint(335, 272, 144, 8)).toBe(3);
    expect(indexBarIndexAtPoint(335, 272, 0, 8)).toBe(-1);
    expect(indexBarIndexAtPoint(NaN, 272, 144, 8)).toBe(-1);
  });
  it('pushes the pinned header away exactly as the next group reaches it', () => {
    const layout = indexBarLayout(indexBarCities);
    expect(indexBarStickyOffset(layout, 0, 380, 36)).toBe(0);
    expect(indexBarStickyOffset(layout, 0, 412, 36)).toBe(-16);
    expect(indexBarStickyOffset(layout, 0, 431, 36)).toBe(-35);
    expect(indexBarStickyOffset(layout, 1, 432, 36)).toBe(0);
    expect(indexBarStickyOffset(layout, 7, 4000, 36)).toBe(0);
  });
  it('rebuilds filtered data, preserves typed indexes and handles empty groups', () => {
    expect(anchorKey(0)).not.toBe(anchorKey('0'));
    const sections = [{ index: 0, data: [] }, { index: '0', data: ['x', 'y'] }];
    expect(indexBarLayout(sections, 60, 40)).toEqual([{ position: 0, offset: 0, height: 40 }, { position: 1, offset: 40, height: 160 }]);
    expect(indexBarLayout(sections.slice(1), 60, 40)).toEqual([{ position: 0, offset: 0, height: 160 }]);
    expect(indexBarLayout([], NaN, -1)).toEqual([]);
    expect(indexBarSectionAtOffset([], 50)).toBe(-1);
    expect(indexBarIndexAtPoint(100, 0, 100, 0)).toBe(-1);
    expect(indexBarLayout([{ index: 'A', data: ['x'] }], NaN, -1)[0]?.height).toBe(80);
  });
});
