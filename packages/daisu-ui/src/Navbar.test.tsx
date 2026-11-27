import { afterEach, expect, test } from '@rstest/core';
import { cleanup, render } from '@lynx-js/react/testing-library';
import { Navbar } from './Navbar.js';

afterEach(cleanup);

test('standard and business navigation bars stay in the scroll layout by default', () => {
  const screen = render(<view><Navbar variant="standard" title="标准导航" /><Navbar title="业务导航" /></view>);
  for (const node of screen.container.querySelectorAll('.ui-navbar, .navbar')) {
    expect(node.getAttribute('style')).toContain('position: relative');
    expect(node.getAttribute('style')).toContain('z-index: 0');
  }
  expect(screen.container.querySelector('.ui-navbar-placeholder')).toBeNull();
});

test('turning fixed off restores a standard navigation bar to normal scrolling', () => {
  const screen = render(<Navbar variant="standard" title="标题" fixed placeholder zIndex={20} />);
  const node = screen.container.querySelector('.ui-navbar')!;
  expect(node.getAttribute('style')).toContain('position: fixed');
  expect(node.getAttribute('style')).toContain('z-index: 20');
  expect(screen.container.querySelector('.ui-navbar-placeholder')).toBeTruthy();
  screen.rerender(<Navbar variant="standard" title="标题" fixed={false} placeholder />);
  expect(node.getAttribute('style')).toContain('position: relative');
  expect(node.getAttribute('style')).toContain('z-index: 0');
  expect(node.getAttribute('style')).toContain('top: auto');
  expect(screen.container.querySelector('.ui-navbar-placeholder')).toBeNull();
});
