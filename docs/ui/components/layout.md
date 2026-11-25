# Layout 布局

栅格布局将一行划分为 24 份，通过 Row 与 Col 组合控制宽度、间隔、偏移和对齐。

```tsx
import { Row, Col } from '@daisu-ui/ui';
```

## 布局能力

### 基础分栏

栅格将一行分为 24 份，通过 `Col.span` 设置每列占用的份数。

```tsx
<Row>
  <Col span={8}>
    <text>左侧</text>
  </Col>
  <Col span={16}>
    <text>右侧</text>
  </Col>
</Row>
```

### 间隔与偏移

通过 `Row.gutter` 设置列间距，通过 `Col.offset` 设置左侧偏移份数。

```tsx
<Row gutter={20}>
  <Col span={8}>
    <text>内容一</text>
  </Col>
  <Col span={8} offset={4}>
    <text>内容二</text>
  </Col>
</Row>
```

### 水平与垂直对齐

通过 `justify` 设置水平排列方式，通过 `align` 设置垂直对齐方式。

```tsx
<Row justify="space-between" align="middle">
  <Col span={6}>
    <text>左侧</text>
  </Col>
  <Col span={6}>
    <text>右侧</text>
  </Col>
</Row>
```

## Attributes 属性

### Row

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| gutter | 栅格列间隔，单位 px | `number` | `0` |
| justify | 水平方向排列方式 | `keyof typeof justifyValues` | `'start'` |
| align | 对齐方式 | `keyof typeof alignValues` | `'top'` |
| className | 根节点自定义类名 | `string` | `''` |
| children | 自定义内容 | `ReactNode` | — |

### Col

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| span | 占用的栅格份数 | `number` | `24` |
| offset | 相对目标元素的偏移 | `number` | `0` |
| className | 根节点自定义类名 | `string` | `''` |
| children | 自定义内容 | `ReactNode` | — |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| Row.children | 自定义内容 | ReactNode |
| Col.children | 自定义内容 | ReactNode |

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[Row 组件源码](./sources/layout/Layout.tsx.txt) · [Col 组件源码](./sources/layout/Layout.tsx.txt) · [示例源码](./sources/layout/demo.tsx.txt) · [文档源码](./sources/layout/docs.md.txt)
