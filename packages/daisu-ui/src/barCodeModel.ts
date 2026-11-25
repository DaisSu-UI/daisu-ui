// Import only encoders. JsBarcode's root entry also imports DOM/Canvas renderers.
import barcodeModule from 'jsbarcode/bin/barcodes/index.js';
type Encoding = { data: string; text?: string; options?: { height?: number } };
type Encoder = new (value: string, options: Record<string, unknown>) => { valid(): boolean; encode(): Encoding | Encoding[] };
export const barCodeFormats = ['auto', 'CODE128', 'CODE128A', 'CODE128B', 'CODE128C', 'EAN13', 'EAN8', 'UPC', 'UPCE', 'CODE39', 'ITF14', 'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110', 'pharmacode', 'codabar'] as const;
export type BarCodeFormat = typeof barCodeFormats[number];
export type BarCodeOptions = {
  value?: string | number; format?: BarCodeFormat; width?: number; height?: number; text?: string; font?: string; fontSize?: number; fontOptions?: '' | 'bold' | 'italic' | 'bold italic';
  textMargin?: number; background?: string; lineColor?: string; margin?: number; marginTop?: number; marginBottom?: number; marginLeft?: number; marginRight?: number;
  displayValue?: boolean; textAlign?: 'left' | 'center' | 'right'; textPosition?: 'top' | 'bottom';
};
const defaults = { format: 'auto', width: 200, height: 100, text: '', font: 'monospace', fontSize: 20, fontOptions: '', textMargin: 2, background: '#ffffff', lineColor: '#000000', margin: 10, displayValue: true, textAlign: 'center', textPosition: 'bottom' } as const;
const escape = (value: string) => value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/[<>&"']/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character]!);
export function encodeBarCode(props: BarCodeOptions) {
  const options = { ...defaults, ...Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined)) } as Required<Omit<BarCodeOptions, 'value'>> & { value?: string | number };
  options.marginTop ??= options.margin; options.marginBottom ??= options.margin; options.marginLeft ??= options.margin; options.marginRight ??= options.margin;
  let valid: boolean | undefined;
  try {
    if (options.value === undefined || String(options.value) === '') return { options, encodings: [], empty: true };
    const value = String(options.value);
    if (value.length > 128) throw new Error('Barcode value exceeds max length 128');
    if (!barCodeFormats.includes(options.format)) throw new Error(`Unsupported barcode format: ${options.format}`);
    for (const name of ['margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'textMargin'] as const) {
      if (!Number.isFinite(options[name]) || options[name] < 0) throw new Error(`Barcode ${name} must be a non-negative finite number`);
    }
    const encoders = (barcodeModule as unknown as { default?: Record<string, Encoder> }).default ?? barcodeModule;
    const encoder = new encoders[options.format === 'auto' ? 'CODE128' : options.format]!(value, { ...options, width: 2, text: options.text || undefined });
    valid = encoder.valid();
    if (!valid) throw new Error('Invalid barcode value');
    const encoded = encoder.encode();
    const encodings: Encoding[] = Array.isArray(encoded) ? encoded : [encoded];
    if (!encodings.some(item => item.data.length)) throw new Error('Invalid barcode value');
    for (const name of ['width', 'height', 'fontSize'] as const) {
      if (!Number.isFinite(options[name]) || options[name] <= 0) throw new Error(`Barcode ${name} must be a positive finite number`);
    }
    return { options, encodings, valid, empty: false };
  } catch (error) { return { options, encodings: [], valid, empty: false, error: error instanceof Error ? error : new Error(String(error)) }; }
}
export type BarCodeEncoding = ReturnType<typeof encodeBarCode>;
export function barCodeLayout(encoded: BarCodeEncoding, measured: Readonly<Record<string, number>> = {}) {
  const { options: o, encodings } = encoded;
  if (encoded.error || encoded.empty) return { svg: '', texts: [], error: encoded.error };
  try {
    const units = encodings.reduce((total, item) => total + item.data.length, 0), available = o.width - o.marginLeft - o.marginRight;
    if (available <= 0) throw new Error('Barcode width is too small for the margins');
    const unitWidth = available / units;
    const segmented = !o.text && ['EAN13', 'EAN8', 'UPC', 'UPCE'].includes(o.format);
    let offset = o.marginLeft;
    const segments = encodings.map(item => { const segment = { ...item, x: offset, width: item.data.length * unitWidth }; offset += segment.width; return segment; });
    const texts = !o.displayValue ? [] : (segmented ? segments.map(item => ({ text: item.text ?? '', x: item.x, width: item.width })) : [{ text: o.text || encodings.map(item => item.text ?? '').join(''), x: o.marginLeft, width: available }]).filter(item => item.text);
    const approximate = (text: string) => Array.from(text).reduce((sum, c) => sum + (c.charCodeAt(0) > 255 ? 1 : o.font === 'monospace' ? .60205 : .65), 0) * o.fontSize;
    const italic = o.fontOptions.includes('italic');
    const fit = texts.reduce((ratio, item) => {
      const width = measured[item.text], textWidth = Number.isFinite(width) && width > 0 ? width : approximate(item.text);
      return Math.min(ratio, item.width / (textWidth + (italic ? o.fontSize / 4 : 0)));
    }, 1);
    const fontSize = fit < 1 ? Math.floor(o.fontSize * fit) : o.fontSize;
    if (texts.length && fontSize < 1) throw new Error('Barcode width is too small for the display text');
    const textHeight = texts.length ? fontSize * 1.25 + o.textMargin : 0;
    const barHeight = o.height - o.marginTop - o.marginBottom - textHeight;
    if (barHeight < 1) throw new Error('Barcode height is too small for the margins, text and bars');
    const barY = o.marginTop + (o.textPosition === 'top' ? textHeight : 0);
    const guardHeight = barHeight + (o.displayValue && segmented && o.textPosition === 'bottom' ? o.textMargin + fontSize / 2 : 0);
    const rects: string[] = [];
    for (const segment of segments) {
      const h = Number(segment.options?.height) > o.height ? guardHeight : barHeight;
      let run = -1;
      for (let i = 0; i <= segment.data.length; i++) {
        if (segment.data[i] === '1') { if (run < 0) run = i; }
        else if (run >= 0) { rects.push(`<rect x="${segment.x + run * unitWidth}" y="${barY}" width="${(i - run) * unitWidth}" height="${h}"/>`); run = -1; }
      }
    }
    const textY = o.textPosition === 'top' ? o.marginTop + fontSize : barY + barHeight + o.textMargin + fontSize;
    const labels = texts.map(item => {
      const align = segmented ? 'center' : o.textAlign, anchor = align === 'left' ? 'start' : align === 'right' ? 'end' : 'middle';
      const x = item.x + (align === 'left' ? 0 : align === 'right' ? item.width : item.width / 2);
      return `<text x="${x}" y="${textY}" text-anchor="${anchor}" font-family="${escape(o.font)}" font-size="${fontSize}" font-weight="${o.fontOptions.includes('bold') ? 'bold' : 'normal'}" font-style="${italic ? 'italic' : 'normal'}">${escape(item.text)}</text>`;
    });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${o.width}" height="${o.height}" viewBox="0 0 ${o.width} ${o.height}"><rect width="${o.width}" height="${o.height}" fill="${escape(o.background || 'transparent')}"/><g fill="${escape(o.lineColor)}">${rects.join('')}${labels.join('')}</g></svg>`;
    return { svg, barSvg: svg.replace(labels.join(''), ''), texts, fontSize, barHeight, textY, segmented };
  } catch (error) { return { svg: '', texts: [], error: error instanceof Error ? error : new Error(String(error)) }; }
}
