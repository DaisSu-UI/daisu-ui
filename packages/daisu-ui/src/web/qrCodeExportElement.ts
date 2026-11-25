/** Browser-only bitmap export. Inline raster assets before decoding the SVG;
 * browsers intentionally ignore external image URLs in SVG image contexts. */
export async function qrCodePng(svg: string, size: number, document: Document): Promise<string> {
  if (!Number.isFinite(size) || size <= 0 || size > 4096) throw new Error('Invalid QR export size');
  const load = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = document.createElement('img');
    const timer = setTimeout(() => { image.onload = image.onerror = null; image.removeAttribute('src'); reject(new Error('二维码导出图片加载超时')); }, 10000);
    image.crossOrigin = 'anonymous';
    image.onload = () => { clearTimeout(timer); image.onload = image.onerror = null; resolve(image); };
    image.onerror = () => { clearTimeout(timer); image.onload = image.onerror = null; reject(new Error('二维码图片加载失败，请检查地址与跨域权限')); };
    image.src = src;
  });
  const raster = (image: HTMLImageElement, width: number, height: number) => {
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    try {
      const context = canvas.getContext('2d'); if (!context) throw new Error('当前浏览器不支持二维码位图导出');
      context.drawImage(image, 0, 0, width, height);
      return canvas.toDataURL('image/png');
    } finally { canvas.width = canvas.height = 0; }
  };
  const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml');
  if (parsed.querySelector('parsererror')) throw new Error('二维码 SVG 无效');
  await Promise.all([...parsed.querySelectorAll('image')].map(async node => {
    const src = node.getAttribute('href') || '';
    const url = new URL(src, document.baseURI);
    if (!['http:', 'https:'].includes(url.protocol) && !/^data:image\/(png|jpeg|webp|gif);base64,/i.test(src)) throw new Error('二维码图片地址不支持导出');
    if (url.username || url.password) throw new Error('二维码图片地址不支持导出');
    const image = await load(url.href);
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 16000000) throw new Error('二维码图片尺寸无效或过大');
    node.setAttribute('href', raster(image, image.naturalWidth, image.naturalHeight));
  }));
  const embedded = new XMLSerializer().serializeToString(parsed.documentElement);
  const image = await load(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(embedded)}`);
  return raster(image, Math.round(size), Math.round(size));
}

export function registerQrCodeExport() {
  if (customElements.get('daisu-qr-export')) return;
  class QrCodeExport extends HTMLElement {
    exportImage(request: { id: number; svg: string; size: number }): void {
      // WebCore serializes invoke() return values across its MessagePort.
      // Keep the bridge synchronous; send asynchronous results via qrexport.
      void this.encode(request);
    }
    private async encode({ id, svg, size }: { id: number; svg: string; size: number }) {
      let result: { id: number; url?: string; error?: string };
      try { result = { id, url: await qrCodePng(svg, size, this.ownerDocument) }; }
      catch (reason) { result = { id, error: String(reason) }; }
      if (this.isConnected) this.dispatchEvent(new CustomEvent('qrexport', { detail: result, bubbles: true, composed: true }));
    }
  }
  customElements.define('daisu-qr-export', QrCodeExport);
}
