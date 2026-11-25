# Input 输入框

输入框用于录入单行文本，支持受控值、清空、密码、字数统计和前后插槽。

```tsx
import { Input } from '@daisu-ui/ui';
```

## 组件类型

### 基本使用

通过 `placeholder` 设置占位文字。

```tsx
<Input placeholder="请输入歪比巴卜" />
```

### 数字类型

设置 `type="number"` 使用数字输入类型。

```tsx
<Input type="number" placeholder="请输入数字" />
```

## 组件状态

### 禁用状态

设置 `disabled` 禁用输入框，禁用时不能编辑或清空内容。

```tsx
<Input defaultValue="这是禁用状态" disabled />
```

### 只读状态

设置 `readonly` 使内容只读。

```tsx
<Input defaultValue="这是只读状态" readonly />
```

### 错误状态

设置 `error` 展示错误状态，内容使用错误颜色。

```tsx
<Input defaultValue="123456" error />
```

## 组件变体

### 清空按钮

设置 `clearable`，输入框有内容时显示清空按钮。

```tsx
<Input defaultValue="支持清空" clearable />
```

### 有值且聚焦时展示清空按钮

设置 `clearTrigger="focus"`，仅在有值并且聚焦时显示清空按钮。

```tsx
<Input clearable clearTrigger="focus" />
```

### 点击清除按钮时不自动聚焦

设置 `focusWhenClear={false}`，点击清空按钮后不自动聚焦。

```tsx
<Input clearable focusWhenClear={false} />
```

### 密码框

设置 `showPassword` 显示密码切换按钮，可组合 `clearable` 使用。

```tsx
<Input defaultValue="password" showPassword clearable />
```

## 内容形态

### 设置前后 Icon

通过 `prefixIcon` 和 `suffixIcon` 设置前后图标，点击分别触发 `onClickPrefixIcon` 和 `onClickSuffixIcon`。

```tsx
<Input prefixIcon="sound" suffixIcon="send" />
```

### 后缀插槽

通过 `suffix` 自定义后缀内容，例如放置验证码按钮。

```tsx
import { Button } from '@daisu-ui/ui';

<Input
  placeholder="请输入验证码"
  suffix={<Button label="获取验证码" size="small" />}
/>
```

## 组件样式

### 字数限制

设置 `maxlength` 限制输入长度，配合 `showWordLimit` 显示字数统计。

```tsx
<Input defaultValue="1234" maxlength={20} showWordLimit />
```

### 紧凑布局

设置 `compact` 使用紧凑布局，可与单位文字等内容组合。

```tsx
<view
  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
>
  <Input compact placeholder="请输入价格" style={{ width: '155px' }} />
  <text>元</text>
</view>
```

## 特殊用法

### 结合表单使用

在 `Cell` 中组合输入框，使用 `center` 垂直居中、`required` 展示必填标记，输入框设置 `compact`。

```tsx
import { CellGroup, Cell } from '@daisu-ui/ui';

<CellGroup border>
  <Cell center title="基本用法" titleWidth="98px">
    <Input compact placeholder="请输入" />
  </Cell>
  <Cell center title="必填" titleWidth="98px" required>
    <Input compact placeholder="请输入" />
  </Cell>
  <Cell center title="自定义插槽" titleWidth="98px">
    <Input compact suffix={<Button label="获取验证码" size="small" />} />
  </Cell>
</CellGroup>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值；传入后由调用方更新 | `string \| number` | — |
| defaultValue | 非受控模式的初始值 | `string \| number` | — |
| placeholder | 占位内容或输入提示 | `string` | — |
| maxlength | 最大输入长度，-1 表示不限制 | `number` | — |
| disabled | 是否禁用 | `boolean` | — |
| readonly | 是否只读 | `boolean` | — |
| clearable | 是否显示清空入口 | `boolean` | — |
| clearTrigger | 清空入口显示条件 | `'always' \| 'focus'` | — |
| focusWhenClear | 清空后是否自动聚焦 | `boolean` | — |
| error | 是否展示错误状态 | `boolean` | — |
| compact | 紧凑布局 | `boolean` | — |
| alignRight | 是否右对齐 | `boolean` | — |
| prefixIcon | 前置图标名称 | `string` | — |
| suffixIcon | 后置图标名称 | `string` | — |
| prefix | 前置内容 | `ReactNode` | — |
| suffix | 后置内容 | `ReactNode` | — |
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
| className | 根节点自定义类名 | `string` | — |
| inputClassName | 输入区域类名 | `string` | — |
| style | 根节点样式 | `CSSProperties` | — |
| type | 类型 | `'text' \| 'number' \| 'digit' \| 'password' \| 'tel' \| 'email'` | — |
| showPassword | 是否显示密码切换入口 | `boolean` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (value: string) => void |
| onInput | 原生输入事件 | (event: TextFieldEvent) => void |
| onFocus | 获得焦点时触发 | (event: TextFieldEvent) => void |
| onBlur | 失去焦点时触发 | (event: TextFieldEvent) => void |
| onConfirm | 确认选择时触发 | (event: TextFieldEvent) => void |
| onClear | 清空内容时触发 | () => void |
| onClickPrefixIcon | 对应操作发生时触发 | () => void |
| onClickSuffixIcon | 对应操作发生时触发 | () => void |
| onTap | 点击时触发 | () => void |
| onKeyboardHeightChange | 对应操作发生时触发 | (event: { height: number }) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| prefix | 前置内容 | ReactNode |
| suffix | 后置内容 | ReactNode |

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

[Input 组件源码](./sources/input/Input.tsx.txt) · [示例源码](./sources/input/demo.tsx.txt) · [文档源码](./sources/input/docs.md.txt)
