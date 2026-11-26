import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../packages/daisu-ui/src/icons/render.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2015, module: ts.ModuleKind.CommonJS },
}).outputText;
const glyph = '<path stroke="currentColor" fill="currentColor" />';
const expected = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path stroke="#07c160" fill="#07c160" /></svg>';

test('SVG icons render on a background runtime without String.replaceAll', () => {
  const context = createContext({ exports: {} });
  runInContext('String.prototype.replaceAll = undefined;', context);
  runInContext(compiled, context);
  assert.equal(context.exports.glyphSvg(glyph, '#07c160'), expected);
  assert.equal(context.exports.glyphSvg('<path fill="currentColor" />', '"<&>'),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="&quot;&lt;&amp;&gt;" /></svg>');
});
