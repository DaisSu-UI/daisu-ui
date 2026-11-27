import { useDemoLocale } from '../demoLocale.js';
import { useState } from '@lynx-js/react';
import { PickerView } from '@daisu-ui/ui';
import type { PickerValue } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
import { pickerOptions, pickerDisabledOptions, pickerUniversity, pickerAreas } from './pickerShared.js';
const custom = [{ id: 1, text: '选项一' }, { id: 2, text: '选项二' }, { id: 3, text: '选项三' }];
export function PickerViewExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [basic, setBasic] = useState<PickerValue[]>([]), [disabled, setDisabled] = useState<PickerValue[]>([]), [immediate, setImmediate] = useState<PickerValue[]>([]);
  const [multiple, setMultiple] = useState<PickerValue[]>(['中南大学', '软件工程']), [area, setArea] = useState<PickerValue[]>(['110000', '110100', '110102']), [fields, setFields] = useState<PickerValue[]>([1]), [message, setMessage] = useState('');
  const [reports, setReports] = useState<Record<string, string>>({});
  const result = (key: string) => <text className="demo-picker-view-result">{demoText(`当前值：${reports[key] ?? ''}`)}</text>;
  const report = (key: string, values: PickerValue[]) => setReports(previous => ({ ...previous, [key]: values.join(' / ') }));
  return <view className="demo-picker-view-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法" noPadding>{result('basic')}<PickerView value={basic} columns={demoCopy(pickerOptions)} onChange={({ value }) => { setBasic(value); report('basic', value); }} /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="禁用选项" noPadding>{result('disabled')}<PickerView value={disabled} columns={demoCopy(pickerDisabledOptions)} onChange={({ value }) => { setDisabled(value); report('disabled', value); }} /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体">
      <ExampleBlock title="立即触发" noPadding>{result('immediate')}<text className="demo-picker-view-result">{demoText(`变更信息：${message}`)}</text><PickerView value={immediate} columns={demoCopy(pickerDisabledOptions)} immediateChange onChange={({ value, selectedLabels, columnIndex }) => { 'background only'; setImmediate(value); report('immediate', value); setMessage(`${selectedLabels.join(' / ')}，第 ${columnIndex} 列`); }} /></ExampleBlock>
      <ExampleBlock title="多列" noPadding>{result('multiple')}<PickerView value={multiple} columns={demoCopy(pickerUniversity)} onChange={({ value }) => { setMultiple(value); report('multiple', value); }} /></ExampleBlock>
      <ExampleBlock title="多级联动" noPadding>{result('area')}<PickerView value={area} columns={demoCopy(pickerAreas)} cascade onChange={({ value }) => { setArea(value); report('area', value); }} /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊用法"><ExampleBlock title="自定义字段" noPadding>{result('fields')}<PickerView value={fields} columns={demoCopy(custom)} valueKey="id" labelKey="text" onChange={({ value }) => { setFields(value); report('fields', value); }} /></ExampleBlock></DemoGroup>
  </view>;
}
