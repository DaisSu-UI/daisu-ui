import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import * as css from 'css-tree';
import ts from 'typescript';
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

test('packaged scroll boundaries contain elevated children and preserve viewport overlays', () => {
  const root = new URL('../packages/daisu-ui/dist/', import.meta.url);
  const rules = [];
  const visited = new Set();
  const load = name => {
    if (visited.has(name)) return;
    visited.add(name);
    const source = readFileSync(new URL(name, root), 'utf8');
    for (const match of source.matchAll(/@import\s+['"]\.\/([^'"]+)['"]/g)) load(match[1]);
    rules.push(...parse(source, { filename: name }).root.filter(rule => rule.type === 'StyleRule'));
  };
  load('styles.css');
  const value = (selector, name) => rules.filter(rule => rule.selectorText.value.split(',').map(s => s.trim()).includes(selector)).flatMap(rule => rule.style).filter(declaration => declaration.name === name).at(-1)?.value;
  // Native Lynx otherwise reparents z-index descendants outside the scrolling UI.
  let scrollers = 0;
  const checkTree = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const url = new URL(entry.name, directory);
      if (entry.isDirectory()) { checkTree(new URL(`${entry.name}/`, directory)); continue; }
      if (!entry.name.endsWith('.tsx') || entry.name.endsWith('.test.tsx')) continue;
      const source = readFileSync(url, 'utf8'), tree = ts.createSourceFile(url.pathname, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const visit = node => {
        if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ['scroll-view', 'list', 'List', 'FeedList'].includes(node.tagName.getText(tree))) {
          scrollers++;
          const style = node.attributes.properties.find(prop => ts.isJsxAttribute(prop) && prop.name.getText(tree) === 'style');
          const expression = style?.initializer && ts.isJsxExpression(style.initializer) ? style.initializer.expression : undefined;
          assert(expression && ts.isObjectLiteralExpression(expression), `explicit native scroll style missing: ${url.pathname}`);
          const layer = expression.properties.find(prop => ts.isPropertyAssignment(prop) && prop.name.getText(tree) === 'zIndex');
          assert(layer && ts.isPropertyAssignment(layer) && layer.initializer.getText(tree) === '0', `native scroll context missing: ${url.pathname}`);
        }
        ts.forEachChild(node, visit);
      };
      visit(tree);
    }
  };
  checkTree(new URL('../packages/daisu-ui/src/', import.meta.url));
  checkTree(new URL('../apps/demo/src/', import.meta.url));
  assert(scrollers >= 18, 'audit must include shared page and nested component scroll containers');
  for (const selector of ['.ui-steps', '.ui-step-header', '.ui-avatar-group', '.ui-swiper', '.ui-calendar-scroll', '.ui-slider-rail', '.ui-tabs-standard', '.ui-table', '.ui-search-block', '.ui-index-bar']) {
    assert.equal(value(selector, 'z-index'), '0', `${selector} needs a local stacking boundary`);
  }
  assert.equal(value('.ui-step-indicator', 'z-index'), '1');
  assert.equal(value('.ui-calendar-day-inner', 'z-index'), '2');
  for (const selector of ['.ui-fab', '.ui-overlay', '.ui-toast-position', '.ui-popup-anchor', '.ui-backtop-position']) {
    assert.equal(value(selector, 'position'), 'fixed', `${selector} must keep its intended viewport positioning`);
  }
});
