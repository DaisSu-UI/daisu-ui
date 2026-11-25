export type TabsValue = string | number;
export type TabsIdentity = { name?: TabsValue; disabled?: boolean };
export function tabsIndex(items: readonly TabsIdentity[], value: TabsValue | undefined) {
  let index = items.findIndex(item => item.name !== undefined && item.name === value);
  if (index < 0 && typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < items.length) index = value;
  if (index < 0 || items[index]?.disabled) index = items.findIndex(item => !item.disabled);
  return index;
}
export function nextTab(items: readonly TabsIdentity[], index: number, direction: number) {
  for (let i = index + direction; i >= 0 && i < items.length; i += direction) if (!items[i]?.disabled) return i;
  return index;
}
