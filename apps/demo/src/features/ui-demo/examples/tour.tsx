import { useDemoLocale } from '../demoLocale.js';
import { useRef, useState } from '@lynx-js/react';
import type { NodesRef } from '@lynx-js/types';
import { Button, Icon, Toast, Tour, useToast } from '@daisu-ui/ui';
import type { TourStep } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

const titles = ['第一步', '第二步', '第三步', '第四步'];
const descriptions = ['这是引导的第一步，介绍基本功能', '这是引导的第二步，展示更多功能', '这是引导的第三步，深入功能介绍', '这是引导的最后一步，总结功能'];
const steps: readonly TourStep[] = [
  { element: '#demo-tour-step-0', content: '欢迎使用引导组件，这是第一步的说明' },
  { element: '#demo-tour-step-1', content: '这是第二步，展示了另一个功能点' },
  { element: '#demo-tour-step-2', content: '这是第三步，深入了解功能' },
  { element: '#demo-tour-step-3', content: '这是最后一步，感谢使用引导组件' },
];
export function TourExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [mode, setMode] = useState(''), [current, setCurrent] = useState(0);
  const scroll = useRef<NodesRef | null>(null); const toast = useToast();
  const start = (next: string) => { 'background only'; setCurrent(next === 'control' ? 2 : 0); setMode(next); };
  const scrollToTarget = async () => { 'background only'; scroll.current?.invoke({ method: 'scrollTo', params: { index: 0, offset: 0, smooth: false } }).exec(); await new Promise<void>(resolve => setTimeout(resolve, 50)); };
  const trigger = (label: string, next: string) => <view className="demo-tour-trigger"><Button label={demoText(label)} onTap={() => start(next)} /></view>;
  return <scroll-view style={{ zIndex: 0 }} ref={scroll} className="ui-demo-component-scroll" scroll-orientation="vertical" enable-scroll={mode === ''}>
    <view className="demo-tour-page">
      <view className="demo-tour-targets">{titles.map((title, i) => <view key={i} id={`demo-tour-step-${i}`} flatten={false} className="demo-tour-item"><text className="demo-tour-title">{demoText(title)}</text><text className="demo-tour-description">{demoText(descriptions[i])}</text></view>)}</view>
      <DemoGroup title="组件类型"><ExampleBlock title="基本用法">{trigger('开始引导', 'basic')}</ExampleBlock></DemoGroup>
      <DemoGroup title="组件状态"><ExampleBlock title="点击蒙版继续">{trigger('点击蒙版继续', 'click')}</ExampleBlock><ExampleBlock title="关闭蒙版">{trigger('关闭蒙版', 'no-mask')}</ExampleBlock></DemoGroup>
      <DemoGroup title="组件样式"><ExampleBlock title="自定义蒙版">{trigger('自定义蒙版', 'mask')}</ExampleBlock><ExampleBlock title="自定义高亮区域">{trigger('自定义高亮区域', 'highlight')}</ExampleBlock><ExampleBlock title="自定义内容和按钮">{trigger('自定义内容和按钮', 'content')}</ExampleBlock></DemoGroup>
      <DemoGroup title="特殊样式"><ExampleBlock title="控制当前步骤">{trigger('从第三步开始', 'control')}</ExampleBlock></DemoGroup>
      <Tour className="ui-demo-page demo-tour-layer" show={mode !== ''} onShowChange={show => { 'background only'; if (!show) setMode(''); }} steps={demoCopy(steps)} current={current} onCurrentChange={setCurrent} padding={10} mask={mode !== 'no-mask'} clickMaskNext={mode === 'click'} maskColor={mode === 'mask' ? 'rgba(255,0,0,.55)' : undefined} borderRadius={mode === 'mask' ? 15 : undefined} offset={mode === 'mask' ? 40 : undefined} rootPortal scrollToTarget={scrollToTarget}
        onFinish={() => { 'background only'; toast.success('引导完成'); }} onError={e => { 'background only'; toast.error(e.message); }}
        renderHighlight={mode === 'highlight' ? () => <view className="demo-tour-custom-highlight" /> : undefined}
        renderContent={mode === 'content' ? () => <view className="demo-tour-custom-content"><Icon name="help-circle-filled" size={22} color="#1c64fd" /><text>{demoText("自定义引导内容区域")}</text></view> : undefined}
        renderNext={mode === 'content' ? state => <Button label={demoText("下一步")} size="mini" onTap={state.next} /> : undefined}
        renderFinish={mode === 'content' ? state => <Button label={demoText("完成")} size="mini" onTap={state.finish} /> : undefined} />
      <Toast {...demoCopy(toast.props)} rootPortal />
      <view className="ui-demo-bottom-space" />
    </view>
  </scroll-view>;
}
