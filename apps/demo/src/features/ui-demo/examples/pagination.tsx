import { useDemoLocale } from '../demoLocale.js';
import { useState } from '@lynx-js/react';
import { Button, Pagination } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function PaginationExample() {
  const { text: demoText } = useDemoLocale();
  const [pages, setPages] = useState([1,1,1,1,1,1,1]);
  const change = (index: number, value: number) => { 'background only'; setPages(values => values.map((page,i)=>i===index?value:page)); };
  return <view className="demo-pagination-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法" noPadding><Pagination value={pages[0]} total={190} onChange={value=>{ 'background only'; change(0,value); }} /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体">
      <ExampleBlock title="按钮风格" noPadding><view className="demo-pagination-stack">{(['plain','dashed','base'] as const).map((variant,index)=><Pagination key={variant} value={pages[index+1]} total={190} buttonVariant={variant} onChange={value=>{ 'background only'; change(index+1,value); }} />)}</view></ExampleBlock>
      <ExampleBlock title="Icon图标" noPadding><Pagination value={pages[4]} total={19} showIcon onChange={value=>{ 'background only'; change(4,value); }} /></ExampleBlock>
      <ExampleBlock title="文字提示" noPadding><Pagination value={pages[5]} total={160} pageSize={20} showIcon showMessage onChange={value=>{ 'background only'; change(5,value); }} /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="内容形态"><ExampleBlock title="自定义插槽" noPadding><Pagination value={pages[6]} total={190} showMessage onChange={value=>{ 'background only'; change(6,value); }} renderPrev={state=><Button label={demoText("上一页")} size="small" tone="danger" disabled={state.value<=1} onTap={state.prev}/>} renderNext={state=><Button label={demoText("下一页")} size="small" tone="danger" disabled={state.value>=state.totalPage} onTap={state.next}/>} renderSize={state=><><text className="demo-pagination-custom-current">{demoText(state.value)}</text><text className="ui-pagination-separator">/</text><text className="demo-pagination-custom-total">{demoText(state.totalPage)}</text></>} renderMessage={state=><text className="demo-pagination-custom-message">{demoText(`当前第${state.value}页，共${state.total}条数据`)}</text>} /></ExampleBlock></DemoGroup>
  </view>;
}
