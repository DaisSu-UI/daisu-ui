import { useDemoLocale } from '../demoLocale.js';
import { useRef, useState } from '@lynx-js/react';
import { Button, Calendar, Cell, CellGroup, Toast, useToast } from '@daisu-ui/ui';
import type { CalendarRef, CalendarShortcut, CalendarSwitchMode, CalendarType, CalendarValue } from '@daisu-ui/ui';
import { calendarValues, calendarWeekNumber } from '@daisu-ui/ui/utils';
import { DemoGroup, ExampleBlock } from './shared.js';
import { calendarFormatter, CalendarSwitch } from './calendarShared.js';
const pad = (value: number) => String(value).padStart(2, '0');
const typeFor = (key: string): CalendarType => ({ multiple: 'dates', range: 'daterange', datetime: 'datetime', datetimerange: 'datetimerange', week: 'week', month: 'month', weekrange: 'weekrange', monthrange: 'monthrange', format: 'daterange', display: 'daterange', shortcuts: 'daterange' } as Record<string, CalendarType>)[key] ?? 'date';
function label(value: CalendarValue | undefined, type: CalendarType, custom = false): string {
  const values = calendarValues(value), formatted = values.map(value => {
    const date = new Date(value), day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    return custom ? `${pad(date.getFullYear() % 100)}年${pad(date.getMonth() + 1)}月${pad(date.getDate())}日` : type.startsWith('week') ? `${date.getFullYear()} 第${pad(calendarWeekNumber(value))}周` : type.startsWith('month') ? day.slice(0, 7) : type.startsWith('datetime') ? `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` : day;
  });
  return type.endsWith('range') ? formatted.length ? formatted.join(' - ') : '-' : formatted.join(', ');
}
const shortcuts: CalendarShortcut[] = [7, 15, 30].map(id => ({ text: `近${id}天`, id }));
const shortcutValue = ({ item }: { item: CalendarShortcut }) => { 'background only'; const end = Date.now() - 86400000; return [end - Number(item.id) * 86400000, end]; };
const displayFormat = (value: number | null, endpoint: 'start' | 'end') => value === null ? endpoint === 'start' ? '活动开始时间' : '活动结束时间' : label(value, 'date', true);
export function CalendarExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [now] = useState(() => Date.now()), [opened, setOpened] = useState(''), [switchMode, setSwitchMode] = useState<CalendarSwitchMode>('none');
  const [values, setValues] = useState<Record<string, CalendarValue>>(() => { const now = Date.now(), day = 86400000; return { basic: now, multiple: [now - 3 * day, now], range: [], datetime: now, datetimerange: [now - 3 * day, now - day], week: now, month: now, weekrange: [now - 14 * day, now], monthrange: [now - 33 * day, now], quick: now, before: null, types: now, format: [now - 3 * day, now], display: [now - 3 * day, now], shortcuts: [], footer: now }; });
  const footer = useRef<CalendarRef>(null);
  const toast = useToast();
  const beforeConfirm = (value: CalendarValue) => { 'background only'; const allow = typeof value === 'number' && value <= Date.now(); if (!allow) toast.error({ msg: '该日期暂无数据', zIndex: 110 }); return allow; };
  const row = (key: string, title: string) => <CellGroup key={key} border><Cell title={demoText(title)} value={label(values[key], typeFor(key), key === 'display')} arrow onTap={() => setOpened(key)} /></CellGroup>;
  const min = new Date(now); min.setFullYear(min.getFullYear() - 20); min.setMonth(min.getMonth() - 6); min.setHours(0, 0, 0, 0);
  return <view className="demo-calendar-page">
    <DemoGroup title="组件类型">{row('basic', '单个日期选择')}{row('multiple', '多个日期选择')}{row('range', '日期范围选择')}{row('datetime', '日期时间选择')}{row('datetimerange', '日期时间范围选择')}{row('week', '周选择')}{row('month', '月选择')}{row('weekrange', '周范围选择')}{row('monthrange', '月范围选择')}</DemoGroup>
    <DemoGroup title="组件状态">{row('quick', '快捷操作')}{row('before', 'before-confirm')}</DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock title="切换模式"><CalendarSwitch value={switchMode} onChange={setSwitchMode} /></ExampleBlock>{row('types', '日周月切换')}</DemoGroup>
    <DemoGroup title="组件样式">{row('format', '日期格式化')}{row('display', '自定义展示')}</DemoGroup>
    <DemoGroup title="特殊样式">{row('shortcuts', '快捷选项')}{row('footer', '拓展确定区域')}</DemoGroup>
    {Object.keys(values).map(key => <Calendar key={key} ref={key === 'footer' ? footer : undefined} visible={opened === key} value={values[key]} type={typeFor(key)} switchMode={switchMode} minDate={key === 'month' ? min.getTime() : undefined} firstDayOfWeek={key === 'weekrange' || key === 'types' ? 1 : 0} showConfirm={key !== 'quick'} showTypeSwitch={key === 'types'} beforeConfirm={key === 'before' ? beforeConfirm : undefined} formatter={key === 'format' ? calendarFormatter : undefined} innerDisplayFormat={key === 'display' ? displayFormat : undefined} shortcuts={key === 'shortcuts' ? shortcuts : undefined} onShortcutsClick={key === 'shortcuts' ? shortcutValue : undefined} confirmRight={key === 'footer' ? <Button block label={demoText("选择今天")} className="demo-calendar-today" onTap={() => { 'background only'; const date = new Date(); date.setHours(0, 0, 0, 0); footer.current?.setValue(date.getTime()); }} /> : undefined} onVisibleChange={show => { 'background only'; if (!show) setOpened(''); }} onConfirm={({ value }) => { 'background only'; setValues(previous => ({ ...previous, [key]: value })); }} />)}
    <Toast {...demoCopy(toast.props)} />
  </view>;
}
