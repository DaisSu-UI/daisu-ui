import { useCallback, useState } from '@lynx-js/react';
import type { VideoPreviewOptions, VideoPreviewProps } from './VideoPreview.js';
/** Each hook owns one explicitly mounted preview, with no global selector state. */
export function useVideoPreview(defaults:Partial<VideoPreviewOptions>={}){
  const [show,setShow]=useState(false),[options,setOptions]=useState<VideoPreviewOptions>(),[requestKey,setRequestKey]=useState(0);
  const previewVideo=useCallback((video:VideoPreviewOptions)=>{'background only';setOptions(video);setRequestKey(v=>v+1);setShow(true);},[]);
  const closeVideoPreview=useCallback(()=>{'background only';setShow(false);},[]);
  const props:VideoPreviewProps={...defaults,options,show,onShowChange:setShow,requestKey};
  return {props,previewVideo,closeVideoPreview};
}
