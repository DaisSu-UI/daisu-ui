import { useDemoLocale } from '../demoLocale.js';
import { useState } from '@lynx-js/react';
import { Button, Cell, CellGroup, Gap, Img, Swiper, Switch } from '@daisu-ui/ui';
import redpanda from '../../../assets/demo-red-panda.jpg';
import capybara from '../../../assets/demo-capybara.jpg';
import panda from '../../../assets/demo-panda.jpg';
import meng from '../../../assets/demo-landscape.jpg';
import moon from '../../../assets/demo-moon.jpg';
import { swiperIndex } from '@daisu-ui/ui/utils';
import { DemoGroup, ExampleBlock } from './shared.js';
const images=[redpanda,capybara,panda,moon,meng];
const titled=images.slice(0,4).map((url,index)=>({url,title:['小熊猫！','卡！皮！巴！拉！','大熊猫！','诗画中国！'][index]}));
export function SwiperExample(){
  const { text: demoText } = useDemoLocale();
 const [loop,setLoop]=useState(false),[controlled,setControlled]=useState(0);
 return <view className="demo-swiper-page"><DemoGroup title="组件类型"><ExampleBlock title="点状指示器" noPadding><Swiper list={images} defaultCurrent={0}/></ExampleBlock><ExampleBlock title="点条状指示器" noPadding><Swiper list={images} defaultCurrent={1} indicator={{type:'dots-bar'}}/></ExampleBlock><ExampleBlock title="数字指示器" noPadding><Swiper list={images} defaultCurrent={2} indicator={{type:'fraction'}} indicatorPosition="bottom-right"/></ExampleBlock></DemoGroup>
 <DemoGroup title="组件变体"><ExampleBlock title="手动切换" noPadding><Swiper list={images} defaultCurrent={3} autoplay={false} loop={false} indicator={{showControls:true}}/></ExampleBlock><ExampleBlock title="指定valueKey和textKey" noPadding><Swiper list={titled} valueKey="url" textKey="title" defaultCurrent={0}/></ExampleBlock></DemoGroup>
 <DemoGroup title="组件样式"><ExampleBlock title="卡片样式" noPadding><view className="demo-swiper-card"><Swiper list={images} defaultCurrent={4} previousMargin={24} nextMargin={24} customItemClass="demo-swiper-card-item" neighborHeight={168} customIndicatorClass="demo-swiper-card-indicator"/></view></ExampleBlock><ExampleBlock title="同时展示2个滑块" noPadding><view className="demo-swiper-card"><Swiper list={images} defaultCurrent={0} displayMultipleItems={2} previousMargin={24} nextMargin={24} customItemClass="demo-swiper-card-item" neighborHeight={168} customIndicatorClass="demo-swiper-card-indicator"/></view></ExampleBlock><ExampleBlock title="自定义指示器" noPadding><Swiper list={images} defaultCurrent={0} renderIndicator={({current,total})=><text className="demo-swiper-custom-indicator">{demoText(current+1)}/{demoText(total)}</text>}/></ExampleBlock></DemoGroup>
 <DemoGroup title="特殊样式"><ExampleBlock title="属性控制切换" noPadding><Swiper list={images} current={controlled} loop={loop} autoplay={false} onChange={value=>{ 'background only';setControlled(value); }}/><Gap/><CellGroup><Cell title="loop"><Switch size={24} value={loop} style={{alignSelf:'flex-end'}} inactiveColor="var(--cso-ui-line)" onChange={({value})=>{ 'background only';setLoop(Boolean(value)); }}/></Cell><Cell title="current" value={String(controlled)}/></CellGroup><view className="demo-swiper-actions"><Button label="prev" onTap={()=>{ 'background only';setControlled(value=>swiperIndex(value-1,images.length,loop)); }}/><Button label="next" tone="success" onTap={()=>{ 'background only';setControlled(value=>swiperIndex(value+1,images.length,loop)); }}/></view></ExampleBlock><ExampleBlock title="插槽用法" noPadding><Swiper list={images} defaultCurrent={1} indicator={{type:'dots-bar'}} renderItem={({item})=><Img src={String(item)} mode="aspectFill" width="100%" height="100%" showLoading={false} showError={false}/>}/></ExampleBlock></DemoGroup>
 </view>;
}
