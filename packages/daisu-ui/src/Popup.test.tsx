import { expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { Popup } from './Popup.js';
import { useState } from '@lynx-js/react';
import { RootPortalHost } from './RootPortal.js';

test('Popup emits controlled close reasons, allows non-dismissable/no-modal panels and preserves children after closing', async () => {
  const changes: boolean[] = []; const closes: string[] = []; let clicks = 0;
  const props = { duration: 0, onChange: (v: boolean) => changes.push(v), onClose: (r: 'modal' | 'close') => closes.push(r), onClickModal: () => clicks++ };
  try {
    const screen = render(<Popup {...props} show title="等级权益" closable closeOnClickModal={false}><text>持久内容</text></Popup>);
    await waitFor(() => expect(screen.container.querySelector('.ui-overlay')).toBeTruthy());
    fireEvent.tap(screen.container.querySelector('.ui-overlay')!);
    expect(clicks).toBe(1); expect(closes).toEqual([]);
    expect(screen.getByText('等级权益')).toBeTruthy();
    fireEvent.tap(screen.container.querySelector('.ui-popup-close')!, { eventType: 'catchEvent' });
    expect(changes).toEqual([false]); expect(closes).toEqual(['close']);
    screen.rerender(<Popup {...props} show title={0}><text>持久内容</text></Popup>);
    fireEvent.tap(screen.container.querySelector('.ui-overlay')!);
    expect(closes).toEqual(['close', 'modal']);
    expect(screen.getByText('0')).toBeTruthy();
    screen.rerender(<Popup {...props} modal={false}><text>持久内容</text></Popup>);
    await waitFor(() => expect((screen.container.querySelector('.ui-popup') as HTMLElement).style.display).toBe('none'));
    expect(screen.getByText('持久内容')).toBeTruthy();
    expect(screen.container.querySelector('.ui-overlay')).toBeNull();
    expect(screen.container.querySelector('.ui-popup-header')).toBeNull();
  } finally { cleanup(); }
});

test('a smaller nested popup has a full viewport mask above the parent and closes independently', async () => {
  function Example() {
    const [child, setChild] = useState(false);
    return <Popup show duration={0} title="父弹窗" style={{ width: '320px' }}>
      <text bindtap={() => setChild(true)}>打开小弹窗</text>
      <Popup show={child} onChange={setChild} duration={0} title="小弹窗" style={{ width: '180px' }}><text>子内容</text></Popup>
    </Popup>;
  }
  try {
    const screen = render(<Example />);
    fireEvent.tap(screen.getByText('打开小弹窗'));
    await waitFor(() => expect(screen.getByText('小弹窗')).toBeTruthy());
    const overlays = screen.container.querySelectorAll('.ui-overlay');
    const anchors = screen.container.querySelectorAll('.ui-popup-anchor');
    expect(overlays).toHaveLength(2);
    expect(Number((overlays[1] as HTMLElement).style.zIndex)).toBeGreaterThan(Number((anchors[0] as HTMLElement).style.zIndex));
    expect(overlays[1]!.closest('.ui-popup-anchor')).toBeNull();
    expect(Number((anchors[1] as HTMLElement).style.zIndex)).toBeGreaterThan(Number((overlays[1] as HTMLElement).style.zIndex));
    fireEvent.tap(overlays[1]!);
    await waitFor(() => expect((overlays[1] as HTMLElement).style.display).toBe('none'));
    expect((overlays[0] as HTMLElement).style.display).not.toBe('none');
    expect(screen.getByText('父弹窗')).toBeTruthy();
  } finally { cleanup(); }
});

test('sibling root-portal popups allocate each new mask above the preceding popup without manual zIndex', async () => {
  function Example() {
    const [child, setChild] = useState(false);
    return <RootPortalHost><Popup show rootPortal duration={0} zIndex={100}><text bindtap={() => setChild(true)}>继续</text></Popup><Popup show={child} rootPortal duration={0} onChange={setChild}><text>第二层</text></Popup></RootPortalHost>;
  }
  try {
    const screen = render(<Example />);
    fireEvent.tap(screen.getByText('继续'));
    await waitFor(() => expect(screen.getByText('第二层')).toBeTruthy());
    const masks = screen.container.querySelectorAll('.ui-overlay'), anchors = screen.container.querySelectorAll('.ui-popup-anchor');
    expect(Number((masks[1] as HTMLElement).style.zIndex)).toBeGreaterThan(Number((anchors[0] as HTMLElement).style.zIndex));
  } finally { cleanup(); }
});

test('popup layers remain reserved during leave and can be reused after closing', async () => {
  rstest.useFakeTimers();
  const tree = (second: boolean, third: boolean) => <RootPortalHost><Popup show rootPortal><text>第一层</text></Popup><Popup show={second} rootPortal><text>第二层</text></Popup><Popup show={third} rootPortal><text>第三层</text></Popup></RootPortalHost>;
  try {
    const screen = render(tree(true, false));
    await rstest.advanceTimersByTimeAsync(400);
    const secondLayer = Number((screen.container.querySelectorAll('.ui-popup-anchor')[1] as HTMLElement).style.zIndex);
    screen.rerender(tree(false, true));
    const masks = screen.container.querySelectorAll('.ui-overlay');
    expect(Number((masks[2] as HTMLElement).style.zIndex)).toBeGreaterThan(secondLayer);
    await rstest.advanceTimersByTimeAsync(400);
    screen.rerender(tree(false, false));
    await rstest.advanceTimersByTimeAsync(400);
    screen.rerender(tree(true, false));
    expect(Number((screen.container.querySelectorAll('.ui-popup-anchor')[1] as HTMLElement).style.zIndex)).toBe(secondLayer);
  } finally { cleanup(); rstest.useRealTimers(); }
});
