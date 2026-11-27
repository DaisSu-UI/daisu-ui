import { useDemoLocale } from '../demoLocale.js';
import { useEffect, useRef, useState } from '@lynx-js/react';
import { Button, Cell, SwipeAction, Toast, useToast } from '@daisu-ui/ui';
import type { SwipeActionBeforeClose, SwipeActionRef, SwipeActionStatus } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function SwipeActionExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const toast = useToast();
  const refs = useRef<Record<string, SwipeActionRef | null>>({});
  const [value, setValue] = useState<SwipeActionStatus>('close');
  const waiting = useRef<{ timer: ReturnType<typeof setTimeout>; resolve: (value: boolean) => void }>();
  useEffect(() => () => { clearTimeout(waiting.current?.timer); waiting.current?.resolve(false); }, []);
  const closeAll = (except?: string) => { 'background only'; for (const [key, ref] of Object.entries(refs.current)) if (key !== except) void ref?.close('value'); };
  const props = (key: string) => ({ ref: (ref: SwipeActionRef | null) => { 'background only'; refs.current[key] = ref; }, onChange: (next: SwipeActionStatus) => { 'background only'; if (key === 'controlled') setValue(next); if (next !== 'close') closeAll(key); } });
  const actions = (labels: string[], feedback = true) => <view className="demo-swipe-actions">{labels.map((label, index) => <view key={label} className={`demo-swipe-button demo-swipe-button-${index % 3}`} bindtap={feedback ? () => toast.show(`点击了${label}`) : undefined}><text>{demoText(label)}</text></view>)}</view>;
  const beforeClose: SwipeActionBeforeClose = (reason, position) => {
    'background only';
    if (reason === 'click' && position === 'inside') { toast.show('已拦截点击内容区导致的关闭'); return false; }
    toast.loading('处理中...');
    return new Promise(resolve => {
      clearTimeout(waiting.current?.timer); waiting.current?.resolve(false);
      waiting.current = { resolve, timer: setTimeout(() => {
        waiting.current = undefined; toast.close();
        toast.show(reason === 'click' ? `${reason} ${position} 导致滑动按钮关闭` : `${reason} 导致 ${position} 滑动按钮关闭`); resolve(true);
      }, 3000) };
    });
  };
  const cell = (label = '内容') => <Cell title={demoText("标题文字")} value={label} />;
  return <view className="demo-swipe-page" bindtap={() => closeAll()}>
    <DemoGroup title="组件类型">
      <ExampleBlock title="基本用法" noPadding><SwipeAction {...demoCopy(props('basic'))} right={actions(['操作1', '操作2', '操作3'])}>{cell()}</SwipeAction></ExampleBlock>
      <ExampleBlock title="左右滑动" noPadding><SwipeAction {...demoCopy(props('both'))} left={actions(['操作1', '操作2', '操作3'])} right={actions(['操作4', '操作5', '操作6'])}>{cell()}</SwipeAction></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="禁用滑动按钮" noPadding><SwipeAction disabled right={actions(['操作1', '操作2', '操作3'])}>{cell()}</SwipeAction></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="切换按钮" noPadding><SwipeAction {...demoCopy(props('controlled'))} value={value} left={actions(['操作1', '操作2', '操作3'])} right={actions(['操作4', '操作5', '操作6'])}>{cell()}</SwipeAction><view className="demo-swipe-controls" catchtap={() => {}}>{(['left', 'close', 'right'] as const).map((status, index) => <Button key={status} label={demoText(['打开左边', '关闭所有', '打开右边'][index])} size="small" onTap={() => { 'background only'; closeAll('controlled'); setValue(status); }} />)}</view></ExampleBlock>
      <ExampleBlock title="关闭前拦截" noPadding><SwipeAction {...demoCopy(props('guard'))} beforeClose={beforeClose} right={actions(['删除', '标记'], false)}>{cell('阻止点击内容区关闭')}</SwipeAction></ExampleBlock>
      <ExampleBlock title="点击事件" noPadding><SwipeAction {...demoCopy(props('click'))} onClick={({ value }) => toast.show(`点击 ${value} 关闭操作按钮`)} right={actions(['操作1', '操作2', '操作3'], false)}>{cell()}</SwipeAction></ExampleBlock>
    </DemoGroup>
    <Toast {...demoCopy(toast.props)} rootPortal />
  </view>;
}
