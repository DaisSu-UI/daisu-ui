import { useEffect, useState } from '@lynx-js/react';
import { Switch, SwitchThumb, SwitchTrack } from '@lynx-js/lynx-ui';
import { Button, Cell, CellGroup, Slider } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

const poem = '黄鹤断矶头，故人今在否？旧江山浑是新愁。欲买桂花同载酒，终不似，少年游。';
const starPath = 'm12 2 3 6.2 6.8 1-4.9 4.8 1.2 6.8L12 17.6l-6.1 3.2 1.2-6.8-4.9-4.8 6.8-1Z';
const settingsPath = '<path d="m9 3-.7 2.2-2 .8-2.1-1-2 3.4L4 10v2l-1.8 1.6 2 3.4 2.1-1 2 .8L9 19h4l.7-2.2 2-.8 2.1 1 2-3.4L18 12v-2l1.8-1.6-2-3.4-2.1 1-2-.8L13 3Z"/><circle cx="11" cy="11" r="3"/>';

function SettingsIcon() {
  const markup = (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="none" stroke="${color}" stroke-width="1.7" stroke-linejoin="round">${settingsPath}</svg>`;
  return <view className="demo-cell-settings"><svg className="ui-demo-icon-light" content={markup('#4e5369')} /><svg className="ui-demo-icon-dark" content={markup('#e5e6eb')} /></view>;
}

function DemoRating({ label }: { label: string }) {
  const [value, setValue] = useState(0);
  return <view className="demo-cell-rating">{[1, 2, 3, 4, 5].map(score => <view key={score} className={`demo-cell-star ${score <= value ? 'demo-cell-star-selected' : ''}`} accessibility-element accessibility-traits="button" accessibility-label={`${label}：${score} 星`} bindtap={() => { 'background only'; setValue(score); }}><svg content={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${starPath}" fill="${score <= value ? '#1c64fd' : '#c9cbd4'}" stroke="${score <= value ? '#1c64fd' : '#c9cbd4'}" stroke-linejoin="round"/></svg>`} /></view>)}</view>;
}

function DemoSwitch() {
  const [checked, setChecked] = useState(false);
  const change = (next: boolean) => { 'background only'; setChecked(next); };
  return <view className="demo-cell-switch-wrap"><Switch className="demo-cell-switch" checked={checked} onChange={change} switchProps={{ 'accessibility-label': '自定义开关' }}><SwitchTrack className="demo-cell-switch-track" /><SwitchThumb className="demo-cell-switch-thumb" /></Switch></view>;
}

export function CellExample({ onHome, onButton }: { onHome: () => void; onButton: () => void }) {
  const [notice, setNotice] = useState(0);
  const showNotice = () => { 'background only'; setNotice(count => count + 1); };
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(0), 1500);
    return () => clearTimeout(timer);
  }, [notice]);
  return <view className="demo-cell-page">
    <DemoGroup title="组件类型">
      <ExampleBlock title="基本用法" noPadding><CellGroup><Cell title="标题文字" value="内容" /><Cell title="标题文字" description="描述信息" value="内容" /></CellGroup></ExampleBlock>
      <ExampleBlock title="分组标题" noPadding><CellGroup title="交易管理" value="内容"><Cell title="标题文字" value="内容" /><Cell title="标题文字" description={poem} value="内容" /></CellGroup></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="点击事件" noPadding><Cell title="标题文字" value="内容" clickable onTap={showNotice} className="demo-cell-clickable" /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体">
      <ExampleBlock title="Placeholder" noPadding><CellGroup><Cell title="用户名" placeholder="请输入用户名" /><Cell title="手机号" value="188****8888" placeholder="请输入手机号" /><Cell title="左对齐" placeholder="请输入内容" valueAlign="left" /><Cell title="居中对齐" placeholder="请输入内容" valueAlign="center" /></CellGroup></ExampleBlock>
      <ExampleBlock title="页面跳转" noPadding><CellGroup><Cell title="帮助与反馈" arrow onTap={onHome} /><Cell title="设置" value="内容" arrow onTap={onButton} /></CellGroup></ExampleBlock>
      <ExampleBlock title="箭头方向" noPadding><CellGroup>{([{ title: '向上箭头', arrowDirection: 'up' }, { title: '向下箭头', arrowDirection: 'down' }, { title: '向左箭头', arrowDirection: 'left' }, { title: '默认箭头(向右)', arrowDirection: 'right' }] as const).map(item => <Cell key={item.arrowDirection} {...item} arrow />)}</CellGroup></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="卡片风格" noPadding><CellGroup insert><Cell title="标题文字" value="内容" /><Cell title="标题文字" description="描述信息" value="内容" /></CellGroup></ExampleBlock>
      <ExampleBlock title="图标" noPadding><CellGroup><Cell title="标题文字" value="内容" icon={<SettingsIcon />} /><Cell title="标题文字" value="内容" className="demo-cell-custom-icon-row" icon={<view className="demo-cell-custom-icon"><view className="demo-cell-note"><view /><view /></view></view>} /></CellGroup></ExampleBlock>
      <ExampleBlock title="大尺寸" noPadding><CellGroup><Cell title="标题文字" value="内容" size="large" /><Cell title="标题文字" value="内容" size="large" icon={<SettingsIcon />} arrow /><Cell title="标题文字" description="描述信息" value="内容" size="large" /></CellGroup></ExampleBlock>
      <ExampleBlock title="垂直居中" noPadding><CellGroup><Cell title="标题文字" value="内容" center /><Cell title="标题文字" description="描述信息" value="内容" center /></CellGroup></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="展示边框线" noPadding><CellGroup title="交易管理" border><Cell title="标题文字" value="内容" /><Cell title="标题文字" description="这一个cell不想要边框" value="内容" border={false} /><Cell title="标题文字" description="描述信息" value="内容" /></CellGroup></ExampleBlock>
      <ExampleBlock title="表单属性" noPadding><CellGroup border><Cell title="必填" required><DemoRating label="必填评分" /></Cell><Cell title="必填星号在右" required markerSide="after"><DemoRating label="右侧标记评分" /></Cell><Cell title="上下结构" required markerSide="after" vertical><Slider defaultValue={0} /></Cell></CellGroup></ExampleBlock>
      <ExampleBlock title="设置宽度" noPadding><Cell title="标题文字" description="这里是文字描述这里是文字描述这里是文字描述" titleWidth="200px" value="内容" /></ExampleBlock>
      <ExampleBlock title="省略号显示" noPadding><CellGroup><Cell title="正常显示" value="这是一段很长的文字内容，通常情况下会完整显示" /><Cell title="省略号显示" value="这是一段很长的文字内容，当启用ellipsis属性时，超出部分将显示省略号" ellipsis /><Cell title="左对齐省略" value="这是一段很长的文字内容，左对齐并启用省略号功能" valueAlign="left" ellipsis /></CellGroup></ExampleBlock>
      <ExampleBlock title="自定义内容" noPadding><CellGroup><Cell title="标题文字" center><Button label="按钮" size="small" variant="plain" onTap={showNotice} /></Cell><Cell title="标题文字" center><DemoSwitch /></Cell><Cell title="标题文字" arrow onTap={onHome}><text className="demo-cell-order">订购</text></Cell><Cell title={<view className="demo-cell-custom-title"><text>标题文字</text><text className="demo-cell-expiry">25天后到期</text></view>} /></CellGroup></ExampleBlock>
    </DemoGroup>
    {notice ? <view className="demo-cell-toast" user-interaction-enabled={false}><text>点击</text></view> : null}
  </view>;
}
