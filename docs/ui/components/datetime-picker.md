# DatetimePicker 日期时间选择器

日期时间选择器以弹层方式选择日期和时间，支持范围限制、自定义文案和确认校验。

```tsx
import { DatetimePicker } from '@daisu-ui/ui';
```

## 组件类型

### 选择日期时间

设置 `type="datetime"`，通过 `visible` 控制弹层，`onConfirm` 获取确认后的时间值。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from '@daisu-ui/ui';

const [visible, setVisible] = useState(false);

<Button
  label="选择时间"
  onTap={() => {
    'background only';
    setVisible(true);
  }}
/>
<DatetimePicker
  visible={visible}
  onVisibleChange={setVisible}
  type="datetime"
  value={Date.now()}
  onConfirm={(event) => {
    'background only';
    console.log(event.value);
  }}
/>
```

## 组件变体

### 选择日期

设置 `type="date"` 仅展示日期选项。

```tsx
<DatetimePicker visible={false} type="date" value={Date.now()} />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| filter | 选项过滤函数 | `DatetimeFilter` | — |
| loading | 加载状态或自定义加载内容 | `boolean` | — |
| disabled | 是否禁用 | `boolean` | — |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |
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
| columnFormatter | 选项列格式化函数 | `(columns: PickerOption[][]) => PickerOption[][]` | — |
| itemHeight | 数据项高度 | `number` | — |
| visibleItemCount | 滚轮可见行数 | `number` | — |
| immediateChange | 输入时是否立即触发变化 | `boolean` | — |
| value | 当前值；传入后由调用方更新 | `V` | — |
| visible | 是否显示选择面板 | `boolean` | — |
| title | 标题内容 | `string` | `''` |
| cancelButtonText | 取消按钮文案 | `string` | `'取消'` |
| confirmButtonText | 确认按钮文案 | `string` | `'完成'` |
| beforeConfirm | 确认前校验 | `(value: Result<V>) => boolean \| Promise<boolean>` | — |
| displayFormatTabLabel | 级联选项页签的显示格式 | `(items: PickerOption[]) => string` | — |
| closeOnClickModal | 点击遮罩是否关闭 | `boolean` | `true` |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | `false` |
| safeAreaInsetBottom | 是否预留底部安全区 | `boolean` | `true` |
| safeAreaBottom | 底部安全区高度 | `number` | `0` |
| zIndex | 浮层层级 | `number` | `100` |
| viewClassName | 选择面板类名 | `string` | `''` |

泛型约束：`V extends DatetimePickerModelValue = DatetimePickerValue`。

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onPickStart | 对应操作发生时触发 | () => void |
| onPickEnd | 对应操作发生时触发 | () => void |
| onVisibleChange | 面板显示状态变化时触发 | (visible: boolean) => void |
| onConfirm | 确认选择时触发 | (event: { value: Result<V> }) => void |
| onChange | 值发生变化时触发 | (event: { value: Result<V> }) => void |
| onPickChange | 对应操作发生时触发 | (event: { value: Result<V> }) => void |
| onToggle | 对应操作发生时触发 | (value: DatetimePickerValue) => void |
| onCancel | 取消操作时触发 | () => void |
| onClose | 关闭时触发 | () => void |
| onOpen | 打开时触发 | () => void |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| open | 打开面板 | () => void |
| close | 关闭面板 | () => void |

## 数据类型

```tsx
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

export type DatetimePickerValue = number | string;
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

### CSS 变量

以下变量可通过 ConfigProvider 的 themeVars 覆盖，未设置时使用当前主题与组件的默认样式。

| 变量 | 作用范围 |
| --- | --- |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-auxiliary` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |
| `--cso-ui-text-placeholder` | 共享主题 |

## 源代码

[DatetimePicker 组件源码](./sources/datetime-picker/DatetimePicker.tsx.txt) · [示例源码](./sources/datetime-picker/demo.tsx.txt) · [文档源码](./sources/datetime-picker/docs.md.txt)
