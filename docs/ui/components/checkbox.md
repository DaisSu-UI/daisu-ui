# Checkbox 复选框

复选框用于选择一个或多个选项，支持分组、禁用、只读和按钮外观。

```tsx
import { Checkbox, CheckboxGroup } from 'daisu-ui';
```

## 组件类型

### 独立复选框

通过 `value` 表示选中状态，`onChange` 返回变化后的值，子节点用于显示选项文案。

```tsx
import { useState } from '@lynx-js/react';

const [checked, setChecked] = useState(false);

<Checkbox
  value={checked}
  onChange={(event) => {
    'background only';
    setChecked(Boolean(event.value));
  }}
>
  我已阅读并同意协议
</Checkbox>
```

## 组合用法

### 复选框组

在 `CheckboxGroup` 中组合多个选项，`defaultValue` 设置默认选中的值列表。

```tsx
<CheckboxGroup defaultValue={['apple']}>
  <Checkbox value="apple">苹果</Checkbox>
  <Checkbox value="orange">橙子</Checkbox>
</CheckboxGroup>
```

## 组件状态

### 禁用与按钮样式

设置 `disabled` 禁用选项，设置分组的 `type="button"` 使用按钮外观。

```tsx
<Checkbox disabled>禁用选项</Checkbox>
<CheckboxGroup type="button">
  <Checkbox value="one">选项一</Checkbox>
  <Checkbox value="two">选项二</Checkbox>
</CheckboxGroup>
```

## Attributes 属性

### Checkbox

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `ChoiceType` | — |
| checkedColor | 选中颜色 | `string` | — |
| uncheckedColor | 未选中颜色 | `string` | — |
| disabled | 是否禁用 | `boolean \| null` | — |
| readonly | 是否只读 | `boolean \| null` | — |
| placement | 浮层相对触发元素的位置 | `'left' \| 'right'` | — |
| direction | 布局或展开方向 | `'horizontal' \| 'vertical'` | — |
| size | 尺寸 | `'large'` | — |
| maxWidth | 最大宽度 | `string` | — |
| labelClassName | 选项文字类名 | `string` | — |
| className | 根节点自定义类名 | `string` | — |
| style | 根节点样式 | `CSSProperties` | — |
| children | 自定义内容 | `ReactNode` | — |
| name | 名称或标识 | `ChoiceValue` | — |
| value | 当前值；传入后由调用方更新 | `ChoiceValue` | — |
| defaultValue | 非受控模式的初始值 | `ChoiceValue` | — |
| trueValue | 选中状态对应的值 | `ChoiceValue` | — |
| falseValue | 未选中状态对应的值 | `ChoiceValue` | — |
| indeterminate | 是否显示半选状态 | `boolean` | — |

### CheckboxGroup

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `ChoiceType` | — |
| checkedColor | 选中颜色 | `string` | — |
| uncheckedColor | 未选中颜色 | `string` | — |
| disabled | 是否禁用 | `boolean \| null` | — |
| readonly | 是否只读 | `boolean \| null` | — |
| placement | 浮层相对触发元素的位置 | `'left' \| 'right'` | — |
| direction | 布局或展开方向 | `'horizontal' \| 'vertical'` | — |
| size | 尺寸 | `'large'` | — |
| maxWidth | 最大宽度 | `string` | — |
| labelClassName | 选项文字类名 | `string` | — |
| className | 根节点自定义类名 | `string` | — |
| style | 根节点样式 | `CSSProperties` | — |
| children | 自定义内容 | `ReactNode` | — |
| value | 当前值；传入后由调用方更新 | `readonly ChoiceValue[]` | — |
| defaultValue | 非受控模式的初始值 | `readonly ChoiceValue[]` | — |
| min | 最小值 | `number` | — |
| max | 最大值或数量上限 | `number` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| Checkbox.onChange | 值发生变化时触发 | (event: { value: ChoiceValue }) => void |
| CheckboxGroup.onChange | 值发生变化时触发 | (event: { value: ChoiceValue[] }) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| Checkbox.renderIcon | 自定义图标 | (state: { isChecked: boolean }) => ReactNode |
| Checkbox.children | 自定义内容 | ReactNode |
| CheckboxGroup.renderIcon | 自定义图标 | (state: { isChecked: boolean }) => ReactNode |
| CheckboxGroup.children | 自定义内容 | ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| toggle | 调用实例方法 | () => void |
| toggleAll | 调用实例方法 | (options?: boolean \| { checked?: boolean; skipDisabled?: boolean }) => void |

## 数据类型

```tsx
export type ChoiceType = 'circle' | 'square' | 'dot' | 'button';

export type ChoiceValue = string | number | boolean;
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

[Checkbox 组件源码](./sources/checkbox/Checkbox.tsx.txt) · [CheckboxGroup 组件源码](./sources/checkbox/Checkbox.tsx.txt) · [示例源码](./sources/checkbox/demo.tsx.txt) · [文档源码](./sources/checkbox/docs.md.txt)
