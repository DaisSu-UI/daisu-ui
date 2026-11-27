import { useLocale } from './useLocale.js';
import { useMainThreadRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, MainThread } from '@lynx-js/types';
import { SortButton } from './SortButton.js';
import type { SortButtonValue } from './SortButton.js';
import { tableOffsets, tableRange, tableSpan } from './tableModel.js';
import type { TableSpan } from './tableModel.js';

export type TableColumn<T> = {
  prop: keyof T & string; label?: string; width?: number | string; sortable?: boolean; fixed?: boolean; align?: 'left' | 'center' | 'right';
  render?: (scope: { row: T; index: number }) => ReactNode;
};
export type TableSortEvent<T> = Omit<TableColumn<T>, 'render'> & { sortDirection: SortButtonValue };
export type TableSpanScope<T> = { row: T; column: TableColumn<T>; rowIndex: number; columnIndex: number };
export type TableProps<T> = {
  data: readonly T[]; columns: readonly TableColumn<T>[]; border?: boolean; stripe?: boolean; height?: number | string; rowHeight?: number;
  showHeader?: boolean; ellipsis?: boolean; index?: boolean | Partial<TableColumn<T>>; fixedHeader?: boolean;
  /** Cell padding in px: one value or [vertical, horizontal]. */
  cellPadding?: number | readonly [number, number];
  spanMethod?: (scope: TableSpanScope<T>) => TableSpan | readonly number[] | void;
  virtual?: boolean; buffer?: number; rowKey?: keyof T | ((row: T, index: number) => string | number);
  onSortMethod?: (column: TableSortEvent<T>) => void; onRowClick?: (event: { rowIndex: number }) => void;
  className?: string; style?: CSSProperties;
};
const length = (value: number | string) => typeof value === 'number' ? `${Math.max(0, value)}px` : value;
/** Bounded tables use native scroll-views; virtual mode mounts only a buffered row window. */
export function Table<T>({ data, columns, border = true, stripe = true, height, rowHeight = 44, showHeader = true, ellipsis = false, index = false, fixedHeader = true, cellPadding, spanMethod, virtual = false, buffer = 5, rowKey, onSortMethod, onRowClick, className = '', style }: TableProps<T>) {
  const { t: localeText } = useLocale();

  const padding = typeof cellPadding === 'number' ? [cellPadding, cellPadding] : cellPadding;
  const paddingY = Number.isFinite(padding?.[0]) ? Math.max(0, padding![0]!) : 12;
  const paddingX = Number.isFinite(padding?.[1]) ? Math.max(0, padding![1]!) : 16;
  const paddingStyle = cellPadding === undefined ? {} : { padding: `${paddingY}px ${paddingX}px` };
  const [widths, setWidths] = useState<Record<string, number>>({}), [viewportHeight, setViewportHeight] = useState(400);
  const [measurements, setMeasurements] = useState<Record<string, number>>({}), [top, setTop] = useState(0);
  const [sort, setSort] = useState<{ prop: string; value: SortButtonValue }>({ prop: '', value: 0 });
  const fixedHead = useMainThreadRef<MainThread.Element | null>(null), fixedBody = useMainThreadRef<MainThread.Element | null>(null);
  const scrollOffset = useMainThreadRef(0);
  const cols: TableColumn<T>[] = index ? [{ prop: '__index' as keyof T & string, label: localeText('table.index'), width: '13.333333vw', ...typeof index === 'object' ? index : {}, render: ({ index: i }) => i + 1 }, ...columns] : [...columns];
  const sizes = cols.map((col, i) => widths[`${i}:${col.width ?? 100}`] ?? (typeof col.width === 'number' ? col.width : 100));
  const x = tableOffsets(sizes), totalWidth = x[x.length - 1]!;
  const minimum = Number.isFinite(rowHeight) && rowHeight > 0 ? rowHeight : 44;
  const keyFor = (row: T, i: number) => typeof rowKey === 'function' ? rowKey(row, i) : rowKey ? String(row[rowKey]) : i;
  const measureKey = (row: T, i: number, col: TableColumn<T>, j: number) => `${keyFor(row, i)}:${j}:${col.prop}`;
  const virtualized = virtual && height !== undefined;
  // Span metadata is evaluated once per cell and used by layout and rendering.
  const spans = !virtualized && spanMethod ? data.map((row, i) => cols.map((column, j) => tableSpan(spanMethod({ row, column, rowIndex: i, columnIndex: j }), i, j, data.length, cols.length))) : undefined;
  const rowSizes = virtualized ? [] : data.map((row, i) => Math.max(minimum, ...cols.map((col, j) => {
    const span = spans?.[i]?.[j];
    const measured = measurements[measureKey(row, i, col, j)];
    return span && (span.rowspan !== 1 || span.colspan === 0) ? minimum : measured === undefined ? minimum : measured + paddingY * 2;
  })));
  // A spanning cell can grow its covered rows without changing neighbouring alignment.
  spans?.forEach((row, i) => row.forEach((span, j) => {
    if (span.rowspan <= 1 || !span.colspan) return;
    const measured = measurements[measureKey(data[i]!, i, cols[j]!, j)];
    const required = measured === undefined ? minimum : measured + paddingY * 2;
    const available = rowSizes.slice(i, i + span.rowspan).reduce((sum, size) => sum + size, 0);
    if (required > available) rowSizes[i + span.rowspan - 1]! += required - available;
  }));
  const y = tableOffsets(rowSizes), bodyHeight = virtualized ? data.length * minimum : y[y.length - 1]!;
  const headerHeight = showHeader ? 44 : 0, fixed = showHeader && fixedHeader;
  const contentHeight = bodyHeight + (fixed ? 0 : headerHeight);
  const visibleHeight = height === undefined ? bodyHeight + headerHeight : Math.min(viewportHeight, bodyHeight + headerHeight);
  const bodyViewport = Math.max(0, visibleHeight - (fixed ? headerHeight : 0));
  const range = virtualized ? tableRange(data.length, top, bodyViewport, minimum, buffer) : { start: 0, end: data.length };
  const lastFixed = cols.reduce((last, col, i) => col.fixed ? i : last, -1);
  const onHorizontal = (event: { detail: { scrollLeft: number } }) => {
    'main thread';
    const offset = Math.max(0, event.detail.scrollLeft);
    scrollOffset.current = offset;
    fixedHead.current?.setStyleProperty('transform', `translateX(${offset}px)`);
    fixedBody.current?.setStyleProperty('transform', `translateX(${offset}px)`);
    fixedHead.current?.setStyleProperty('box-shadow', offset > 0 ? '10px 0 12px -12px rgba(0,0,0,0.2)' : 'none');
    fixedBody.current?.setStyleProperty('box-shadow', offset > 0 ? '10px 0 12px -12px rgba(0,0,0,0.2)' : 'none');
  };
  const restore = (event: MainThread.LayoutChangeEvent) => {
    'main thread';
    event.currentTarget.setStyleProperty('transform', `translateX(${scrollOffset.current}px)`);
  };
  const text = (value: ReactNode) => typeof value === 'string' || typeof value === 'number' ? <text className="ui-table-value" text-maxline={ellipsis ? '2' : undefined}>{value}</text> : value;
  const cellClass = (col: TableColumn<T>, i: number, j: number, header = false) => `ui-table-cell ui-table-${col.align ?? 'left'} ${border ? 'ui-table-cell-border' : ''} ${stripe && (header || i % 2 === 1) ? 'ui-table-stripe' : ''} ${j === cols.length - 1 ? 'ui-table-last-column' : ''} ${!header && i === data.length - 1 ? 'ui-table-last-row' : ''}`;
  const borders = border ? <view className="ui-table-borders" /> : null;
  const headers = (pinned: boolean) => cols.map((col, j) => Boolean(col.fixed) === pinned ? <view key={col.prop} className={`${cellClass(col, 0, j, true)} ui-table-header-cell`} style={{ ...paddingStyle, left: `${x[j]}px`, width: `${sizes[j]}px`, height: '44px' }}>
    {borders}{col.sortable ? <SortButton title={col.label} value={sort.prop === col.prop ? sort.value : 0} allowReset onChange={({ value }) => {
      'background only';
      setSort({ prop: col.prop, value });
      const { render: _render, ...column } = col;
      onSortMethod?.({ width: 100, sortable: false, fixed: false, align: 'left', ...column, sortDirection: value });
    }} /> : text(col.label ?? '')}
  </view> : null);
  const cells = (pinned: boolean) => data.slice(range.start, range.end).map((row, local) => {
    const i = range.start + local;
    return cols.map((col, j) => {
      if (Boolean(col.fixed) !== pinned) return null;
      const span = spans?.[i]?.[j] ?? { rowspan: 1, colspan: 1 };
      if (!span.rowspan || !span.colspan) return null;
      const cellHeight = virtualized ? minimum : y[i + span.rowspan]! - y[i]!;
      const key = measureKey(row, i, col, j);
      return <view key={key} className={`${cellClass(col, i, j + span.colspan - 1)} ${i + span.rowspan === data.length ? 'ui-table-last-row' : ''}`} data-rowindex={i} data-column={col.prop} style={{ ...paddingStyle, left: `${x[j]}px`, top: `${(virtualized ? i * minimum : y[i]!) + (!fixed ? headerHeight : 0)}px`, width: `${x[j + span.colspan]! - x[j]!}px`, height: `${cellHeight}px` }} bindtap={() => { 'background only'; onRowClick?.({ rowIndex: i }); }}>
        {borders}<view className="ui-table-content" bindlayoutchange={virtualized ? undefined : event => {
          'background only';
          // The content wrapper is the only measurement boundary; descendants may bubble.
          if (event.target.uid !== event.currentTarget.uid) return;
          const needed = Math.ceil(event.detail.height);
          setMeasurements(previous => previous[key] === needed ? previous : { ...previous, [key]: needed });
        }}>{text(col.render ? col.render({ row, index: i }) : String(row[col.prop] ?? ''))}</view>
      </view>;
    });
  });
  const fixedStyle: CSSProperties = { width: `${lastFixed >= 0 ? x[lastFixed + 1] : 0}px`, height: '100%' };
  const header = <view className="ui-table-header" style={{ height: `${headerHeight}px` }}>{headers(false)}<view className="ui-table-fixed" style={fixedStyle} main-thread:ref={fixedHead} main-thread:bindlayoutchange={restore}>{headers(true)}</view></view>;
  return <view className={`ui-table ${border ? 'ui-table-border' : ''} ${className}`} style={style}>
    <view className="ui-table-measures" style={{ height: '0px' }}>{cols.map((col, j) => <view key={`${j}:${col.width ?? 100}`} className="ui-table-measure" style={{ width: length(col.width ?? 100), height: '0px' }} bindlayoutchange={event => { 'background only'; const width = event.detail.width, key = `${j}:${col.width ?? 100}`; if (width > 0) setWidths(previous => previous[key] === width ? previous : { ...previous, [key]: width }); }} />)}</view>
    {height !== undefined ? <view className="ui-table-measure" style={{ width: '0px', height: length(height) }} bindlayoutchange={event => { 'background only'; setViewportHeight(Math.max(0, event.detail.height)); }} /> : null}
    <scroll-view className="ui-table-horizontal" scroll-orientation="horizontal" bounces={false} main-thread:bindscroll={onHorizontal} style={{ zIndex: 0, height: `${visibleHeight}px`, width: '100%' }}>
      <view style={{ width: `${totalWidth}px`, height: `${visibleHeight}px` }}>
        {fixed ? header : null}
        <scroll-view className="ui-table-vertical" scroll-orientation="vertical" enable-scroll={height !== undefined} enable-nested-scroll bounces={false} style={{ zIndex: 0, width: `${totalWidth}px`, height: `${bodyViewport}px` }} bindscroll={virtualized ? event => { 'background only'; const next = Math.max(0, event.detail.scrollTop); setTop(previous => Math.floor(previous / minimum) === Math.floor(next / minimum) ? previous : next); } : undefined}>
          <view className="ui-table-body" style={{ height: `${contentHeight}px`, width: `${totalWidth}px` }}>
            {!fixed && showHeader ? header : null}{cells(false)}
            <view className="ui-table-fixed" style={fixedStyle} main-thread:ref={fixedBody} main-thread:bindlayoutchange={restore}>{cells(true)}</view>
          </view>
        </scroll-view>
      </view>
    </scroll-view>
  </view>;
}
