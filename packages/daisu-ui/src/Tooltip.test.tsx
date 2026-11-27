import { expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { createRef } from '@lynx-js/react';
import type { NodesRef } from '@lynx-js/types';
import { Tooltip } from './Tooltip.js';
import type { TooltipRef } from './Tooltip.js';

function geometry() {
  const createQuery = lynx.createSelectorQuery.bind(lynx); let count = 0;
  const rects = [{ left: 150, top: 130, width: 80, height: 40 }, { left: 0, top: 0, width: 122, height: 44 }, { left: 0, top: 0, width: 390, height: 844 }];
  return rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => {
    const query = createQuery(); const select = query.select.bind(query);
    query.select = selector => { const ref = select(selector); const invoke = ref.invoke.bind(ref);
      ref.invoke = options => options.method === 'boundingClientRect' ? { exec() { options.success?.(rects[count++ % 3]); } } as unknown as ReturnType<NodesRef['invoke']> : invoke(options);
      return ref;
    }; return query;
  });
}

test('Tooltip measures native geometry, opens from its trigger, and closes from the close button exactly once', async () => {
  const mock = geometry(); const events: unknown[] = [];
  try {
    const screen = render(<Tooltip showClose content="提示文字" duration={0} onChange={event => events.push(event)} onOpen={() => events.push('open')} onClose={() => events.push('close')}><text>触发器</text></Tooltip>);
    fireEvent.tap(screen.container.querySelector('.ui-tooltip-target')!, { eventType: 'catchEvent' });
    await waitFor(() => expect(screen.container.querySelector('.ui-bubble-anchor')?.getAttribute('style')).toContain('visibility: visible'));
    expect(screen.container.querySelector('.ui-bubble-anchor')?.getAttribute('style')).toContain('top: 54px');
    expect(screen.container.querySelector('.ui-bubble-panel')?.getAttribute('style')).toContain('height: 44px');
    expect(screen.container.querySelector('.ui-bubble-panel')?.getAttribute('style')).toContain('width: 122px');
    fireEvent.tap(screen.container.querySelector('.ui-bubble-close')!, { eventType: 'catchEvent' });
    await waitFor(() => expect(events).toEqual([{ show: true }, 'open', { show: false }, 'close']));
    expect(screen.getByText('提示文字')).toBeTruthy();
  } finally { cleanup(); mock.mockRestore(); }
});

test('Tooltip controlled state waits for its owner, imperative controls honor disabled and position updates do not emit changes', async () => {
  const mock = geometry(); const ref = createRef<TooltipRef>(); const changes: boolean[] = [];
  try {
    const screen = render(<Tooltip ref={ref} show={false} content="受控" onShowChange={value => changes.push(value)}><text>触发器</text></Tooltip>);
    ref.current!.open(); expect(changes).toEqual([true]);
    expect(screen.container.querySelector('.ui-bubble-anchor')?.getAttribute('style')).toContain('visibility: hidden');
    screen.rerender(<Tooltip ref={ref} show content="受控" onShowChange={value => changes.push(value)}><text>触发器</text></Tooltip>);
    await waitFor(() => expect(screen.container.querySelector('.ui-bubble-anchor')?.getAttribute('style')).toContain('visibility: visible'));
    ref.current!.updatePosition();
    await waitFor(() => expect(screen.container.querySelector('.ui-bubble-anchor')?.getAttribute('style')).toContain('visibility: visible'));
    expect(changes).toEqual([true]);
    screen.rerender(<Tooltip ref={ref} disabled content="禁用" onShowChange={value => changes.push(value)}><text>触发器</text></Tooltip>);
    ref.current!.open(); expect(changes).toEqual([true]);
  } finally { cleanup(); mock.mockRestore(); }
});
