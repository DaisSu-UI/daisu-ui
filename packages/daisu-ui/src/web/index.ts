/** Browser-only registration, before mounting <lynx-view>. */
import { registerRichTextMedia } from './richTextMediaElement.js';
import { registerImgCropper } from './imgCropperElement.js';
import { registerQrCodeExport } from './qrCodeExportElement.js';
export { registerRichTextMedia, registerImgCropper, registerQrCodeExport };
export function registerDaisuWebComponents(){ registerRichTextMedia(); registerImgCropper(); registerQrCodeExport(); }
