import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Rate } from './Rate.js';
import { nextRateValue, rateCount, rateScore, rateSvg } from './rateModel.js';

test('Rate normalizes values and only clears the minimum selected score', () => {
  expect(rateCount(NaN)).toBe(5); expect(rateCount(-2)).toBe(0); expect(rateScore(Infinity, 5)).toBe(0); expect(rateScore(9, 5)).toBe(5);
  expect(nextRateValue(1, 1, false, true)).toBe(0); expect(nextRateValue(.5, .5, true, true)).toBe(0); expect(nextRateValue(3, 3, false, true)).toBe(3);
  const svg = rateSvg('M0 0', 'linear-gradient(180deg, rgba(255,238,0,1) 0%, rgba(250,176,21,1) 100%)');
  expect(svg).toContain('linearGradient'); expect(svg).toContain('stop-color="rgba(255,238,0,1)"'); expect(svg).toContain('offset="100%"');
  expect(rateSvg('M0 0', '\"><script>')).not.toContain('<script>');
});

test('Rate half-hit targets select and clear fractional values, while readonly and disabled remain inert', () => {
  const values: number[] = [];
  try {
    const screen = render(<Rate defaultValue={2.5} allowHalf clearable onChange={({ value }) => values.push(value)} />);
    fireEvent.tap(screen.container.querySelectorAll('.ui-rate-hit-half')[0]!); expect(values).toEqual([.5]);
    fireEvent.tap(screen.container.querySelectorAll('.ui-rate-hit-half')[0]!); expect(values).toEqual([.5, 0]);
    screen.rerender(<Rate value={3} readonly onChange={({ value }) => values.push(value)} />);
    fireEvent.tap(screen.container.querySelector('.ui-rate-hit')!); expect(values).toEqual([.5, 0]);
    screen.rerender(<Rate value={3} disabled onChange={({ value }) => values.push(value)} />);
    fireEvent.tap(screen.container.querySelector('.ui-rate-hit')!); expect(values).toEqual([.5, 0]);
  } finally { cleanup(); }
});

test('Rate replaces different selected icons and clips the idle icon to the unselected half', () => {
  try {
    const screen = render(<Rate value={2.5} allowHalf icon="thumb-down-fill" activeIcon="thumb-up-fill" />);
    const items = screen.container.querySelectorAll('.ui-rate-item');
    expect(items[0]!.querySelector('.ui-rate-empty')).toBeNull();
    expect(items[1]!.querySelector('.ui-rate-empty')).toBeNull();
    expect(items[2]!.querySelector('.ui-rate-empty')?.getAttribute('style')).toMatch(/width:\s*50%/);
    expect(items[2]!.querySelector('.ui-rate-fill')?.getAttribute('style')).toMatch(/width:\s*50%/);
    expect(items[3]!.querySelector('.ui-rate-fill')).toBeNull();
    screen.rerender(<Rate value={0} icon="thumb-down-fill" activeIcon="thumb-up-fill" />);
    expect(screen.container.querySelectorAll('.ui-rate-empty').length).toBe(5);
    expect(screen.container.querySelector('.ui-rate-fill')).toBeNull();
  } finally { cleanup(); }
});


test('Rate disabled preserves active and custom colors unless disabledColor is explicitly provided', () => {
  try {
    const screen = render(<Rate value={2} disabled activeColor="#12b886" />);
    expect(screen.container.querySelector('.ui-rate-disabled')).not.toBeNull();
    expect(screen.container.querySelector('.ui-rate-fill svg')?.getAttribute('content')).toContain('fill="#12b886"');
    expect(screen.container.querySelector('.ui-rate-default-light')?.getAttribute('content')).toContain('fill="#c9cbd4"');
    screen.rerender(<Rate value={2} disabled disabledColor="#888888" />);
    expect(screen.container.querySelector('.ui-rate-fill svg')?.getAttribute('content')).toContain('fill="#888888"');
  } finally { cleanup(); }
});
