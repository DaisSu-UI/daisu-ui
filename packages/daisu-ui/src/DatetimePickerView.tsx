import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { PickerView } from './PickerView.js';
import type { PickerViewRef } from './PickerView.js';
import type { PickerOption } from './pickerModel.js';
import { datetimeModel } from './datetimePickerModel.js';
import type { DatetimeColumn, DatetimeModelProps, DatetimePickerValue } from './datetimePickerModel.js';
export type DatetimePickerChange = { value: DatetimePickerValue; columns: DatetimeColumn[]; selectedOptions: PickerOption[] };
export type DatetimePickerViewProps = DatetimeModelProps & {
  disabled?: boolean; loading?: boolean; itemHeight?: number; visibleItemCount?: number; immediateChange?: boolean;
  onChange?: (event: DatetimePickerChange) => void; onPickStart?: () => void; onPickEnd?: () => void; className?: string; style?: CSSProperties;
};
export type DatetimePickerViewRef = {
  getSelected: () => DatetimePickerChange; getSelectedOptions: () => PickerOption[]; correctValue: (value: DatetimePickerValue) => DatetimePickerValue; getOriginColumns: () => DatetimeColumn[];
};
export const DatetimePickerView = forwardRef<DatetimePickerViewRef, DatetimePickerViewProps>(function DatetimePickerView(props, ref) {
  const [inner, setInner] = useState<DatetimePickerValue>(''), value = props.value ?? inner;
  const { type, minDate, maxDate, minHour, maxHour, minMinute, maxMinute, minSecond, maxSecond, useSecond, boundaryMinDate, boundaryMaxDate, formatter, filter, columnFormatter } = props;
  const modelProps = useMemo(() => ({ value, type, minDate, maxDate, minHour, maxHour, minMinute, maxMinute, minSecond, maxSecond, useSecond, boundaryMinDate, boundaryMaxDate, formatter, filter, columnFormatter }), [value, type, minDate, maxDate, minHour, maxHour, minMinute, maxMinute, minSecond, maxSecond, useSecond, boundaryMinDate, boundaryMaxDate, formatter, filter, columnFormatter]);
  const data = useMemo(() => datetimeModel(modelProps), [modelProps]), picker = useRef<PickerViewRef>(null), callback = useRef(props.onChange); callback.current = props.onChange;
  const event = (model: ReturnType<typeof datetimeModel>): DatetimePickerChange => ({ value: model.value, columns: model.origin, selectedOptions: model.selectedOptions });
  useEffect(() => {
    if (value !== data.value) { if (props.value === undefined) setInner(data.value); callback.current?.(event(data)); }
  }, [value, data, props.value]);
  const read = () => { 'background only'; return datetimeModel(modelProps, picker.current?.getSelectedValues()); };
  useImperativeHandle(ref, () => ({ getSelected: () => { 'background only'; return event(read()); }, getSelectedOptions: () => { 'background only'; return read().selectedOptions; }, correctValue: next => datetimeModel({ ...modelProps, value: next }).value, getOriginColumns: () => data.origin.map(column => ({ ...column, values: [...column.values] })) }), [modelProps, data]);
  return <PickerView ref={picker} columns={data.columns} value={data.values} disabled={props.disabled} loading={props.loading} itemHeight={props.itemHeight} visibleItemCount={props.visibleItemCount} immediateChange={props.immediateChange} onPickStart={props.onPickStart} onPickEnd={props.onPickEnd} className={`ui-datetime-picker-view ${props.className ?? ''}`} style={props.style} onChange={selection => {
    'background only'; const next = datetimeModel(modelProps, selection.value); if (props.value === undefined) setInner(next.value); callback.current?.(event(next));
  }} />;
});
