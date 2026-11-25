export type CascaderScalar = string | number;
export type CascaderValue = CascaderScalar | readonly CascaderScalar[];
export type CascaderOption = { value: CascaderScalar; text: string; children?: readonly CascaderOption[]; disabled?: boolean; tip?: string; isLeaf?: boolean; [key: string]: unknown };
export type CascaderFields = { valueKey?: string; textKey?: string; childrenKey?: string; tipKey?: string; isLeafKey?: string };
export type CascaderInput = CascaderOption | Readonly<Record<string, unknown>>;
export function normalizeCascader(options: readonly CascaderInput[], fields: CascaderFields): CascaderOption[] {
  const { valueKey = 'value', textKey = 'text', childrenKey = 'children', tipKey = 'tip', isLeafKey = 'isLeaf' } = fields;
  return options.flatMap(option => {
    const value = option[valueKey];
    if (typeof value !== 'string' && typeof value !== 'number') return [];
    const children = option[childrenKey];
    return [{ ...option, value, text: String(option[textKey] ?? value), tip: option[tipKey] === undefined ? undefined : String(option[tipKey]), isLeaf: option[isLeafKey] === undefined ? undefined : !!option[isLeafKey], disabled: !!option.disabled, children: Array.isArray(children) ? normalizeCascader(children, fields) : undefined }];
  });
}
export function cascaderPath(options: readonly CascaderOption[], value: CascaderValue | undefined): CascaderOption[] {
  if (Array.isArray(value)) {
    const path: CascaderOption[] = []; let level = options;
    for (const key of value) { const option = level.find(item => item.value === key); if (!option) break; path.push(option); level = option.children ?? []; }
    return path;
  }
  for (const option of options) { if (option.value === value) return [option]; const children = cascaderPath(option.children ?? [], value); if (children.length) return [option, ...children]; }
  return [];
}
