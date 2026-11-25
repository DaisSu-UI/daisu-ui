import { useState } from '@lynx-js/react';
import { DatetimePickerView, Toast, useToast } from '@daisu-ui/ui';
import type { DatetimePickerType, DatetimePickerValue } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
import { datetimeUnits, fiveMinuteFilter } from './datetimeShared.js';
export function DatetimePickerViewExample() {
  const [values, setValues] = useState<Record<string, DatetimePickerValue>>(() => { const now = Date.now(); return { basic: '', seconds: now, date: now, month: now, year: '', time: '11:12', timeSeconds: '11:12:13', format: now, filter: now }; }), toast = useToast();
  const example = (key: string, title: string, type: DatetimePickerType = 'datetime') => <ExampleBlock key={key} title={title}><DatetimePickerView value={values[key]} type={type} useSecond={key === 'seconds' || key === 'timeSeconds'} formatter={key === 'format' ? datetimeUnits : undefined} filter={key === 'filter' ? fiveMinuteFilter : undefined} onChange={({ value }) => { 'background only'; setValues(previous => ({ ...previous, [key]: value })); if (key === 'basic') toast.show(`选择了${new Date(value)}`); }} /></ExampleBlock>;
  return <view className="demo-datetime-picker-view-page">
    <DemoGroup title="组件类型">{example('basic', '日期选择')}</DemoGroup>
    <DemoGroup title="组件变体">{example('seconds', '日期选择（带秒）')}{example('date', '年月日', 'date')}{example('month', '年月', 'year-month')}{example('year', '年', 'year')}{example('time', '时分', 'time')}{example('timeSeconds', '时间选择（带秒）', 'time')}</DemoGroup>
    <DemoGroup title="组件样式">{example('format', '内部格式')}{example('filter', '过滤选项')}</DemoGroup>
    <Toast {...toast.props} />
  </view>;
}
