# Divider 分割线

分割线用于分隔内容区域，支持水平、垂直、虚线以及带文字或图标的分隔形式。

```tsx
import { Divider } from '@daisu-ui/ui';
```

## 组件类型

### 基础分割线

默认展示水平分割线，设置 `dashed` 使用虚线，子节点用于展示分隔文字。

```tsx
<Divider />
<Divider dashed />
<Divider>内容分隔</Divider>
```

## 组件样式

### 颜色与位置

通过 `color` 设置颜色，通过 `contentPosition` 设置内容的位置。

```tsx
<Divider color="#1c64fd" contentPosition="left">
  左侧标题
</Divider>
```

## 布局能力

### 垂直分割线

设置 `vertical` 使用垂直分割线，适合横向排列的操作项。

```tsx
<view
  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
>
  <text>编辑</text>
  <Divider vertical />
  <text>删除</text>
</view>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| children | 中间内容，字符串/数值自动包入text；数值0保留 | `ReactNode` | — |
| label | 兼容旧接口；children优先于label，contentPosition优先于align | `string` | — |
| align | 兼容旧接口；children优先于label，contentPosition优先于align | `DividerAlign` | `'center'` |
| contentPosition | 左右短线限制为可用宽度10% | `DividerAlign` | — |
| color | 文字颜色，与官网行为一致；线条颜色使用--cso-ui-divider-line-color，ReactNode自行指定颜色 | `string` | — |
| hairline | 水平scaleY(.5)、竖线scaleX(.5)，保留布局尺寸 | `boolean` | `true` |
| dashed | 虚线 | `boolean` | `false` |
| vertical | 16px高的竖线；忽略children与label | `boolean` | `false` |
| className | 根节点样式 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 中间内容，字符串/数值自动包入text；数值0保留 | ReactNode |

## 数据类型

```tsx
export type DividerAlign = 'left' | 'center' | 'right';
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
| `--cso-ui-divider-line-color` | 当前组件 |
| `--cso-ui-divider-line-width` | 当前组件 |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-text-auxiliary` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Divider 组件源码](./sources/divider/Divider.tsx.txt) · [示例源码](./sources/divider/demo.tsx.txt) · [文档源码](./sources/divider/docs.md.txt)
