import { useRef } from '@lynx-js/react';
import { Button, Cell, Dialog, DropMenu, DropMenuItem, Slider, SortButton, useDialog } from '@daisu-ui/ui';
import type { DropMenuItemProps, DropMenuItemRef } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

const goods = [{ label: '全部商品', value: 0 }, { label: '新款商品', value: 1, tip: '这是补充信息' }, { label: '这是比较长的筛选条件这是比较长的筛选条件', value: 2 }];
const sorts = [{ label: '综合', value: 0 }, { label: '销量', value: 1 }, { label: '上架时间', value: 2 }];

export function DropMenuExample({ theme }: { theme: 'light' | 'dark' }) {
  const filter = useRef<DropMenuItemRef>(null);
  const dialog = useDialog();
  const common: Partial<DropMenuItemProps> = { rootPortal: true, popupClassName: 'ui-demo-page demo-drop-menu-popup', activeColor: theme === 'dark' ? '#5b90ff' : '#1c64fd' };
  return <view className="demo-drop-menu-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法" noPadding><DropMenu><DropMenuItem {...common} defaultValue={1} options={goods} /><DropMenuItem {...common} defaultValue={0} options={sorts} /></DropMenu></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="禁用" noPadding><DropMenu><DropMenuItem {...common} defaultValue={0} options={goods} disabled /><DropMenuItem {...common} defaultValue={0} options={sorts} /></DropMenu></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock title="异步打开/关闭" noPadding><DropMenu><DropMenuItem {...common} defaultValue={0} options={goods} beforeToggle={({ status }) => dialog.confirm({ title: status ? '异步打开' : '异步关闭', msg: status ? '确定要打开下拉菜单吗' : '确定要关闭下拉菜单吗' }).then(() => true).catch(() => false)} /></DropMenu></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="自定义菜单选项" noPadding><view className="demo-drop-menu-custom"><DropMenu style={{ flex: 1 }}><DropMenuItem {...common} defaultValue={0} options={goods} /></DropMenu><view className="demo-drop-menu-sort"><SortButton title="上架时间" /></view></view></ExampleBlock>
      <ExampleBlock title="自定义菜单图标" noPadding><DropMenu><DropMenuItem {...common} title="地图" icon="location" iconSize={14} /></DropMenu></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="向上弹出" noPadding><DropMenu direction="up" topOffset={44}><DropMenuItem {...common} defaultValue={0} options={goods} /><DropMenuItem {...common} defaultValue={0} options={sorts} /></DropMenu></ExampleBlock>
      <ExampleBlock title="自定义菜单内容" noPadding><DropMenu direction="up" topOffset={44}><DropMenuItem {...common} defaultValue={0} options={goods} /><DropMenuItem {...common} ref={filter} title="筛选">
        <view className="demo-drop-menu-slider"><Slider defaultValue={30} /></view>
        <Cell title="标题文字" value="内容" /><Cell title="标题文字" description="描述信息" value="内容" />
        <view className="demo-drop-menu-confirm"><Button label="主要按钮" block size="large" onTap={() => filter.current?.close()} /></view>
      </DropMenuItem></DropMenu></ExampleBlock>
    </DemoGroup>
    <Dialog {...dialog.props} rootPortal className="ui-demo-page" />
  </view>;
}
