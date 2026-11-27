import { useDemoLocale } from '../demoLocale.js';
import { memo, useCallback, useState } from '@lynx-js/react';
import { CalendarView, Radio, RadioGroup } from '@daisu-ui/ui';
import type { CalendarType, CalendarValue, CalendarSwitchMode } from '@daisu-ui/ui';
import { CalendarDemoPanel } from './CalendarDemoPanel.js';
import { DemoGroup, ExampleBlock } from './shared.js';
import { calendarFormatter, CalendarSwitch } from './calendarShared.js';
const CalendarField = memo(function CalendarField({ name, value, type, switchMode, onChange }: { name: string; value: CalendarValue | undefined; type: CalendarType; switchMode: CalendarSwitchMode; onChange: (key: string, value: CalendarValue) => void }) {
  const change = useCallback(({ value }: { value: CalendarValue }) => { 'background only'; onChange(name, value); }, [name, onChange]);
  return <CalendarView value={value} type={type} switchMode={switchMode} allowSameDay firstDayOfWeek={name === 'first' ? 1 : 0} formatter={name === 'format' ? calendarFormatter : undefined} maxRange={name === 'limit' ? 3 : undefined} onChange={change} />;
});
export function CalendarViewExample() {
  const { text: demoText } = useDemoLocale();
  const [values, setValues] = useState<Record<string, CalendarValue>>(() => { const now = Date.now(), day = 86400000; return { single: now, multiple: null, range: [now - 33 * day, now], datetime: now, datetimerange: [now - 3 * day, now - day], format: [now - 3 * day, now - day], first: [now - 3 * day, now - day], limit: [now - 3 * day, now - day] }; });
  const [singleType, setSingleType] = useState<CalendarType>('date'), [rangeType, setRangeType] = useState<CalendarType>('daterange'), [switchMode, setSwitchMode] = useState<CalendarSwitchMode>('none');
  const change = useCallback((key: string, value: CalendarValue) => { 'background only'; setValues(previous => ({ ...previous, [key]: value })); }, []);
  const view = (key: string, type: CalendarType = 'date') => <CalendarDemoPanel initial={key === 'single'} height={(type === 'month' || type === 'monthrange' ? 382 : type.startsWith('datetime') ? 404 : 392) + (switchMode === 'none' ? 0 : 4)}><CalendarField name={key} value={values[key]} type={type} switchMode={switchMode} onChange={change} /></CalendarDemoPanel>;
  const types = (current: CalendarType, options: CalendarType[], onChange: (type: CalendarType) => void) => <view className="demo-calendar-types"><text>{demoText("切换类型：")}</text><RadioGroup<CalendarType> type="button" value={current} onChange={next => { 'background only'; if (next) onChange(next); }}>{options.map(type => <Radio key={type} value={type}>{type}</Radio>)}</RadioGroup></view>;
  return <view className="demo-calendar-view-page">
    <DemoGroup title="组件类型">
      <ExampleBlock title="单个日期选择" noPadding>{types(singleType, ['date', 'week', 'month'], setSingleType)}{view('single', singleType)}</ExampleBlock>
      <ExampleBlock title="多个日期选择" noPadding>{view('multiple', 'dates')}</ExampleBlock>
      <ExampleBlock title="日期范围选择" noPadding>{types(rangeType, ['daterange', 'weekrange', 'monthrange'], setRangeType)}{view('range', rangeType)}</ExampleBlock>
      <ExampleBlock title="时间类型" noPadding>{view('datetime', 'datetime')}</ExampleBlock>
      <ExampleBlock title="时间范围类型" noPadding>{view('datetimerange', 'datetimerange')}</ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="范围选择允许选中同一日期" noPadding>{view('range', 'daterange')}</ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock title="切换模式"><CalendarSwitch value={switchMode} onChange={setSwitchMode} /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="自定义日期" noPadding>{view('format', 'daterange')}</ExampleBlock><ExampleBlock title="设置周起始日" noPadding>{view('first')}</ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="限制最大选择范围" noPadding>{view('limit', 'daterange')}</ExampleBlock></DemoGroup>
  </view>;
}
