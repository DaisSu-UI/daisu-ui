import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import { Loading } from './Loading.js';
import { FormFieldContext } from './formContext.js';
import { nearestPickerIndex, normalizePickerColumns, resolvePickerColumns, pickerSelection } from './pickerModel.js';
import type { PickerChange, PickerColumns, PickerFieldNames, PickerOption, PickerValue } from './pickerModel.js';

export type PickerViewProps = PickerFieldNames & {
  value?: readonly PickerValue[]; columns: PickerColumns; cascade?: boolean; itemHeight?: number; visibleItemCount?: number;
  immediateChange?: boolean; disabled?: boolean; loading?: boolean; onChange?: (event: PickerChange) => void;
  onPickStart?: () => void; onPickEnd?: () => void; className?: string; style?: CSSProperties;
};
type ColumnRef = { getIndex: () => number };
const Column = forwardRef<ColumnRef, {
  items: readonly PickerOption[]; index: number; row: number; count: number; disabled: boolean; immediate: boolean;
  onSelect: (index: number) => void; onStart?: () => void; onEnd?: () => void;
}>(function Column({ items, index, row, count, disabled, immediate, onSelect, onStart, onEnd }, handle) {
  const node = useRef<NodesRef>(null), timer = useRef<ReturnType<typeof setTimeout>>(), offset = useRef(Math.max(0, index) * row);
  const dragging = useRef(false), moving = useRef(false), target = useRef<number | null>(null), selected = useRef(index);
  const scrollTo = (next: number, smooth: boolean) => { 'background only'; target.current = next * row; offset.current = next * row; node.current?.invoke({ method: 'scrollTo', params: { offset: next * row, smooth } }).exec(); };
  useEffect(() => {
    clearTimeout(timer.current); dragging.current = false; moving.current = false; selected.current = index;
    scrollTo(Math.max(0, index), false);
    return () => clearTimeout(timer.current);
  }, [items, row, disabled]);
  useEffect(() => { if (selected.current !== index) { selected.current = index; scrollTo(Math.max(0, index), false); } }, [index]);
  useImperativeHandle(handle, () => ({ getIndex: () => nearestPickerIndex(items, offset.current / row) }), [items, row]);
  const end = () => { 'background only'; if (moving.current) { moving.current = false; onEnd?.(); } };
  const settle = (smooth = true) => {
    'background only'; clearTimeout(timer.current);
    if (disabled) return;
    const next = nearestPickerIndex(items, offset.current / row);
    if (next >= 0) { scrollTo(next, smooth); if (selected.current !== next) { selected.current = next; onSelect(next); } }
    end();
  };
  return <scroll-view ref={node} className="ui-picker-column" scroll-orientation="vertical" scroll-bar-enable={false} enable-scroll={!disabled} bounces={false} enable-nested-scroll force-can-scroll initial-scroll-offset={Math.max(0, index) * row}
    bindtouchstart={() => { 'background only'; if (disabled) return; clearTimeout(timer.current); target.current = null; dragging.current = true; }}
    bindtouchend={() => { 'background only'; dragging.current = false; if (immediate) settle(false); else timer.current = setTimeout(() => settle(), 160); }}
    bindtouchcancel={() => { 'background only'; dragging.current = false; settle(false); }}
    bindscroll={event => {
      'background only'; if (disabled) return;
      offset.current = event.detail.scrollTop;
      if (target.current !== null) { if (Math.abs(offset.current - target.current) < .5) target.current = null; return; }
      if (!moving.current) { moving.current = true; onStart?.(); }
      clearTimeout(timer.current);
      if (!dragging.current) timer.current = setTimeout(() => settle(), 160);
    }}
    bindscrollend={() => { 'background only'; if (target.current !== null) { target.current = null; return; } if (!dragging.current) settle(); }}>
    <view style={{ paddingTop: `${(count - 1) * row / 2}px`, paddingBottom: `${(count - 1) * row / 2}px` }}>
      {items.map((item, i) => <view key={`${typeof item.value}:${item.value}:${i}`} className={`ui-picker-option ${i === index ? 'ui-picker-option-selected' : ''} ${item.disabled ? 'ui-picker-option-disabled' : ''}`} style={{ height: `${row}px` }} bindtap={() => {
        'background only'; if (disabled || item.disabled) return;
        clearTimeout(timer.current); selected.current = i; scrollTo(i, true); if (i !== index) onSelect(i); end();
      }}><text text-maxline="1">{item.label}</text></view>)}
    </view>
  </scroll-view>;
});
export type PickerViewRef = {
  getSelected: () => PickerChange; getSelectedOptions: () => PickerOption[]; getSelectedValues: () => PickerValue[];
  getSelectedLabels: () => string[]; getSelectedIndex: () => number[]; getColumnsData: () => readonly (readonly PickerOption[])[];
  getColumnData: (index: number) => readonly PickerOption[]; getColumnIndex: (index: number) => number; resetColumns: (columns: PickerColumns) => void;
};
export const PickerView = forwardRef<PickerViewRef, PickerViewProps>(function PickerView({ value, columns, cascade = false, itemHeight = 44, visibleItemCount = 6, valueKey, labelKey, childrenKey, immediateChange = false, disabled: disabledProp, loading = false, onChange, onPickStart, onPickEnd, className = '', style }, ref) {
  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const [inner, setInner] = useState<PickerValue[]>([]), [override, setOverride] = useState<{ source: PickerColumns; columns: PickerColumns }>();
  const columnRefs = useRef<(ColumnRef | null)[]>([]), current = value ?? inner, source = override?.source === columns ? override.columns : columns;
  const row = Number.isFinite(itemHeight) ? Math.max(1, itemHeight) : 44, count = Number.isFinite(visibleItemCount) ? Math.max(1, Math.trunc(visibleItemCount)) : 6;
  const model = useMemo(() => ({ columns: source, value: current, cascade, valueKey, labelKey, childrenKey }), [source, current, cascade, valueKey, labelKey, childrenKey]);
  const selection = useMemo(() => pickerSelection(model), [model]);
  const normalized = useMemo(() => normalizePickerColumns(source, { valueKey, labelKey, childrenKey }), [source, valueKey, labelKey, childrenKey]);
  const data = useMemo(() => resolvePickerColumns(normalized, current, cascade), [normalized, current, cascade]);
  const read = () => {
    const values = data.flatMap((items, index) => {
      const item = items[columnRefs.current[index]?.getIndex() ?? selection.selectedIndexes[index]!]; return item ? [item.value] : [];
    });
    return pickerSelection({ ...model, value: values });
  };
  useImperativeHandle(ref, () => ({ getSelected: read, getSelectedOptions: () => read().selectedOptions, getSelectedValues: () => read().value, getSelectedLabels: () => read().selectedLabels, getSelectedIndex: () => read().selectedIndexes, getColumnsData: () => data, getColumnData: index => data[index] ?? [], getColumnIndex: index => read().selectedIndexes[index] ?? -1, resetColumns: next => setOverride({ source: columns, columns: next }) }), [model, selection, data, columns]);
  const padding = (count - 1) * row / 2;
  return <view className={`ui-picker-view ${className}`} style={{ height: `${row * count}px`, ...style }}>
    <view className="ui-picker-indicator" style={{ top: `${padding}px`, height: `${row}px` }} pointer-events="none" />
    <view className="ui-picker-columns">{data.map((items, column) => <Column key={column} ref={node => { columnRefs.current[column] = node; }} items={items} index={selection.selectedIndexes[column] ?? -1} row={row} count={count} disabled={disabled || loading} immediate={immediateChange} onStart={onPickStart} onEnd={onPickEnd} onSelect={index => {
      'background only'; const next = [...selection.value]; next[column] = items[index]!.value; if (cascade) next.splice(column + 1);
      const result = pickerSelection({ ...model, value: next }, data.length === 1 ? index : column);
      if (value === undefined) setInner(result.value); onChange?.(result);
    }} />)}</view>
    <view className="ui-picker-fade ui-picker-fade-top" style={{ height: `${padding}px` }} pointer-events="none" /><view className="ui-picker-fade ui-picker-fade-bottom" style={{ height: `${padding}px` }} pointer-events="none" />
    {loading ? <view className="ui-picker-view-loading"><Loading /></view> : null}
  </view>;
});
