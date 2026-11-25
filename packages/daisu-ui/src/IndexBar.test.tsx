import { beforeEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import type { ReactNode } from '@lynx-js/react';
import { forwardRef, useImperativeHandle } from '@lynx-js/react' with { rstest: 'importActual' };

const { scrollTo } = rstest.hoisted(() => ({ scrollTo: rstest.fn() }));
// The test environment cannot invoke native list methods or materialize virtual cells.
// Keep selection and slot rendering real, and inspect the public List scroll command.
rstest.mock('@lynx-js/lynx-ui', () => {
  return { List: forwardRef<{ scrollTo: typeof scrollTo }, { children?: ReactNode; className?: string }>((props, ref) => {
    useImperativeHandle(ref, () => ({ scrollTo }));
    return <view className={props.className}>{props.children}</view>;
  }) };
});
import { IndexAnchor, IndexBar } from './IndexBar.js';
beforeEach(() => scrollTo.mockClear());

test('IndexBar preserves typed indexes and renders custom rows and anchor content', () => {
  const changes: (string | number)[] = [];
  try {
    const screen = render(<IndexBar listId="index-bar-test" sections={[{ index: 0, data: ['数字'] }, { index: '0', data: ['字符串'] }]} renderItem={({ item }) => <text>{item}</text>} renderAnchor={({ section }) => <text>{`分组 ${typeof section.index}`}</text>} onChange={({ index }) => changes.push(index)} />);
    expect(screen.getByText('数字')).toBeTruthy();
    expect(screen.getByText('分组 string')).toBeTruthy();
    const indexes = screen.container.querySelectorAll('.ui-index-bar-index');
    fireEvent.tap(indexes[1]!);
    fireEvent.tap(indexes[1]!);
    expect(changes).toEqual(['0']);
    expect(scrollTo).toHaveBeenLastCalledWith(false, 'top', 2, 0);
    expect(indexes[1]!.classList.contains('ui-index-bar-index-active')).toBe(true);
    expect(screen.container.querySelector('.ui-index-bar-sticky')).toBeNull();
  } finally { cleanup(); }
});

test('IndexBar resets removed groups and clears its rail and pinned header for empty data', () => {
  try {
    const row = ({ item }: { item: string }) => <text>{item}</text>;
    const screen = render(<IndexBar listId="index-bar-dynamic" sticky sections={[{ index: 'A', data: ['甲'] }, { index: 'B', data: ['乙'] }]} renderItem={row} />);
    fireEvent.tap(screen.container.querySelectorAll('.ui-index-bar-index')[1]!);
    expect(screen.container.querySelector('.ui-index-bar-index-active')?.textContent).toBe('B');
    screen.rerender(<IndexBar listId="index-bar-dynamic" sticky sections={[{ index: 'C', data: ['丙'] }]} renderItem={row} />);
    expect(screen.container.querySelector('.ui-index-bar-index-active')?.textContent).toBe('C');
    expect(screen.container.querySelector('.ui-index-bar-sticky')?.textContent).toBe('C');
    screen.rerender(<IndexBar listId="index-bar-dynamic" sticky sections={[]} renderItem={row} />);
    expect(screen.container.querySelector('.ui-index-bar-rail')).toBeNull();
    expect(screen.container.querySelector('.ui-index-bar-sticky')).toBeNull();
  } finally { cleanup(); }
});

test('IndexAnchor keeps numeric zero and accepts a custom content slot', () => {
  try {
    const screen = render(<IndexAnchor index={0} />);
    expect(screen.getByText('0')).toBeTruthy();
    screen.rerender(<IndexAnchor index="A" className="custom-anchor"><text>热门城市</text></IndexAnchor>);
    expect(screen.getByText('热门城市')).toBeTruthy();
    expect(screen.container.querySelector('.custom-anchor')).toBeTruthy();
  } finally { cleanup(); }
});
