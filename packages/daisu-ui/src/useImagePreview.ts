import { useCallback, useState } from '@lynx-js/react';
import type { ImagePreviewOptions, ImagePreviewProps } from './ImagePreview.js';
/** Every hook owns one preview; mount its props on a matching ImagePreview. */
export function useImagePreview(defaults:ImagePreviewOptions={}){
 const [show,setShow]=useState(false),[options,setOptions]=useState<ImagePreviewOptions>(defaults),[requestKey,setRequestKey]=useState(0);
 const previewImage=useCallback((input:readonly string[]|ImagePreviewOptions)=>{
  'background only';setOptions(Array.isArray(input)?{images:input}:input as ImagePreviewOptions);setRequestKey(value=>value+1);setShow(true);
 },[]);
 const closeImagePreview=useCallback(()=>{ 'background only';setShow(false); },[]);
 const props:ImagePreviewProps={...defaults,options,show,onShowChange:setShow,requestKey};
 return {props,previewImage,closeImagePreview};
}
