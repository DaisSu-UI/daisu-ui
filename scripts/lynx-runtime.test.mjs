import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import test from 'node:test';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const source = readFileSync(new URL('../packages/daisu-ui/src/icons/render.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2015, module: ts.ModuleKind.CommonJS },
}).outputText;
const glyph = '<path stroke="currentColor" fill="currentColor" />';
const expected = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path stroke="#07c160" fill="#07c160" /></svg>';
const routerRuntime = ts.transpileModule(readFileSync(new URL('../packages/daisu-ui/src/router/runtime.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2015, module: ts.ModuleKind.CommonJS },
}).outputText;
const require = createRequire(import.meta.url);

function bootstrapRouter(globals = {}) {
  const context = createContext({ exports: {}, require, setTimeout, ...globals });
  runInContext(routerRuntime, context);
  return context;
}

test('router queues navigation work through the native Lynx scheduler', () => {
  const scheduled = [];
  const native = { queueMicrotask(callback) { assert.equal(this, native); scheduled.push(callback); } };
  const context = bootstrapRouter({ lynx: native });
  let called = false;
  context.queueMicrotask(() => { called = true; });
  assert.equal(called, false);
  assert.equal(scheduled.length, 1);
  scheduled.shift()();
  assert.equal(called, true);
  assert.throws(() => context.queueMicrotask(null), /requires a function/);
});

test('router preserves an existing global scheduler', () => {
  const existing = () => {};
  assert.equal(bootstrapRouter({ queueMicrotask: existing }).queueMicrotask, existing);
});

test('older Lynx hosts run microtasks asynchronously and report callback errors', async () => {
  const timers = [];
  const context = bootstrapRouter({ setTimeout: callback => { timers.push(callback); } });
  const order = [];
  context.queueMicrotask(() => { order.push('microtask'); });
  order.push('synchronous');
  const failure = new Error('callback failed');
  context.queueMicrotask(() => { throw failure; });
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(order, ['synchronous', 'microtask']);
  assert.equal(timers.length, 1);
  assert.throws(timers[0], error => error === failure);
});

test('TanStack client navigation opens a detail page and returns without browser globals', () => {
  execFileSync(process.execPath, ['--conditions=browser', fileURLToPath(new URL('./check-router-runtime.mjs', import.meta.url))], {
    env: { ...process.env, NODE_ENV: 'production' }, stdio: 'pipe',
  });
});

test('SVG icons render on a background runtime without String.replaceAll', () => {
  const context = createContext({ exports: {} });
  runInContext('String.prototype.replaceAll = undefined;', context);
  runInContext(compiled, context);
  assert.equal(context.exports.glyphSvg(glyph, '#07c160'), expected);
  assert.equal(context.exports.glyphSvg('<path fill="currentColor" />', '"<&>'),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="&quot;&lt;&amp;&gt;" /></svg>');
});

test('Loading opens with native size strings when Object.hasOwn is unavailable', () => {
  const source = readFileSync(new URL('../packages/daisu-ui/src/loadingModel.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2015, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const context = createContext({ exports: {} });
  runInContext('Object.hasOwn = undefined;', context);
  runInContext(compiled, context);
  assert.equal(context.exports.loadingDimension('50px'), '50px');
  assert.equal(context.exports.loadingDimension('small'), '14px');
  assert.equal(context.exports.loadingDimension('75rpx'), '10vw');
  assert.equal(context.exports.loadingDimension('toString'), '28px');
  assert(context.exports.circularLoadingSvg('#1c64fd').includes('<svg'));
});
