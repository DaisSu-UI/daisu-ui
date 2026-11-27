import { useDemoLocale } from '../demoLocale.js';
import { useEffect, useState } from '@lynx-js/react';
import { Avatar, AvatarGroup, Badge, Icon, RootPortal } from '@daisu-ui/ui';
import type { AvatarGroupItem } from '@daisu-ui/ui';
import panda from '../../../assets/demo-panda.jpg';
import { DemoGroup, ExampleBlock } from './shared.js';

const group: readonly AvatarGroupItem[] = [{ key: 'panda', src: panda }, { key: 'star', icon: 'star-fill' }, { key: 'a', text: 'A', bgColor: '#1c64fd' }, { key: 'b', text: 'B', bgColor: '#12b886' }, { key: 'c', text: 'C', bgColor: '#f14646' }];

export function AvatarExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [notice, setNotice] = useState(false);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => { 'background only'; setNotice(false); }, 2000); return () => clearTimeout(timer); }, [notice]);
  const clicked = () => { 'background only'; setNotice(true); };
  return <view className="demo-avatar-page">
    <DemoGroup title="组件类型">
      <ExampleBlock title="基础用法"><view className="demo-avatar-row"><Avatar src={panda} /><Avatar text="U" /><Avatar icon="user" /></view></ExampleBlock>
      <ExampleBlock title="头像组基础用法"><view className="demo-avatar-group-line"><AvatarGroup items={demoCopy(group.slice(0, 4))} /></view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="可点击"><view className="demo-avatar-row"><Avatar src={panda} size="large" onTap={clicked} /><Avatar text={demoText("点我")} size="large" bgColor="#1c64fd" onTap={clicked} /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="头像形状"><view className="demo-avatar-row"><Avatar src={panda} shape="square" /><Avatar src={panda} /></view></ExampleBlock>
      <ExampleBlock title="头像尺寸"><view className="demo-avatar-row">{(['large', 'medium', 'normal', 'small', 80, 60, '40px'] as const).map(size => <Avatar key={String(size)} src={panda} size={size} />)}</view></ExampleBlock>
      <ExampleBlock title="自定义颜色"><view className="demo-avatar-row"><Avatar text="W" bgColor="#f14646" /><Avatar text="O" bgColor="#12b886" /><Avatar text="T" bgColor="#1c64fd" /><Avatar icon="user" bgColor="var(--cso-ui-canvas)" color="#868a9c" /></view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="带徽记的头像"><view className="demo-avatar-row"><Badge value={10} type="primary"><Avatar src={panda} shape="square" /></Badge><Badge value={20}><Avatar src={panda} shape="square" /></Badge><Badge isDot><Avatar src={panda} shape="square" /></Badge><Badge isDot><Avatar text="A" shape="square" bgColor="#1c64fd" /></Badge></view></ExampleBlock></DemoGroup>
    <DemoGroup title="内容形态"><ExampleBlock title="自定义内容"><view className="demo-avatar-row"><Avatar><text className="demo-avatar-vip">VIP</text></Avatar><Avatar><Icon name="star-fill" size={24} color="#f0883a" /></Avatar></view></ExampleBlock></DemoGroup>
    <DemoGroup title="布局能力">
      <ExampleBlock title="头像组最大数量"><view className="demo-avatar-group-line"><AvatarGroup items={demoCopy(group)} maxCount={3} /></view></ExampleBlock>
      <ExampleBlock title="头像组叠层方向"><view className="demo-avatar-column"><AvatarGroup items={demoCopy(group)} maxCount={4} /><AvatarGroup items={demoCopy(group)} maxCount={4} cascading="right-up" /></view></ExampleBlock>
      <ExampleBlock title="头像组垂直堆叠"><view className="demo-avatar-row"><AvatarGroup items={demoCopy(group)} maxCount={4} vertical /><AvatarGroup items={demoCopy(group)} maxCount={4} cascading="right-up" vertical /></view></ExampleBlock>
    </DemoGroup>
    {notice ? <RootPortal><view className="demo-index-bar-message"><text>{demoText("点击头像")}</text></view></RootPortal> : null}
  </view>;
}
