# Radio 单选

单选框用于从互斥选项中选择一项，通过 RadioGroup 管理选中值和公共属性。

```tsx
import { Radio, RadioGroup } from 'daisu-ui';
```

## 组件类型

### 单选框组

通过 `RadioGroup.value` 与 `onChange` 管理当前选项，每个 `Radio.value` 指定选项值。

```tsx
import { useState } from '@lynx-js/react';

const [value, setValue] = useState<string | null>('one');

<RadioGroup value={value} onChange={setValue}>
  <Radio value="one">选项一</Radio>
  <Radio value="two">选项二</Radio>
</RadioGroup>
```

## 组件状态

### 禁用选项

在选项上设置 `disabled`，该选项不能被选中。

```tsx
<RadioGroup defaultValue="one">
  <Radio value="one">可用选项</Radio>
  <Radio value="two" disabled>
    禁用选项
  </Radio>
</RadioGroup>
```

## 组件变体

### 按钮单选框

设置 `RadioGroup.type="button"` 使用按钮外观。

```tsx
<RadioGroup type="button" defaultValue="one">
  <Radio value="one">选项一</Radio>
  <Radio value="two">选项二</Radio>
</RadioGroup>
```

## Attributes 属性

### Radio

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
| value | 当前值；传入后由调用方更新 | `ChoiceValue` | 必填 |

### RadioGroup

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
| value | 当前值；传入后由调用方更新 | `T \| null` | — |
| defaultValue | 非受控模式的初始值 | `T \| null` | — |
| allowUncheck | 是否允许取消当前选项 | `boolean` | — |
| options | 选项配置 | `RadioOption[]` | — |

泛型约束：`T extends ChoiceValue = ChoiceValue`。

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| RadioGroup.onChange | 值发生变化时触发 | (value: T \| null) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| Radio.renderIcon | 自定义图标 | (state: { isChecked: boolean }) => ReactNode |
| Radio.children | 自定义内容 | ReactNode |
| RadioGroup.renderIcon | 自定义图标 | (state: { isChecked: boolean }) => ReactNode |
| RadioGroup.children | 自定义内容 | ReactNode |

## 数据类型

```tsx
export type ChoiceType = 'circle' | 'square' | 'dot' | 'button';

export type ChoiceValue = string | number | boolean;

export type RadioOption = {
  label: string;
  value: string;
  disabled?: boolean;
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

[Radio 组件源码](./sources/radio/Radio.tsx.txt) · [RadioGroup 组件源码](./sources/radio/Radio.tsx.txt) · [示例源码](./sources/radio/demo.tsx.txt) · [文档源码](./sources/radio/docs.md.txt)
