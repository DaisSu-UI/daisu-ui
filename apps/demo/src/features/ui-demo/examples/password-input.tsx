import { useState } from '@lynx-js/react';
import { Keyboard, PasswordInput } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function PasswordInputExample() {
  const [values, setValues] = useState(['123', '12', '123', '123', '123', '12']);
  const [active, setActive] = useState(-1);
  const example = (index: number, title: string) => <ExampleBlock title={title} noPadding>
    <PasswordInput value={values[index]} length={index === 1 ? 4 : 6} gutter={index === 2 ? 10 : 0} mask={index !== 3} focused={active === index}
      info={index === 4 ? '密码为 6 位数字' : ''} errorInfo={index === 4 && values[4]!.length === 6 && values[4] !== '123456' ? '密码错误' : ''}
      onFocus={() => { 'background only'; setActive(index); }} />
  </ExampleBlock>;
  return <view className="demo-password-input-page">
    <DemoGroup title="组件类型">{example(0, '基本用法')}</DemoGroup>
    <DemoGroup title="组件变体">{example(1, '自定义长度')}</DemoGroup>
    <DemoGroup title="组件样式">{example(2, '格子间距')}</DemoGroup>
    <DemoGroup title="内容形态">{example(3, '明文展示')}{example(4, '提示信息')}</DemoGroup>
    <DemoGroup title="特殊用法">{example(5, '随机键盘')}</DemoGroup>
    <Keyboard visible={active >= 0} onVisibleChange={visible => { 'background only'; if (!visible) setActive(-1); }} value={values[active] ?? ''}
      onChange={value => { 'background only'; setValues(previous => previous.map((entry, index) => index === active ? value : entry)); }}
      maxlength={active === 1 ? 4 : 6} randomKeyOrder={active === 5} />
  </view>;
}
