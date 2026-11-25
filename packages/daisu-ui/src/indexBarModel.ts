export type AnchorIndex = string | number;
export type IndexBarSection<T> = { index: AnchorIndex; data: readonly T[] };

export function indexBarSize(value: number, fallback: number) {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function indexBarLayout<T>(sections: readonly IndexBarSection<T>[], itemHeight = 44, anchorHeight = 36) {
  const rowSize = indexBarSize(itemHeight, 44);
  const anchorSize = indexBarSize(anchorHeight, 36);
  let position = 0;
  let offset = 0;
  return sections.map(section => {
    const result = { position, offset, height: anchorSize + section.data.length * rowSize };
    position += section.data.length + 1;
    offset += result.height;
    return result;
  });
}

export function indexBarSectionAtOffset(layout: readonly { offset: number }[], offset: number) {
  if (!layout.length) return -1;
  const top = Number.isFinite(offset) ? Math.max(0, offset) : 0;
  let section = 0;
  for (let i = 1; i < layout.length; i++) {
    if (top + .5 < layout[i]!.offset) break;
    section = i;
  }
  return section;
}

export function indexBarIndexAtPoint(point: number, top: number, height: number, count: number) {
  if (!count || ![point, top, height].every(Number.isFinite) || height <= 0) return -1;
  return Math.max(0, Math.min(count - 1, Math.floor((point - top) / (height / count))));
}

export function indexBarStickyOffset(layout: readonly { offset: number }[], section: number, scrollTop: number, height: number) {
  const next = layout[section + 1];
  return next ? Math.min(0, next.offset - Math.max(0, scrollTop) - height) : 0;
}

export function anchorKey(index: AnchorIndex) { return `${typeof index}:${index}`; }
