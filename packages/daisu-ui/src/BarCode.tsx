import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { barCodeLayout, encodeBarCode } from './barCodeModel.js';
import type { BarCodeOptions } from './barCodeModel.js';
export type { BarCodeFormat } from './barCodeModel.js';
export type BarCodeProps = BarCodeOptions & { onValid?: (valid: boolean) => void; onError?: (error: Error) => void; className?: string; style?: CSSProperties };
export type BarCodeRef = { exportImage: () => Promise<string>; getSvg: () => string };
/** Standard barcode encoders and native SVG; no DOM, Canvas, filesystem or host business API. */
export const BarCode = forwardRef<BarCodeRef, BarCodeProps>(function BarCode({ onValid, onError, className = '', style, ...props }, ref) {
  const { value, format, width, height, text, font, fontSize, fontOptions, textMargin, background, lineColor, margin, marginTop, marginBottom, marginLeft, marginRight, displayValue, textAlign, textPosition } = props;
  const encoded = useMemo(() => encodeBarCode(props), [value, format, width, height, text, font, fontSize, fontOptions, textMargin, background, lineColor, margin, marginTop, marginBottom, marginLeft, marginRight, displayValue, textAlign, textPosition]);
  const [metrics, setMetrics] = useState<{ key: string; widths: Record<string, number> }>({ key: '', widths: {} });
  const o = encoded.options, metricKey = JSON.stringify([o.font,o.fontSize,o.fontOptions,o.value,o.text,o.format]);
  const layout = useMemo(() => barCodeLayout(encoded, metrics.key === metricKey ? metrics.widths : {}), [encoded, metrics, metricKey]);
  useEffect(() => { if (encoded.valid !== undefined) onValid?.(encoded.valid); }, [encoded]);
  useEffect(() => { if (layout.error) onError?.(layout.error); }, [layout.error]);
  useImperativeHandle(ref, () => ({
    getSvg() { 'background only'; if (!layout.svg) throw layout.error ?? new Error('Barcode value is empty'); return layout.svg; },
    async exportImage() { 'background only'; if (!layout.svg) throw layout.error ?? new Error('Barcode value is empty'); return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(layout.svg)}`; },
  }), [layout]);
  return <view className={`ui-bar-code ${className}`} style={{ width: `${encoded.empty ? 0 : Number.isFinite(o.width) && o.width > 0 ? o.width : 200}px`, height: `${encoded.empty ? 0 : Number.isFinite(o.height) && o.height > 0 ? o.height : 100}px`, ...style }} accessibility-element accessibility-label={String(value ?? '')}>
    {layout.svg ? <svg className="ui-bar-code-svg" content={layout.barSvg} style={{ width: `${o.width}px`, height: `${o.height}px` }} /> : null}
    {layout.texts.map((item,i) => <text key={`label:${i}`} className="ui-bar-code-label" style={{ left: `${item.x}px`, top: `${layout.textY! - layout.fontSize!}px`, width: `${item.width}px`, lineHeight: `${layout.fontSize! * 1.25}px`, fontFamily:o.font, fontSize:`${layout.fontSize}px`, color:o.lineColor, textAlign:layout.segmented?'center':o.textAlign, fontWeight:o.fontOptions.includes('bold')?'bold':'normal', fontStyle:o.fontOptions.includes('italic')?'italic':'normal' }}>{item.text}</text>)}
    {layout.texts.map((item,i) => <text key={`${metricKey}:${i}:${item.text}`} className="ui-bar-code-measure" style={{ fontFamily: o.font, fontSize: `${o.fontSize}px`, fontWeight: o.fontOptions.includes('bold') ? 'bold' : 'normal', fontStyle: o.fontOptions.includes('italic') ? 'italic' : 'normal' }} bindlayoutchange={event => {
      'background only';
      const measured = event.detail.width;
      if (Number.isFinite(measured) && measured > 0) setMetrics(previous => previous.key === metricKey && previous.widths[item.text] === measured ? previous : { key: metricKey, widths: { ...previous.key === metricKey ? previous.widths : {}, [item.text]: measured } });
    }}>{item.text}</text>)}
  </view>;
});
