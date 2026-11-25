const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Render trusted, bundled SVG geometry with a literal or gradient paint. */
export function glyphSvg(glyph: string, color: string, defs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${defs}${glyph.replaceAll('currentColor', escape(color))}</svg>`;
}
