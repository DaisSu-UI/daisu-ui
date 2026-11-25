# InputNumber 计数器

计数器用于在指定范围内调整数值，支持精度、步长、空值和异步变更校验。

```tsx
import { InputNumber } from '@daisu-ui/ui';
```

## 组件类型

### 基础计数器

通过 `value` 和 `onChange` 管理数值，使用 `min` 和 `max` 限定范围。

```tsx
import { useState } from '@lynx-js/react';

import type { InputNumberValue } from '@daisu-ui/ui';

const [value, setValue] = useState<InputNumberValue>(1);

<InputNumber
  value={value}
  onChange={(event) => {
    'background only';
    setValue(event.value);
  }}
  min={1}
  max={10}
/>
```

## 组件样式

### 步长与精度

通过 `step` 设置每次增减的数值，通过 `precision` 设置小数位数。

```tsx
<InputNumber defaultValue={1.5} step={0.1} precision={1} min={0} />
```

## 组件状态

### 禁用与禁止输入

设置 `disabled` 禁用整个计数器，设置 `disableInput` 仅禁止手动输入。

```tsx
<InputNumber disabled />
<InputNumber disableInput defaultValue={3} />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| min | 最小值 | `number` | `1` |
| max | 最大值或数量上限 | `number` | — |
| step | 每次增加或减少的步长 | `number` | `1` |
| precision | 小数精度 | `number \| string` | `0` |
| stepStrictly | 是否严格按步长变化 | `boolean` | `false` |
| allowNull | 是否允许空值 | `boolean` | `false` |
| value | 当前值；传入后由调用方更新 | `InputNumberValue` | — |
| defaultValue | 非受控模式的初始值 | `InputNumberValue` | `1` |
| disabled | 是否禁用 | `boolean` | — |
| disableInput | 是否禁止手动输入 | `boolean` | `false` |
| disableMinus | 是否禁用减号 | `boolean` | `false` |
| disablePlus | 是否禁用加号 | `boolean` | `false` |
| withoutInput | 是否隐藏中间输入区域 | `boolean` | `false` |
| inputWidth | 输入区域宽度 | `number \| string` | `36` |
| placeholder | 占位内容或输入提示 | `string` | `''` |
| avoidKeyboard | 是否避让键盘 | `boolean` | `true` |
| beforeChange | 变化前校验；返回 false 或拒绝 Promise 可阻止变化 | `(value: InputNumberValue) => boolean \| Promise<boolean>` | — |
| longPress | 是否支持长按连续调整 | `boolean` | `false` |
| immediateChange | 输入时是否立即触发变化 | `boolean` | `true` |
| updateOnInit | 初始化时是否触发数值更新 | `boolean` | `true` |
| inputType | 原生输入类型 | `'number' \| 'digit'` | `'digit'` |
| theme | 外观主题 | `InputNumberTheme` | `'default'` |
| round | 圆角样式 | `boolean` | `false` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (event: { value: InputNumberValue }) => void |
| onFocus | 获得焦点时触发 | (event: TextFieldEvent) => void |
| onBlur | 失去焦点时触发 | (event: TextFieldEvent) => void |

## 数据类型

```tsx
export type InputNumberValue = number | string;

export type InputNumberTheme =
  | 'default'
  | 'primary'
  | 'outline-split'
  | 'outline';

export type TextFieldEvent = {
  value: string;
  selectionStart?: number;
  selectionEnd?: number;
  isComposing?: boolean;
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
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-line-strong` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[InputNumber 组件源码](./sources/input-number/InputNumber.tsx.txt) · [示例源码](./sources/input-number/demo.tsx.txt) · [文档源码](./sources/input-number/docs.md.txt)
