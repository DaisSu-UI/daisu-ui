import { useState } from '@lynx-js/react';
import { Cell, CellGroup, SelectPicker, Toast, useToast } from 'daisu-ui';
import type { SelectPickerValue } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';
export const selectPickerOptions = ['男装', '奢侈品', '女装', '鞋靴', '内衣配饰', '箱包', '美妆护肤', '个性清洁', '钟表珠宝', '手机', '数码', '电脑办公'].map((label, index) => ({ value: String(101 + index), label }));
const disabledOptions = [selectPickerOptions[0]!, selectPickerOptions[1]!, selectPickerOptions[2]!].map((item, index) => ({ ...item, disabled: index === 0 }));
const initial: Record<string, SelectPickerValue> = { basic: ['101'], radio: '101', disabled: [], loading: [], title: [], search: ['102'], radioSearch: '102', change: [], validate: [], auto: '101' };
export function SelectPickerExample() {
  const [opened, setOpened] = useState(''), [values, setValues] = useState(initial), toast = useToast();
  const example = (key: string, title: string) => {
    const value = values[key], list = Array.isArray(value) ? value : [value], display = list.map(value => selectPickerOptions.find(item => item.value === value)?.label ?? '').join(', ');
    return <ExampleBlock key={key} title={title} noPadding><CellGroup border><Cell title={title} value={display} ellipsis arrow onTap={() => setOpened(key)} /></CellGroup>
      <SelectPicker visible={opened === key} onVisibleChange={show => { 'background only'; if (!show) setOpened(''); }} value={value} columns={key === 'disabled' ? disabledOptions : selectPickerOptions}
        type={['radio', 'radioSearch', 'auto'].includes(key) ? 'radio' : 'checkbox'} title={key === 'title' ? '多选' : '请选择'} loading={key === 'loading'} filterable={key === 'search' || key === 'radioSearch'} showConfirm={key !== 'auto'}
        onChange={key === 'change' ? ({ value }) => { 'background only'; toast.show({ msg: `选择了${value}`, zIndex: 110 }); } : undefined}
        beforeConfirm={key === 'validate' ? value => { 'background only'; if (Array.isArray(value) && value.length) { toast.error({ msg: '暂时无法选择商品', zIndex: 110 }); return false; } return true; } : undefined}
        onConfirm={({ value }) => { 'background only'; setValues(previous => ({ ...previous, [key]: value })); }} />
    </ExampleBlock>;
  };
  return <view className="demo-select-picker-page">
    <DemoGroup title="组件类型">{example('basic', '选择地址')}{example('radio', '类型切换')}</DemoGroup>
    <DemoGroup title="组件状态">{example('disabled', '禁用选项')}{example('loading', 'loading')}</DemoGroup>
    <DemoGroup title="组件样式">{example('title', '标题')}{example('search', '可搜索')}{example('radioSearch', '单选可搜索')}</DemoGroup>
    <DemoGroup title="特殊样式">{example('change', '选择器change')}{example('validate', 'before-confirm')}{example('auto', '自动完成')}</DemoGroup>
    <Toast {...toast.props} />
  </view>;
}
