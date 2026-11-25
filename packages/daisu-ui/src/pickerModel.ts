export type PickerValue = string | number;
export type PickerOption = { value: PickerValue; label: string; disabled?: boolean; children?: readonly PickerOption[] };
export type PickerColumnItem = PickerValue | PickerOption | Readonly<Record<string, unknown>>;
export type PickerColumns = readonly PickerColumnItem[] | readonly (readonly PickerColumnItem[])[];
export type PickerFieldNames = { valueKey?: string; labelKey?: string; childrenKey?: string };
export type PickerChange = {
  value: PickerValue[];
  selectedItems: PickerOption[];
  selectedValues: PickerValue[];
  selectedOptions: PickerOption[];
  selectedLabels: string[];
  selectedIndexes: number[];
  columnIndex: number;
};
export function normalizePickerColumns(columns: PickerColumns, fields: PickerFieldNames = {}): readonly (readonly PickerOption[])[] {
  const { valueKey = 'value', labelKey = 'label', childrenKey = 'children' } = fields;
  const normalize = (items: readonly PickerColumnItem[]): PickerOption[] => items.flatMap(item => {
    if (typeof item === 'string' || typeof item === 'number') return [{ value: item, label: String(item) }];
    const record = item as Readonly<Record<string, unknown>>, value = record[valueKey];
    if (typeof value !== 'string' && typeof value !== 'number') return [];
    return [{ ...record, value, label: String(record[labelKey] ?? value), disabled: !!record.disabled, children: Array.isArray(record[childrenKey]) ? normalize(record[childrenKey] as PickerColumnItem[]) : undefined }];
  });
  return Array.isArray(columns[0]) ? (columns as readonly (readonly PickerColumnItem[])[]).map(normalize) : [normalize(columns as readonly PickerColumnItem[])];
}
export function nearestPickerIndex(items: readonly PickerOption[], position: number): number {
  if (!items.length) return -1;
  const target = Math.max(0, Math.min(items.length - 1, Math.round(position)));
  for (let distance = 0; distance < items.length; distance++) {
    if (items[target + distance] && !items[target + distance]!.disabled) return target + distance;
    if (items[target - distance] && !items[target - distance]!.disabled) return target - distance;
  }
  return -1;
}
export function pickerColumns(columns: PickerColumns, value: readonly PickerValue[], cascade = false, fields: PickerFieldNames = {}): readonly (readonly PickerOption[])[] {
  return resolvePickerColumns(normalizePickerColumns(columns, fields), value, cascade);
}
export function resolvePickerColumns(normalized: readonly (readonly PickerOption[])[], value: readonly PickerValue[], cascade: boolean): readonly (readonly PickerOption[])[] {
  if (!cascade) return normalized;
  const result: (readonly PickerOption[])[] = [];
  let items = normalized[0] ?? [];
  while (items.length) {
    const index = items.findIndex(item => item.value === value[result.length] && !item.disabled);
    result.push(items);
    items = items[index < 0 ? nearestPickerIndex(items, 0) : index]?.children ?? [];
  }
  return result;
}
export function pickerSelection(props: PickerFieldNames & { columns: PickerColumns; value?: readonly PickerValue[]; cascade?: boolean }, columnIndex = -1): PickerChange {
  const columns = pickerColumns(props.columns, props.value ?? [], props.cascade, props);
  const selectedIndexes = columns.map((items, index) => {
    const found = items.findIndex(item => item.value === props.value?.[index] && !item.disabled);
    return found < 0 ? nearestPickerIndex(items, 0) : found;
  });
  const selectedOptions = columns.flatMap((items, index) => items[selectedIndexes[index]!] ? [items[selectedIndexes[index]!]!] : []);
  const value = selectedOptions.map(item => item.value);
  return { value, selectedItems: selectedOptions, selectedValues: value, selectedOptions, selectedLabels: selectedOptions.map(item => item.label), selectedIndexes, columnIndex };
}
