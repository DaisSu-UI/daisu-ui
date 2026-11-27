import { useDemoLocale } from '../demoLocale.js';
import { useState } from '@lynx-js/react';
import { Button, Cell, CellGroup, Popup } from '@daisu-ui/ui';
import type { PopupPosition } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

type Example = 'center' | 'top' | 'right' | 'bottom' | 'left' | 'close' | 'long-title' | 'no-click' | 'no-modal' | 'safe' | 'scroll' | 'parent';
export function PopupExample() {
  const { text: demoText } = useDemoLocale();
  const [active, setActive] = useState<Example>('center');
  const [shown, setShown] = useState(false);
  const [child, setChild] = useState(false);
  const open = (value: Example) => () => { 'background only'; setActive(value); setShown(true); };
  const cell = (title: string, value: Example) => <Cell title={demoText(title)} arrow onTap={open(value)} />;
  const position: PopupPosition = active && ['top', 'right', 'bottom', 'left'].includes(active) ? active as PopupPosition : active === 'center' || active === 'parent' ? 'center' : 'bottom';
  return <view className="demo-popup-page">
    <DemoGroup title="组件类型">
      <ExampleBlock title="基础用法" noPadding><CellGroup>{cell('弹出层', 'center')}</CellGroup></ExampleBlock>
      <ExampleBlock title="弹出位置" noPadding><CellGroup border>{cell('顶部', 'top')}{cell('右侧', 'right')}{cell('底部', 'bottom')}{cell('左侧', 'left')}</CellGroup></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件状态">
      <ExampleBlock title="关闭按钮" noPadding><CellGroup border>{cell('关闭按钮', 'close')}{cell('长标题', 'long-title')}</CellGroup></ExampleBlock>
      <ExampleBlock title="禁用遮罩点击" noPadding>{cell('禁用遮罩点击', 'no-click')}</ExampleBlock>
      <ExampleBlock title="禁用遮罩" noPadding>{cell('禁用遮罩', 'no-modal')}</ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="开启底部安全区" noPadding>{cell('开启底部安全区', 'safe')}</ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="锁定滚动" noPadding>{cell('锁定滚动', 'scroll')}</ExampleBlock>
      <ExampleBlock title="嵌套弹窗与 root-portal" noPadding>{cell('嵌套弹窗测试', 'parent')}</ExampleBlock>
    </DemoGroup>
    {/* Separate position instances prevent a closing panel jumping to another edge. */}
    {(['center', 'top', 'right', 'bottom', 'left'] as const).map(edge => <Popup key={edge} show={shown && position === edge} rootPortal position={edge} className={`ui-demo-page demo-popup-panel ${edge === 'center' ? 'demo-popup-center' : ''}`} style={edge === 'center' ? { borderRadius: '4.266667vw' } : edge === 'left' || edge === 'right' ? { width: '200px' } : { height: '200px' }} title={demoText(active === 'close' ? '等级权益' : active === 'long-title' ? '活动权益与使用说明，查看本月可领取的会员礼遇' : undefined)} round={edge === 'bottom'} closable={['close', 'long-title', 'no-click', 'no-modal'].includes(active ?? '')} closeOnClickModal={active !== 'no-click'} modal={active !== 'no-modal'} safeAreaInsetBottom={active === 'safe'} onChange={() => { setShown(false); setChild(false); }}>
      {edge === 'center' ? active === 'parent' ? <view className="demo-popup-parent"><text>{demoText("父弹窗")}</text><Button label={demoText("打开传送子弹窗")} size="small" tone="success" onTap={() => setChild(true)} /></view> : <view className="demo-popup-square"><text>{demoText("弹弹弹")}</text></view> : (active === 'close' || active === 'long-title') ? <view className="demo-popup-content"><text>{demoText("标题位于左侧，右侧圆形按钮可关闭弹窗。")}</text></view> : active === 'scroll' ? <view className="demo-popup-scroll"><text>{demoText("锁定滚动")}</text>{Array.from({ length: 10 }, (_, i) => <text key={i}>{demoText("内容")}{demoText(i + 1)}</text>)}</view> : null}
    </Popup>)}
    <Popup show={child} rootPortal round closable title={demoText("子弹窗")} className="ui-demo-page" style={{ width: '280px' }} onChange={setChild}><view className="demo-popup-content"><text className="demo-popup-child-copy">{demoText("这个子弹窗会脱离父层级渲染")}</text></view></Popup>
  </view>;
}
