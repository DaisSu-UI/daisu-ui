import { useDemoLocale } from '../demoLocale.js';
import { Grid, GridItem } from '@daisu-ui/ui';
import { useAppRouter } from '../../../app/router.js';
import cat from '../../../assets/demo-cat.png';
import { DemoGroup, ExampleBlock } from './shared.js';
const cells=(count:number)=>Array.from({length:count},(_,i)=><GridItem key={i} icon="image" text="文字"/>);
const horizontal=(reverse=false)=>['图标居'+(reverse?'右':'左'),'设置选项','卡券中心','订单列表'].map((text,i)=><GridItem key={i} icon={['image','settings','tag','list'][i]} text={text}/>);
export function GridExample(){
  const { text: demoText } = useDemoLocale();
  const router=useAppRouter();
  return <view className="demo-grid-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法" noPadding><Grid clickable>{cells(4)}</Grid></ExampleBlock><ExampleBlock title="内容插槽" noPadding><Grid>{[0,1,2].map(i=><GridItem key={i}><image src={cat} className="demo-grid-image" mode="scaleToFill"/></GridItem>)}</Grid></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock title="自定义列数" noPadding><Grid column={3}>{cells(6)}</Grid></ExampleBlock><ExampleBlock title="正方形格子" noPadding><Grid square column={4} border gutter={10}>{cells(8)}</Grid></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="自定义背景颜色" noPadding><Grid bgColor="var(--cso-ui-canvas)">{cells(4)}</Grid></ExampleBlock><ExampleBlock title="显示border"><Grid column={3} border>{cells(6)}</Grid></ExampleBlock><ExampleBlock title="设定格间隙" noPadding><Grid gutter={10} column={4}>{cells(8)}</Grid></ExampleBlock><ExampleBlock title="提示信息" noPadding><Grid><GridItem isDot icon="gift" text={demoText("文字")}/><GridItem value={100} max={99} icon="desktop" text={demoText("文字")}/></Grid></ExampleBlock></DemoGroup>
    <DemoGroup title="布局能力"><ExampleBlock title="横向布局" noPadding><Grid direction="horizontal" column={2}>{horizontal()}</Grid></ExampleBlock><ExampleBlock title="横向布局 + 图标调换" noPadding><Grid direction="horizontal" reverse column={2} border>{horizontal(true)}</Grid></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="图标插槽" noPadding><Grid>{[0,1,2].map(i=><GridItem key={i} text={demoText("文字")} renderIcon={<image src={cat} className="demo-grid-slot-image"/>}/>)}</Grid></ExampleBlock><ExampleBlock title="文字插槽" noPadding><Grid>{[0,1,2].map(i=><GridItem key={i} icon="image" text={<text className="demo-grid-slot-text">{demoText("自定义文字插槽")}</text>} textClassName="demo-grid-custom-text"/>)}</Grid></ExampleBlock><ExampleBlock title="自定义样式" noPadding><Grid><GridItem ellipsis className="demo-grid-custom-item" icon="search-line" text={demoText("AI 友好的设计系统，提供 80+ 高质量组件，支持暗黑模式、国际化和自定义主题。")}/><GridItem ellipsis className="demo-grid-custom-item" icon="settings" text={demoText("基于Vue3+TS开发，提供80+高质量组件，支持暗黑模式、国际化和自定义主题。")}/></Grid></ExampleBlock><ExampleBlock title="页面导航" noPadding><Grid clickable onNavigate={(_url,options)=>{ 'background only';void router.navigate({to:'/ui-demo/$page',params:{page:'button'},replace:options.replace});}}><GridItem url="/ui-demo/button" linkType="replace" icon="edit" text="Redirect to ..."/><GridItem url="/ui-demo/button" icon="edit" text="Navigate to ..."/></Grid></ExampleBlock></DemoGroup>
  </view>;
}
