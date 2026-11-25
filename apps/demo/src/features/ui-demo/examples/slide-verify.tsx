import { useRef } from '@lynx-js/react';
import { Button, SlideVerify, Toast, useToast } from 'daisu-ui';
import type { SlideVerifyRef } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';
export function SlideVerifyExample() {
  const ref = useRef<SlideVerifyRef>(null), toast = useToast();
  const feedback = { onSuccess: () => { 'background only'; toast.success('验证成功'); }, onFail: () => { 'background only'; toast.error('验证失败，请重试'); } };
  return <view className="demo-slide-verify-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><SlideVerify width="calc(100% - 40px)" {...feedback} /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="禁用状态"><SlideVerify width="calc(100% - 40px)" disabled /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="自定义文案"><SlideVerify width="calc(100% - 40px)" text="请拖动滑块" successText="验证成功" /></ExampleBlock><ExampleBlock title="自定义颜色"><SlideVerify width="calc(100% - 40px)" backgroundColor="var(--cso-ui-primary-soft)" activeBackgroundColor="var(--cso-ui-primary)" /></ExampleBlock><ExampleBlock title="自定义图标"><SlideVerify width="calc(100% - 40px)" icon="arrow-right" successIcon="thumb-up-fill" /></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="自定义容错范围"><SlideVerify width="calc(100% - 40px)" tolerance={20} /></ExampleBlock><ExampleBlock title="重置方法"><SlideVerify width="calc(100% - 40px)" ref={ref} {...feedback} /><Button label="重置" className="demo-slide-verify-reset" onTap={() => { 'background only'; ref.current?.reset(); toast.info('已重置'); }} /></ExampleBlock><ExampleBlock title="插槽用法"><SlideVerify width="calc(100% - 40px)" text={<text>滑动验证</text>} successText={<text>验证通过</text>} renderIcon={<text className="demo-slide-verify-icon">drag</text>} renderSuccessIcon={<text className="demo-slide-verify-icon demo-slide-verify-success-icon">OK</text>} /></ExampleBlock></DemoGroup>
    <Toast {...toast.props} />
  </view>;
}
