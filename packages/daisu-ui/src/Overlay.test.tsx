import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { Overlay } from './Overlay.js';

test('Overlay is controlled, honors content tap boundaries and completes both lifecycle sequences', async () => {
  const events: string[] = [];
  let taps = 0;
  const props = { duration: 0, onBeforeEnter: () => events.push('before-enter'), onEnter: () => events.push('enter'), onAfterEnter: () => events.push('after-enter'), onBeforeLeave: () => events.push('before-leave'), onLeave: () => events.push('leave'), onAfterLeave: () => events.push('after-leave'), onTap: () => taps++ };
  try {
    const screen = render(<Overlay {...props} />);
    expect(screen.container.querySelector('.ui-overlay')).toBeNull();
    screen.rerender(<Overlay {...props} show><view catchtap={() => {}}><text>内容</text></view></Overlay>);
    await waitFor(() => expect(events).toEqual(['before-enter', 'enter', 'after-enter']));
    fireEvent.tap(screen.container.querySelector('.ui-overlay')!);
    expect(taps).toBe(1);
    screen.rerender(<Overlay {...props} />);
    // The backdrop continues to catch taps while fading out, but cannot request another close.
    fireEvent.tap(screen.container.querySelector('.ui-overlay')!);
    expect(taps).toBe(1);
    await waitFor(() => expect(events).toEqual(['before-enter', 'enter', 'after-enter', 'before-leave', 'leave', 'after-leave']));
    expect((screen.container.querySelector('.ui-overlay') as HTMLElement).style.display).toBe('none');
  } finally { cleanup(); }
});
