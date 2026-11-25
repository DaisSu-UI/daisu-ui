# Search 搜索框

搜索框用于输入关键字并触发搜索，支持清空、取消、聚焦和自定义操作区域。

```tsx
import { Search } from 'daisu-ui';
```

## 组件类型

### 受控搜索

通过 `value` 和 `onChange` 管理关键词，事件中的 `value` 为当前输入内容。

```tsx
import { useState } from '@lynx-js/react';

const [value, setValue] = useState('');

<Search
  value={value}
  onChange={(event) => {
    'background only';
    setValue(event.value);
  }}
  placeholder="请输入关键词"
/>
```

## 组件状态

### 禁用搜索

设置 `disabled` 禁止编辑搜索内容。

```tsx
<Search value="搜索内容" disabled />
```

## 内容形态

### 输入提示

通过 `placeholder` 设置搜索框的占位提示。

```tsx
<Search placeholder="搜索商品、品牌" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值；传入后由调用方更新 | `string` | — |
| defaultValue | 非受控模式的初始值 | `string` | `''` |
| type | 类型 | `InputProps['type']` | `'text'` |
| placeholder | 占位内容或输入提示 | `string` | `'搜索'` |
| cancelTxt | 取消文案 | `string` | `'取消'` |
| variant | 外观变体 | `'plain' \| 'filled' \| 'light'` | `'plain'` |
| hideCancel | 是否隐藏取消按钮 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| maxlength | 最大输入长度，-1 表示不限制 | `number \| string` | `-1` |
| placeholderLeft | 占位区左侧内容 | `boolean` | `false` |
| focus | 是否获取输入焦点 | `boolean` | — |
| focusWhenClear | 清空后是否自动聚焦 | `boolean` | `false` |
| placeholderColor | 占位文字颜色 | `string` | — |
| prefix | 前置内容 | `ReactNode` | — |
| inputSuffix | inputSuffix 配置 | `ReactNode` | — |
| suffix | 后置内容 | `ReactNode` | — |
| inputClassName | 输入区域类名 | `string` | `''` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (event: { value: string }) => void |
| onSearch | 对应操作发生时触发 | (event: { value: string }) => void |
| onCancel | 取消操作时触发 | (event: { value: string }) => void |
| onClear | 清空内容时触发 | () => void |
| onFocus | 获得焦点时触发 | (event: TextFieldEvent) => void |
| onBlur | 失去焦点时触发 | (event: TextFieldEvent) => void |
| onTap | 点击时触发 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| prefix | 前置内容 | ReactNode |
| inputSuffix | 自定义区域内容 | ReactNode |
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
import { ConfigProvider } from 'daisu-ui';

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
| `--cso-ui-light-display` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-surface-muted` | 共享主题 |
| `--cso-ui-text-placeholder` | 共享主题 |

## 源代码

[Search 组件源码](./sources/search/Search.tsx.txt) · [示例源码](./sources/search/demo.tsx.txt) · [文档源码](./sources/search/docs.md.txt)
