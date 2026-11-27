import { useDemoLocale } from '../demoLocale.js';
import { useInitData, useRef, useState } from '@lynx-js/react';
import { Button, VideoPreview, useVideoPreview } from '@daisu-ui/ui';
import type { VideoPreviewRef } from '@daisu-ui/ui';
import poster from '../../../assets/demo-cat.png';
import { DemoGroup, ExampleBlock } from './shared.js';
import url from '../../../assets/demo-journey.mp4';
export function VideoPreviewExample(){
  const { text: demoText, copy: demoCopy } = useDemoLocale();
 const init=useInitData() as unknown,browser=!!init&&typeof init==='object'&&'browserMedia' in init&&init.browserMedia===true;
 const main=useVideoPreview(),sub=useVideoPreview(),ref=useRef<VideoPreviewRef>(null),[error,setError]=useState('');
 const video={url,poster,title:'视频预览'};
 return <view className="demo-video-preview-page">
  <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><Button disabled={!browser} label={demoText("点击预览视频")} onTap={()=>{'background only';main.previewVideo(video);}}/></ExampleBlock></DemoGroup>
  <DemoGroup title="特殊样式"><ExampleBlock title="多实例调用"><Button disabled={!browser} label={demoText("默认实例")} onTap={()=>{'background only';main.previewVideo(video);}}/><Button disabled={!browser} label={demoText("指定实例")} onTap={()=>{'background only';sub.previewVideo({...video,title:'指定实例预览',closePosition:'left-top'});}}/></ExampleBlock>
   <ExampleBlock title="全屏预览"><Button disabled={!browser} label={demoText("点击预览全屏视频")} onTap={()=>{'background only';main.previewVideo({...video,title:'全屏预览',fullScreen:true});}}/></ExampleBlock>
   <ExampleBlock title="组件实例调用"><Button disabled={!browser} label={demoText("通过 ref 打开")} onTap={()=>{'background only';ref.current?.open(video);}}/></ExampleBlock>
  </DemoGroup>
  {!browser?<text className="demo-rich-hint">{demoText("当前环境暂不支持视频预览，请在浏览器中体验。")}</text>:null}{error?<text className="demo-rich-hint">{demoText(error)}</text>:null}
  <VideoPreview {...demoCopy(main.props)} ref={ref} rootPortal mediaMode={browser?'browser':'none'} onError={({message})=>{'background only';setError(message);}}/>
  <VideoPreview {...demoCopy(sub.props)} rootPortal mediaMode={browser?'browser':'none'} onError={({message})=>{'background only';setError(message);}}/>
 </view>;
}
