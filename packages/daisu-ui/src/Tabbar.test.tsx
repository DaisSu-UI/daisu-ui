import { afterEach, expect, test } from '@rstest/core';
import { cleanup, render } from '@lynx-js/react/testing-library';
import { Tabbar } from './Tabbar.js';
afterEach(cleanup);

test('Tabbar releases every fixed coordinate and layer when returning to page flow', () => {
  const items = [{ title: '首页', icon: 'home' }];
  const screen = render(<Tabbar items={items} fixed zIndex={20} />);
  const node = screen.container.querySelector('.ui-tabbar')!;
  expect(node.getAttribute('style')).toContain('position: fixed');
  expect(node.getAttribute('style')).toContain('z-index: 20');
  screen.rerender(<Tabbar items={items} />);
  const style = node.getAttribute('style')!;
  expect(style).toContain('position: relative');
  for (const edge of ['top', 'left', 'right', 'bottom']) expect(style).toContain(`${edge}: auto`);
  expect(style).toContain('z-index: 0');
});
