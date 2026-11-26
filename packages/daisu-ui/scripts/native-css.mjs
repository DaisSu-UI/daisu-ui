import { createHash } from 'node:crypto';
import * as css from 'css-tree';

/**
 * Lynx 4.0 supports nested references in custom properties, but the stylesheet
 * serializer lowers var() fallbacks on ordinary properties to literal strings.
 * Resolve a nested expression through a private custom property instead. Keep
 * the original declaration and cascade order, including !important and slots.
 */
export function nativeCompatibleCSS(source) {
  const ast = css.parse(source, { positions: true, parseCustomProperty: true });
  const edits = [];
  css.walk(ast, {
    visit: 'Declaration',
    enter(node) {
      if (node.property.startsWith('--')) return;
      let nested = false;
      let depth = 0;
      css.walk(node.value, {
        enter(child) {
          if (child.type === 'Function' && child.name === 'var' && ++depth > 1) nested = true;
        },
        leave(child) {
          if (child.type === 'Function' && child.name === 'var') depth--;
        },
      });
      if (!nested) return;
      const value = source.slice(node.value.loc.start.offset, node.value.loc.end.offset).trim();
      const name = `--_daisu-var-${createHash('sha256').update(value).digest('hex').slice(0, 12)}`;
      // Insert at the rule itself so scope changes and inherited overrides are
      // evaluated where the declaration is used, including inside portals.
      edits.push({ start: node.loc.start.offset, end: node.loc.start.offset, value: `${name}: ${value}; ` });
      edits.push({ start: node.value.loc.start.offset, end: node.value.loc.end.offset, value: `var(${name})` });
    },
  });
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    source = source.slice(0, edit.start) + edit.value + source.slice(edit.end);
  }
  return source;
}
