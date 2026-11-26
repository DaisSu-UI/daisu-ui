import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import * as css from 'css-tree';
import { parse } from '@lynx-js/css-serializer';
import { nativeCompatibleCSS } from '../packages/daisu-ui/scripts/native-css.mjs';
import { configThemeTokens } from '../packages/daisu-ui/dist/configTheme.js';

test('native stylesheet conversion preserves variable precedence, scope, literals and important', () => {
  const source = '.a { color:var(--custom,var(--muted,#999)) !important; background:linear-gradient(red,var(--surface,#fff)); } .b {color:var(--custom,var(--muted,#999))}';
  const output = nativeCompatibleCSS(source);
  const { root, errors } = parse(output);
  assert.deepEqual(errors.filter(error => error.name === 'nested var'), []);
  const [first, second] = root;
  const alias = Object.keys(first.variables)[0];
  assert.equal(first.variables[alias], 'var(--custom,var(--muted,#999))');
  assert.equal(second.variables[alias], first.variables[alias]);
  assert.equal(first.style[0].value, `{{${alias}}} !important`);
  assert(output.includes('background:linear-gradient(red,var(--surface,#fff))'));
  assert.equal(nativeCompatibleCSS(output), output);
});

test('every UI stylesheet retains all ordinary declarations and has no unsupported nested fallback after packaging', () => {
  const dir = new URL('../packages/daisu-ui/src/', import.meta.url);
  let converted = 0;
  for (const name of readdirSync(dir).filter(name => name.endsWith('.css'))) {
    const source = readFileSync(new URL(name, dir), 'utf8');
    const output = nativeCompatibleCSS(source);
    if (output !== source) converted++;
    const properties = value => {
      const entries = [];
      css.walk(css.parse(value, { parseCustomProperty: true }), { visit: 'Declaration', enter(node) {
        if (!node.property.startsWith('--')) entries.push([node.property, node.important]);
      } });
      return entries;
    };
    assert.deepEqual(properties(output), properties(source), name);
    assert.deepEqual(parse(output, { filename: name }).errors.filter(error => error.name === 'nested var'), [], name);
  }
  assert(converted > 0, 'the audit must exercise fallback conversion');
});

test('stylesheet and ConfigProvider expose identical default theme tokens', () => {
  const { root } = parse(readFileSync(new URL('../packages/daisu-ui/src/styles.css', import.meta.url), 'utf8'));
  for (const [selector, theme] of [[':root', 'light'], ['.theme-dark', 'dark']]) {
    const rule = root.find(rule => rule.type === 'StyleRule' && rule.selectorText.value === selector);
    assert.deepEqual(rule.variables, configThemeTokens(theme), theme);
  }
});
