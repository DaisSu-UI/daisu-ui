/** Shared protocol; browser DOM code is only loaded by daisu-ui/web. */
export type RichTextMediaType = 'audio' | 'video';
export type RichTextMediaConfig = {
  id: string;
  type: RichTextMediaType;
  sources: string[];
  title: string;
  poster?: string;
  loop: boolean;
  muted: boolean;
  preview?: boolean;
};
export type RichTextMediaEvent = { id: string; type: RichTextMediaType; src: string };
export type RichTextMediaTimeUpdate = RichTextMediaEvent & { currentTime: number; duration: number };
export type RichTextMediaSignal = RichTextMediaTimeUpdate & {
  kind: 'play' | 'pause' | 'ended' | 'timeupdate' | 'error' | 'close';
  message?: string;
  code?: string;
  fatal?: boolean;
};
export function validRichTextMediaId(id: string) {
  return !!id && id.length <= 128 && !/[\s\u0000-\u001f\u007f]/.test(id);
}
