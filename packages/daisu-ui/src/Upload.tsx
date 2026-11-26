import type { CSSProperties } from '@lynx-js/types';
import { useContext, useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import { Icon } from './Icon.js';
import { Loading } from './Loading.js';
import type { LoadingProps } from './Loading.js';
import { FormFieldContext } from './formContext.js';

export type UploadFile = { url: string; name?: string; path?: string; status?: 'success' | 'loading' | 'fail'; message?: string; percent?: number };
/** Selection, credentials, validation and transport belong to the adapter/host. */
export type UploadAdapter = {
  chooseAndUpload: (onProgress: (progress: number) => void) => Promise<UploadFile | null>;
  preview?: (files: readonly UploadFile[], index: number) => void | Promise<void>;
};
export type UploadProps = {
  fileList?: readonly UploadFile[];
  onChange?: (event: { fileList: UploadFile[] }) => void;
  adapter?: UploadAdapter;
  disabled?: boolean; readonly?: boolean; limit?: number; size?: number; deletable?: boolean;
  showLimitNum?: boolean; reupload?: boolean; previewFullImage?: boolean;
  imageMode?: 'aspectFit' | 'aspectFill' | 'scaleToFill' | 'center';
  uploadIcon?: string; uploadText?: string;
  loadingType?: LoadingProps['type']; loadingSize?: number; loadingColor?: string;
  beforeChoose?: (event: { fileList: readonly UploadFile[]; reuploadIndex?: number }) => boolean | Promise<boolean>;
  beforePreview?: (file: UploadFile, index: number) => boolean | Promise<boolean>;
  beforeRemove?: (file: UploadFile, index: number) => boolean | Promise<boolean>;
  onSuccess?: (file: UploadFile) => void; onFail?: (error: Error) => void; onProgress?: (progress: number) => void;
  onPreview?: (event: { file: UploadFile; index: number }) => void;
  onRemove?: (event: { file: UploadFile; index: number }) => void;
  renderPreviewCover?: (event: { file: UploadFile; index: number }) => ReactNode;
  className?: string; evokeClassName?: string; previewClassName?: string; style?: CSSProperties; children?: ReactNode;
};
const emptyFiles: readonly UploadFile[] = [];
const errorOf = (reason: unknown, fallback: string) => reason instanceof Error ? reason : new Error(fallback);
export function Upload({ fileList = emptyFiles, onChange, adapter, disabled: disabledProp, readonly = false, limit = 0, size = 88, deletable = true, showLimitNum = true, reupload = false, previewFullImage = true, imageMode = 'aspectFill', uploadIcon = 'camera-fill', uploadText, loadingType = 'circular', loadingSize = 24, loadingColor = '#fff', beforeChoose, beforePreview, beforeRemove, onSuccess, onFail, onProgress, onPreview, onRemove, renderPreviewCover, className = '', evokeClassName = '', previewClassName = '', style, children }: UploadProps) {
  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const [uploading, setUploading] = useState(false), [progress, setProgress] = useState(0);
  const generation = useRef(0), choosing = useRef(false), removing = useRef(false), previewing = useRef(false);
  const latest = useRef({ fileList, disabled, readonly, limit, adapter, onChange, onSuccess, onFail, onProgress, onPreview, onRemove });
  latest.current = { fileList, disabled, readonly, limit, adapter, onChange, onSuccess, onFail, onProgress, onPreview, onRemove };
  useEffect(() => {
    generation.current++; choosing.current = false; removing.current = false; previewing.current = false; setUploading(false);
    return () => { generation.current++; };
  }, [fileList, disabled, readonly, adapter, limit, reupload, deletable, previewFullImage]);
  const withinLimit = limit <= 0 || fileList.length < limit;
  const choose = async (target?: UploadFile) => {
    'background only';
    if (disabled || readonly || choosing.current || (!target && !withinLimit)) return;
    choosing.current = true;
    const ticket = generation.current;
    let acceptingProgress = false;
    try {
      const index = target ? fileList.indexOf(target) : -1;
      if (beforeChoose && !await beforeChoose({ fileList, ...(index < 0 ? {} : { reuploadIndex: index }) })) return;
      if (ticket !== generation.current) return;
      if (!adapter) throw new Error('未接入图片上传能力');
      acceptingProgress = true; setUploading(true); setProgress(0);
      const file = await adapter.chooseAndUpload(value => {
        'background only';
        if (ticket !== generation.current || !acceptingProgress || !Number.isFinite(value)) return;
        const next = Math.max(0, Math.min(100, value)); setProgress(next); latest.current.onProgress?.(next);
      });
      acceptingProgress = false;
      if (ticket !== generation.current || !file) return;
      if (!file.url) throw new Error('上传结果缺少图片地址');
      const current = latest.current, next = [...current.fileList], uploaded = { ...file, status: 'success' as const };
      if (target) { const location = next.indexOf(target); if (location < 0) return; next[location] = uploaded; }
      else { if (current.limit > 0 && next.length >= current.limit) return; next.push(uploaded); }
      current.onChange?.({ fileList: next }); current.onSuccess?.(uploaded);
    } catch (reason) { if (ticket === generation.current) latest.current.onFail?.(errorOf(reason, '上传失败')); }
    finally { acceptingProgress = false; if (ticket === generation.current) { choosing.current = false; setUploading(false); } }
  };
  const remove = async (file: UploadFile, index: number) => {
    'background only';
    if (disabled || readonly || !deletable || file.status === 'loading' || removing.current) return;
    removing.current = true; const ticket = generation.current;
    try {
      if (!await (beforeRemove?.(file, index) ?? true) || ticket !== generation.current) return;
      const current = latest.current, location = current.fileList.indexOf(file);
      if (location >= 0) { current.onChange?.({ fileList: current.fileList.filter((_, i) => i !== location) }); current.onRemove?.({ file, index: location }); }
    } catch (reason) { if (ticket === generation.current) latest.current.onFail?.(errorOf(reason, '删除失败')); }
    finally { if (ticket === generation.current) removing.current = false; }
  };
  const preview = async (file: UploadFile, index: number) => {
    'background only';
    if (file.status === 'loading') return;
    if (reupload && !readonly) { await choose(file); return; }
    if (previewing.current) return;
    previewing.current = true; const ticket = generation.current;
    try {
      if (!await (beforePreview?.(file, index) ?? true) || ticket !== generation.current) return;
      const current = latest.current, location = current.fileList.indexOf(file);
      if (location < 0) return;
      current.onPreview?.({ file, index: location });
      if (previewFullImage) {
        if (current.adapter?.preview) await current.adapter.preview(current.fileList, location);
        else if (!current.onPreview) throw new Error('未接入图片预览能力');
      }
    } catch (reason) { if (ticket === generation.current) latest.current.onFail?.(errorOf(reason, '预览失败')); }
    finally { if (ticket === generation.current) previewing.current = false; }
  };
  const dimension = Number.isFinite(size) ? Math.max(0, size) : 88;
  return <view className={`ui-upload ${disabled ? 'ui-upload-disabled' : ''} ${className}`} style={{ '--ui-upload-size': `${dimension}px`, ...style } as CSSProperties}>
    {fileList.map((file, index) => <view className={`ui-upload-preview ${previewClassName}`} key={`${file.path ?? file.url}-${index}`}>
      <view className="ui-upload-picture" bindtap={() => { 'background only'; void preview(file, index); }} accessibility-element accessibility-traits="button" accessibility-label={`${reupload && !readonly ? '重新上传' : '预览'}${file.name ?? `图片${index + 1}`}`}>
        <image src={file.url} mode={imageMode} className="ui-upload-image" />
      </view>
      <view className="ui-upload-border" />
      {file.status === 'loading' || file.status === 'fail' ? <view className="ui-upload-status">{file.status === 'loading' ? <Loading type={loadingType} size={loadingSize} color={loadingColor} /> : <Icon name="close-circle" color="#fff" size={24} />}<text>{file.message ?? (file.status === 'fail' ? '上传失败' : file.percent === undefined ? '上传中' : `${Math.round(file.percent)}%`)}</text></view> : null}
      {deletable && !readonly && !disabled && file.status !== 'loading' ? <view className="ui-upload-remove" catchtap={() => { 'background only'; void remove(file, index); }} accessibility-element accessibility-traits="button" accessibility-label={`删除${file.name ?? `图片${index + 1}`}`}><Icon name="close" size={16} color="#fff" /></view> : null}
      {renderPreviewCover?.({ file, index })}
    </view>)}
    {!readonly && withinLimit ? <view className={`${children ? 'ui-upload-evoke-slot' : 'ui-upload-add'} ${evokeClassName}`} bindtap={() => { 'background only'; void choose(); }} accessibility-element accessibility-traits="button" accessibility-label={disabled ? '上传已禁用' : uploading ? `上传中${Math.round(progress)}%` : uploadText ?? '上传图片'}>
      {uploading ? <><Loading type={loadingType} size={loadingSize} /><text>{Math.round(progress)}%</text></> : children ?? <><Icon name={uploadIcon} size={32} color={disabled ? 'var(--cso-ui-disabled-text)' : 'var(--cso-ui-text-muted)'} />{uploadText ? <text>{uploadText}</text> : null}{limit > 0 && showLimitNum ? <text className="ui-upload-count">（{fileList.length}/{limit}）</text> : null}</>}
    </view> : null}
  </view>;
}
