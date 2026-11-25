# DatetimePickerView 日期时间选择器视图

日期时间选择器视图在页面内展示时间滚轮，可限制时间范围并调整选择类型。

```tsx
import { DatetimePickerView } from 'daisu-ui';
```

## 组件类型

### 日期时间

设置 `type="datetime"` 选择日期与时间，通过 `value` 设置当前值，`onChange` 获取选择结果。

```tsx
<DatetimePickerView
  value={Date.now()}
  type="datetime"
  onChange={(event) => {
    'background only';
    console.log(event.value);
  }}
/>
```

## 组件变体

### 日期选择

设置 `type="date"` 仅选择日期。

```tsx
<DatetimePickerView value={Date.now()} type="date" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值；传入后由调用方更新 | `DatetimePickerValue` | — |
| type | 类型 | `DatetimePickerType` | — |
| minDate | 最小可选择日期 | `number` | — |
| maxDate | 最大可选择日期 | `number` | — |
| minHour | 最小时 | `number` | — |
| maxHour | 最大小时 | `number` | — |
| minMinute | 最小分钟 | `number` | — |
| maxMinute | 最大分钟 | `number` | — |
| useSecond | 是否包含秒 | `boolean` | — |
| minSecond | 最小秒数 | `number` | — |
| maxSecond | 最大秒数 | `number` | — |
| boundaryMinDate | 可浏览的最小日期 | `number` | — |
| boundaryMaxDate | 可浏览的最大日期 | `number` | — |
| formatter | 内容格式化函数 | `(type: DatetimeColumnType, value: number) => string` | — |
| filter | 选项过滤函数 | `DatetimeFilter` | — |
| columnFormatter | 选项列格式化函数 | `(columns: PickerOption[][]) => PickerOption[][]` | — |
| disabled | 是否禁用 | `boolean` | — |
| loading | 加载状态或自定义加载内容 | `boolean` | — |
| itemHeight | 数据项高度 | `number` | — |
| visibleItemCount | 滚轮可见行数 | `number` | — |
| immediateChange | 输入时是否立即触发变化 | `boolean` | — |
| className | 根节点自定义类名 | `string` | — |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (event: DatetimePickerChange) => void |
| onPickStart | 对应操作发生时触发 | () => void |
| onPickEnd | 对应操作发生时触发 | () => void |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| getSelected | 调用实例方法 | () => DatetimePickerChange |
| getSelectedOptions | 调用实例方法 | () => PickerOption[] |
| correctValue | 调用实例方法 | (value: DatetimePickerValue) => DatetimePickerValue |
| getOriginColumns | 调用实例方法 | () => DatetimeColumn[] |

## 数据类型

```tsx
export type DatetimePickerValue = number | string;

export type DatetimePickerType =
  | 'datetime'
  | 'date'
  | 'year-month'
  | 'time'
  | 'year';

export type DatetimeColumnType =
  | 'year'
  | 'month'
  | 'date'
  | 'hour'
  | 'minute'
  | 'second';

export type PickerOption = {
  value: PickerValue;
  label: string;
  disabled?: boolean;
  children?: readonly PickerOption[];
};

export type DatetimePickerChange = {
  value: DatetimePickerValue;
  columns: DatetimeColumn[];
  selectedOptions: PickerOption[];
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

[DatetimePickerView 组件源码](./sources/datetime-picker-view/DatetimePickerView.tsx.txt) · [示例源码](./sources/datetime-picker-view/demo.tsx.txt) · [文档源码](./sources/datetime-picker-view/docs.md.txt)
