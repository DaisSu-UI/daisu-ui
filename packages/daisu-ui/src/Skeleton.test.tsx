import { afterEach, expect, test } from '@rstest/core';
import { cleanup, render } from '@lynx-js/react/testing-library';
import { Skeleton, skeletonRows } from './Skeleton.js';
afterEach(cleanup);
test('Skeleton presets and numeric counts produce the documented columns',()=>{
 expect(skeletonRows(undefined,'avatar')).toEqual([[{type:'circle',size:64}]]);expect(skeletonRows([],'paragraph')).toHaveLength(4);expect(skeletonRows([1,1,2],'text').map(row=>row.length)).toEqual([1,1,2]);expect(skeletonRows([Infinity,-1,2.9],'text').map(row=>row.length)).toEqual([0,0,2]);
});
test('Skeleton rowCol replaces theme immediately and only supported layout styles reach cells',()=>{
 const screen=render(<Skeleton theme="paragraph"/>);expect(screen.container.querySelectorAll('.ui-skeleton-row')).toHaveLength(4);
 screen.rerender(<Skeleton rowCol={[[{size:48,type:'circle',backgroundColor:'#fff'},{width:'50%',marginLeft:12,borderRadius:8}]]} animation="gradient"/>);expect(screen.container.querySelectorAll('.ui-skeleton-row')).toHaveLength(1);expect(screen.container.querySelectorAll('.ui-skeleton-shimmer')).toHaveLength(2);expect(screen.container.querySelector('.ui-skeleton-circle')!.getAttribute('style')).toContain('48px');
 screen.rerender(<Skeleton theme="image"/>);expect(screen.container.querySelectorAll('.ui-skeleton-col')).toHaveLength(1);expect(screen.container.querySelector('.ui-skeleton-rect')).toBeTruthy();
});
test('Skeleton loading toggles exclusive content and restores animation without running JS timers',()=>{
 const screen=render(<Skeleton animation="flashed"><text>已加载内容</text></Skeleton>);expect(screen.queryByText('已加载内容')).toBeNull();expect(screen.container.querySelector('.ui-skeleton-animation-flashed')).toBeTruthy();
 screen.rerender(<Skeleton loading={false} animation="gradient"><text>已加载内容</text></Skeleton>);expect(screen.getByText('已加载内容')).toBeTruthy();expect(screen.container.querySelector('.ui-skeleton-col')).toBeNull();
 screen.rerender(<Skeleton animation="gradient">{0}</Skeleton>);expect(screen.container.querySelector('.ui-skeleton-shimmer')).toBeTruthy();
});
