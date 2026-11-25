# CalendarView 日历面板

日历面板在页面中直接展示月份与日期，支持单日、范围以及日期禁用。

```tsx
import { CalendarView } from 'daisu-ui';
```

## 组件类型

### 单日选择

设置 `type="date"` 使用单日模式，`value` 指定日期，`onChange` 获取选择结果。

```tsx
<CalendarView
  value={Date.now()}
  type="date"
  onChange={(event) => {
    'background only';
    console.log(event.value);
  }}
/>
```

## 组件变体

### 日期范围

设置 `type="daterange"` 选择开始日期和结束日期。

```tsx
<CalendarView type="daterange" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `CalendarType` | `'date'` |
| minDate | 最小可选择日期 | `number` | — |
| maxDate | 最大可选择日期 | `number` | — |
| firstDayOfWeek | 每周起始日期，0 表示星期日 | `number` | `0` |
| defaultTime | 未指定时分秒时使用的默认时间 | `string \| readonly string[]` | — |
| maxRange | 允许选择的最大范围 | `number` | — |
| allowSameDay | 是否允许范围起止日期相同 | `boolean` | `false` |
| value | 当前值；传入后由调用方更新 | `CalendarValue` | — |
| disabled | 是否禁用 | `boolean` | — |
| panelHeight | 面板高度 | `number` | `316` |
| showPanelTitle | 是否显示面板标题 | `boolean` | `true` |
| switchMode | 日历切换方式 | `CalendarSwitchMode` | `'none'` |
| rangePrompt | 日期范围选择提示文字 | `string` | — |
| formatter | 内容格式化函数 | `(day: CalendarDayItem) => Partial<CalendarDayItem>` | — |
| timeFilter | 时间选项过滤函数 | `DatetimeFilter` | — |
| timeItemHeight | 时间滚轮行高 | `number` | `44` |
| timeVisibleItemCount | 时间滚轮可见行数 | `number` | `3` |
| hideSecond | 是否隐藏秒选项 | `boolean` | `false` |
| immediateChange | 输入时是否立即触发变化 | `boolean` | `false` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (event: { value: CalendarValue }) => void |
| onOverRange | 对应操作发生时触发 | () => void |
| onPickStart | 对应操作发生时触发 | () => void |
| onPickEnd | 对应操作发生时触发 | () => void |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| scrollIntoView | 调用实例方法 | () => void |
| getSelected | 调用实例方法 | () => CalendarValue |

## 数据类型

```tsx
export type CalendarType =
  | 'date'
  | 'dates'
  | 'daterange'
  | 'datetime'
  | 'datetimerange'
  | 'week'
  | 'weekrange'
  | 'month'
  | 'monthrange';

export type CalendarValue = number | readonly (number | null)[] | null;

export type CalendarSwitchMode = 'none' | 'month' | 'year-month';

export type CalendarDayItem = {
  date: number;
  text: string;
  disabled: boolean;
  type: CalendarDayType;
  topInfo?: string;
  bottomInfo?: string;
  customClass?: string;
};
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from 'daisu-ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[CalendarView 组件源码](./sources/calendar-view/CalendarView.tsx.txt) · [示例源码](./sources/calendar-view/demo.tsx.txt) · [文档源码](./sources/calendar-view/docs.md.txt)
