import type { HostClient } from './host.js';
import type { UploadAdapter } from 'daisu-ui';
/** The host owns selection, authorization and upload transport on every platform. */
export function createHostUploadAdapter(host: HostClient, options: { source?: 'gallery' | 'camera'; maxSizeKB?: number } = {}): UploadAdapter {
  return {
    async chooseAndUpload(onProgress) {
      'background only';
      const uploadId = `ui-upload-${Date.now()}-${Math.random()}`;
      const unsubscribe = host.onUploadProgress((id, progress) => { if (id === uploadId) onProgress(progress); });
      try {
        const file = await host.call('media.image.pickAndUpload', { source: options.source ?? 'gallery', maxSizeKB: options.maxSizeKB ?? 30720, uploadId });
        return file ? { url: file.url || file.path, name: file.name, path: file.path } : null;
      } finally { unsubscribe(); }
    },
    async preview(files, index) {
      'background only';
      const accepted = await host.call('media.image.preview', { urls: files.map(file => file.url), current: index });
      if (!accepted) throw new Error('宿主暂不支持图片预览');
    },
  };
}
