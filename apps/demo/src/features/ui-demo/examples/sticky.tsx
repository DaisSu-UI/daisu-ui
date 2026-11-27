import { useDemoLocale } from '../demoLocale.js';
import { useEffect, useState } from '@lynx-js/react';
import { Button, Sticky, StickyBox } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
export function StickyExample(){
  const { text: demoText } = useDemoLocale();
 const [show,setShow]=useState(false),[scrollTop,setScrollTop]=useState(0);
 useEffect(()=>{const timer=setTimeout(()=>setShow(true),5000);return()=>clearTimeout(timer);},[]);
 return <scroll-view className="ui-demo-component-scroll" scroll-orientation="vertical" style={{zIndex:0}} bindscroll={event=>{'background only';setScrollTop(event.detail.scrollTop);}}><view className="ui-demo-component-content"><view className="demo-sticky-page"><DemoGroup title="组件类型"><ExampleBlock title="基本用法"><view className="demo-sticky-container"><Sticky scrollTop={scrollTop} offsetTop={44} style={{marginLeft:'20px'}}><Button tone="success" label={demoText("基础用法")}/></Sticky></view></ExampleBlock><ExampleBlock title="相对容器"><view className="demo-sticky-container"><StickyBox><view className="demo-sticky-box"><Sticky scrollTop={scrollTop} offsetTop={44}><Button tone="warning" label={demoText("相对容器")}/></Sticky></view></StickyBox></view></ExampleBlock></DemoGroup>
 <DemoGroup title="组件样式"><ExampleBlock title="吸顶距离"><view className="demo-sticky-container"><Sticky scrollTop={scrollTop} offsetTop={94}><Button label={demoText("吸顶距离")}/></Sticky></view></ExampleBlock><ExampleBlock title="相对容器+吸顶距离"><view className="demo-sticky-container"><StickyBox><view className="demo-sticky-box"><Sticky scrollTop={scrollTop} offsetTop={194}><Button tone="warning" label={demoText("相对容器+吸顶距离")}/></Sticky></view></StickyBox></view></ExampleBlock></DemoGroup>
 <DemoGroup title="特殊样式"><ExampleBlock title="动态插入"><view className="demo-sticky-container demo-sticky-dynamic"><Button tone="info" variant="plain" label={demoText("点击插入")} onTap={()=>{ 'background only';setShow(true); }}/><Sticky scrollTop={scrollTop} offsetTop={44} style={{marginTop:show?0:'24px'}}>{show?<Button tone="danger" label={demoText("动态生成")}/>:null}</Sticky></view></ExampleBlock></DemoGroup></view><view className="ui-demo-bottom-space"/></view></scroll-view>;
}
