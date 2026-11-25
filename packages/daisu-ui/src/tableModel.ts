export type TableSpan = { rowspan: number; colspan: number };
export function tableSpan(value: TableSpan | readonly number[] | void, row: number, col: number, rows: number, cols: number): TableSpan {
  const r = Array.isArray(value) ? value[0] : (value as TableSpan | undefined)?.rowspan;
  const c = Array.isArray(value) ? value[1] : (value as TableSpan | undefined)?.colspan;
  const clean = (n: number | undefined, remaining: number) => n === undefined ? 1 : Number.isFinite(n) ? Math.min(remaining, Math.max(0, Math.floor(n))) : 1;
  return { rowspan: clean(r, rows - row), colspan: clean(c, cols - col) };
}
export function tableRange(count: number, top: number, height: number, rowHeight: number, buffer: number) {
  const padding = Number.isFinite(buffer) ? Math.max(0, Math.floor(buffer)) : 5;
  const start = Math.min(Math.max(0, count - 1), Math.max(0, Math.floor(top / rowHeight) - padding));
  return { start, end: Math.min(count, Math.ceil((top + height) / rowHeight) + padding + 1) };
}
export function tableOffsets(sizes: readonly number[]) {
  const offsets = [0];
  for (const size of sizes) offsets.push(offsets[offsets.length - 1]! + size);
  return offsets;
}
