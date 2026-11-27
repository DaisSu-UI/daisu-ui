import type { UiLocaleOverride } from './locale.js';
export type CropperSize = { width: number; height: number };
export type CropperTransform = { rotation: number; zoom: number; offsetX: number; offsetY: number };
export type ImgCropperConfig = {
  locale?: UiLocaleOverride;
  show: boolean; imgSrc: string; aspectRatio: string; imgWidth?: number | string; imgHeight?: number | string;
  disabledRotate: boolean; exportScale: number; maxScale: number; quality: number; fileType: 'png' | 'jpg';
  cancelButtonText: string; confirmButtonText: string;
};
export type ImgCropperResult = { tempFilePath: string; width: number; height: number; fileType: 'png' | 'jpg' };
export type ImgCropperSignal = { kind: 'confirm' | 'cancel' | 'loaded' | 'error'; phase?: 'load'|'export'|'config'; result?: ImgCropperResult; width?: number; height?: number; message?: string };
export const initialCropperTransform: CropperTransform = { rotation: 0, zoom: 1, offsetX: 0, offsetY: 0 };
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
export function cropperAspect(value = '1:1') {
  const match = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/.exec(value);
  if (!match || Number(match[1]) <= 0 || Number(match[2]) <= 0) throw new Error('aspectRatio 必须为正数宽:高');
  const ratio = Number(match[1]) / Number(match[2]);
  if (!Number.isFinite(ratio) || ratio < 0.02 || ratio > 50) throw new Error('裁剪比例超出范围');
  return ratio;
}
export function cropperFrame(viewport: CropperSize, aspect: string): CropperSize {
  const ratio = cropperAspect(aspect), width = Math.min(Math.max(1, viewport.width - 40), viewport.height * 0.85 * ratio);
  return { width: Math.max(1, width), height: Math.max(1, width / ratio) };
}
/** Clamp the crop corners in the rotated image's coordinate system. */
export function cropperGeometry(source: CropperSize, crop: CropperSize, input: CropperTransform, maxScale = 3) {
  const rotation = ((input.rotation % 360) + 360) % 360, radians = rotation * Math.PI / 180;
  const cos = Math.cos(radians), sin = Math.sin(radians);
  const extentX = (Math.abs(cos) * crop.width + Math.abs(sin) * crop.height) / 2;
  const extentY = (Math.abs(sin) * crop.width + Math.abs(cos) * crop.height) / 2;
  const coverScale = Math.max(extentX * 2 / source.width, extentY * 2 / source.height);
  const zoom = clamp(Number.isFinite(input.zoom) ? input.zoom : 1, 1, Math.max(1, maxScale));
  const scale = coverScale * zoom;
  const limitX = Math.max(0, source.width * scale / 2 - extentX), limitY = Math.max(0, source.height * scale / 2 - extentY);
  const x = clamp(cos * input.offsetX + sin * input.offsetY, -limitX, limitX);
  const y = clamp(-sin * input.offsetX + cos * input.offsetY, -limitY, limitY);
  return { rotation, zoom, offsetX: cos * x - sin * y, offsetY: sin * x + cos * y, scale, coverScale };
}
export function cropperExportSize(frame: CropperSize, exportScale: number) {
  if (!Number.isFinite(exportScale) || exportScale <= 0) throw new Error('exportScale 必须为有限正数');
  const width = Math.round(frame.width * exportScale), height = Math.round(frame.height * exportScale);
  if (width < 1 || height < 1 || width > 4096 || height > 4096 || width * height > 16777216) throw new Error('导出图片应在 1–4096 像素及 1600 万像素内');
  return { width, height };
}
export function cropperInitialZoom(source: CropperSize, viewport: CropperSize, cover: number, width?: number | string, height?: number | string) {
  const size = (v: number | string | undefined, total: number) => typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : typeof v === 'string' && /^\d+(\.\d+)?%$/.test(v) ? parseFloat(v) / 100 * total : 0;
  return Math.max(1, size(width, viewport.width) / source.width / cover, size(height, viewport.height) / source.height / cover);
}
