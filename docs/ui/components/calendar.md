# Calendar 日历选择器

日历选择器通过弹层提供单日、日期范围和多种日期选择模式，适合预约与筛选。

```tsx
import { Calendar } from 'daisu-ui';
```

## 组件类型

### 弹层日历

通过 `visible` 控制日历弹层，`type="date"` 使用单日模式，`onConfirm` 返回选择的日期。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from 'daisu-ui';

const [visible, setVisible] = useState(false);

<Button
  label="选择日期"
  onTap={() => {
    'background only';
    setVisible(true);
  }}
/>
<Calendar
  visible={visible}
  onVisibleChange={setVisible}
  type="date"
  onConfirm={(event) => {
    'background only';
    console.log(event.value);
  }}
/>
```

## 组件变体

### 日期范围

设置 `type="daterange"` 选择日期范围，通过 `title` 设置面板标题。

```tsx
<Calendar visible={false} type="daterange" title="选择入住日期" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值；传入后由调用方更新 | `CalendarValue` | — |
| disabled | 是否禁用 | `boolean` | — |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |
| type | 类型 | `CalendarType` | `'date'` |
| minDate | 最小可选择日期 | `number` | — |
| maxDate | 最大可选择日期 | `number` | — |
| formatter | 内容格式化函数 | `(day: CalendarDayItem) => Partial<CalendarDayItem>` | — |
| immediateChange | 输入时是否立即触发变化 | `boolean` | — |
| firstDayOfWeek | 每周起始日期，0 表示星期日 | `number` | — |
| defaultTime | 未指定时分秒时使用的默认时间 | `string \| readonly string[]` | — |
| maxRange | 允许选择的最大范围 | `number` | — |
| allowSameDay | 是否允许范围起止日期相同 | `boolean` | — |
| panelHeight | 面板高度 | `number` | — |
| showPanelTitle | 是否显示面板标题 | `boolean` | — |
| switchMode | 日历切换方式 | `CalendarSwitchMode` | — |
| rangePrompt | 日期范围选择提示文字 | `string` | — |
| timeFilter | 时间选项过滤函数 | `DatetimeFilter` | — |
| timeItemHeight | 时间滚轮行高 | `number` | — |
| timeVisibleItemCount | 时间滚轮可见行数 | `number` | — |
| hideSecond | 是否隐藏秒选项 | `boolean` | — |
| visible | 是否显示选择面板 | `boolean` | — |
| title | 标题内容 | `string` | `'选择日期'` |
| confirmText | 确认文案 | `string` | `'确定'` |
| showConfirm | 是否显示确认按钮 | `boolean` | `true` |
| beforeConfirm | 确认前校验 | `(value: CalendarValue) => boolean \| Promise<boolean>` | — |
| innerDisplayFormat | 选择器内部显示格式 | `(value: number \| null, endpoint: 'start' \| 'end', type: CalendarType) => string` | — |
| ellipsis | 是否截断超出范围的文字 | `boolean` | `false` |
| showTypeSwitch | 是否展示日期类型切换 | `boolean` | `false` |
| shortcuts | 快捷选项列表 | `readonly CalendarShortcut[]` | `[]` |
| confirmLeft | confirmLeft 配置 | `ReactNode` | — |
| confirmRight | confirmRight 配置 | `ReactNode` | — |
| viewClassName | 选择面板类名 | `string` | `''` |
| closeOnClickModal | 点击遮罩是否关闭 | `boolean` | `true` |
| duration | 动画或显示时长，单位 ms | `number` | `200` |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | `false` |
| safeAreaInsetBottom | 是否预留底部安全区 | `boolean` | `true` |
| safeAreaBottom | 底部安全区高度 | `number` | `0` |
| zIndex | 浮层层级 | `number` | `100` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onPickStart | 对应操作发生时触发 | () => void |
| onPickEnd | 对应操作发生时触发 | () => void |
| onOverRange | 对应操作发生时触发 | () => void |
| onVisibleChange | 面板显示状态变化时触发 | (visible: boolean) => void |
| onConfirm | 确认选择时触发 | (event: { value: CalendarValue; type: CalendarType }) => void |
| onChange | 值发生变化时触发 | (event: { value: CalendarValue }) => void |
| onPickChange | 对应操作发生时触发 | (event: { value: CalendarValue }) => void |
| onCancel | 取消操作时触发 | () => void |
| onOpen | 打开时触发 | () => void |
| onClose | 关闭时触发 | () => void |
| onShortcutsClick | 对应操作发生时触发 | (event: { item: CalendarShortcut; index: number }) => CalendarValue \| Promise<CalendarValue> |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| confirmLeft | 自定义区域内容 | ReactNode |
| confirmRight | 自定义区域内容 | ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| open | 打开面板 | () => void |
| close | 关闭面板 | () => void |

## 数据类型

```tsx
export type CalendarValue = number | readonly (number | null)[] | null;

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

export type CalendarDayItem = {
  date: number;
  text: string;
  disabled: boolean;
  type: CalendarDayType;
  topInfo?: string;
  bottomInfo?: string;
  customClass?: string;
};

export type CalendarSwitchMode = 'none' | 'month' | 'year-month';

export type CalendarShortcut = { text: string; [key: string]: unknown };
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from 'daisu-ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

### CSS 变量

以下变量可通过 ConfigProvider 的 themeVars 覆盖，未设置时使用当前主题与组件的默认样式。

| 变量 | 作用范围 |
| --- | --- |
| `--cso-ui-calendar-range-bg` | 当前组件 |
| `--cso-ui-dark-display` | 共享主题 |
| `--cso-ui-disabled-text` | 共享主题 |
| `--cso-ui-light-display` | 共享主题 |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-on-primary` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-surface-muted` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-auxiliary` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |
| `--cso-ui-text-placeholder` | 共享主题 |
| `--cso-ui-text-secondary` | 共享主题 |

## 源代码

[Calendar 组件源码](./sources/calendar/Calendar.tsx.txt) · [示例源码](./sources/calendar/demo.tsx.txt) · [文档源码](./sources/calendar/docs.md.txt)
