import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, render } from '@lynx-js/react/testing-library';
import { Circle } from './Circle.js';
import { circleStops, circleSvg } from './circleModel.js';
afterEach(() => { cleanup(); rstest.useRealTimers(); });
const defaults = { value:20,size:120,color:'#1c64fd',layerColor:'#f2f3f5',strokeWidth:18,strokeLinecap:'round' as const,clockwise:true };
test('Circle native SVG matches Wot stroke geometry, direction, zero dot and full circle', () => {
  const svg = circleSvg(defaults); expect(svg).toContain('r="55.5"'); expect(svg).toContain('stroke-width="9"'); expect(svg).toContain('M60 4.5A55.5 55.5 0 0 1');
  expect(circleSvg({ ...defaults,clockwise:false })).toContain('M60 4.5A55.5 55.5 0 0 0');
  expect(circleSvg({ ...defaults,value:0 })).toContain('cx="60" cy="4.5" r="4.5"');
  expect(circleSvg({ ...defaults,value:100 })).not.toContain('<path'); expect(circleSvg({ ...defaults,value:120 })).toBe(circleSvg({ ...defaults,value:100 }));
  expect(circleSvg({ ...defaults,value:NaN,strokeLinecap:'butt' })).not.toContain('<path'); expect(circleSvg({ ...defaults,size:0 })).not.toContain('NaN');
});
test('Circle sorts and escapes gradient stops and fill without mutating the provided map', () => {
  const color = { '100%':'white','0':'red','bad':'blue' }; expect(circleStops(color)).toEqual([{ offset:0,color:'red' },{ offset:100,color:'white' }]);
  const svg = circleSvg({ ...defaults,color,fill:'red" test="value' }); expect(svg).toContain('gradientUnits="userSpaceOnUse" x1="120"'); expect(svg).toContain('stroke="url(#circle-gradient)"'); expect(svg).toContain('red&quot; test=&quot;value'); expect(svg).toContain('stroke-width="18"'); expect(Object.keys(color)).toContain('bad');
});
test('Circle reverses from its current animation, clamps invalid targets and stops on immediate speed or unmount', async () => {
  rstest.useFakeTimers(); const screen = render(<Circle value={20} text="20%" />);
  const markup = () => screen.container.querySelector('.ui-circle-svg')!.getAttribute('content'); const initial = markup();
  screen.rerender(<Circle value={70} text="70%" />); await rstest.advanceTimersByTimeAsync(100); const middle = markup(); expect(middle).not.toBe(initial); expect(middle).not.toBe(circleSvg({ ...defaults,value:70 }));
  screen.rerender(<Circle value={10} />); await rstest.advanceTimersByTimeAsync(400); expect(markup()).toBe(circleSvg({ ...defaults,value:10 }));
  screen.rerender(<Circle value={200} speed={0} />); await rstest.advanceTimersByTimeAsync(20); expect(markup()).toBe(circleSvg({ ...defaults,value:100 }));
  screen.rerender(<Circle value={NaN} speed={0} />); await rstest.advanceTimersByTimeAsync(20); expect(markup()).toBe(circleSvg({ ...defaults,value:0 }));
  screen.rerender(<Circle value={100} />); screen.unmount(); await rstest.advanceTimersByTimeAsync(3000);
});
test('Circle text overrides children and paint changes update at a stable value', () => {
  const screen = render(<Circle value={20} text="优先文本"><text>插槽</text></Circle>); expect(screen.container.querySelector('.ui-circle-content')?.textContent).toBe('优先文本');
  screen.rerender(<Circle value={20} color="red" size={80} strokeWidth={6}><text>插槽</text></Circle>); expect(screen.container.querySelector('.ui-circle-content')?.textContent).toBe('插槽'); expect(screen.container.querySelector('.ui-circle-svg')?.getAttribute('content')).toContain('stroke="red"'); expect(screen.container.querySelector('.ui-circle')?.getAttribute('style')).toContain('80px');
});
