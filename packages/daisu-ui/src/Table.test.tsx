import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Table } from './Table.js';
import { tableOffsets, tableRange, tableSpan } from './tableModel.js';
const data = [{ id: 1, name: '关羽', score: 66 }, { id: 2, name: '刘备', score: 68 }, { id: 3, name: '赵云', score: 91 }];
const columns = [{ prop: 'name', label: '姓名', fixed: true, sortable: true }, { prop: 'score', label: '分数', sortable: true }] as const;
afterEach(cleanup);
// Runtime accepts NodesRef for native scroll-view (the helper declaration omits this overload).
function scroll(scrollTop: number) { fireEvent(lynx.createSelectorQuery().select('.ui-table-vertical') as unknown as Element, Object.assign(new Event('bindEvent:scroll'), { eventType: 'bindEvent', eventName: 'scroll', detail: { scrollTop } })); }
test('Table sort cycles include reset, clear the previous column and leave data ownership to the caller', () => {
  const sort = rstest.fn(), click = rstest.fn();
  const screen = render(<Table data={data} columns={columns} onSortMethod={sort} onRowClick={click} />);
  const buttons = [screen.getByText('姓名').parentElement!, screen.getByText('分数').parentElement!];
  fireEvent.tap(buttons[0]!); expect(sort).toHaveBeenLastCalledWith(expect.objectContaining({ prop: 'name', sortDirection: 1 }));
  fireEvent.tap(buttons[0]!); expect(sort).toHaveBeenLastCalledWith(expect.objectContaining({ sortDirection: -1 }));
  fireEvent.tap(buttons[0]!); expect(sort).toHaveBeenLastCalledWith(expect.objectContaining({ sortDirection: 0 }));
  fireEvent.tap(buttons[0]!); fireEvent.tap(buttons[1]!);
  expect(buttons[0]!.className).not.toContain('ui-sort-button-active');
  expect(sort).toHaveBeenLastCalledWith(expect.objectContaining({ prop: 'score', sortDirection: 1 }));
  fireEvent.tap(screen.container.querySelector('[data-rowindex="2"]')!); expect(click).toHaveBeenCalledWith({ rowIndex: 2 });
  expect(data[0]!.id).toBe(1);
});
test('Table renders span geometry once, hides covered cells and keeps index/custom slots and options', () => {
  const screen = render(<Table data={data} columns={columns} index={{ width: 60 }} spanMethod={({ rowIndex, columnIndex }) => rowIndex === 0 ? columnIndex === 0 ? [2, 2] : [0, 0] : rowIndex === 1 && columnIndex < 2 ? [0, 0] : undefined} />);
  const cell = screen.container.querySelector('[data-rowindex="0"]')!;
  expect(cell.getAttribute('style')).toContain('width: 160px');
  expect(cell.getAttribute('style')).toContain('height: 88px');
  expect(screen.container.querySelectorAll('[data-rowindex="0"]')).toHaveLength(1);
  screen.rerender(<Table data={data.slice(1)} columns={[{ prop: 'id', render: ({ row, index }) => `行${index}:${row.name}` }]} showHeader={false} stripe={false} border={false} />);
  expect(screen.getByText('行0:刘备')).toBeTruthy();
  expect(screen.container.querySelector('.ui-table-header')).toBeNull();
  expect(screen.container.querySelector('.ui-table-stripe')).toBeNull();
  expect(screen.container.querySelector('.ui-table-border')).toBeNull();
});
test('Table virtual mode bounds mounted nodes and reports absolute row indexes at the last row', () => {
  const rows = Array.from({ length: 10000 }, (_, id) => ({ id, name: `士兵${id}`, score: id })), click = rstest.fn();
  const screen = render(<Table data={rows} columns={columns} height={400} rowHeight={50} virtual onRowClick={click} rowKey="id" />);
  expect(screen.container.querySelectorAll('.ui-table-cell').length).toBeLessThan(40);
  scroll(500000);
  expect(screen.getByText('士兵9999')).toBeTruthy();
  expect(screen.container.querySelectorAll('.ui-table-cell').length).toBeLessThan(40);
  fireEvent.tap(screen.container.querySelector('[data-rowindex="9999"]')!); expect(click).toHaveBeenCalledWith({ rowIndex: 9999 });
  screen.rerender(<Table data={rows.slice(0, 2)} columns={columns} height={400} virtual rowHeight={50} />);
  expect(screen.getByText('士兵1')).toBeTruthy();
});
test('Table uses the configured padding for measured rows and reacts without another content layout', () => {
  const props = { data: data.slice(0, 1), columns: [{ prop: 'name' as const }], showHeader: false, rowHeight: 1 };
  const screen = render(<Table {...props} />);
  const content = screen.container.querySelector('.ui-table-content')!;
  fireEvent(content, Object.assign(new Event('bindEvent:layoutchange'), { eventType: 'bindEvent', eventName: 'layoutchange', detail: { height: 20 } }));
  expect(screen.container.querySelector('[data-rowindex="0"]')!.getAttribute('style')).toContain('height: 44px');
  screen.rerender(<Table {...props} cellPadding={0} />);
  expect(screen.container.querySelector('[data-rowindex="0"]')!.getAttribute('style')).toContain('height: 20px');
  screen.rerender(<Table {...props} cellPadding={[8, 10]} />);
  expect(screen.container.querySelector('[data-rowindex="0"]')!.getAttribute('style')).toContain('height: 36px');
});
test('Table span and viewport calculations handle empty data, clipping and invalid values', () => {
  expect(tableOffsets([60, 100, 160])).toEqual([0, 60, 160, 320]);
  expect(tableSpan([8, 9], 1, 1, 3, 3)).toEqual({ rowspan: 2, colspan: 2 });
  expect(tableSpan({ rowspan: NaN, colspan: -1 }, 0, 0, 3, 3)).toEqual({ rowspan: 1, colspan: 0 });
  expect(tableRange(0, 0, 400, 44, 5)).toEqual({ start: 0, end: 0 });
  expect(tableRange(10000, 499950, 356, 50, 5)).toEqual({ start: 9994, end: 10000 });
});
