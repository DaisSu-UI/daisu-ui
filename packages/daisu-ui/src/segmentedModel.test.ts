import { describe, expect, it } from '@rstest/core';
import { segmentedIndex, segmentedOptions } from './segmentedModel.js';

describe('segmented value matching', () => {
  it('preserves payload, zero and the distinction between numeric and string values', () => {
    const custom = { value: 'user', disabled: true, payload: { id: 2 } };
    const options = segmentedOptions([0, '0', custom]);
    expect(segmentedIndex(options, 0)).toBe(0);
    expect(segmentedIndex(options, '0')).toBe(1);
    expect(options[2]).toBe(custom);
    expect(segmentedIndex(options, 'user')).toBe(2);
  });
  it('handles absent selections, empty options, reordering and removal', () => {
    expect(segmentedIndex([], undefined)).toBe(-1);
    expect(segmentedIndex(segmentedOptions(['a', 'b']), 'missing')).toBe(0);
    expect(segmentedIndex(segmentedOptions(['b', 'a']), 'a')).toBe(1);
    expect(segmentedIndex(segmentedOptions(['b']), 'a')).toBe(0);
  });
});
