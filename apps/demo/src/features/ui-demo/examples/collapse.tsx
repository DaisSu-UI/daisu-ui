import { useDemoLocale } from '../demoLocale.js';
import { useState } from '@lynx-js/react';
import { Collapse, CollapseViewMore } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

const text = '这是一条简单的示例文字。';
const content = <text className="demo-collapse-copy">{text}</text>;

export function CollapseExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [open, setOpen] = useState<string[]>(['first']);
  const [accordion, setAccordion] = useState<string[]>(['one']);
  const change = (value: string[]) => { 'background only'; setOpen(value); };
  const changeAccordion = (value: string[]) => { 'background only'; setAccordion(value); };
  return <>
    <DemoGroup title="基本用法"><ExampleBlock title="普通折叠" noPadding><Collapse value={open} onChange={change} items={demoCopy([{ name: 'first', title: '标签1', content }, { name: 'second', title: '标签2', content }, { name: 'third', title: '标签3', content }])} /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="禁用" noPadding><Collapse defaultValue={['one']} items={demoCopy([{ name: 'one', title: '标签1', content }, { name: 'two', title: '标签2', disabled: true, content }, { name: 'three', title: '标签3', content }])} /></ExampleBlock></DemoGroup>
    <DemoGroup title="交互模式">
      <ExampleBlock title="手风琴" noPadding><Collapse value={accordion} accordion onChange={changeAccordion} items={demoCopy([{ name: 'one', title: '标签1', content }, { name: 'two', title: '标签2', content }, { name: 'three', title: '标签3', content }])} /></ExampleBlock>
      <ExampleBlock title="异步展开" noPadding><Collapse items={demoCopy([{ name: 'async', title: '点击加载内容', beforeExpand: () => new Promise(resolve => setTimeout(() => resolve(true), 500)), content: <text className="demo-collapse-copy">{demoText("内容加载完成后展开。")}</text> }])} /></ExampleBlock>
      <ExampleBlock title="查看更多"><CollapseViewMore text={demoText(text.repeat(12))} lineCount={2} /></ExampleBlock>
    </DemoGroup>
  </>;
}
