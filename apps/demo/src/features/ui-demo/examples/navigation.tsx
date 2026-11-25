import { useEffect, useRef, useState } from '@lynx-js/react';
import { Icon, Navbar, NavbarCapsule, SyncedInput } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function NavigationExample({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  const [keyword, setKeyword] = useState('');
  const [notice, setNotice] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = () => { 'background only'; clearTimeout(timer.current); setNotice('按钮'); timer.current = setTimeout(() => setNotice(''), 1500); };
  return <view className="demo-navbar-page">
    <DemoGroup title="组件类型">
      <ExampleBlock title="基础用法" noPadding><Navbar variant="standard" title="标题" /></ExampleBlock>
      <ExampleBlock title="返回上级" noPadding><Navbar variant="standard" title="标题" leftText="返回" leftArrow onLeftTap={onBack} /></ExampleBlock>
      <ExampleBlock title="右侧按钮" noPadding><Navbar variant="standard" title="标题" leftText="返回" leftArrow rightText="按钮" onLeftTap={onBack} onRightTap={show} /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="禁用按钮" noPadding><Navbar variant="standard" title="标题" leftText="返回" rightText="按钮" leftArrow leftDisabled rightDisabled onLeftTap={onBack} onRightTap={show} /></ExampleBlock></DemoGroup>
    <DemoGroup title="内容形态">
      <ExampleBlock title="使用插槽" noPadding><Navbar variant="standard" title="标题" left={<Icon name="left" size={24} />} right={<Icon name="search-line" size={18} />} onLeftTap={onBack} /></ExampleBlock>
      <ExampleBlock title="胶囊样式" noPadding><Navbar variant="standard" title="标题" rightText="设置" capsule={<NavbarCapsule onBack={onBack} onBackHome={onHome} />} /></ExampleBlock>
      <ExampleBlock title="带搜索栏" noPadding><Navbar variant="standard" leftText="返回" leftArrow rightText="设置" title={<view className="demo-navbar-search"><Icon name="search-line" size={16} color="#4e5369" /><SyncedInput value={keyword} onInput={setKeyword} placeholder="搜索" maxlength={100} className="demo-navbar-search-input" /></view>} /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="原有默认样式"><ExampleBlock title="默认导航栏（56px）" noPadding><Navbar title="医疗机构备案" onBack={onBack} rightLabel="保存" onRight={show} /></ExampleBlock></DemoGroup>
    <view className="demo-navbar-spacer" />
    {notice ? <view className="demo-cell-toast" user-interaction-enabled={false}><text>{notice}</text></view> : null}
  </view>;
}
