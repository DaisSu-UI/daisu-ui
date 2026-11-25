import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { SortButton } from './SortButton.js';

test('SortButton follows ascending/descending/reset cycles and keeps controlled state external', () => {
  const values: number[] = [];
  try {
    const screen = render(<SortButton allowReset onChange={({ value }) => values.push(value)} />);
    const tap = () => fireEvent.tap(screen.container.querySelector('.ui-sort-button')!);
    tap(); tap(); tap(); tap(); expect(values).toEqual([1, -1, 0, 1]);
    screen.rerender(<SortButton value={0} descFirst line onChange={({ value }) => values.push(value)} />);
    tap(); tap(); expect(values.slice(-2)).toEqual([-1, -1]);
    expect(screen.container.querySelector('.ui-sort-button-indicator')).toBeNull();
    screen.rerender(<SortButton value={-1} descFirst line onChange={({ value }) => values.push(value)} />);
    tap(); expect(values.at(-1)).toBe(1); expect(screen.container.querySelector('.ui-sort-button-indicator')).not.toBeNull();
  } finally { cleanup(); }
});
