import { useState } from '@lynx-js/react';
import { Cell, CellGroup, Textarea } from '@daisu-ui/ui';
import type { TextareaProps } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
function Sample({ defaultValue = '', ...props }: TextareaProps) { const [value, setValue] = useState<string | number>(defaultValue); return <Textarea {...props} value={value} onChange={setValue} />; }
export function TextareaExample() {
  return <view className="demo-textarea-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本使用" noPadding><Sample placeholder="请填写评价" /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="只读" noPadding><Sample readonly clearable defaultValue="只读只读只度" /></ExampleBlock><ExampleBlock title="禁用" noPadding><Sample disabled clearable defaultValue="禁用禁用禁用" /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体">
      <ExampleBlock title="清空按钮 和 字数限制" noPadding><Sample clearable maxlength={120} showWordLimit defaultValue="支持清空和字数限制的文本域" /></ExampleBlock>
      <ExampleBlock title="有值且聚焦时展示清空按钮" noPadding><Sample clearable clearTrigger="focus" maxlength={120} showWordLimit /></ExampleBlock>
      <ExampleBlock title="点击清除按钮时不自动聚焦" noPadding><Sample clearable focusWhenClear={false} maxlength={120} showWordLimit /></ExampleBlock>
      <ExampleBlock title="高度自适应" noPadding><Sample autoHeight clearable defaultValue="输入文字后，输入框高度跟随字数多少变化" /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="紧凑布局"><Sample compact placeholder="请填写评价" /></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="结合表单使用" noPadding><CellGroup border>
      <Cell title="基本用法" titleWidth="98px"><Sample compact placeholder="请输入" /></Cell>
      <Cell title="禁用" titleWidth="98px"><Sample compact placeholder="请输入" disabled defaultValue="该输入框禁用" /></Cell>
      <Cell title="清空按钮" titleWidth="98px"><Sample compact placeholder="请输入" clearable /></Cell>
      <Cell title="高度自适应" titleWidth="98px"><Sample compact placeholder="请输入" autoHeight /></Cell>
      <Cell title="字数限制" titleWidth="98px"><Sample compact placeholder="请输入" maxlength={240} showWordLimit /></Cell>
      <Cell title="必填" titleWidth="98px" required><Sample compact placeholder="请输入" /></Cell>
      <Cell title="只读" titleWidth="98px"><Sample compact placeholder="请输入" readonly defaultValue="只读只读只度" /></Cell>
    </CellGroup></ExampleBlock></DemoGroup>
  </view>;
}
