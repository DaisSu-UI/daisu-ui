# Picker 选择器

选择器以弹层方式展示滚轮选项，支持多列、联动、确认和取消。

```tsx
import { Picker } from '@daisu-ui/ui';
```

## 组件类型

### 打开选择器

通过 `columns` 配置选项，`visible` 控制显示，`onConfirm` 返回确认后的选择。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from '@daisu-ui/ui';

const [visible, setVisible] = useState(false);

<Button
  label="选择城市"
  onTap={() => {
    'background only';
    setVisible(true);
  }}
/>
<Picker
  visible={visible}
  onVisibleChange={setVisible}
  columns={[
    { value: 'sh', label: '上海' },
    { value: 'bj', label: '北京' },
  ]}
  onConfirm={(event) => {
    'background only';
    console.log(event.value);
  }}
/>
```

## 组件样式

### 自定义标题

通过 `title` 设置标题，通过 `confirmButtonText` 设置确认按钮文案。

```tsx
<Picker
  visible={false}
  title="请选择城市"
  confirmButtonText="确定"
  columns={[{ value: 'sh', label: '上海' }]}
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
| cascade | 是否联动后续选项列 | `boolean` | — |
| itemHeight | 数据项高度 | `number` | — |
| visibleItemCount | 滚轮可见行数 | `number` | — |
| immediateChange | 输入时是否立即触发变化 | `boolean` | — |
| disabled | 是否禁用 | `boolean` | — |
| loading | 加载状态或自定义加载内容 | `boolean` | — |
| className | 根节点自定义类名 | `string` | — |
| style | 根节点样式 | `CSSProperties` | — |
| visible | 是否显示选择面板 | `boolean` | — |
| title | 标题内容 | `ReactNode` | `''` |
| confirmButtonText | 确认按钮文案 | `string` | `'完成'` |
| cancelButtonText | 取消按钮文案 | `string` | `'取消'` |
| beforeConfirm | 确认前校验 | `(value: PickerValue[]) => boolean \| Promise<boolean>` | — |
| closeOnClickModal | 点击遮罩是否关闭 | `boolean` | `true` |
| safeAreaInsetBottom | 是否预留底部安全区 | `boolean` | `true` |
| viewClassName | 选择面板类名 | `string` | — |
| zIndex | 浮层层级 | `number` | `100` |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | `false` |
| safeAreaBottom | 底部安全区高度 | `number` | `0` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (event: PickerChange) => void |
| onPickStart | 对应操作发生时触发 | () => void |
| onPickEnd | 对应操作发生时触发 | () => void |
| onVisibleChange | 面板显示状态变化时触发 | (visible: boolean) => void |
| onConfirm | 确认选择时触发 | (event: PickerChange) => void |
| onCancel | 取消操作时触发 | () => void |
| onClose | 关闭时触发 | () => void |
| onOpen | 打开时触发 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| title | 标题内容 | ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| open | 打开面板 | () => void |
| close | 关闭面板 | () => void |

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

### CSS 变量

以下变量可通过 ConfigProvider 的 themeVars 覆盖，未设置时使用当前主题与组件的默认样式。

| 变量 | 作用范围 |
| --- | --- |
| `--cso-ui-canvas` | 共享主题 |
| `--cso-ui-dark-display` | 共享主题 |
| `--cso-ui-disabled-text` | 共享主题 |
| `--cso-ui-light-display` | 共享主题 |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-picker-fade-bottom` | 当前组件 |
| `--cso-ui-picker-fade-top` | 当前组件 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Picker 组件源码](./sources/picker/Picker.tsx.txt) · [示例源码](./sources/picker/demo.tsx.txt) · [文档源码](./sources/picker/docs.md.txt)
