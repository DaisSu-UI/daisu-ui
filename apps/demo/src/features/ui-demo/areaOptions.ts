import { areaList } from '@vant/area-data';
import type { CascaderOption } from '@daisu-ui/ui';

type AreaData = {
  province_list: Record<string, string>;
  city_list: Record<string, string>;
  county_list: Record<string, string>;
};
type Branch = CascaderOption & { children: CascaderOption[] };

/** Visit each administrative division once, preserving the source order. */
export function buildAreaOptions(data: AreaData): CascaderOption[] {
  const result: CascaderOption[] = [];
  const provinces = new Map<string, Branch>();
  const cities = new Map<string, Branch>();
  for (const [value, text] of Object.entries(data.province_list)) {
    const province: Branch = { value, text, children: [] };
    result.push(province);
    provinces.set(value.slice(0, 2), province);
  }
  for (const [value, text] of Object.entries(data.city_list)) {
    const province = provinces.get(value.slice(0, 2));
    if (!province) continue;
    const city: Branch = { value, text, children: [] };
    province.children.push(city);
    cities.set(value.slice(0, 4), city);
  }
  for (const [value, text] of Object.entries(data.county_list)) {
    cities.get(value.slice(0, 4))?.children.push({ value, text });
  }
  return result;
}

/** Creating or importing this cache never reads or traverses the area tables. */
export function createAreaOptionsCache(readData: () => AreaData) {
  let cached: readonly CascaderOption[] | undefined;
  return () => cached ??= buildAreaOptions(readData());
}

// Only address-picker event handlers request this tree; renders start with [].
export const getDemoAreaOptions = createAreaOptionsCache(() => areaList);
