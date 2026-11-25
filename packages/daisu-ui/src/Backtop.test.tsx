import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Backtop } from './Backtop.js';

test('Backtop uses a strict threshold and sends sanitized duration to its owning controller', () => {
  const requests: number[] = [];
  try {
    const request = ({ duration }: { duration: number }) => requests.push(duration);
    const screen = render(<Backtop scrollTop={300} onBacktop={request} />);
    expect(screen.container.querySelector('.ui-backtop')).toBeNull();
    screen.rerender(<Backtop scrollTop={301} duration={1000} onBacktop={request} text="顶部" shape="square" />);
    fireEvent.tap(screen.container.querySelector('.ui-backtop')!);
    expect(requests).toEqual([1000]);
    expect(screen.getByText('顶部')).toBeTruthy();
    screen.rerender(<Backtop scrollTop={301} duration={-5} onBacktop={request}><text>TOP</text></Backtop>);
    expect(screen.getByText('TOP')).toBeTruthy();
    fireEvent.tap(screen.container.querySelector('.ui-backtop')!);
    expect(requests).toEqual([1000, 0]);
    screen.rerender(<Backtop scrollTop={300} onBacktop={request} />);
    const leaving = screen.container.querySelector('.ui-backtop');
    if (leaving) fireEvent.tap(leaving);
    expect(requests).toHaveLength(2);
  } finally { cleanup(); }
});
