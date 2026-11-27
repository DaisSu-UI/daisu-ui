import { useDemoLocale } from '../demoLocale.js';
import { useState } from '@lynx-js/react';
import { Grid, GridItem, Skeleton, Switch } from '@daisu-ui/ui';
import type { SkeletonRow, SkeletonTheme } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
const grid:SkeletonRow[]=[Array.from({length:5},()=>({width:48,height:48})),Array.from({length:5},()=>({width:48,height:16}))];
const imageGroup:SkeletonRow[]=[{height:171},1,{width:107},[{width:93},{width:32,marginLeft:41}]];
export function SkeletonExample(){
  const { text: demoText } = useDemoLocale();
 const [loading,setLoading]=useState(true);
 return <view className="demo-skeleton-page"><DemoGroup title="组件类型">{([['头像骨架屏','avatar'],['图片骨架屏','image'],['文本骨架屏','text'],['段落骨架屏','paragraph']] as [string,SkeletonTheme][]).map(([title,theme])=><ExampleBlock title={title} key={theme}><Skeleton theme={theme}/></ExampleBlock>)}</DemoGroup>
 <DemoGroup title="组件样式"><ExampleBlock title="宫格骨架屏"><Skeleton rowCol={grid}/></ExampleBlock><ExampleBlock title="单元格骨架屏">{(['circle','rect'] as const).map((type,index)=><view key={type} className={`demo-skeleton-row ${index?'demo-skeleton-row-top':''}`}><Skeleton style={{flexShrink:0}} rowCol={[{size:48,type}]}/><Skeleton style={{width:'100%',marginLeft:'12px'}} rowCol={[{width:'50%'},{width:'100%'}]}/></view>)}</ExampleBlock><ExampleBlock title="图片组合骨架屏"><Skeleton rowCol={imageGroup}/><Skeleton style={{marginTop:'20px'}} rowCol={imageGroup}/></ExampleBlock></DemoGroup>
 <DemoGroup title="特殊样式"><ExampleBlock title="渐变加载动画"><Skeleton animation="gradient" theme="paragraph"/></ExampleBlock><ExampleBlock title="闪烁加载动画"><view className="demo-skeleton-row"><Skeleton style={{flexShrink:0}} rowCol={[{size:48,type:'circle'}]}/><Skeleton style={{width:'100%',marginLeft:'12px'}} animation="flashed" theme="paragraph"/></view></ExampleBlock><ExampleBlock title="插槽内容"><text className="demo-skeleton-switch-label">{demoText("切换显示")}</text><Switch value={loading} onChange={({value})=>{ 'background only';setLoading(Boolean(value)); }}/><view className="demo-skeleton-switch-gap"/><Skeleton loading={loading} rowCol={grid}><Grid>{Array.from({length:5},(_,index)=><GridItem key={index} icon="camera" iconSize={32} text={demoText("文字")}/>)}</Grid></Skeleton></ExampleBlock></DemoGroup></view>;
}
