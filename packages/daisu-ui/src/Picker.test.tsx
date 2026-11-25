import { beforeEach, afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { Picker, pickerSelection } from './Picker.js';
beforeEach(() => { const original = lynx.createSelectorQuery.bind(lynx); rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => { const query = original(), select = query.select.bind(query); query.select = selector => selector.startsWith('[react-ref-') ? { invoke: () => ({ exec() {} }) } as unknown as import('@lynx-js/types').NodesRef : select(selector); return query; }); });
afterEach(() => { cleanup(); rstest.restoreAllMocks(); });
const columns = [{ value: 1, label: '禁用', disabled: true }, { value: '1', label: '可用' }];
test('Picker resolves strict values, skips disabled options, and recomputes cascading descendants', () => {
  expect(pickerSelection({ columns, value: [1] }).value).toEqual(['1']);
  const tree = [{value:'a',label:'A',children:[{value:'a1',label:'A1'}]},{value:'b',label:'B',children:[{value:'b1',label:'B1'}]}];
  expect(pickerSelection({columns:tree,value:['b','a1'],cascade:true}).value).toEqual(['b','b1']);
});
test('Picker cancels an outstanding confirmation immediately on modal close', async () => {
  let resolve!: (allowed: boolean) => void, confirms = 0, closed = 0;
  const screen = render(<Picker visible columns={columns} beforeConfirm={()=>new Promise(r=>{resolve=r;})} onConfirm={()=>{confirms++;}} onClose={()=>{closed++;}} />);
  fireEvent.tap(screen.container.querySelector('.ui-picker-confirm')!);
  fireEvent.tap(screen.container.querySelector('.ui-overlay')!);
  resolve(true);
  await Promise.resolve(); await Promise.resolve();
  expect(closed).toBe(1); expect(confirms).toBe(0);
  screen.rerender(<Picker visible columns={columns} onConfirm={()=>{confirms++;}} />);
  fireEvent.tap(screen.container.querySelector('.ui-picker-confirm')!);
  await waitFor(()=>expect(confirms).toBe(1));
});

test('Picker only commits after successful confirmation and reports modal cancellation', async () => {
  let changes = 0, confirms = 0, cancels = 0;
  const screen = render(<Picker visible columns={columns} beforeConfirm={() => false} onChange={() => changes++} onConfirm={() => confirms++} onCancel={() => cancels++} />);
  fireEvent.tap(screen.container.querySelector('.ui-picker-confirm')!); await Promise.resolve(); await Promise.resolve();
  expect(changes).toBe(0); expect(confirms).toBe(0);
  fireEvent.tap(screen.container.querySelector('.ui-overlay')!); expect(cancels).toBe(1);
});

test('Picker invalidates asynchronous confirmation when the owner replaces its value', async () => {
  let resolve!: (allow: boolean) => void, confirms = 0;
  const options = ['a', 'b'], beforeConfirm = () => new Promise<boolean>(r => { resolve = r; });
  const screen = render(<Picker visible columns={options} value={['a']} beforeConfirm={beforeConfirm} onConfirm={() => confirms++} />);
  fireEvent.tap(screen.container.querySelector('.ui-picker-confirm')!);
  screen.rerender(<Picker visible columns={options} value={['b']} beforeConfirm={beforeConfirm} onConfirm={() => confirms++} />);
  resolve(true); await Promise.resolve(); await Promise.resolve(); expect(confirms).toBe(0);
});
