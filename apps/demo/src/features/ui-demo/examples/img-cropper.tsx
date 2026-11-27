import { useDemoLocale } from '../demoLocale.js';
import { useInitData, useRef, useState } from '@lynx-js/react';
import { Button, Icon, Img, ImgCropper } from '@daisu-ui/ui';
import type { ImgCropperRef, ImgCropperResult } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
const ratios=['1:1','3:2','16:9','16:10','1:1'];
export function ImgCropperExample(){
  const { text: demoText } = useDemoLocale();
 const init=useInitData() as unknown,browser=!!init&&typeof init==='object'&&'browserMedia' in init&&init.browserMedia===true;
 const [show,setShow]=useState(false),[current,setCurrent]=useState(0),[images,setImages]=useState<Record<number,ImgCropperResult>>({}),[error,setError]=useState('');
 const cropper=useRef<ImgCropperRef>(null),latest=useRef(images);latest.current=images;
 const open=(index:number)=>{'background only';if(!browser){setError('请在浏览器中使用图片裁剪。');return;}setCurrent(index);setError('');setShow(true);};
 const image=(index:number)=>{
  const height=index===1?200:index===2||index===3?168.75:200,result=images[index];
  return <view className={`demo-cropper-preview ${index===0||index===4?'demo-cropper-circular':'demo-cropper-rectangular'}`} style={{height:`${height}px`}} bindtap={()=>open(index)} accessibility-element accessibility-label={demoText("选择裁剪图片")} accessibility-traits="button">
   {result?<Img src={result.tempFilePath} width="100%" height="100%" mode="aspectFit"/>:<Icon name="camera-fill" size={60} color="#fff"/>}
  </view>;
 };
 return <view className="demo-cropper-page">
  <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><view className="demo-cropper-profile">{image(0)}<text className="demo-cropper-label">{demoText("点击上传头像")}</text></view></ExampleBlock></DemoGroup>
  <DemoGroup title="组件配置"><ExampleBlock title="自定义裁剪比例"><view className="demo-cropper-grid">{[1,2,3].map(index=><view className="demo-cropper-grid-item" key={index}>{image(index)}<text className="demo-cropper-label">{demoText(ratios[index])}{demoText("比例裁剪")}</text></view>)}</view></ExampleBlock></DemoGroup>
  <DemoGroup title="特殊用法"><ExampleBlock title="裁剪后导出"><view className="demo-cropper-profile">{image(4)}<text className="demo-cropper-label">{demoText("点击裁剪并导出 JPEG 头像")}</text></view>{images[4]?<view className="demo-cropper-result"><text className="demo-cropper-label">{demoText(images[4]!.width)} × {demoText(images[4]!.height)} · JPEG</text><Button label={demoText("下载裁剪图片")} size="small" onTap={()=>{'background only';cropper.current?.downloadResult(images[4]!.tempFilePath);}}/></view>:null}</ExampleBlock></DemoGroup>
  {error?<text className="demo-rich-hint">{demoText(error)}</text>:null}
  <ImgCropper ref={cropper} show={show} onShowChange={setShow} mode={browser?'browser':'none'} autoChoose rootPortal topInset={44} style={{'--cso-ui-img-cropper-confirm-bg':'#1c64fd'} as never} aspectRatio={ratios[current]} fileType={current===4?'jpg':'png'} onConfirm={result=>{
   'background only';const previous=latest.current[current];if(previous)cropper.current?.revokeResult(previous.tempFilePath);setImages(old=>({...old,[current]:result}));
  }} onError={({message})=>{'background only';setError(message);}}/>
 </view>;
}
