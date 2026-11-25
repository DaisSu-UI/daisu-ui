import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import type { RichTextMediaConfig, RichTextMediaSignal } from './richTextMedia.js';
import { richTextUrl } from './richTextModel.js';
import { Overlay } from './Overlay.js';
import { Icon } from './Icon.js';
import type {} from './RichText.js';

export type PreviewVideo = { url: string; poster?: string; title?: string };
export type VideoPreviewOptions = PreviewVideo & { zIndex?: number; fullScreen?: boolean; closePosition?: 'left-top' | 'right-top'; onOpen?: () => void; onClose?: () => void };
export type VideoPreviewProps = Partial<VideoPreviewOptions> & {
  show?: boolean; onShowChange?: (show: boolean) => void; options?: VideoPreviewOptions; requestKey?: number;
  mediaMode?: 'browser' | 'none'; rootPortal?: boolean; duration?: number;
  onError?: (error: { src: string; message: string }) => void; className?: string; style?: CSSProperties;
};
export type VideoPreviewRef = { open: (video: VideoPreviewOptions) => boolean; close: () => void };

export const VideoPreview = forwardRef<VideoPreviewRef, VideoPreviewProps>(function VideoPreview({ show, onShowChange, options, requestKey=0, mediaMode='none',rootPortal=false,duration=300,onError,className='',style,...defaults },ref){
  const [innerShow,setInnerShow]=useState(false),[imperative,setImperative]=useState<Partial<VideoPreviewOptions>>({}),[revision,setRevision]=useState(0);
  const imperativeRequest=useRef(requestKey);
  const settings={...defaults,...(imperativeRequest.current===requestKey&&Object.keys(imperative).length?imperative:options)},visible=show??innerShow;
  const active=visible&&mediaMode==='browser'&&!!richTextUrl(settings.url||'');
  const state=useRef({visible,settings,onShowChange,onError,mediaMode,requestKey}),wasVisible=useRef(false),closing=useRef(false),player=useRef<NodesRef|null>(null);
  state.current={visible,settings,onShowChange,onError,mediaMode,requestKey};
  const close=()=>{'background only';if(!state.current.visible||closing.current)return;closing.current=true;player.current?.invoke({method:'pauseMedia'}).exec();setInnerShow(false);state.current.onShowChange?.(false);};
  useImperativeHandle(ref,()=>({open(video){
    'background only';if(state.current.mediaMode!=='browser'||!richTextUrl(video.url)){state.current.onError?.({src:video.url,message:'当前环境不支持此视频地址的预览'});return false;}
    imperativeRequest.current=state.current.requestKey;setImperative(video);setRevision(v=>v+1);closing.current=false;setInnerShow(true);state.current.onShowChange?.(true);return true;
  },close}),[]);
  useEffect(()=>{
    if(active&&!wasVisible.current){closing.current=false;state.current.settings.onOpen?.();}
    else if(!active&&wasVisible.current)state.current.settings.onClose?.();
    wasVisible.current=active;
  },[active]);
  useEffect(()=>{if(visible&&!active)state.current.onError?.({src:settings.url||'',message:mediaMode!=='browser'?'当前环境不支持视频预览':'视频地址不可用'});},[visible,active,mediaMode,settings.url]);
  const config:RichTextMediaConfig={id:'preview',type:'video',sources:[richTextUrl(settings.url||'')].filter(Boolean),title:settings.title||'',poster:richTextUrl(settings.poster||''),loop:false,muted:false,preview:true};
  return <Overlay show={active} rootPortal={rootPortal} duration={duration} lockScroll onTap={close} zIndex={settings.zIndex??1000} className={`ui-video-preview ${className}`} style={style}>
    {active?<view className="ui-video-preview-stage"><daisu-rich-media key={`${requestKey}:${revision}`} ref={player} className={`ui-video-preview-video ${settings.fullScreen?'ui-video-preview-fullscreen':''}`} media-config={JSON.stringify(config)} catchtap={()=>{}} bindmediaevent={({detail:event}:{detail:RichTextMediaSignal})=>{
      'background only';if(!state.current.visible)return;if(event.kind==='close')close();else if(event.kind==='error')state.current.onError?.({src:event.src,message:event.message||'视频加载失败'});
    }}/></view>:null}
    <view className={`ui-video-preview-close ui-video-preview-close-${settings.closePosition??'left-top'}`} catchtap={close} accessibility-element accessibility-label="关闭视频预览" accessibility-traits="button"><Icon name="close" size={24} color="#fff"/></view>
  </Overlay>;
});
