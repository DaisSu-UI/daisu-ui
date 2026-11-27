# SelectPicker 单复选选择器

单复选选择器通过弹层展示列表选项，支持单选、多选和确认操作。

```tsx
import { SelectPicker } from '@daisu-ui/ui';
```

## 组件类型

### 单选列表

设置 `type="radio"` 使用单选模式，`columns` 配置选项，`visible` 控制面板显示。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from '@daisu-ui/ui';

const [visible, setVisible] = useState(false);

<Button
  label="选择"
  onTap={() => {
    'background only';
    setVisible(true);
  }}
/>
<SelectPicker
  visible={visible}
  onVisibleChange={setVisible}
  type="radio"
  columns={[
    { value: 1, label: '选项一' },
    { value: 2, label: '选项二' },
  ]}
/>
```

## 组件变体

### 多选列表

设置 `type="checkbox"` 使用多选模式。

```tsx
<SelectPicker
  visible={false}
  type="checkbox"
  columns={[
    { value: 'a', label: '选项一' },
    { value: 'b', label: '选项二' },
  ]}
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值；传入后由调用方更新 | `SelectPickerValue` | — |
| visible | 是否显示选择面板 | `boolean` | — |
| columns | 列或选项配置 | `readonly (SelectPickerOption \| Readonly<Record<string, unknown>>)[]` | 必填 |
| type | 类型 | `'checkbox' \| 'radio'` | `'checkbox'` |
| title | 标题内容 | `string` | — |
| min | 最小值 | `number` | `0` |
| max | 最大值或数量上限 | `number` | `0` |
| disabled | 是否禁用 | `boolean` | — |
| loading | 加载状态或自定义加载内容 | `boolean` | `false` |
| filterable | 是否允许筛选选项 | `boolean` | `false` |
| filterPlaceholder | 筛选输入框占位文案 | `string` | — |
| confirmButtonText | 确认按钮文案 | `string` | — |
| showConfirm | 是否显示确认按钮 | `boolean` | `true` |
| valueKey | 选项值字段名 | `string` | `'value'` |
| labelKey | 显示文案字段名 | `string` | `'label'` |
| checkedColor | 选中颜色 | `string` | — |
| selectSize | 选中项尺寸 | `'large'` | — |
| loadingColor | 加载指示器颜色 | `string` | `'#4D80F0'` |
| beforeConfirm | 确认前校验 | `(value: ChoiceValue \| ChoiceValue[]) => boolean \| Promise<boolean>` | — |
| closeOnClickModal | 点击遮罩是否关闭 | `boolean` | `true` |
| scrollIntoView | 滚动定位配置 | `boolean` | `true` |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | `false` |
| zIndex | 浮层层级 | `number` | `100` |
| safeAreaInsetBottom | 是否预留底部安全区 | `boolean` | `true` |
| safeAreaBottom | 底部安全区高度 | `number` | `0` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |
| contentClassName | 内容区域类名 | `string` | `''` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (event: { value: ChoiceValue \| ChoiceValue[] }) => void |
| onVisibleChange | 面板显示状态变化时触发 | (visible: boolean) => void |
| onConfirm | 确认选择时触发 | (event: { value: ChoiceValue \| ChoiceValue[]; selectedItems: SelectPickerOption[] }) => void |
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
export type SelectPickerValue = ChoiceValue | readonly ChoiceValue[];

export type ChoiceValue = string | number | boolean;

export type SelectPickerOption = {
  value: ChoiceValue;
  label: string;
  disabled?: boolean;
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

[SelectPicker 组件源码](./sources/select-picker/SelectPicker.tsx.txt) · [示例源码](./sources/select-picker/demo.tsx.txt) · [文档源码](./sources/select-picker/docs.md.txt)
