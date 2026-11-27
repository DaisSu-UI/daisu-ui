import { afterEach, expect, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { CalendarExample } from './calendar.js';
afterEach(cleanup);

test('Calendar Demo selects today repeatedly after editing the draft without committing the saved value', () => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const label = (date: Date) => `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  const screen = render(<CalendarExample />);
  fireEvent.tap(screen.getByText('拓展确定区域'));
  const selected = () => screen.container.querySelector('.ui-calendar-day-selected')?.getAttribute('accessibility-label');
  for (let i = 0; i < 2; i++) {
    fireEvent.tap(screen.container.querySelector(`[accessibility-label="${label(yesterday)}"]`)!);
    expect(selected()).toBe(label(yesterday));
    fireEvent.tap(screen.getByText('选择今天'));
    expect(selected()).toBe(label(today));
  }
});
