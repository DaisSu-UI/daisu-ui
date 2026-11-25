import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { Popup } from './Popup.js';

test('Popup emits controlled close reasons, allows non-dismissable/no-modal panels and preserves children after closing', async () => {
  const changes: boolean[] = []; const closes: string[] = []; let clicks = 0;
  const props = { duration: 0, onChange: (v: boolean) => changes.push(v), onClose: (r: 'modal' | 'close') => closes.push(r), onClickModal: () => clicks++ };
  try {
    const screen = render(<Popup {...props} show closable closeOnClickModal={false}><text>持久内容</text></Popup>);
    await waitFor(() => expect(screen.container.querySelector('.ui-overlay')).toBeTruthy());
    fireEvent.tap(screen.container.querySelector('.ui-overlay')!);
    expect(clicks).toBe(1); expect(closes).toEqual([]);
    fireEvent.tap(screen.container.querySelector('.ui-popup-close')!, { eventType: 'catchEvent' });
    expect(changes).toEqual([false]); expect(closes).toEqual(['close']);
    screen.rerender(<Popup {...props} show><text>持久内容</text></Popup>);
    fireEvent.tap(screen.container.querySelector('.ui-overlay')!);
    expect(closes).toEqual(['close', 'modal']);
    screen.rerender(<Popup {...props} modal={false}><text>持久内容</text></Popup>);
    await waitFor(() => expect((screen.container.querySelector('.ui-popup') as HTMLElement).style.display).toBe('none'));
    expect(screen.getByText('持久内容')).toBeTruthy();
    expect(screen.container.querySelector('.ui-overlay')).toBeNull();
  } finally { cleanup(); }
});
