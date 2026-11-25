import { useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { BaseEvent, CSSProperties, ImageErrorEvent, ImageLoadEvent } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { imgDimension, imgFrame } from './imgModel.js';
import type { ImgMode, ImgSize } from './imgModel.js';

export type ImgPreview = (url: string) => void | Promise<void>;
export type ImgProps = {
  src?: string; previewSrc?: string; width?: number | string; height?: number | string;
  mode?: ImgMode; round?: boolean; radius?: number | string; showLoading?: boolean; showError?: boolean;
  loading?: ReactNode; error?: ReactNode; enablePreview?: boolean; onPreview?: ImgPreview;
  onPreviewError?: (error: Error) => void; onClick?: () => void;
  onLoad?: (event: BaseEvent<'load', ImageLoadEvent>) => void;
  onError?: (event: BaseEvent<'error', ImageErrorEvent>) => void;
  alt?: string; customImage?: string; className?: string; style?: CSSProperties;
};

// A source change remounts image state, including when returning to a previously failed URL.
export function Img(props: ImgProps) { return <ImgSource key={props.src || ''} {...props} />; }
function ImgSource({ src = '', previewSrc, width, height, mode = 'scaleToFill', round = false, radius,
  showLoading = true, showError = true, loading, error, enablePreview = false, onPreview,
  onPreviewError, onClick, onLoad, onError, alt = '', customImage = '', className = '', style }: ImgProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [natural, setNatural] = useState<ImgSize | null>(null), [box, setBox] = useState<ImgSize>({ width: 0, height: 0 });
  const active = useRef(true), state = useRef(status), previewing = useRef(false);
  useEffect(() => () => { active.current = false; }, []);
  const nativeMode = mode === 'scaleToFill' || mode === 'aspectFit' || mode === 'aspectFill';
  // Native image sizing follows its parent on the main thread. Measuring these
  // modes would send every animated height through the background renderer.
  const frame = !nativeMode && natural && box.width > 0 && box.height > 0 ? imgFrame(mode, box, natural) : null;
  const autoHeight = mode === 'widthFix' && height === undefined && natural && box.width > 0 ? Math.round(box.width * natural.height / natural.width) : undefined;
  const autoWidth = mode === 'heightFix' && width === undefined && natural && box.height > 0 ? Math.round(box.height * natural.width / natural.height) : undefined;
  const tap = () => {
    'background only';
    onClick?.();
    if (!enablePreview || state.current !== 'success' || !src || previewing.current) return;
    previewing.current = true;
    void Promise.resolve().then(() => {
      if (!onPreview) throw new Error('请提供图片预览适配器');
      return onPreview(previewSrc || src);
    }).catch(reason => { if (active.current) onPreviewError?.(reason instanceof Error ? reason : new Error(String(reason))); }).finally(() => { previewing.current = false; });
  };
  return <view className={`ui-img ${round ? 'ui-img-round' : ''} ui-img-${status} ${className}`}
    style={{ width: autoWidth === undefined ? imgDimension(width, 320) : `${autoWidth}px`, height: autoHeight === undefined ? imgDimension(height, 240) : `${autoHeight}px`, ...(radius === undefined ? {} : { borderRadius: imgDimension(radius, 0) }), ...style }}
    flatten={false} bindlayoutchange={event => {
      'background only';
      if (nativeMode) return;
      const { width: w, height: h } = event.detail;
      if (Number.isFinite(w) && Number.isFinite(h) && w >= 0 && h >= 0) setBox(previous => previous.width === w && previous.height === h ? previous : { width: w, height: h });
    }} bindtap={tap} accessibility-element={!!alt || enablePreview} accessibility-label={alt || '图片'} accessibility-traits={enablePreview ? 'button' : 'image'}>
    {src && status !== 'error' ? <image className={`ui-img-image ${customImage}`} src={src} mode={frame?.mode || (mode === 'aspectFit' || mode === 'aspectFill' ? mode : 'scaleToFill')}
      style={frame ? { width: `${frame.width}px`, height: `${frame.height}px`, left: `${frame.left}px`, top: `${frame.top}px` } : {width:'100%',height:'100%',left:0,top:0}}
      bindload={event => {
        'background only';
        if (!active.current || state.current !== 'loading') return;
        const { width: w, height: h } = event.detail;
        if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) setNatural({ width: w, height: h });
        state.current = 'success'; setStatus('success'); onLoad?.(event);
      }} binderror={event => {
        'background only';
        if (!active.current || state.current !== 'loading') return;
        state.current = 'error'; setStatus('error'); onError?.(event);
      }} /> : null}
    {status === 'loading' && showLoading ? <view className="ui-img-placeholder ui-img-loading-placeholder">{loading ?? <Icon name="image" size={32} color="#a9acb8" />}</view> : null}
    {status === 'error' && showError ? <view className="ui-img-placeholder ui-img-error-placeholder">{error ?? <Icon name="image-failloading" size={32} color="#a9acb8" />}</view> : null}
  </view>;
}
