import { expect, test } from '@rstest/core';
import { bubblePosition } from './bubblePosition.js';
import type { BubblePlacement } from './bubblePosition.js';

test('Bubble positions all twelve directions with trigger-centered arrows and start/end alignment', () => {
  const target = { left: 150, top: 300, width: 80, height: 40 }; const box = { left: 0, top: 0, width: 120, height: 60 }; const viewport = { left: 0, top: 0, width: 390, height: 844 };
  const placements = { bottom: [130,354], 'bottom-start': [150,354], 'bottom-end': [110,354], top: [130,226], 'top-start': [150,226], 'top-end': [110,226], left: [16,290], 'left-start': [16,300], 'left-end': [16,280], right: [244,290], 'right-start': [244,300], 'right-end': [244,280] };
  for (const [placement, point] of Object.entries(placements)) { const pos = bubblePosition(target, box, viewport, placement as BubblePlacement); expect([pos.x, pos.y]).toEqual(point); }
  expect(bubblePosition(target, box, viewport, 'bottom-start').arrow).toBe(40);
  expect(bubblePosition(target, box, viewport, 'top', [5, -10])).toMatchObject({ x: 135, y: 216 });
  expect(bubblePosition(target, box, viewport, 'bottom', 6, false).y).toBe(352);
});

test('Bubble flips at viewport edges, clamps cross-axis and keeps arrow in rounded corners', () => {
  const target = { left: 360, top: 800, width: 30, height: 40 }; const box = { left: 0, top: 0, width: 120, height: 60 }; const viewport = { left: 0, top: 44, width: 390, height: 800 };
  expect(bubblePosition(target, box, viewport, 'bottom')).toMatchObject({ side: 'top', x: 270, y: 726, arrow: 105 });
  expect(bubblePosition(target, box, viewport, 'right')).toMatchObject({ side: 'left', x: 226, y: 784, arrow: 36 });
});
