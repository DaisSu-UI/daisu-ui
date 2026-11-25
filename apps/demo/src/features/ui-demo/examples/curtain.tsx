import { useState } from '@lynx-js/react';
import { Button, Curtain } from 'daisu-ui';
import type { CurtainClosePosition } from 'daisu-ui';
import cat from '../../../assets/wot-black-cat-preview.png';
import { DemoGroup, ExampleBlock } from './shared.js';
const positions:CurtainClosePosition[]=['inset','top-left','top','top-right','bottom-left','bottom','bottom-right','bottom-right','inset'];
export function CurtainExample(){
 const [opened,setOpened]=useState<number|null>(null);
 const button=(index:number,label:string)=><Button key={index} label={label} onTap={()=>{ 'background only';setOpened(index); }}/>,hide=()=>{ 'background only';setOpened(null); };
 return <view className="demo-curtain-page"><DemoGroup title="组件类型"><ExampleBlock title="基本用法"><view className="demo-curtain-buttons">{button(0,'关闭按钮在内部')}</view></ExampleBlock></DemoGroup><DemoGroup title="组件样式"><ExampleBlock title="修改按钮位置"><view className="demo-curtain-buttons">{['左上','顶部','右上','左下','底部','右下'].map((label,index)=>button(index+1,label))}</view></ExampleBlock></DemoGroup><DemoGroup title="组件状态"><ExampleBlock title="点击遮罩关闭"><view className="demo-curtain-buttons">{button(7,'点击遮罩关闭')}</view></ExampleBlock></DemoGroup><DemoGroup title="特殊样式"><ExampleBlock title="自定义关闭按钮"><view className="demo-curtain-buttons">{button(8,'自定义关闭按钮')}</view></ExampleBlock></DemoGroup>
 {positions.map((position,index)=><Curtain key={index} src={cat} width={280} value={opened===index} onChange={hide} rootPortal closePosition={position} closeOnClickModal={index===7} renderClose={index===8?close=><text className="demo-curtain-custom-close" catchtap={close}>关闭</text>:undefined}/>)}
 </view>;
}
