import { expect, test } from '@rstest/core';
import { createRef } from '@lynx-js/react';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { Popover } from './Popover.js';
import type { PopoverMenuItem, PopoverRef } from './Popover.js';

test('Popover menu returns the original item and index, requests close before selection, and ignores repeated taps', async () => {
  const item = { content: '删除', iconClass: 'delete', payload: { id: 42 } };
  const events: unknown[] = [];
  try {
    const screen = render(<Popover defaultShow mode="menu" content={[{ content: '置顶' }, item]} onShowChange={show => events.push(show)} onMenuClick={event => events.push(event)}><text>目标</text></Popover>);
    await waitFor(() => expect(screen.container.querySelector('.ui-transition-fade-enter-from')).toBeTruthy());
    const option = screen.container.querySelectorAll('.ui-popover-menu-item')[1]!;
    fireEvent.tap(option, { eventType: 'catchEvent' }); fireEvent.tap(option, { eventType: 'catchEvent' });
    expect(events).toEqual([false, { item, index: 1 }]);
    expect((events[1] as { item: PopoverMenuItem }).item).toBe(item);
  } finally { cleanup(); }
});

test('Popover controlled selection waits for its owner and disabled menu stays inert', async () => {
  const ref = createRef<PopoverRef>(); const requests: boolean[] = []; let count = 0;
  const props = { ref, mode: 'menu' as const, content: [{ content: '选项' }], onShowChange: (show: boolean) => requests.push(show), onMenuClick: () => count++ };
  try {
    const screen = render(<Popover {...props} show />);
    await waitFor(() => expect(screen.container.querySelector('.ui-transition-fade-enter-from')).toBeTruthy());
    fireEvent.tap(screen.container.querySelector('.ui-popover-menu-item')!, { eventType: 'catchEvent' });
    expect(requests).toEqual([false]); expect(count).toBe(1);
    expect(screen.container.querySelector('.ui-transition-fade-leave-from')).toBeNull();
    screen.rerender(<Popover {...props} show disabled />);
    ref.current?.open();
    fireEvent.tap(screen.container.querySelector('.ui-popover-menu-item')!, { eventType: 'catchEvent' });
    expect(requests).toEqual([false]); expect(count).toBe(1);
  } finally { cleanup(); }
});

test('Popover custom content takes precedence over normal text or menu and ref forwards controls', async () => {
  const ref = createRef<PopoverRef>(); const events: string[] = [];
  try {
    const screen = render(<Popover ref={ref} content="默认" contentNode={<text>自定义</text>} onOpen={() => events.push('open')} onClose={() => events.push('close')} />);
    ref.current?.open();
    await waitFor(() => expect(events).toEqual(['open']));
    expect(screen.getByText('自定义')).toBeTruthy(); expect(screen.queryByText('默认')).toBeNull();
    ref.current?.close();
    await waitFor(() => expect(events).toEqual(['open', 'close']));
  } finally { cleanup(); }
});
