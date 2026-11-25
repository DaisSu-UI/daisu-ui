import { useState } from '@lynx-js/react';
import { Button, Cell, CellGroup, Icon, Input, Toast, useToast } from 'daisu-ui';
import type { InputProps } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';
function Sample({ defaultValue = '', ...props }: InputProps) { const [value, setValue] = useState<string | number>(defaultValue); return <Input {...props} value={value} onChange={setValue} />; }
export function InputExample() {
  const toast = useToast();
  return <view className="demo-input-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本使用" noPadding><Sample placeholder="请输入歪比巴卜" /></ExampleBlock><ExampleBlock title="数字类型" noPadding><Sample type="number" /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="禁用状态" noPadding><Sample defaultValue="这是禁用状态" disabled /></ExampleBlock><ExampleBlock title="只读状态" noPadding><Sample defaultValue="这是只读状态" readonly /></ExampleBlock><ExampleBlock title="错误状态" noPadding><Sample defaultValue="123456" error /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock title="清空按钮" noPadding><Sample defaultValue="支持清空" clearable /></ExampleBlock><ExampleBlock title="有值且聚焦时展示清空按钮" noPadding><Sample clearable clearTrigger="focus" /></ExampleBlock><ExampleBlock title="点击清除按钮时不自动聚焦" noPadding><Sample clearable focusWhenClear={false} /></ExampleBlock><ExampleBlock title="密码框" noPadding><Sample clearable showPassword defaultValue="password" /></ExampleBlock></DemoGroup>
    <DemoGroup title="内容形态"><ExampleBlock title="设置前后Icon" noPadding><Sample prefixIcon="sound" suffixIcon="send" onClickPrefixIcon={() => { 'background only'; toast.show('点击前置图标'); }} onClickSuffixIcon={() => { 'background only'; toast.show('点击后置图标'); }} /></ExampleBlock><ExampleBlock title="后缀插槽" noPadding><Sample placeholder="请输入歪比巴卜" suffix={<Button label="获取验证码" size="small" onTap={() => { 'background only'; toast.show('点击获取验证码'); }} />} /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="字数限制" noPadding><Sample defaultValue="1234" maxlength={20} showWordLimit /></ExampleBlock><ExampleBlock title="紧凑布局"><view className="demo-input-compact"><Sample compact placeholder="请输入价格" style={{ width: '155px' }} /><text>元</text></view></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊用法"><ExampleBlock title="结合表单使用" noPadding><CellGroup border>
      <Cell center title="基本用法" titleWidth="98px"><Sample compact placeholder="请输入" /></Cell>
      <Cell center title="禁用" titleWidth="98px"><Sample compact disabled defaultValue="该输入框禁用" /></Cell>
      <Cell center title="清除/密码" titleWidth="98px"><Sample compact showPassword clearable defaultValue="12345678" /></Cell>
      <Cell center title="错误状态" titleWidth="98px"><Sample compact placeholder="请输入歪比巴卜" error /></Cell>
      <Cell center title="必填" titleWidth="98px" required><Sample compact placeholder="请输入歪比巴卜" /></Cell>
      <Cell center title="字数限制" titleWidth="98px"><Sample compact placeholder="请输入" maxlength={20} showWordLimit /></Cell>
      <Cell center icon={<Icon name="sound" size={18} />} title="图标" titleWidth="98px"><Sample compact placeholder="请输入" suffixIcon="send" /></Cell>
      <Cell center title="自定义插槽" titleWidth="98px"><Sample compact placeholder="请输入" suffix={<Button size="small" label="获取验证码" onTap={() => { 'background only'; toast.show('点击获取验证码'); }} />} /></Cell>
    </CellGroup></ExampleBlock></DemoGroup>
    <Toast {...toast.props} rootPortal />
  </view>;
}
