import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Empty } from './Empty.js';
import { EmptyState } from './EmptyState.js';
afterEach(cleanup);
test('Empty renders native glyphs by default and allows local bitmap and SVG icon URLs',()=>{
  const screen=render(<Empty tip="暂无内容"/>);expect(screen.getByText('暂无内容')).toBeTruthy();expect(screen.container.querySelector('svg')).toBeTruthy();
  screen.rerender(<Empty icon="/cover.jpg" iconSize="40vw"/>);expect(screen.container.querySelector('.ui-empty-icon')!.getAttribute('style')).toContain('40vw');expect(screen.container.querySelector('image')!.getAttribute('src')).toBe('/cover.jpg');
  screen.rerender(<Empty icon="/cover.svg"/>);expect(screen.container.querySelector('svg')!.getAttribute('src')).toBe('/cover.svg');
});
test('Empty custom image replaces icon and bottom actions remain interactive; no tip creates no gap',()=>{
  const click=rstest.fn(),screen=render(<Empty image={<text>自定义图像</text>} bottom={<view bindtap={click}><text>重试</text></view>}/>);
  expect(screen.container.querySelector('.ui-empty-icon')).toBeNull();expect(screen.container.querySelector('.ui-empty-tip')).toBeNull();expect(screen.getByText('自定义图像')).toBeTruthy();fireEvent.tap(screen.getByText('重试').parentElement!);expect(click).toHaveBeenCalledTimes(1);
  screen.rerender(<Empty tip={0}/>);expect(screen.getByText('0')).toBeTruthy();
});
test('EmptyState keeps existing business presentation and retry behavior',()=>{
  const click=rstest.fn(),screen=render(<EmptyState description="说明" actionLabel="刷新" onAction={click}/>);expect(screen.getByText('暂无数据')).toBeTruthy();expect(screen.getByText('说明')).toBeTruthy();expect(screen.container.querySelector('.ui-empty-mark')).toBeTruthy();fireEvent.tap(screen.container.querySelector('.ui-button')!);expect(click).toHaveBeenCalledTimes(1);
});
