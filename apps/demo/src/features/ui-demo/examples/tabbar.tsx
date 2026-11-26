import { useEffect, useRef, useState } from '@lynx-js/react';
import { Button, Popup, Icon, Loading, RootPortal, Tabbar } from '@daisu-ui/ui';
import type { TabbarItem, TabbarValue } from '@daisu-ui/ui';
import panda from '../../../assets/demo-panda.jpg';
import { DemoGroup, ExampleBlock } from './shared.js';

const basic: readonly TabbarItem[] = [{ title: '首页', icon: 'home' }, { title: '分类', icon: 'store' }, { title: '我的', icon: 'user' }];
const named: readonly TabbarItem[] = [{ name: 'home', title: '首页', icon: 'home' }, { name: 'cart', title: '分类', icon: 'store' }, { name: 'setting', title: '设置', icon: 'settings' }, { name: 'user', title: '我的', icon: 'user' }];
const badges: readonly TabbarItem[] = [{ title: '点状', icon: 'home', isDot: true, value: 2 }, { title: '分类', icon: 'store', value: 2 }, { title: '我的', icon: 'user', value: 30 }, { title: '最大值', icon: 'user', value: 200 }];
const round: readonly TabbarItem[] = [{ title: '首页', icon: 'home', isDot: true }, { title: '分类', icon: 'store', value: 2 }, { title: '相册', icon: 'image', value: 30 }, { title: '我的', icon: 'user', value: 200 }];
const custom: readonly TabbarItem[] = [{ title: '首页', icon: 'home', value: 2 }, { title: '分类', value: 2, renderIcon: () => <image className="demo-tabbar-avatar" src={panda} mode="aspectFill" /> }, { title: '我的', icon: 'user', value: 3 }];
const five: readonly TabbarItem[] = [{ title: '首页', icon: 'home' }, { title: '分类', icon: 'store' }, { title: '我的', icon: 'user' }, { title: '相册', icon: 'image' }, { title: '客服', icon: 'message' }];
const fixed: readonly TabbarItem[] = five.map((item, index) => ({ ...item, isDot: index === 0, value: index === 3 ? 200 : index === 4 ? 10 : undefined }));
const colors: readonly TabbarItem[] = [...badges.slice(0, 3), { title: '最大值', icon: 'image', value: 200 }, { title: '客服', icon: 'message', value: 10 }];

export function TabbarExample({ theme }: { theme: 'light' | 'dark' }) {
  const [values, setValues] = useState<TabbarValue[]>([1, 'home', 2, 2, 1, 1, 1, 1, 1, 1]);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const pending = useRef(new Map<ReturnType<typeof setTimeout>, (allowed: boolean) => void>());
  useEffect(() => () => { clearTimeout(toastTimer.current); for (const [timer, resolve] of pending.current) { clearTimeout(timer); resolve(false); } pending.current.clear(); }, []);
  const change = (index: number, value: TabbarValue) => { 'background only'; setValues(old => old.map((item, i) => i === index ? value : item)); };
  const show = (message: string) => { 'background only'; clearTimeout(toastTimer.current); setNotice(message); toastTimer.current = setTimeout(() => setNotice(''), 1500); };
  const activeColor = theme === 'dark' ? '#5b90ff' : '#1c64fd';
  const danger = theme === 'dark' ? '#ff7875' : '#fa4350';
  const placeholder = theme === 'dark' ? '#696b70' : '#bfbfbf';
  const raised: readonly TabbarItem[] = [fixed[0]!, fixed[1]!, { children: <view className="demo-tabbar-raised"><Icon name="plus" size={32} color={activeColor} /></view> }, fixed[3]!, fixed[4]!];
  const render = (index: number, items: readonly TabbarItem[], props: Partial<Parameters<typeof Tabbar>[0]> = {}) => <Tabbar items={items} value={values[index]} onChange={event => { 'background only'; change(index, event.value); }} activeColor={activeColor} {...props} />;
  return <view className="demo-tabbar-page">
    <DemoGroup title="组件类型">
      <ExampleBlock title="基础用法" noPadding>{render(0, basic, { bordered: true })}</ExampleBlock>
      <ExampleBlock title="通过名称匹配" noPadding>{render(1, named, { bordered: true })}</ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="徽标提示" noPadding>{render(2, badges)}</ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock title="悬浮标签栏" noPadding>{render(3, round, { shape: 'round' })}</ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="自定义图标" noPadding>{render(4, custom)}</ExampleBlock>
      <ExampleBlock title="自定义颜色" noPadding>{render(5, colors, { activeColor: danger, inactiveColor: placeholder })}</ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="监听切换事件" noPadding>{render(6, five, { activeColor: danger, inactiveColor: placeholder, onChange: event => { 'background only'; change(6, event.value); show(`选中标签:${event.value}`); } })}</ExampleBlock>
      <ExampleBlock title="默认插槽" noPadding>{render(7, raised, { beforeChange: name => { 'background only'; if (name === 2) { setDialog(true); return false; } return true; } })}</ExampleBlock>
      <ExampleBlock title="异步确认" noPadding>{render(8, fixed, { bordered: true, beforeChange: () => { 'background only'; setLoading(true); return new Promise<boolean>(resolve => { const timer = setTimeout(() => { pending.current.delete(timer); if (pending.current.size === 0) setLoading(false); resolve(true); }, 1000); pending.current.set(timer, resolve); }); } })}</ExampleBlock>
      <ExampleBlock title="固定底部" noPadding>{render(9, fixed, { fixed: true, bordered: true, placeholder: true, safeAreaInsetBottom: true })}</ExampleBlock>
    </DemoGroup>
    <RootPortal>
      {notice ? <view className="ui-demo-page demo-cell-toast" user-interaction-enabled={false}><text>{notice}</text></view> : null}
      {loading ? <view className="ui-demo-page demo-tabbar-loading" user-interaction-enabled={false}><Loading /><text>Loading...</text></view> : null}
      <Popup show={dialog} onChange={setDialog} title="发布动态" closable round className="ui-demo-page demo-tabbar-dialog"><image className="demo-tabbar-dialog-image" src={panda} mode="aspectFill" /><view className="demo-tabbar-dialog-body"><text className="demo-root-portal-modal-text">选择你要发布的内容类型</text><Button label="确定" round block onTap={() => { 'background only'; setDialog(false); }} /></view></Popup>
    </RootPortal>
  </view>;
}
