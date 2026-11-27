import { useDemoLocale } from '../demoLocale.js';
import { useRef } from '@lynx-js/react';
import { Button, Icon, NoticeBar, Toast, useToast, useConfigProvider } from '@daisu-ui/ui';
import type { NoticeBarClick, NoticeBarRef } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
const poems=['芦叶满汀洲','寒沙带浅流','二十年重过南楼','柳下系船犹未稳','能几日','又中秋'];
const message='这是一条消息提示信息';
export function NoticeBarExample(){
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const ref=useRef<NoticeBarRef>(null),toast=useToast(),config=useConfigProvider();
  const click=({index,text}:NoticeBarClick)=>{ 'background only'; toast.info(`${index+1}：${text}`); };
  return <view className="demo-notice-bar-page">
    <DemoGroup title="组件类型"><ExampleBlock noPadding title="基本用法"><NoticeBar text={demoText(message.repeat(3))} prefix="exclamation-circle-fill"/></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock noPadding title="类型修改"><NoticeBar type="danger" text={demoText('当前网络不可用，请检查你的网络设置。'.repeat(2))} prefix="close-circle-fill" className="demo-notice-bar-space"/><NoticeBar type="info" text={demoText('点击查看信息详情，'.repeat(4)+'点击查看信息详情。')} prefix="info-circle-fill"/></ExampleBlock><ExampleBlock noPadding title="可关闭的"><NoticeBar text={demoText(Array(3).fill(message).join('，')+'。')} closable prefix="sound"/></ExampleBlock></DemoGroup>
    <DemoGroup title="内容形态"><ExampleBlock noPadding title="禁止滚动"><NoticeBar scrollable={false} text={demoText("欲买桂花同载酒，终不似少年游…")} prefix="stop"/></ExampleBlock>
      <ExampleBlock noPadding title="插槽"><NoticeBar scrollable={false} prefix={<Icon name="stop" size={20} color={config.theme==='dark'?'#ffa94d':'#f57f00'}/>} suffix={<text className="demo-notice-bar-link" bindtap={()=>{ 'background only';toast.info('查看通知详情'); }}>{demoText("查看")}</text>}>{demoText("通知被禁或时段内消息屏蔽可能造成消…")}</NoticeBar></ExampleBlock>
      <ExampleBlock noPadding title="多行展示"><NoticeBar text={demoText(Array(3).fill(message).join('，').repeat(2))} wrapable scrollable={false}/></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock noPadding title="自定义颜色"><NoticeBar text={demoText(Array(3).fill(message).join('，'))} prefix="robot" color={config.theme==='dark'?'#20c997':'#59cdaa'} backgroundColor={config.theme==='dark'?'#053c2c':'#f3fbf9'} className="demo-notice-bar-custom"/></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊用法"><ExampleBlock noPadding title="多文本轮播"><NoticeBar text={demoText(poems)} prefix="thunderbolt" onClick={click}/></ExampleBlock><ExampleBlock noPadding title="垂直滚动"><NoticeBar text={demoText(poems)} prefix="experiment" direction="vertical" delay={3} className="demo-notice-bar-space" onClick={click}/><NoticeBar text={demoText("只有一条消息不会滚动")} prefix="experiment" direction="vertical" delay={3} className="demo-notice-bar-space" onClick={click}/></ExampleBlock><ExampleBlock noPadding title="重置播放动画"><NoticeBar ref={ref} text={demoText(poems)} prefix="wifi" direction="vertical" delay={3} className="demo-notice-bar-space"/><Button label={demoText("重置播放动画")} onTap={()=>{ 'background only';ref.current?.reset(); }}/></ExampleBlock></DemoGroup>
    <Toast {...demoCopy(toast.props)}/>
  </view>;
}
