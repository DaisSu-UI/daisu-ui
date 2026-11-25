import { beforeEach, afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { Cascader } from './Cascader.js';
import type { CascaderLazyLoad } from './Cascader.js';
import { cascaderPath, normalizeCascader } from './cascaderModel.js';
beforeEach(() => { const original = lynx.createSelectorQuery.bind(lynx); rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => { const query = original(), select = query.select.bind(query); query.select = selector => selector.startsWith('[react-ref-') ? { invoke: () => ({ exec() {} }) } as unknown as import('@lynx-js/types').NodesRef : select(selector); return query; }); });
afterEach(() => { cleanup(); rstest.restoreAllMocks(); });
const options = [{ value: 1, text: '省', children: [{ value: '1', text: '市' }, { value: 2, text: '禁用', disabled: true }] }];
const catchTap = (element: Parameters<typeof fireEvent>[0]) => fireEvent(element, Object.assign(new Event('catchEvent:tap'), { eventName: 'tap', eventType: 'catchEvent' }));
const select = (screen: Pick<ReturnType<typeof render>, 'container'>, label: string) => fireEvent.tap([...screen.container.querySelectorAll('.ui-cascader-option')].find(e => e.textContent === label)!);
test('Cascader normalizes custom fields without mutating input and uses strict path values', () => {
  const raw = [{ id: 1, name: 'P', items: [{ id: '1', name: 'C', note: 'tip', leaf: true }] }];
  const result = normalizeCascader(raw, { valueKey: 'id', textKey: 'name', childrenKey: 'items', tipKey: 'note', isLeafKey: 'leaf' });
  expect(cascaderPath(result, '1').map(o => o.text)).toEqual(['P', 'C']); expect(cascaderPath(result, [1, 1]).map(o => o.text)).toEqual(['P']); expect(raw[0]).not.toHaveProperty('value');
});
test('Cascader selects a static leaf, ignores disabled nodes, and reports scalar value', async () => {
  const confirm = rstest.fn(); const screen = render(<Cascader visible options={options} onConfirm={confirm} />);
  select(screen, '省'); select(screen, '禁用'); expect(confirm).not.toHaveBeenCalled(); select(screen, '市');
  await waitFor(() => expect(confirm).toHaveBeenCalledWith(expect.objectContaining({ value: '1', selectedOptions: [expect.objectContaining({ value: 1, text: '省' }), expect.objectContaining({ value: '1', text: '市' })] })));
});
test('Cascader strict confirmation can keep a parent; rejected confirmation stays open', async () => {
  const confirm = rstest.fn(), close = rstest.fn(); const screen = render(<Cascader visible options={options} checkStrictly beforeConfirm={() => false} onConfirm={confirm} onClose={close} />);
  select(screen, '省'); catchTap(screen.container.querySelector('.ui-cascader-confirm')!); await Promise.resolve(); await Promise.resolve(); expect(confirm).not.toHaveBeenCalled(); expect(close).not.toHaveBeenCalled();
  screen.rerender(<Cascader visible options={options} checkStrictly onConfirm={confirm} />); catchTap(screen.container.querySelector('.ui-cascader-confirm')!);
  await waitFor(() => expect(confirm).toHaveBeenCalledWith(expect.objectContaining({ value: 1, selectedOptions: [expect.objectContaining({ value: 1, text: '省' })] })));
});
test('Cascader restores lazy paths and emits full paths for leaf selection', async () => {
  const loader: CascaderLazyLoad = (option, _tab, resolve) => resolve(option ? [{ value: 'child', text: '子', isLeaf: true }] : [{ value: 'root', text: '根', isLeaf: false }]);
  const confirm = rstest.fn(); const screen = render(<Cascader visible lazyLoad={loader} value={['root', 'child']} onConfirm={confirm} />);
  await waitFor(() => expect(screen.container.querySelectorAll('.ui-cascader-option').length).toBe(2)); select(screen, '子');
  await waitFor(() => expect(confirm).toHaveBeenCalledWith(expect.objectContaining({ value: ['root', 'child'] })));
});
test('Cascader discards late lazy resolution after close and accepts resolve only once', async () => {
  let resolve!: Parameters<CascaderLazyLoad>[2]; const loader: CascaderLazyLoad = (_option, _tab, done) => { resolve = done; };
  const screen = render(<Cascader visible lazyLoad={loader} />); fireEvent.tap(screen.container.querySelector('.ui-overlay')!);
  resolve([{ value: 'late', text: '过期' }]); await Promise.resolve(); expect(screen.queryByText('过期')).toBeNull();
  screen.rerender(<Cascader visible={false} lazyLoad={loader} />); screen.rerender(<Cascader visible lazyLoad={loader} />);
  resolve([{ value: 1, text: '有效', isLeaf: true }]); resolve([{ value: 2, text: '重复' }]);
  await waitFor(() => expect(screen.getByText('有效')).toBeTruthy()); expect(screen.queryByText('重复')).toBeNull();
});
test('Cascader invalidates pending confirmation on owner replacement and modal cancellation', async () => {
  let resolve!: (allow: boolean) => void; const confirm = rstest.fn(); const beforeConfirm = () => new Promise<boolean>(done => { resolve = done; });
  const screen = render(<Cascader visible value={1} options={options} checkStrictly beforeConfirm={beforeConfirm} onConfirm={confirm} />);
  catchTap(screen.container.querySelector('.ui-cascader-confirm')!); screen.rerender(<Cascader visible value="1" options={options} checkStrictly beforeConfirm={beforeConfirm} onConfirm={confirm} />);
  resolve(true); await Promise.resolve(); await Promise.resolve(); expect(confirm).not.toHaveBeenCalled();
  catchTap(screen.container.querySelector('.ui-cascader-confirm')!); fireEvent.tap(screen.container.querySelector('.ui-overlay')!); resolve(true); await Promise.resolve(); await Promise.resolve(); expect(confirm).not.toHaveBeenCalled();
});
