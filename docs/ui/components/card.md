# Card 卡片

卡片用于聚合标题、正文与底部操作。标准卡片适合独立内容块，矩形卡片适合连续列表。

```tsx
import { Card } from 'daisu-ui';
```

## 组件类型

### 标准卡片

设置 `variant="standard"` 使用标准卡片，通过 `title` 设置标题。

```tsx
<Card variant="standard" title="生活记录">
  <text>今天也是值得记录的一天。</text>
</Card>
```

### 矩形卡片

设置 `type="rectangle"` 使用矩形卡片，适合连续排列的内容区域。

```tsx
<Card type="rectangle" title="项目动态">
  <text>项目已更新。</text>
</Card>
```

## 内容形态

### 自定义标题与操作

通过 `title` 自定义标题节点，通过 `footer` 设置底部操作，子节点作为正文内容。

```tsx
import { Button } from 'daisu-ui';

<Card
  variant="standard"
  title={<text>订单详情</text>}
  footer={<Button label="查看" size="small" />}
>
  <text>订单编号：20260001</text>
</Card>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| title | ReactNode；字符串/数字用原生text，standard单行省略；复杂标题使用 ReactNode | `ReactNode` | — |
| description | 兼容原业务说明，standard也可使用 | `string` | — |
| children | 卡片内容，原始字符串/数字自动包text；standard始终保留内容容器 | `ReactNode` | — |
| footer | 底部ReactNode；未提供/false不渲染，0有效 | `ReactNode` | — |
| variant | business保留既有样式；standard使用标准样式 | `'business' \| 'standard'` | — |
| type | rectangle：矩形、无横边距和阴影；未传variant时自动选standard | `'rectangle'` | — |
| customTitleClass | 三个区域的类名 | `string` | `''` |
| customContentClass | 三个区域的类名 | `string` | `''` |
| customFooterClass | 三个区域的类名 | `string` | `''` |
| className | 根节点样式 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| title | ReactNode；字符串/数字用原生text，standard单行省略；复杂标题使用 ReactNode | ReactNode |
| children | 卡片内容，原始字符串/数字自动包text；standard始终保留内容容器 | ReactNode |
| footer | 底部ReactNode；未提供/false不渲染，0有效 | ReactNode |

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
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Card 组件源码](./sources/card/Card.tsx.txt) · [示例源码](./sources/card/demo.tsx.txt) · [文档源码](./sources/card/docs.md.txt)
