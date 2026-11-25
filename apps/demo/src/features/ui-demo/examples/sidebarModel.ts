export const sidebarCategories = ['一', '二', '三', '四', '五', '六', '七'] as const;
export const sidebarRowCounts = [24, 24, 18, 21, 24, 18, 24] as const;
export const sidebarHeaderIndexes = sidebarRowCounts.map((_, section) => sidebarRowCounts.slice(0, section).reduce((sum, count) => sum + count + 1, 0));
export const sidebarSectionOffsets = sidebarRowCounts.map((_, section) => sidebarRowCounts.slice(0, section).reduce((sum, count) => sum + 44 + count * 68, 0));

/** Demo rows have fixed heights. Dynamic business content must use measured offsets. */
export function sidebarSectionAtOffset(offset: number) {
  const position = Number.isFinite(offset) ? Math.max(0, offset) + 50 : 50;
  let section = 0;
  for (let i = 1; i < sidebarSectionOffsets.length; i++) {
    if (position >= sidebarSectionOffsets[i]!) section = i;
    else break;
  }
  return section;
}
