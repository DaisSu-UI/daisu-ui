import { useDemoLocale } from '../demoLocale.js';
import { useEffect, useRef, useState } from '@lynx-js/react';
import { Button, Transition } from '@daisu-ui/ui';
import type { TransitionName } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function TransitionExample() {
  const { text: demoText } = useDemoLocale();
  const [show, setShow] = useState(false);
  const [name, setName] = useState<TransitionName>('fade');
  const [customShow, setCustomShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const customTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => { clearTimeout(timer.current); clearTimeout(customTimer.current); }, []);
  const run = (next: TransitionName) => { 'background only'; clearTimeout(timer.current); setName(next); setShow(true); timer.current = setTimeout(() => setShow(false), 500); };
  const runCustom = () => { 'background only'; clearTimeout(customTimer.current); setCustomShow(true); customTimer.current = setTimeout(() => setCustomShow(false), 1200); };
  const buttons = (names: TransitionName[]) => <view className="demo-transition-buttons">{names.map(item => <Button key={item} className="demo-transition-trigger" label={demoText(item)} onTap={() => { 'background only'; run(item); }} />)}</view>;
  return <view className="demo-transition-page">
    <DemoGroup title="组件类型">
      <ExampleBlock title="Fade 动画">{buttons(['fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right'])}</ExampleBlock>
      <ExampleBlock title="Slide 动画">{buttons(['slide-up', 'slide-down', 'slide-left', 'slide-right'])}</ExampleBlock>
      <ExampleBlock title="Zoom 动画">{buttons(['zoom-in', 'zoom-out'])}</ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="自定义动画"><view className="demo-transition-buttons"><Button className="demo-transition-trigger" label="custom" onTap={runCustom} /></view></ExampleBlock></DemoGroup>
    <Transition show={show} name={name} className="demo-transition-block" />
    <Transition show={customShow} name={[]} duration={{ enter: 700, leave: 1000 }} className="demo-transition-block demo-transition-custom" enterClassName="demo-transition-custom-enter" enterActiveClassName="demo-transition-custom-active" leaveActiveClassName="demo-transition-custom-active" leaveToClassName="demo-transition-custom-leave" />
  </view>;
}
