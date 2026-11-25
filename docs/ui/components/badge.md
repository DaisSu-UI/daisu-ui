# Badge 徽标

徽标用于标记数量、未读或状态，可附着在图标和其他内容旁边。

```tsx
import { Badge } from '@daisu-ui/ui';
```

## 组件类型

### 数字与圆点

通过 `value` 设置数字，设置 `isDot` 仅显示圆点；子节点为徽标依附的内容。

```tsx
import { Icon } from '@daisu-ui/ui';

<Badge value={5}>
  <Icon name="notification" size={24} />
</Badge>
<Badge isDot>
  <Icon name="message" size={24} />
</Badge>
```

## 组件样式

### 封顶与状态颜色

通过 `max` 设置显示上限，通过 `type` 设置语义颜色。

```tsx
<Badge value={120} max={99} type="danger">
  <text>消息</text>
</Badge>
```

## 组件状态

### 显示零值

设置 `showZero`，数值为 0 时仍显示徽标。

```tsx
<Badge value={0} showZero>
  <text>待办</text>
</Badge>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 数量或自定义文本；未传、空字符串及非有限数不显示数字标记 | `string \| number` | — |
| max | 仅截断数值value，超过显示max+；字符串不截断 | `number` | — |
| top | 相对默认锚点偏移；正top向下、正right向左，数值/纯数字字符串为px，rpx转换vw | `string \| number` | — |
| right | 相对默认锚点偏移；正top向下、正right向左，数值/纯数字字符串为px，rpx转换vw | `string \| number` | — |
| isDot | 6px点状标记，优先于value与showZero | `boolean` | `false` |
| hidden | 隐藏标记，保留包裹内容，优先于isDot | `boolean` | `false` |
| type | info使用浅底深字，其余使用主题颜色与白字 | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'danger'` |
| bgColor | 覆盖标记背景 | `string` | — |
| showZero | 显示数值0或字符串0 | `boolean` | `false` |
| shape | 胶囊、4px圆角、左下角无圆角的气泡 | `'circle' \| 'square' \| 'bubble'` | `'circle'` |
| border | 1px表面色描边，使用shadow避免改变徽标几何 | `boolean` | `false` |
| children | 包裹内容；有内容时定位其右上角，无内容时标记参与正常布局 | `ReactNode` | — |
| className | 外部包裹节点样式，不影响children的点击 | `string` | `''` |
| style | 外部包裹节点样式，不影响children的点击 | `CSSProperties` | — |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 包裹内容；有内容时定位其右上角，无内容时标记参与正常布局 | ReactNode |

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
| `--cso-ui-danger` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-success` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-surface-muted` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |
| `--cso-ui-warning` | 共享主题 |

## 源代码

[Badge 组件源码](./sources/badge/Badge.tsx.txt) · [示例源码](./sources/badge/demo.tsx.txt) · [文档源码](./sources/badge/docs.md.txt)
