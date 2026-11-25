import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';
import { areaList } from '@vant/area-data';
import ts from 'typescript';

// Compile the production helper outside the measured region (also supports Node 20).
const compiled = ts.transpileModule(readFileSync(new URL('../apps/demo/src/features/ui-demo/areaOptions.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const helper = { exports: {} };
new Function('require', 'module', 'exports', compiled)(createRequire(import.meta.url), helper, helper.exports);
const { buildAreaOptions, createAreaOptionsCache } = helper.exports;

// Previous module-level implementation, retained only for this comparison.
const previous = () => Object.entries(areaList.province_list).map(([value, text]) => ({
  value, text,
  children: Object.entries(areaList.city_list).filter(([city]) => city.slice(0, 2) === value.slice(0, 2)).map(([value, text]) => ({
    value, text,
    children: Object.entries(areaList.county_list).filter(([county]) => county.slice(0, 4) === value.slice(0, 4)).map(([value, text]) => ({ value, text })),
  })),
}));
const indexed = () => buildAreaOptions(areaList);
assert.deepEqual(indexed(), previous());

function measure(build) {
  const times = [];
  for (let index = 0; index < 21; index++) {
    const start = performance.now();
    build();
    times.push(performance.now() - start);
  }
  const sorted = times.slice(1).sort((a, b) => a - b);
  return { firstMs: times[0], medianMs: sorted[Math.floor(sorted.length / 2)], minMs: Math.min(...times), maxMs: Math.max(...times) };
}
const cached = createAreaOptionsCache(() => areaList);
console.log(JSON.stringify({
  runtime: process.version,
  scope: 'Node computation only; excludes bundle parsing, page rendering, requests and device startup',
  counts: { provinces: Object.keys(areaList.province_list).length, cities: Object.keys(areaList.city_list).length, counties: Object.keys(areaList.county_list).length },
  identicalTree: true,
  previous: measure(previous),
  indexed: measure(indexed),
  cached: measure(cached),
}, null, 2));
