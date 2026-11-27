import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Fab } from './Fab.js';
import { Button } from './Button.js';

afterEach(() => { cleanup(); rstest.useRealTimers(); });

function measure(container: Element, width = 60, height = 60) {
  fireEvent.layoutchange(container.querySelector('.ui-fab-viewport')!, { detail: { width: 390, height: 0 } });
  fireEvent.layoutchange(container.querySelector('.ui-fab-viewport-vertical')!, { detail: { width: 0, height: 844 } });
  fireEvent.layoutchange(container.querySelector('.ui-fab-trigger-measure')!, { detail: { width, height } });
}

test('Fab anchors all four menu directions to the measured trigger after opening', () => {
  rstest.useFakeTimers();
  const screen = render(<Fab position="left-bottom"><Button label="操作" /></Fab>);
  const root = screen.container.querySelector('.ui-fab')!;
  expect(root.getAttribute('style')).toContain('visibility: hidden');
  measure(screen.container);
  fireEvent.layoutchange(screen.container.querySelector('.ui-fab-action-measure')!, { detail: { width: 40, height: 160 } });
  fireEvent.tap(screen.container.querySelector('.ui-fab-trigger')!);
  expect(root.getAttribute('style')).toContain('width: 60px');
  expect(root.getAttribute('style')).toContain('height: 60px');
  expect(root.getAttribute('style')).toContain('top: 768px');
  expect(root.getAttribute('style')).toContain('visibility: visible');
  for (const [direction, left, top, width, height] of [
    ['top', 0, -200, 60, 200], ['bottom', 0, 60, 60, 200],
    ['left', -200, 0, 200, 60], ['right', 60, 0, 200, 60],
  ] as const) {
    screen.rerender(<Fab position="left-bottom" direction={direction}><Button label="操作" /></Fab>);
    fireEvent.layoutchange(screen.container.querySelector('.ui-fab-action-measure')!, { detail: direction === 'top' || direction === 'bottom' ? { width: 40, height: 160 } : { width: 160, height: 40 } });
    const menu = screen.container.querySelector('.ui-fab-actions')!;
    expect(menu.className).toContain(`ui-fab-actions-${direction}`);
    for (const [key, value] of Object.entries({ left, top, width, height })) expect(menu.getAttribute('style')).toContain(`${key}: ${value}px`);
    expect(menu.getAttribute('style')).toContain('bottom: auto');
    expect(menu.getAttribute('style')).toContain('right: auto');
  }
});

test('Fab measures a custom trigger without letting descendant layouts resize its anchor', () => {
  const screen = render(<Fab position="right-bottom" direction="left" trigger={<Button label="分享给朋友" />}><Button label="操作" /></Fab>);
  measure(screen.container, 160, 44);
  const root = screen.container.querySelector('.ui-fab')!;
  expect(root.getAttribute('style')).toContain('left: 214px');
  expect(root.getAttribute('style')).toContain('top: 784px');
  expect(root.getAttribute('style')).toContain('width: 160px');
  fireEvent.layoutchange(screen.container.querySelector('.ui-fab-action-measure')!, { detail: { width: 120, height: 40 } });
  expect(screen.container.querySelector('.ui-fab-actions')!.getAttribute('style')).toContain('left: -160px');
  fireEvent.layoutchange(screen.container.querySelector('.ui-button')!, { detail: { width: 22, height: 22 } });
  fireEvent.layoutchange(screen.container.querySelector('.ui-fab-trigger-measure')!, { detail: { width: 0, height: 0 } });
  expect(root.getAttribute('style')).toContain('width: 160px');
  expect(root.getAttribute('style')).toContain('height: 44px');
});

test('Fab keeps its menu attached after a drag snaps the trigger to the opposite edge', () => {
  const screen = render(<Fab draggable position="right-bottom"><Button label="操作" /></Fab>);
  measure(screen.container);
  const trigger = screen.container.querySelector('.ui-fab-trigger')!;
  fireEvent.touchstart(trigger, { touches: [{ clientX: 330, clientY: 790 }] });
  fireEvent.touchmove(trigger, { touches: [{ clientX: 40, clientY: 400 }] });
  fireEvent.touchend(trigger, { changedTouches: [{ clientX: 40, clientY: 400 }] });
  const root = screen.container.querySelector('.ui-fab')!;
  const menu = screen.container.querySelector('.ui-fab-actions')!;
  expect(root.getAttribute('style')).toContain('left: 16px');
  expect(menu.className).toContain('ui-fab-actions-right');
  expect(menu.getAttribute('style')).toContain('left: 60px');
  expect(menu.getAttribute('style')).toContain('height: 60px');
});

test('Fab repositions an open upward menu when action content grows', () => {
  const screen = render(<Fab defaultActive><Button label="操作" /></Fab>);
  measure(screen.container);
  const probe = screen.container.querySelector('.ui-fab-action-measure')!;
  const menu = screen.container.querySelector('.ui-fab-actions')!;
  expect(menu.getAttribute('style')).toContain('visibility: hidden');
  fireEvent.layoutchange(probe, { detail: { width: 40, height: 80 } });
  expect(menu.getAttribute('style')).toContain('top: -120px');
  expect(menu.getAttribute('style')).toContain('visibility: visible');
  fireEvent.layoutchange(probe, { detail: { width: 40, height: 160 } });
  expect(menu.getAttribute('style')).toContain('top: -200px');
  expect(menu.getAttribute('style')).toContain('height: 200px');
});
