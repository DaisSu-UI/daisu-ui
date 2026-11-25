import { expect, rstest, test } from '@rstest/core';
import { areaList } from '@vant/area-data';
import { buildAreaOptions, createAreaOptionsCache } from './areaOptions.js';

test('a cache defers every table read until requested and reuses the tree', () => {
  const readData = rstest.fn(() => areaList);
  const getOptions = createAreaOptionsCache(readData);
  expect(readData).not.toHaveBeenCalled();
  const first = getOptions();
  expect(first.length).toBeGreaterThan(0);
  expect(getOptions()).toBe(first);
  expect(readData).toHaveBeenCalledTimes(1);
});

test('the indexed tree preserves every province, city, county and their ordering', () => {
  const tree = buildAreaOptions(areaList);
  expect(tree.map(item => [item.value, item.text])).toEqual(Object.entries(areaList.province_list));
  const cities = tree.flatMap(province => {
    const expected = Object.entries(areaList.city_list).filter(([code]) => code.slice(0, 2) === String(province.value).slice(0, 2));
    expect(province.children?.map(city => [city.value, city.text])).toEqual(expected);
    return province.children ?? [];
  });
  expect(cities).toHaveLength(Object.keys(areaList.city_list).length);
  expect(cities.flatMap(city => city.children ?? [])).toHaveLength(Object.keys(areaList.county_list).length);
  for (const city of cities) {
    for (const county of city.children ?? []) {
      expect(String(county.value).slice(0, 4)).toBe(String(city.value).slice(0, 4));
      expect(county.text).toBe(areaList.county_list[String(county.value)]);
      expect(county.children).toBeUndefined();
    }
  }
});

test('empty parents and unmatched children keep the previous hierarchy semantics', () => {
  expect(buildAreaOptions({
    province_list: { '110000': '省一', '120000': '省二' },
    city_list: { '110100': '市一', '990100': '不存在的省' },
    county_list: { '110101': '区一', '110201': '不存在的市', '990101': '孤立区县' },
  })).toEqual([
    { value: '110000', text: '省一', children: [{ value: '110100', text: '市一', children: [{ value: '110101', text: '区一' }] }] },
    { value: '120000', text: '省二', children: [] },
  ]);
});
