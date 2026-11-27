import { useDemoLocale } from '../demoLocale.js';
import { Button, ImagePreview, SwiperNav, useImagePreview } from '@daisu-ui/ui';
import type { ImagePreviewOptions } from '@daisu-ui/ui';
import redpanda from '../../../assets/demo-red-panda.jpg';
import capybara from '../../../assets/demo-capybara.jpg';
import panda from '../../../assets/demo-panda.jpg';
import moon from '../../../assets/demo-moon.jpg';
import meng from '../../../assets/demo-landscape.jpg';
import { DemoGroup, ExampleBlock } from './shared.js';
const images=[redpanda,capybara,panda,moon,meng],labels=['小熊猫','水豚','大熊猫','月亮','萌宠'];
export function ImagePreviewExample(){
  const { text: demoText, copy: demoCopy } = useDemoLocale();
 const preview=useImagePreview(),custom=useImagePreview();
 const open=(input:ImagePreviewOptions={})=>{ 'background only';preview.previewImage({images,...input}); };
 return <view className="demo-image-preview-page">
  <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><Button label={demoText("预览图片")} onTap={()=>open()}/></ExampleBlock><ExampleBlock title="传入图片数组"><Button label={demoText("直接传入数组")} onTap={()=>preview.previewImage(images)}/></ExampleBlock></DemoGroup>
  <DemoGroup title="组件变体"><ExampleBlock title="指定起始位置"><Button label={demoText("从第二张开始")} onTap={()=>open({startPosition:1})}/></ExampleBlock></DemoGroup>
  <DemoGroup title="组件配置"><ExampleBlock title="隐藏页码"><Button label={demoText("不显示页码")} onTap={()=>open({showIndex:false})}/></ExampleBlock><ExampleBlock title="隐藏关闭按钮"><Button label={demoText("不显示关闭按钮")} onTap={()=>open({closeable:false})}/></ExampleBlock><ExampleBlock title="关闭按钮位置"><Button label={demoText("左上角")} onTap={()=>open({closeIconPosition:'top-left'})}/><Button label={demoText("右上角")} onTap={()=>open({closeIconPosition:'top-right'})}/></ExampleBlock><ExampleBlock title="禁用点击关闭"><Button label={demoText("点击不关闭")} onTap={()=>open({closeOnClick:false})}/></ExampleBlock><ExampleBlock title="禁用循环"><Button label={demoText("禁用循环播放")} onTap={()=>open({loop:false})}/></ExampleBlock></DemoGroup>
  <DemoGroup title="特殊用法"><ExampleBlock title="监听事件"><Button label={demoText("带事件回调")} onTap={()=>open({onOpen:()=>console.info('预览已打开'),onClose:()=>console.info('预览已关闭'),onChange:index=>console.info('当前图片索引:',index)})}/></ExampleBlock><ExampleBlock title="使用插槽"><Button label={demoText("自定义插槽")} onTap={()=>custom.previewImage({images,showIndex:false})}/></ExampleBlock></DemoGroup>
  <ImagePreview {...demoCopy(preview.props)} rootPortal/>
  <ImagePreview {...demoCopy(custom.props)} rootPortal renderIndicator={({current,total})=><SwiperNav current={current} total={total} type="dots-bar" style={{bottom:'64px'}}/>} renderContent={({current})=><text className="demo-image-preview-bottom">{demoText(labels[current])}</text>}/>
 </view>;
}
