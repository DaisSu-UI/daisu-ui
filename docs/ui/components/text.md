# Text 文本

文本用于展示普通文字、语义状态、格式化金额和脱敏信息，支持多行截断与前后内容。

```tsx
import { Text } from 'daisu-ui';
```

## 组件类型

### 普通文本与语义颜色

通过 `text` 设置文字，使用 `type` 区分普通、成功和错误等语义状态。

```tsx
<Text text="这是一段正文" />
<Text text="操作成功" type="success" />
<Text text="请检查输入" type="error" />
```

## 内容形态

### 格式化与脱敏

设置 `mode` 选择格式化方式，配合 `format` 对手机号等信息脱敏。

```tsx
<Text text="18888888888" mode="phone" format />
<Text text="12345.67" mode="price" prefix="￥" />
```

## 组件样式

### 字号与行数

通过 `size` 和 `lineHeight` 设置字号与行高，`lines` 限制显示行数，`bold` 设置粗体。

```tsx
<Text
  text="长文本会根据设置的行数截断展示。"
  size={16}
  lineHeight={24}
  lines={2}
  bold
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| text | 文本内容 | `string \| number` | 必填 |
| type | 语义主题 | `'primary' \| 'error' \| 'warning' \| 'success' \| 'default'` | `'default'` |
| mode | date 为毫秒时间戳、本地时区 YYYY-MM-DD；price 为千分位、两位小数 | `TextMode` | `'text'` |
| format | phone 保留前三后四位；name 保留首尾字，中间 ** | `boolean` | `false` |
| color | 自定义文字样式 | `string` | — |
| size | 自定义文字样式 | `string \| number` | — |
| bold | 粗体、1–5 行截断；使用 Lynx text-maxline | `boolean` | `false` |
| lines | 粗体、1–5 行截断；使用 Lynx text-maxline | `number` | — |
| lineHeight | 自定义文字样式 | `string \| number` | — |
| decoration | 文字装饰 | `'none' \| 'underline' \| 'line-through'` | — |
| prefix | 前后内容，节点须适用于 Lynx 内联 text | `ReactNode` | — |
| suffix | 前后内容，节点须适用于 Lynx 内联 text | `ReactNode` | — |
| className | 点击回调或自定义样式类名 | `string` | `''` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onTap | 点击回调或自定义样式类名 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| prefix | 前后内容，节点须适用于 Lynx 内联 text | ReactNode |
| suffix | 前后内容，节点须适用于 Lynx 内联 text | ReactNode |

## 数据类型

```tsx
export type TextMode = 'text' | 'date' | 'phone' | 'name' | 'price';
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
| `--cso-ui-danger` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-success` | 共享主题 |
| `--cso-ui-text-auxiliary` | 当前组件 |
| `--cso-ui-text-muted` | 当前组件 |
| `--cso-ui-warning` | 共享主题 |

## 源代码

[Text 组件源码](./sources/text/Text.tsx.txt) · [示例源码](./sources/text/demo.tsx.txt) · [文档源码](./sources/text/docs.md.txt)
