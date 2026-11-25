import { afterEach, expect, test } from '@rstest/core';
import { cleanup, render, waitFor } from '@lynx-js/react/testing-library';
import { Progress } from './Progress.js';
import { progressSegments, progressStops, progressPercentage } from './progressModel.js';
afterEach(cleanup);
test('progress clamps invalid input, sorts stops without mutating callers, and keeps Wot upward color stages', () => {
  const colors = [{ color: 'red', percentage: 60 }, { color: 'yellow', percentage: 30 }, { color: 'black', percentage: 90 }];
  const stops = progressStops(colors); expect(colors[0]?.percentage).toBe(60); expect(stops.map(stop => stop.percentage)).toEqual([30,60,90]);
  expect(progressStops(['red','blue'])).toEqual([{ color:'red', percentage:50 },{ color:'blue', percentage:100 }]);
  expect(progressSegments(0,50,stops)).toEqual([{ value:30,color:'yellow' },{ value:50,color:'black' }]); expect(progressSegments(80,50,stops)).toEqual([{ value:50,color:'red' }]);
  expect([NaN, Infinity, -10, 150].map(progressPercentage)).toEqual([0,0,0,100]);
});
test('Progress renders inside labels, status icons, hidden labels and zero without losing the target value', async () => {
  const screen = render(<Progress percentage={120} hideText status="success" duration={0} />);
  expect(screen.container.querySelector('.ui-progress-label')).toBeNull(); expect(screen.container.querySelector('.ui-progress-icon')).toBeTruthy();
  await waitFor(() => expect(screen.container.querySelector('.ui-progress-fill')?.getAttribute('style')).toContain('width: 100%'));
  screen.rerender(<Progress percentage={0} percentPosition={{ type:'inner',align:'center' }} duration={0} />);
  expect(screen.container.querySelector('.ui-progress-zero')).toBeTruthy(); expect(screen.getByText('0%')).toBeTruthy(); expect(screen.container.querySelector('.ui-progress-align-center')).toBeTruthy();
});
test('Progress cancels pending color stages on target replacement, updates color at the same value and cleans timers on unmount', async () => {
  const color = [{ color:'red',percentage:30 },{ color:'blue',percentage:100 }];
  const screen = render(<Progress percentage={100} color={color} duration={4} />);
  await waitFor(() => expect(screen.container.querySelector('.ui-progress-fill')?.getAttribute('style')).toContain('width: 30%'));
  screen.rerender(<Progress percentage={10} color="green" duration={0} />);
  await waitFor(() => expect(screen.container.querySelector('.ui-progress-fill')?.getAttribute('style')).toContain('width: 10%'));
  await new Promise(resolve => setTimeout(resolve,180)); expect(screen.container.querySelector('.ui-progress-fill')?.getAttribute('style')).toContain('background-color: green'); expect(screen.getByText('10%')).toBeTruthy();
  screen.rerender(<Progress percentage={10} color="purple" duration={0} />); await waitFor(() => expect(screen.container.querySelector('.ui-progress-fill')?.getAttribute('style')).toContain('background-color: purple')); screen.unmount();
});
