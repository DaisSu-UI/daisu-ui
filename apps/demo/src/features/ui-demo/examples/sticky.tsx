import { useEffect, useState } from '@lynx-js/react';
import { Button, Sticky, StickyBox } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
export function StickyExample(){
 const [show,setShow]=useState(false);
 useEffect(()=>{const timer=setTimeout(()=>setShow(true),5000);return()=>clearTimeout(timer);},[]);
 return <view className="demo-sticky-page"><DemoGroup title="组件类型"><ExampleBlock title="基本用法"><view className="demo-sticky-container"><Sticky offsetTop={44} style={{marginLeft:'20px'}}><Button tone="success" label="基础用法"/></Sticky></view></ExampleBlock><ExampleBlock title="相对容器"><view className="demo-sticky-container"><StickyBox><view className="demo-sticky-box"><Sticky offsetTop={44}><Button tone="warning" label="相对容器"/></Sticky></view></StickyBox></view></ExampleBlock></DemoGroup>
 <DemoGroup title="组件样式"><ExampleBlock title="吸顶距离"><view className="demo-sticky-container"><Sticky offsetTop={94}><Button label="吸顶距离"/></Sticky></view></ExampleBlock><ExampleBlock title="相对容器+吸顶距离"><view className="demo-sticky-container"><StickyBox><view className="demo-sticky-box"><Sticky offsetTop={194}><Button tone="warning" label="相对容器+吸顶距离"/></Sticky></view></StickyBox></view></ExampleBlock></DemoGroup>
 <DemoGroup title="特殊样式"><ExampleBlock title="动态插入"><view className="demo-sticky-container demo-sticky-dynamic"><Button tone="info" variant="plain" label="点击插入" onTap={()=>{ 'background only';setShow(true); }}/><Sticky offsetTop={44} style={{marginTop:show?0:'24px'}}>{show?<Button tone="danger" label="动态生成"/>:null}</Sticky></view></ExampleBlock></DemoGroup></view>;
}
