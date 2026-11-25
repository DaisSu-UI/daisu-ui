# PickerView 选择器视图

选择器视图将滚轮面板直接嵌入页面，适合自定义弹层或固定区域选择。

```tsx
import { PickerView } from '@daisu-ui/ui';
```

## 组件类型

### 单列选择

通过 `columns` 配置选项，通过 `onChange` 获取滚轮选择结果。

```tsx
<PickerView
  columns={[
    { value: 'sh', label: '上海' },
    { value: 'bj', label: '北京' },
  ]}
  onChange={(event) => {
    'background only';
    console.log(event.value);
  }}
/>
```

## 组件样式

### 滚轮高度

通过 `visibleItemCount` 设置可见选项的行数。

```tsx
<PickerView
  visibleItemCount={5}
  columns={[
    { value: 1, label: '选项一' },
    { value: 2, label: '选项二' },
  ]}
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| valueKey | 选项值字段名 | `string` | — |
| labelKey | 显示文案字段名 | `string` | — |
| childrenKey | 子节点字段名 | `string` | — |
| value | 当前值；传入后由调用方更新 | `readonly PickerValue[]` | — |
| columns | 列或选项配置 | `PickerColumns` | 必填 |
| cascade | 是否联动后续选项列 | `boolean` | `false` |
| itemHeight | 数据项高度 | `number` | `44` |
| visibleItemCount | 滚轮可见行数 | `number` | `6` |
| immediateChange | 输入时是否立即触发变化 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | — |
| loading | 加载状态或自定义加载内容 | `boolean` | `false` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (event: PickerChange) => void |
| onPickStart | 对应操作发生时触发 | () => void |
| onPickEnd | 对应操作发生时触发 | () => void |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| getSelected | 调用实例方法 | () => PickerChange |
| getSelectedOptions | 调用实例方法 | () => PickerOption[] |
| getSelectedValues | 调用实例方法 | () => PickerValue[] |
| getSelectedLabels | 调用实例方法 | () => string[] |
| getSelectedIndex | 调用实例方法 | () => number[] |
| getColumnsData | 调用实例方法 | () => readonly (readonly PickerOption[])[] |
| getColumnData | 调用实例方法 | (index: number) => readonly PickerOption[] |
| getColumnIndex | 调用实例方法 | (index: number) => number |
| resetColumns | 调用实例方法 | (columns: PickerColumns) => void |

## 数据类型

```tsx
export type PickerValue = string | number;

export type PickerColumns =
  | readonly PickerColumnItem[]
  | readonly (readonly PickerColumnItem[])[];

export type PickerChange = {
  value: PickerValue[];
  selectedItems: PickerOption[];
  selectedValues: PickerValue[];
  selectedOptions: PickerOption[];
  selectedLabels: string[];
  selectedIndexes: number[];
  columnIndex: number;
};
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[PickerView 组件源码](./sources/picker-view/PickerView.tsx.txt) · [示例源码](./sources/picker-view/demo.tsx.txt) · [文档源码](./sources/picker-view/docs.md.txt)
