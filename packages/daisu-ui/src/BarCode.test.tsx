import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, render } from '@lynx-js/react/testing-library';
import { createRef } from '@lynx-js/react';
import { BarCode } from './BarCode.js';
import type { BarCodeRef } from './BarCode.js';
import { barCodeFormats, barCodeLayout, encodeBarCode } from './barCodeModel.js';
afterEach(cleanup);
const values: Record<string,string> = { CODE128: 'CODE128', CODE128A: 'CODE128A', CODE128B: 'CODE128B', CODE128C: '123456', EAN13: '690123456789', EAN8: '1234567', UPC: '12345678901', UPCE: '123456', CODE39: 'CODE39', ITF14: '1234567890123', MSI: '123456', MSI10: '123456', MSI11: '123456', MSI1010: '123456', MSI1110: '123456', pharmacode: '1234', codabar: 'A123456A' };
test('BarCode supports all demo formats and uses real EAN/UPC check digits and guard bars', () => {
  for (const format of barCodeFormats) {
    const encoded = encodeBarCode({ format, value: values[format] ?? '1234567890' });
    expect(encoded.valid, format).toBe(true); expect(encoded.error, format).toBeUndefined();
    const layout = barCodeLayout(encoded); expect(layout.error, format).toBeUndefined(); expect(layout.svg).toContain('<rect');
    expect(encoded.encodings.every(item => /^[01]+$/.test(item.data))).toBe(true);
  }
  const ean13 = encodeBarCode({ format:'EAN13', value:'690123456789' });
  expect(ean13.encodings.map(item => item.text ?? '').join('')).toBe('6901234567892');
  expect(ean13.encodings.map(item => item.data).join('')).toHaveLength(107); // 95 symbols + 12 quiet modules for first digit
  expect(encodeBarCode({ format:'EAN13', value:'6901234567893' }).valid).toBe(false);
  expect(encodeBarCode({ format:'EAN8', value:'1234567' }).encodings.map(item => item.text ?? '').join('')).toBe('12345670');
  expect(encodeBarCode({ format:'UPC', value:'12345678901' }).encodings.map(item => item.text ?? '').join('')).toBe('123456789012');
});
test('BarCode validates encoding independently of layout and rejects invalid bounds and options', () => {
  expect(encodeBarCode({ value:'' }).empty).toBe(true);
  expect(encodeBarCode({ value:0 }).valid).toBe(true);
  expect(encodeBarCode({ value:'a'.repeat(129) }).error?.message).toContain('128');
  expect(encodeBarCode({ value:'abc', format:'CODE128C' }).valid).toBe(false);
  expect(encodeBarCode({ value:'123', margin:NaN }).valid).toBeUndefined();
  expect(encodeBarCode({ value:'123', marginLeft:-1 }).error).toBeTruthy();
  const narrow = encodeBarCode({ value:'123', width:10 }); expect(narrow.valid).toBe(true); expect(barCodeLayout(narrow).error).toBeTruthy();
  expect(encodeBarCode({ value:'123', width:Infinity }).error).toBeTruthy();
  expect(barCodeLayout(encodeBarCode({ value:'123', height:30 })).error).toBeTruthy();
});
test('BarCode fits native text, preserves encoded modules, escapes SVG and keeps total size', () => {
  const plain = encodeBarCode({value:'1234567890'}), top = barCodeLayout(encodeBarCode({value:'1234567890',textPosition:'top'}));
  expect(top.barHeight).toBe(53); expect(top.svg).toContain('y="37"');
  const measured = barCodeLayout(plain, {'1234567890':240}); expect(measured.fontSize).toBe(15); expect(measured.barHeight).toBe(59.25);
  const hidden = barCodeLayout(encodeBarCode({value:'1234567890',displayValue:false})); expect(hidden.texts).toHaveLength(0); expect(hidden.barHeight).toBe(80);
  const text='<svg onload="bad">&'; const custom=encodeBarCode({value:'1234567890',text,lineColor:'red"/>',font:'mono"space'}), result=barCodeLayout(custom);
  expect(custom.encodings.map(e=>e.data)).toEqual(plain.encodings.map(e=>e.data));
  expect(result.svg).toContain('&lt;svg onload=&quot;bad&quot;&gt;&amp;'); expect(result.svg).not.toContain('<svg onload=');
  expect(barCodeLayout(encodeBarCode({value:'\u0000A',format:'CODE128A'})).svg).not.toContain('\u0000');
  for(const value of ['__proto__','constructor','toString']) expect(barCodeLayout(encodeBarCode({value})).svg).not.toContain('NaN');
  expect(result.barSvg).not.toContain('<text'); expect(result.svg).toContain('viewBox="0 0 200 100"');
});
test('BarCode emits every encoding result, updates exports and refuses stale/invalid exports', async () => {
  const ref=createRef<BarCodeRef>(),valid=rstest.fn(),error=rstest.fn();
  const screen=render(<BarCode ref={ref} value="690123456789" format="EAN13" onValid={valid} onError={error}/>);
  expect(valid).toHaveBeenLastCalledWith(true); expect(Array.from(screen.container.querySelectorAll('.ui-bar-code-label')).map(node=>node.textContent)).toEqual(['6','901234','567892']);
  const url=await ref.current!.exportImage(); expect(url).toMatch(/^data:image\/svg\+xml/); expect(decodeURIComponent(url)).toContain(ref.current!.getSvg());
  screen.rerender(<BarCode ref={ref} value="690123456789" format="EAN13" height={140} onValid={valid} onError={error}/>);
  expect(valid).toHaveBeenCalledTimes(2); expect(ref.current!.getSvg()).toContain('height="140"');
  screen.rerender(<BarCode ref={ref} value="bad" format="EAN13" onValid={valid} onError={error}/>);
  expect(valid).toHaveBeenLastCalledWith(false); expect(error).toHaveBeenCalled(); expect(screen.container.querySelector('svg')).toBeNull(); await expect(ref.current!.exportImage()).rejects.toThrow('Invalid barcode');
  screen.rerender(<BarCode ref={ref} value="" onValid={valid}/>); expect(screen.container.querySelector('svg')).toBeNull(); await expect(ref.current!.exportImage()).rejects.toThrow('empty');
});
