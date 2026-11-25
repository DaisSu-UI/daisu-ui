import { describe, expect, it } from '@rstest/core';
import { paginationState } from './paginationModel.js';
describe('pagination bounds', () => {
  it('gives total precedence and rounds the last partial page up', () => {
    expect(paginationState(1, 19, 100, 10).pages).toBe(2);
    expect(paginationState(1, undefined, 19, 10).pages).toBe(19);
    expect(paginationState(8, 160, undefined, 20).page).toBe(8);
  });
  it('clamps page when data shrinks and handles empty or invalid input', () => {
    expect(paginationState(9, 19).page).toBe(2);
    expect(paginationState(-1, 0)).toEqual({page:1,pages:1,pageSize:10,total:0});
    expect(paginationState(NaN, 20, undefined, 0).pages).toBe(2);
    expect(paginationState(Infinity, NaN).page).toBe(1);
  });
});
