import { useRef, useState } from '@lynx-js/react';
import { Button, Tooltip } from '@daisu-ui/ui';
import type { BubblePlacement, TooltipRef } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function TooltipExample() {
  const refs = useRef<Record<string, TooltipRef | null>>({});
  const dynamic = useRef<TooltipRef>(null);
  const [width, setWidth] = useState(90);
  const [show, setShow] = useState(false);
  const closeAll = (except?: string) => { 'background only'; for (const [key, value] of Object.entries(refs.current)) if (key !== except) value?.close(); if (except !== 'dynamic') dynamic.current?.close(); };
  const props = (key: string) => ({ ref: (value: TooltipRef | null) => { 'background only'; refs.current[key] = value; }, onOpen: () => closeAll(key) });
  const button = (placement: BubblePlacement, label: string = placement) => <Tooltip key={placement} {...props(placement)} placement={placement} content={`${placement} 提示文字`}><Button label={label} /></Tooltip>;
  return <view className="demo-tooltip-page" bindtap={() => closeAll()}>
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法">
      <view className="demo-tooltip-top">{button('bottom-start')}{button('bottom')}{button('bottom-end')}</view>
      <view className="demo-tooltip-sides"><view className="demo-tooltip-side">{button('right-start')}{button('right')}{button('right-end')}</view><view className="demo-tooltip-side">{button('left-start', 'left-start\u00a0')}{button('left')}{button('left-end')}</view></view>
      <view className="demo-tooltip-bottom">{button('top-start')}{button('top')}{button('top-end')}</view>
    </ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态">
      <ExampleBlock title="显示关闭按钮"><Tooltip {...props('closable')} content="显示关闭按钮" placement="right" showClose><Button label="显示关闭按钮" /></Tooltip></ExampleBlock>
      <ExampleBlock title="控制显隐"><view className="demo-tooltip-control-trigger" catchtap={() => {}}><Button label={show ? '关闭' : '打开'} size="small" onTap={() => setShow(value => !value)} /></view><view className="demo-tooltip-controlled"><Tooltip {...props('controlled')} show={show} onShowChange={setShow} placement="top" content="控制显隐"><Button label="top" /></Tooltip></view></ExampleBlock>
      <ExampleBlock title="禁用"><Tooltip disabled placement="right-end" content="禁用"><Button label="禁用" /></Tooltip></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="内容形态"><ExampleBlock title="多行文本"><view className="demo-tooltip-lines-demo"><Tooltip {...props('multiline')} placement="right" contentNode={<view className="demo-tooltip-lines">{[1, 2, 3].map(value => <text key={value}>多行文本{value}</text>)}</view>}><Button label="多行文本" /></Tooltip></view></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="动态内容与位置更新"><view className="demo-tooltip-lines-demo"><Tooltip ref={dynamic} onOpen={() => closeAll('dynamic')} placement="right" contentNode={<view className="demo-tooltip-lines" style={{ width: `${width}px` }}><text className="demo-tooltip-width">当前宽度: {width}px</text><Button label="改变大小" size="small" onTap={() => { 'background only'; setWidth(value => value === 90 ? 150 : 90); dynamic.current?.updatePosition(); }} /></view>}><Button label="动态内容" /></Tooltip></view></ExampleBlock>
      <ExampleBlock title="绑定change事件"><Tooltip {...props('events')} placement="right-end" content="事件" onChange={({ show: visible }) => { 'background only'; console.info('Tooltip change', visible); }}><Button label="事件" /></Tooltip></ExampleBlock>
    </DemoGroup>
  </view>;
}
