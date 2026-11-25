/** Optional native Demo host. A real application supplies its own upload transport. */
export type HostClient = {
  call(method: 'media.image.preview', args: { urls: string[]; current: number }): Promise<boolean>;
  call(method: 'media.image.pickAndUpload', args: { source: 'gallery' | 'camera'; maxSizeKB: number; uploadId: string }): Promise<{ url: string; path: string; name: string } | null>;
  onUploadProgress(listener: (id: string, progress: number) => void): () => void;
};
