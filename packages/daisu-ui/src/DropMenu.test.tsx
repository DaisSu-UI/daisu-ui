import { expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { createRef } from '@lynx-js/react';
import type { NodesRef } from '@lynx-js/types';
import { DropMenu, DropMenuItem } from './DropMenu.js';
import type { DropMenuItemRef } from './DropMenu.js';

// Only geometry is native; keep menu/guard/transition behavior real.
function geometry() {
  const createQuery = lynx.createSelectorQuery.bind(lynx);
  return rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => {
    const query = createQuery();
    const select = query.select.bind(query);
    query.select = selector => {
      const ref = select(selector);
      const invoke = ref.invoke.bind(ref);
      ref.invoke = options => options.method === 'boundingClientRect' ? { exec() { options.success?.({ top: 130, bottom: 178, left: 0, right: 390, width: 390, height: 48 }); } } as unknown as ReturnType<NodesRef['invoke']> : invoke(options);
      return ref;
    };
    return query;
  });
}
const options = [{ label: '数字', value: 0 }, { label: '字符串', value: '0', tip: '说明' }];

test('DropMenu selects strict typed values and returns the original mapped option, with mutual exclusion and disabled headers', async () => {
  const mock = geometry(); const changes: unknown[] = [];
  try {
    const screen = render(<DropMenu duration={0}><DropMenuItem defaultValue={0} options={options} onChange={event => changes.push(event)} /><DropMenuItem title="第二项" options={options} /><DropMenuItem title="禁用项" disabled options={options} /></DropMenu>);
    const headers = screen.container.querySelectorAll('.ui-drop-menu-item');
    fireEvent.tap(headers[2]!, { eventType: 'catchEvent' }); expect(screen.container.querySelector('.ui-drop-menu-item-open')).toBeNull();
    fireEvent.tap(headers[0]!, { eventType: 'catchEvent' });
    await waitFor(() => expect(screen.container.querySelector('.ui-drop-menu-item-open')).not.toBeNull());
    expect(screen.container.querySelector('.ui-overlay')?.getAttribute('style')).toContain('178px');
    fireEvent.tap(screen.container.querySelectorAll('.ui-drop-menu-option')[1]!);
    expect(changes).toEqual([{ value: '0', selectedItem: options[1] }]);
    expect((changes[0] as { selectedItem: unknown }).selectedItem).toBe(options[1]);
    fireEvent.tap(headers[0]!, { eventType: 'catchEvent' });
    await waitFor(() => expect(headers[0]!.classList.contains('ui-drop-menu-item-open')).toBe(true));
    fireEvent.tap(headers[1]!, { eventType: 'catchEvent' });
    await waitFor(() => expect(headers[1]!.classList.contains('ui-drop-menu-item-open')).toBe(true));
    expect(screen.container.querySelectorAll('.ui-drop-menu-item-open').length).toBe(1);
  } finally { cleanup(); mock.mockRestore(); }
});

test('DropMenu stale async open cannot replace a newer item, callback rerenders preserve pending guards and rejected closes keep it open', async () => {
  const mock = geometry(); let resolve: (result: boolean) => void = () => {}; let calls = 0;
  const guard = () => { calls++; return new Promise<boolean>(done => { resolve = done; }); };
  const draw = () => <DropMenu duration={0}><DropMenuItem title="等待确认" options={options} beforeToggle={() => guard()} /><DropMenuItem title="立即打开" options={options} /></DropMenu>;
  try {
    const screen = render(draw());
    const headers = () => screen.container.querySelectorAll('.ui-drop-menu-item');
    fireEvent.tap(headers()[0]!, { eventType: 'catchEvent' });
    screen.rerender(draw());
    fireEvent.tap(headers()[1]!, { eventType: 'catchEvent' });
    await waitFor(() => expect(headers()[1]!.classList.contains('ui-drop-menu-item-open')).toBe(true));
    resolve(true); await Promise.resolve(); await Promise.resolve();
    expect(headers()[0]!.classList.contains('ui-drop-menu-item-open')).toBe(false);
    fireEvent.tap(headers()[0]!, { eventType: 'catchEvent' }); screen.rerender(draw()); resolve(true);
    await waitFor(() => expect(headers()[0]!.classList.contains('ui-drop-menu-item-open')).toBe(true));
    fireEvent.tap(screen.container.querySelector('.ui-overlay')!); resolve(false);
    await Promise.resolve(); await Promise.resolve();
    expect(headers()[0]!.classList.contains('ui-drop-menu-item-open')).toBe(true); expect(calls).toBe(3);
  } finally { cleanup(); mock.mockRestore(); }
});

test('DropMenu exposes imperative controls and custom content, maps fields and ignores disabled/unmounted guard results', async () => {
  const mock = geometry(); const ref = createRef<DropMenuItemRef>(); let accepted: (value: boolean) => void = () => {};
  const selected: unknown[] = []; const mapped = [{ id: 7, text: '映射项', hint: '详情' }];
  try {
    const screen = render(<DropMenu direction="up" topOffset={44} modal={false} duration={0}><DropMenuItem ref={ref} title="菜单" options={mapped} valueKey="id" labelKey="text" tipKey="hint" onChange={event => selected.push(event)} /></DropMenu>);
    ref.current!.open(); await waitFor(() => expect(ref.current!.getShowPop()).toBe(true));
    expect(screen.container.querySelector('.ui-drop-menu-layer-up')?.getAttribute('style')).toContain('130px');
    expect(screen.container.querySelector('.ui-drop-menu-layer-up')?.getAttribute('style')).toContain('top: 44px');
    fireEvent.tap(screen.container.querySelector('.ui-drop-menu-option')!); expect(selected).toEqual([{ value: 7, selectedItem: mapped[0] }]);
    await waitFor(() => expect(ref.current!.getShowPop()).toBe(false));
    screen.rerender(<DropMenu><DropMenuItem ref={ref} title="菜单" beforeToggle={() => new Promise(done => { accepted = done; })}><text>筛选内容</text></DropMenuItem></DropMenu>);
    ref.current!.open();
    screen.rerender(<DropMenu><DropMenuItem ref={ref} title="菜单" disabled><text>筛选内容</text></DropMenuItem></DropMenu>);
    accepted(true); await Promise.resolve(); await Promise.resolve(); expect(ref.current!.getShowPop()).toBe(false);
  } finally { cleanup(); mock.mockRestore(); }
});
