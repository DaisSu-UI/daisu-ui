import { useEffect, useRef, useState } from '@lynx-js/react';
import { Cell, CellGroup, DatetimePicker, Toast, useToast } from '@daisu-ui/ui';
import type { DatetimePickerModelValue, DatetimePickerType, DatetimePickerValue, PickerOption } from '@daisu-ui/ui';
import { datetimeLabel } from '@daisu-ui/ui/utils';
import { DemoGroup, ExampleBlock } from './shared.js';
import { datetimeUnits, fiveMinuteFilter } from './datetimeShared.js';
const typeFor = (key: string): DatetimePickerType => key === 'date' ? 'date' : key === 'month' ? 'year-month' : key === 'year' ? 'year' : key === 'time' || key === 'timeSeconds' ? 'time' : 'datetime';
const secondsFor = (key: string) => key === 'seconds' || key === 'timeSeconds' || key === 'range';
const tabLabel = (items: PickerOption[]) => `${items[0]?.label}年${items[1]?.label}月${items[2]?.label}日 ${items[3]?.label}:${items[4]?.label}`;
export function DatetimePickerExample() {
  const [now] = useState(() => Date.now()), [opened, setOpened] = useState(''), [values, setValues] = useState<Record<string, DatetimePickerModelValue>>(() => { const now = Date.now(); return { basic: '', limit: now, validate: now, seconds: now, date: now, month: now, year: now, time: '09:20', timeSeconds: '09:20:26', range: ['', ''], rangeFormat: ['', now], display: now, format: now, filter: now }; });
  const toast = useToast(), pending = useRef<{ timer: ReturnType<typeof setTimeout>; resolve: (allow: boolean) => void }>();
  const cancelPending = () => { 'background only'; if (pending.current) { clearTimeout(pending.current.timer); pending.current.resolve(false); pending.current = undefined; toast.close(); } };
  useEffect(() => () => { if (pending.current) { clearTimeout(pending.current.timer); pending.current.resolve(false); } }, []);
  const beforeConfirm = (value: DatetimePickerModelValue) => {
    'background only'; toast.loading({ msg: '处理中', zIndex: 110 });
    return new Promise<boolean>(resolve => { const timer = setTimeout(() => { pending.current = undefined; toast.close(); const allow = typeof value === 'number' && value <= Date.now(); if (!allow) toast.error({ msg: '不能选择大于今天的日期', zIndex: 110 }); resolve(allow); }, 2000); pending.current = { timer, resolve }; });
  };
  const row = (key: string, title: string) => {
    const value = values[key]!, text = Array.isArray(value) ? value.some(item => item !== '') ? value.map(item => datetimeLabel(item, 'datetime', true)).join(' - ') : '' : datetimeLabel(value as DatetimePickerValue, typeFor(key), secondsFor(key));
    const display = key === 'display' ? text.replace(/^(\d+)-(\d+)-(\d+)/, '$1年$2月$3日') : text;
    return <Cell key={key} title={title} value={display} arrow placeholder={key === 'basic' ? '请选择' : undefined} titleWidth={key === 'basic' ? '33%' : undefined} valueAlign={key === 'basic' ? 'left' : undefined} onTap={() => setOpened(key)} />;
  };
  const nextYear = new Date(now); nextYear.setFullYear(nextYear.getFullYear() + 1); nextYear.setHours(0, 0, 0, 0);
  return <view className="demo-datetime-picker-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法" noPadding><CellGroup border>{row('basic', '日期选择')}{row('limit', '时间范围一年')}</CellGroup></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="before-confirm" noPadding><CellGroup border>{row('validate', 'before-confirm')}</CellGroup></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock title="日期类型" noPadding><CellGroup border>{row('seconds', '日期选择（带秒）')}{row('date', '年月日')}{row('month', '年月')}{row('year', '年')}{row('time', '时分')}{row('timeSeconds', '时间选择（带秒）')}</CellGroup></ExampleBlock><ExampleBlock title="区域选择" noPadding><CellGroup border>{row('range', '日期选择')}{row('rangeFormat', '日期选择')}</CellGroup></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="展示格式与内部格式" noPadding><CellGroup border>{row('display', '展示格式')}{row('format', '内部格式')}{row('filter', '过滤选项')}</CellGroup></ExampleBlock></DemoGroup>
    {Object.keys(values).map(key => <DatetimePicker key={key} visible={opened === key} value={values[key]} type={typeFor(key)} useSecond={secondsFor(key)} onVisibleChange={show => { 'background only'; if (!show) { setOpened(''); cancelPending(); } }} title={key === 'range' ? '请选择区间' : ''} minDate={key === 'limit' ? now : undefined} maxDate={key === 'limit' ? nextYear.getTime() : undefined} beforeConfirm={key === 'validate' ? beforeConfirm : undefined} displayFormatTabLabel={key === 'rangeFormat' ? tabLabel : undefined} formatter={key === 'format' ? datetimeUnits : undefined} filter={key === 'filter' ? fiveMinuteFilter : undefined} onConfirm={({ value }) => { 'background only'; setValues(previous => ({ ...previous, [key]: value })); }} />)}
    <Toast {...toast.props} />
  </view>;
}
