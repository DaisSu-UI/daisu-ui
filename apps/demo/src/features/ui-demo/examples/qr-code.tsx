import { useInitData,useRef,useState } from '@lynx-js/react';
import { Button, Img, QrCode } from 'daisu-ui';
import type { QrCodeProps, QrCodeRef } from 'daisu-ui';
import { DemoGroup,ExampleBlock } from './shared.js';
import logo from '../../../assets/wot-black-cat.png';
function Code(props:QrCodeProps){return <view className="demo-qr-center"><QrCode text="https://wot-ui.cn" {...props}/></view>;}
export function QrCodeExample(){
 const init=useInitData() as unknown,browser=!!init&&typeof init==='object'&&'browserMedia' in init&&init.browserMedia===true;
 const ref=useRef<QrCodeRef>(null),[image,setImage]=useState(''),[error,setError]=useState('');
 return <view className="demo-qr-page"><DemoGroup title="基础用法">
  <ExampleBlock title="基础二维码"><Code/></ExampleBlock><ExampleBlock title="自定义尺寸"><Code size={280}/></ExampleBlock><ExampleBlock title="自定义颜色"><Code colorDark="#3c9cff" colorLight="#f2f7ff"/></ExampleBlock>
 </DemoGroup><DemoGroup title="样式能力">
  <ExampleBlock title="带 Logo"><Code logo={logo}/></ExampleBlock><ExampleBlock title="Logo 样式"><Code logo={logo} logoWidth={52} logoHeight={52} logoRadius={12} logoBorderColor="#ffffff" logoBorderWidth={4}/></ExampleBlock>
  <ExampleBlock title="码点样式"><view className="demo-qr-grid">{(['dots','rounded','liquid'] as const).map((type,i)=><view key={type} className="demo-qr-style"><QrCode text="https://wot-ui.cn" size={140} dotType={type} dotScale={type==='dots'?.9:1}/><text className="demo-qr-label">{['圆点','圆角','液态'][i]}</text></view>)}</view></ExampleBlock>
 </DemoGroup><DemoGroup title="特殊样式"><ExampleBlock title="渐变颜色"><Code enableGradient gradientDirection={45} gradientColors={['#4f46e5','#06b6d4','#10b981']}/></ExampleBlock><ExampleBlock title="背景图片"><Code backgroundImage={logo} colorDark="rgba(255, 255, 255, 0.8)" colorLight="rgba(15, 31, 50, 0.88)" margin={4}/></ExampleBlock></DemoGroup>
 <DemoGroup title="方法"><ExampleBlock title="导出图片"><view className="demo-qr-center"><QrCode ref={ref} exportMode={browser?'browser':'svg'} text="https://wot-ui.cn" logo={logo}/></view><view className="demo-qr-actions"><Button label="导出二维码" size="small" onTap={async()=>{'background only';try{setImage(await ref.current!.exportImage());setError('');}catch(e){setError(String(e));}}}/></view>{image?<view className="demo-qr-result"><text className="demo-qr-label">导出结果</text><Img src={image} width={200} height={200} mode="aspectFit"/></view>:null}{error?<text>{error}</text>:null}</ExampleBlock></DemoGroup></view>;
}
