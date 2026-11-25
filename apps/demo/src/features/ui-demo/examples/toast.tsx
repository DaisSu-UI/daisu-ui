import { useEffect, useRef } from '@lynx-js/react';
import { Button, Toast, useToast } from 'daisu-ui';
import type { ToastLoadingType } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';
import customIcon from '../../../assets/demo-recycle.svg';

const longText = '这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文案';
const poem = '芦叶满汀洲，寒沙带浅流。二十年重过南楼。柳下系船犹未稳，能几日，又中秋。黄鹤断矶头，故人曾到否？旧江山浑是新愁。欲买桂花同载酒，终不似，少年游。';

export function ToastExample() {
  const toast = useToast();
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = (callback: () => void) => { 'background only'; clearTimeout(timer.current); callback(); };
  const loading = (type: ToastLoadingType, vertical = false) => run(() => {
    toast.loading({ msg: vertical ? poem : '3s后自动关闭', loadingType: type, direction: vertical ? 'vertical' : 'horizontal' });
    timer.current = setTimeout(toast.close, 3000);
  });
  return <view className="demo-toast-page">
    <DemoGroup title="组件类型">
      <ExampleBlock title="基本用法"><view className="demo-toast-buttons"><Button label="toast" onTap={() => run(() => toast.show('提示信息'))} /><Button label="长文案" onTap={() => run(() => toast.show(longText))} /></view></ExampleBlock>
      <ExampleBlock title="类型toast"><view className="demo-toast-buttons"><Button label="成功toast" onTap={() => run(() => toast.success('操作成功'))} /><Button label="错误toast" onTap={() => run(() => toast.error('手机验证码输入错误，请重新输入'))} /><Button label="警告toast" onTap={() => run(() => toast.warning('提示信息'))} /><Button label="常规toast" onTap={() => run(() => toast.info('常规提示信息'))} /></view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件状态">
      <ExampleBlock title="Loading"><view className="demo-toast-buttons">{(['circular', 'spinner', 'dots'] as const).map(type => <Button key={type} label={type === 'circular' ? 'circular (默认)' : type} onTap={() => loading(type)} />)}</view></ExampleBlock>
      <ExampleBlock title="纵向布局loading"><view className="demo-toast-buttons">{(['circular', 'spinner', 'dots'] as const).map(type => <Button key={type} label={type} onTap={() => loading(type, true)} />)}</view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="使用图标"><view className="demo-toast-buttons"><Button label="内部图标" onTap={() => run(() => toast.show({ iconClass: 'star', msg: '使用组件库内部图标' }))} /><Button label="自定义图标" onTap={() => run(() => toast.show({ iconClass: customIcon, msg: '使用自定义图标' }))} /></view></ExampleBlock>
      <ExampleBlock title="提示位置"><view className="demo-toast-buttons">{(['top', 'middle', 'bottom'] as const).map((position, index) => <Button key={position} label={`${['顶部', '居中', '底部'][index]}toast`} onTap={() => run(() => toast.show({ position, msg: '提示信息' }))} />)}</view></ExampleBlock>
      <ExampleBlock title="排版方向"><view className="demo-toast-buttons">{(['horizontal', 'vertical'] as const).map((direction, index) => <Button key={direction} label={index ? '纵向排版' : '横向排版'} onTap={() => run(() => toast.success({ msg: poem, direction }))} />)}</view></ExampleBlock>
    </DemoGroup>
    <Toast {...toast.props} rootPortal />
  </view>;
}
