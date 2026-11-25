import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { FloatingPanel } from './FloatingPanel.js';
import { nearestPanelAnchor, panelAnchors, panelHeight } from './floatingPanelModel.js';

test('FloatingPanel normalizes anchors, clamps heights, and chooses the nearest stop', () => {
  expect(panelAnchors([400, NaN, -1, 100, 400, 1000], 800)).toEqual([100, 400, 800]);
  expect(panelAnchors(undefined, 800)).toEqual([100, 480]); expect(panelAnchors([], 60)).toEqual([60]);
  expect(panelHeight(0, [100, 400])).toBe(100); expect(panelHeight(999, [100, 400])).toBe(400);
  expect(nearestPanelAnchor(280, [100, 320, 560])).toBe(320);
});
function touch(node: Element, type: string, x: number, y: number, catchEvent = false) {
  const eventType = catchEvent ? 'catchEvent' : 'bindEvent';
  fireEvent(node, Object.assign(new Event(`${eventType}:${type}`), { eventName: type, eventType, touches: [{ clientX: x, clientY: y }], changedTouches: [{ clientX: x, clientY: y }] }));
}
test('FloatingPanel drags and snaps only on release, cancellation restores height, horizontal content gestures stay inert', () => {
  const values: number[] = [];
  try {
    const screen = render(<FloatingPanel anchors={[100, 320, 560]} onHeightChange={({ height }) => values.push(height)} />);
    const header = screen.container.querySelector('.ui-floating-panel-header')!;
    touch(header, 'touchstart', 100, 700, true); touch(header, 'touchmove', 100, 480, true);
    expect(values).toEqual([]); expect(screen.container.querySelector('.ui-floating-panel')?.getAttribute('style')).toContain('translateY(240px)');
    touch(header, 'touchend', 100, 480, true); expect(values).toEqual([320]);
    touch(header, 'touchstart', 100, 480, true); touch(header, 'touchmove', 100, 200, true); touch(header, 'touchcancel', 100, 200, true);
    expect(values).toEqual([320]); expect(screen.container.querySelector('.ui-floating-panel')?.getAttribute('style')).toContain('translateY(240px)');
    const content = screen.container.querySelector('.ui-floating-panel-content')!;
    touch(content, 'touchstart', 100, 500); touch(content, 'touchmove', 200, 490); touch(content, 'touchend', 200, 490);
    expect(values).toEqual([320]);
  } finally { cleanup(); }
});
test('FloatingPanel controlled height, content disable, and expanded scrolling preserve the owner state', () => {
  const values: number[] = [];
  try {
    const props = { anchors: [100, 400], onHeightChange: ({ height }: { height: number }) => values.push(height) };
    const screen = render(<FloatingPanel {...props} height={100} contentDraggable={false} />);
    const content = screen.container.querySelector('.ui-floating-panel-content')!;
    touch(content, 'touchstart', 100, 700); touch(content, 'touchmove', 100, 300); touch(content, 'touchend', 100, 300);
    expect(values).toEqual([]);
    const header = screen.container.querySelector('.ui-floating-panel-header')!;
    touch(header, 'touchstart', 100, 700, true); touch(header, 'touchmove', 100, 300, true); touch(header, 'touchend', 100, 300, true);
    expect(values).toEqual([400]); expect(screen.container.querySelector('.ui-floating-panel')?.getAttribute('style')).toContain('translateY(300px)');
    screen.rerender(<FloatingPanel {...props} height={400} />);
    const scroller = lynx.createSelectorQuery().select('.ui-floating-panel-scroll') as unknown as Element;
    fireEvent.scroll(scroller, { detail: { scrollTop: 80 } });
    touch(content, 'touchstart', 100, 300); touch(content, 'touchmove', 100, 600); touch(content, 'touchend', 100, 600);
    expect(values).toEqual([400]);
  } finally { cleanup(); }
});
