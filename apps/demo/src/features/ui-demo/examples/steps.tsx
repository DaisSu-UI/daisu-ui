import { useDemoLocale } from '../demoLocale.js';
import { useState } from '@lynx-js/react';
import { Button, Steps, Step, ConfigProvider, useConfigProvider } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
export function StepsExample(){
  const { text: demoText } = useDemoLocale();
 const {theme}=useConfigProvider();
 const [active,setActive]=useState(0),[dots,setDots]=useState(0),[vertical,setVertical]=useState(0);
 const rows=(word='注册1个账号')=>[word,'登录账号并绑定手机','完善个人信息'].map((description,index)=><Step key={index} title={demoText(`步骤${index+1}`)} description={demoText(description)}/>);
 const next=(action:()=>void)=><view className="demo-steps-action"><Button size="small" onTap={action} label={demoText("下一步")}/></view>;
 return <ConfigProvider className="demo-steps-page" themeVars={{primary:theme==='dark'?'#5b90ff':'#1c64fd',danger:theme==='dark'?'#ff6b6b':'#f14646'}}><DemoGroup title="组件类型"><ExampleBlock title="基本用法"><Steps><Step/><Step/><Step/></Steps></ExampleBlock><ExampleBlock title="标题和描述信息"><Steps active={active} alignCenter>{rows()}</Steps>{next(()=>{ 'background only';setActive(value=>value+1); })}</ExampleBlock><ExampleBlock title="修改图标"><Steps active={1} alignCenter><Step icon="settings"/><Step icon="list"/><Step icon="clock-circle"/></Steps></ExampleBlock></DemoGroup>
 <DemoGroup title="组件状态"><ExampleBlock title="修改状态"><Steps active={1} alignCenter><Step title={demoText("绑定手机")}/><Step title={demoText("重新绑定手机")} status="error"/><Step title={demoText("步骤3")}/></Steps></ExampleBlock></DemoGroup>
 <DemoGroup title="组件样式"><ExampleBlock title="水平局中"><Steps alignCenter><Step/><Step/><Step/></Steps></ExampleBlock></DemoGroup>
 <DemoGroup title="布局能力"><ExampleBlock title="竖向步骤条"><Steps active={1} vertical><Step description={demoText("注册1个账号")}/><Step description={demoText("登录账号并绑定手机，后面是比较长的文案，后面是比较长的文案")}/><Step description={demoText("完善个人信息")}/></Steps></ExampleBlock></DemoGroup>
 <DemoGroup title="特殊样式"><ExampleBlock title="点状步骤条"><Steps active={1} dot alignCenter>{rows()}</Steps></ExampleBlock><ExampleBlock title="可控制的点状步骤条"><Steps active={dots} dot alignCenter>{rows('注册一个账号')}</Steps>{next(()=>{ 'background only';setDots(value=>(value+1)%4); })}</ExampleBlock><ExampleBlock title="点状步骤和垂直方向"><Steps active={1} vertical dot><Step description={demoText("注册1个账号")}/><Step description={demoText("登录账号并绑定手机")}/><Step description={demoText("完善个人信息")}/></Steps></ExampleBlock><ExampleBlock title="可控制的竖向点状步骤条"><Steps active={vertical} vertical dot>{rows('注册一个账号')}</Steps>{next(()=>{ 'background only';setVertical(value=>(value+1)%4); })}</ExampleBlock></DemoGroup></ConfigProvider>;
}
