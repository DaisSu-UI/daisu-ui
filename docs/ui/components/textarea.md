# Textarea 文本域

文本域用于录入多行内容，支持高度控制、自动增高、清空和字数统计。

```tsx
import { Textarea } from '@daisu-ui/ui';
```

## 组件类型

### 多行输入

通过 `value` 和 `onChange` 管理多行文本，`placeholder` 设置占位提示。

```tsx
import { useState } from '@lynx-js/react';

const [value, setValue] = useState('');

<Textarea value={value} onChange={setValue} placeholder="请输入详细说明" />
```

## 组件状态

### 禁用与只读

设置 `readonly` 使内容只读，设置 `disabled` 禁用文本域。

```tsx
<Textarea value="这是只读内容" readonly />
<Textarea value="这是禁用内容" disabled />
```

## 组件样式

### 自适应高度与字数

设置 `autoHeight` 让高度随内容变化，通过 `minHeight` 和 `maxHeight` 限定范围；配合 `maxlength` 与 `showWordLimit` 显示字数。

```tsx
<Textarea
  autoHeight
  minHeight={100}
  maxHeight={240}
  maxlength={200}
  showWordLimit
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| error | 是否展示错误状态 | `boolean` | — |
| disabled | 是否禁用 | `boolean` | — |
| className | 根节点自定义类名 | `string` | — |
| style | 根节点样式 | `CSSProperties` | — |
| value | 当前值；传入后由调用方更新 | `string \| number` | — |
| defaultValue | 非受控模式的初始值 | `string \| number` | — |
| placeholder | 占位内容或输入提示 | `string` | — |
| maxlength | 最大输入长度，-1 表示不限制 | `number` | — |
| readonly | 是否只读 | `boolean` | — |
| clearable | 是否显示清空入口 | `boolean` | — |
| clearTrigger | 清空入口显示条件 | `'always' \| 'focus'` | — |
| focusWhenClear | 清空后是否自动聚焦 | `boolean` | — |
| compact | 紧凑布局 | `boolean` | — |
| alignRight | 是否右对齐 | `boolean` | — |
| prefixIcon | 前置图标名称 | `string` | — |
| prefix | 前置内容 | `ReactNode` | — |
| showWordLimit | 是否显示字数统计 | `boolean` | — |
| focus | 是否获取输入焦点 | `boolean` | — |
| confirmType | 键盘确认按钮类型 | `'done' \| 'go' \| 'next' \| 'search' \| 'send'` | — |
| confirmHold | 确认后是否保持键盘 | `boolean` | — |
| avoidKeyboard | 是否避让键盘 | `boolean` | — |
| cursorSpacing | 光标与键盘之间的距离 | `number` | — |
| softInputMode | 软键盘避让模式 | `'unspecified' \| 'nothing' \| 'pan' \| 'resize'` | — |
| holdKeyboard | 是否保持键盘显示 | `boolean` | — |
| selectionStart | 文本选择开始位置 | `number` | — |
| selectionEnd | 文本选择结束位置 | `number` | — |
| placeholderColor | 占位文字颜色 | `string` | — |
| inputFilter | 原生输入过滤表达式 | `string` | — |
| showSoftInputOnFocus | 聚焦时是否打开系统键盘 | `boolean` | — |
| ignoreCompositionEvent | 是否在输入法合成结束后统一更新值 | `boolean` | — |
| inputClassName | 输入区域类名 | `string` | — |
| autoHeight | 是否随内容自动增高 | `boolean` | — |
| height | 高度 | `number` | — |
| minHeight | 最小高度 | `number` | — |
| maxHeight | 最大高度 | `number` | — |
| maxlines | 最大显示行数 | `number` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onTap | 点击时触发 | () => void |
| onChange | 值发生变化时触发 | (value: string) => void |
| onInput | 原生输入事件 | (event: TextFieldEvent) => void |
| onFocus | 获得焦点时触发 | (event: TextFieldEvent) => void |
| onBlur | 失去焦点时触发 | (event: TextFieldEvent) => void |
| onConfirm | 确认选择时触发 | (event: TextFieldEvent) => void |
| onClear | 清空内容时触发 | () => void |
| onClickPrefixIcon | 对应操作发生时触发 | () => void |
| onClickSuffixIcon | 对应操作发生时触发 | () => void |
| onKeyboardHeightChange | 对应操作发生时触发 | (event: { height: number }) => void |
| onLineChange | 对应操作发生时触发 | (event: { lineCount: number }) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| prefix | 前置内容 | ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| focus | 获得焦点 | () => void |
| blur | 失去焦点 | () => void |
| setSelectionRange | 调用实例方法 | (start: number, end: number) => void |

## 数据类型

```tsx
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

## 源代码

[Textarea 组件源码](./sources/textarea/Textarea.tsx.txt) · [示例源码](./sources/textarea/demo.tsx.txt) · [文档源码](./sources/textarea/docs.md.txt)
