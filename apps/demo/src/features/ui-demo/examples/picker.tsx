import { useDemoLocale } from '../demoLocale.js';
import { useEffect, useRef, useState } from '@lynx-js/react';
import { Cell, CellGroup, Picker, Toast, useToast } from '@daisu-ui/ui';
import type { PickerValue } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
import { pickerOptions, pickerUniversity, pickerAreas } from './pickerShared.js';
const longOptions = pickerOptions.map((item, index) => index === 0 ? { value: '选项1'.repeat(13), label: '选项1'.repeat(13) } : item);
const initial: Record<string, PickerValue[]> = { basic: [], multiple: [], area: ['110000', '110100', '110102'], title: ['选项1'], large: ['选项3'], right: ['选项3'], separator: ['中南大学', '软件工程'], validate: [] };
export function PickerExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [values, setValues] = useState(initial), [opened, setOpened] = useState(''), [labels, setLabels] = useState<Record<string, string>>({ area: '北京 - 北京 - 西城区', separator: '中南大学-软件工程' });
  const toast = useToast(), pending = useRef<{ timer: ReturnType<typeof setTimeout>; resolve: (allow: boolean) => void }>();
  useEffect(() => () => { if (pending.current) { clearTimeout(pending.current.timer); pending.current.resolve(false); } }, []);
  const beforeConfirm = (value: PickerValue[]) => {
    'background only'; toast.loading({ msg: '处理中', zIndex: 110 });
    return new Promise<boolean>(resolve => { const timer = setTimeout(() => { pending.current = undefined; toast.close(); const allowed = !['选项2', '选项3'].includes(String(value[0])); if (!allowed) toast.error({ msg: '选项校验不通过，请重新选择', zIndex: 110 }); resolve(allowed); }, 2000); pending.current = { timer, resolve }; });
  };
  const example = (key: string, heading: string, cellTitle = heading) => {
    const columns = key === 'area' ? pickerAreas : key === 'multiple' || key === 'separator' ? pickerUniversity : key === 'title' ? pickerOptions : longOptions;
    return <ExampleBlock key={key} title={heading} noPadding><CellGroup border><Cell title={demoText(cellTitle)} value={labels[key] ?? String(values[key]?.[0] ?? '')} placeholder={demoText(key === 'basic' ? '请选择' : undefined)} size={key === 'large' ? 'large' : 'medium'} arrow ellipsis onTap={() => setOpened(key)} /></CellGroup>
      <Picker visible={opened === key} onVisibleChange={show => { 'background only'; if (!show) { setOpened(''); if (pending.current) { clearTimeout(pending.current.timer); pending.current.resolve(false); pending.current = undefined; toast.close(); } } }} value={values[key]} columns={demoCopy(columns)} cascade={key === 'area'} title={demoText(key === 'title' ? '文案标题' : '')} beforeConfirm={key === 'validate' ? beforeConfirm : undefined} onConfirm={({ value, selectedLabels }) => {
        'background only'; setValues(previous => ({ ...previous, [key]: value }));
        if (['multiple', 'area', 'separator'].includes(key)) setLabels(previous => ({ ...previous, [key]: selectedLabels.join(key === 'multiple' ? ', ' : key === 'area' ? ' - ' : '-') }));
      }} />
    </ExampleBlock>;
  };
  return <view className="demo-picker-page">
    <DemoGroup title="基础用法">{example('basic', '单列选项')}{example('multiple', '多列')}{example('area', '多级联动')}</DemoGroup>
    <DemoGroup title="内容形态">{example('title', '文案标题', '标题')}</DemoGroup>
    <DemoGroup title="组件样式">{example('large', '大小', '单列选项')}{example('right', '值靠右显示', '单列选项')}</DemoGroup>
    <DemoGroup title="特殊交互">{example('separator', '分隔符')}{example('validate', '确定前校验', 'before-confirm')}</DemoGroup>
    <Toast {...demoCopy(toast.props)} />
  </view>;
}
