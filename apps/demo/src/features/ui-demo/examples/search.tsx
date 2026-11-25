import { useRef, useState } from '@lynx-js/react';
import { Icon, Popover, Search, Toast, useToast } from 'daisu-ui';
import type { PopoverRef, SearchProps } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';
function Sample({ defaultValue = '', ...props }: SearchProps) { const [value, setValue] = useState(defaultValue); return <Search {...props} value={value} onChange={({ value }) => { 'background only'; setValue(value); }} />; }
export function SearchExample({ theme }: { theme: 'light' | 'dark' }) {
  const iconColor = theme === 'dark' ? '#e5e6eb' : '#4e5369';
  const primaryColor = theme === 'dark' ? '#5b90ff' : '#1c64fd';
  const [basic, setBasic] = useState(''), [searchType, setSearchType] = useState('全部'), [filterOpen, setFilterOpen] = useState(false);
  const popovers = useRef<Record<string, PopoverRef | null>>({}), toast = useToast();
  const closeAll = (except?: string) => { 'background only'; for (const [key, ref] of Object.entries(popovers.current)) if (key !== except) ref?.close(); };
  const popoverProps = (key: string) => ({ ref: (ref: PopoverRef | null) => { 'background only'; popovers.current[key] = ref; }, onOpen: () => { 'background only'; closeAll(key); } });
  const scan = <Icon name="scan" size={20} color={iconColor} />;
  const actions = <view className="demo-search-actions"><Icon name="filter" size={20} color={iconColor} onTap={() => { 'background only'; toast.show('筛选'); }} /><Icon name="plus-circle-fill" size={20} color={primaryColor} onTap={() => { 'background only'; toast.show('新增'); }} /></view>;
  return <view className="demo-search-page" bindtap={() => { 'background only'; closeAll(); }}>
    <DemoGroup title="组件类型">
      <ExampleBlock title="基础用法" noPadding><Search value={basic} onChange={({ value }) => { 'background only'; setBasic(value); }} onSearch={({ value }) => { 'background only'; toast.show(`搜索${value}`); }} onCancel={() => { 'background only'; toast.show('取消'); }} onClear={() => { 'background only'; toast.show('清空'); }} /></ExampleBlock>
      <ExampleBlock title="数字类型" noPadding><Sample type="number" placeholder="请输入手机号" /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件状态">
      <ExampleBlock title="自动聚焦" noPadding><Sample focus /></ExampleBlock>
      <ExampleBlock title="清空后自动聚焦" noPadding><Sample focusWhenClear /></ExampleBlock>
      <ExampleBlock title="禁用且隐藏取消按钮" noPadding><Search disabled hideCancel onTap={() => { 'background only'; toast.show('禁用点击'); }} /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock title="样式变体" noPadding><Sample variant="plain" /><Sample variant="filled" className="demo-search-mt" /><Sample variant="light" className="demo-search-mt" /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="搜索占位符居左" noPadding><Sample placeholderLeft /></ExampleBlock>
      <ExampleBlock title="设置最大长度" noPadding><Sample defaultValue="初始文案" maxlength={4} /></ExampleBlock>
      <ExampleBlock title="自定义右侧文案" noPadding><Sample placeholder="请输入订单号/订单名称" cancelTxt="搜索" /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="自定义左侧插槽" noPadding><Sample prefix={<Popover {...popoverProps('prefix')} mode="menu" content={[{ content: '全部' }, { content: '订单号' }, { content: '退款单号' }]} onMenuClick={({ item }) => { 'background only'; setSearchType(item.content); }}><view className="demo-search-type" style={{ width: `${searchType.length * 16 + 46}px` }}><text>{searchType}</text><Icon name="caret-down" size={18} color={iconColor} /><view className="demo-search-type-divider" /></view></Popover>} /></ExampleBlock>
      <ExampleBlock title="自定义输入框右侧图标" noPadding><Sample inputSuffix={scan} /></ExampleBlock>
      <ExampleBlock title="自定义右侧插槽" noPadding><Sample inputSuffix={scan} suffix={<Popover {...popoverProps('filter')} mode="menu" content={[{ content: '气泡文本' }, { content: '气泡文本' }, { content: '气泡文本' }]} placement="bottom" onOpen={() => { 'background only'; closeAll('filter'); setFilterOpen(true); }} onClose={() => { 'background only'; setFilterOpen(false); }}><view className="demo-search-filter"><text>筛选条件</text><Icon name={filterOpen ? 'caret-up' : 'caret-down'} size={16} color={iconColor} /></view></Popover>} /></ExampleBlock>
      <ExampleBlock title="多种插槽组合" noPadding><Sample variant="plain" inputSuffix={scan} suffix={actions} /><Sample variant="filled" className="demo-search-mt" inputSuffix={scan} suffix={actions} /><view className="demo-search-light demo-search-mt"><Sample variant="light" inputSuffix={scan} suffix={actions} /></view></ExampleBlock>
    </DemoGroup>
    <Toast {...toast.props} rootPortal />
  </view>;
}
