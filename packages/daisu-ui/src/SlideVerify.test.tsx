import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { createRef } from '@lynx-js/react';
import { SlideVerify } from './SlideVerify.js';
import type { SlideVerifyRef } from './SlideVerify.js';
afterEach(cleanup);
function setup(props: import('./SlideVerify.js').SlideVerifyProps = {}) {
  const ref = createRef<SlideVerifyRef>(), screen = render(<SlideVerify {...props} ref={ref} />), bar = screen.container.querySelector('.ui-slide-verify')!, thumb = screen.container.querySelector('.ui-slide-verify-button')!;
  fireEvent.layoutchange(bar, { detail: { width: 300, height: 40 } });
  const point = (x: number) => ({ eventType: 'catchEvent', touches: [{ clientX: x, x: 5 }], changedTouches: [{ clientX: x, x: 5 }] });
  return { ...screen, ref, bar, thumb, start: () => fireEvent.touchstart(thumb, point(20)), move: (x: number) => fireEvent.touchmove(thumb, point(x)), end: (x: number) => fireEvent.touchend(thumb, point(x)) };
}
test('SlideVerify uses viewport coordinates rather than coordinates relative to its moving thumb', async () => {
  const success = rstest.fn(), fail = rstest.fn(), screen = setup({ onSuccess: success, onFail: fail });
  screen.start(); screen.move(275); screen.end(275);
  expect(success).toHaveBeenCalledTimes(1); expect(fail).not.toHaveBeenCalled(); expect(screen.bar.className).toContain('ui-slide-verify-success');
  screen.start(); screen.move(50); screen.end(50); expect(success).toHaveBeenCalledTimes(1); expect(screen.thumb.getAttribute('style')).toContain('translateX(260px)');
  screen.ref.current?.reset(); await waitFor(() => expect(screen.bar.className).not.toContain('ui-slide-verify-success'));
  screen.start(); screen.move(100); screen.end(100); expect(fail).toHaveBeenCalledTimes(1);
});
test('SlideVerify measures thumb size from height, accepts end coordinates and resets on resize', () => {
  const success = rstest.fn(), screen = setup({ height: 60, tolerance: 0, onSuccess: success });
  fireEvent.layoutchange(screen.bar, { detail: { width: 300, height: 60 } }); screen.start(); screen.end(260);
  expect(success).toHaveBeenCalledTimes(1); expect(screen.thumb.getAttribute('style')).toContain('translateX(240px)');
  fireEvent.layoutchange(screen.bar, { detail: { width: 320, height: 60 } }); expect(screen.bar.className).not.toContain('ui-slide-verify-success');
});
test('SlideVerify disabled and cancelled gestures never pass or emit a failure', () => {
  const success = rstest.fn(), fail = rstest.fn(), screen = setup({ onSuccess: success, onFail: fail });
  screen.start(); screen.move(280); fireEvent.touchcancel(screen.thumb, { eventType: 'catchEvent' }); expect(success).not.toHaveBeenCalled(); expect(fail).not.toHaveBeenCalled();
  screen.rerender(<SlideVerify disabled onSuccess={success} onFail={fail} />); screen.start(); screen.end(280); expect(success).not.toHaveBeenCalled();
});
test('SlideVerify blocks undersized tracks and multitouch without granting success', () => {
  const success = rstest.fn(), screen = setup({ onSuccess: success });
  fireEvent.layoutchange(screen.bar, { detail: { width: 40, height: 40 } }); screen.start(); screen.end(280); expect(success).not.toHaveBeenCalled();
  fireEvent.layoutchange(screen.bar, { detail: { width: 300, height: 40 } }); screen.start();
  fireEvent.touchmove(screen.thumb, { eventType: 'catchEvent', touches: [{ clientX: 280 }, { clientX: 100 }] }); screen.end(280); expect(success).not.toHaveBeenCalled();
});
