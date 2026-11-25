import { Radio, RadioGroup } from 'daisu-ui';
import type { CalendarDayItem, CalendarSwitchMode } from 'daisu-ui';
export function calendarFormatter(day: CalendarDayItem) {
  const date = new Date(day.date), now = new Date();
  return { ...day, topInfo: date.toDateString() === now.toDateString() ? '今天' : date.getMonth() === 5 && date.getDate() === 18 ? '618大促' : date.getMonth() === 10 && date.getDate() === 11 ? '京东双11' : '', bottomInfo: day.type === 'start' ? '开始' : day.type === 'end' ? '结束' : day.type === 'same' ? '开始/结束' : '' };
}
export function CalendarSwitch({ value, onChange }: { value: CalendarSwitchMode; onChange: (value: CalendarSwitchMode) => void }) {
  return <RadioGroup<CalendarSwitchMode> type="button" value={value} onChange={next => { 'background only'; if (next) onChange(next); }}>{(['none', 'month', 'year-month'] as const).map(mode => <Radio key={mode} value={mode}>{mode}</Radio>)}</RadioGroup>;
}
