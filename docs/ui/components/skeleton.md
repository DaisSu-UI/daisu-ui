# Skeleton 骨架屏

骨架屏用于在数据加载期间展示页面结构占位，支持预设内容和自定义行。

```tsx
import { Skeleton } from 'daisu-ui';
```

## 组件类型

### 基础占位

在数据加载期间展示 `Skeleton`，为即将出现的内容提供结构占位。

```tsx
<Skeleton />
```

## 组件样式

### 动画与主题

设置 `animation="gradient"` 使用渐变占位动画。

```tsx
<Skeleton animation="gradient" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| theme | avatar/image/text/paragraph；预设头像/图片64px，文字16px，段落四行 | `SkeletonTheme` | `'text'` |
| rowCol | readonly SkeletonRow[]，非空时替代theme；空数组使用预设 | `readonly SkeletonRow[]` | — |
| loading | true只渲染骨架；false只渲染children，无隐藏内容提前挂载 | `boolean` | `true` |
| animation | gradient：1.5秒扫光；flashed：2秒明暗变化 | `'' \| 'gradient' \| 'flashed'` | `''` |
| children | 加载结束内容，原始字符自动包原生text | `ReactNode` | — |
| className | 根节点样式 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 加载结束内容，原始字符自动包原生text | ReactNode |

## 数据类型

```tsx
export type SkeletonTheme = 'avatar' | 'image' | 'text' | 'paragraph';

export type SkeletonRow = number | SkeletonCell | readonly SkeletonCell[];
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
| `--cso-ui-skeleton-bg` | 当前组件 |
| `--cso-ui-skeleton-highlight` | 当前组件 |

## 源代码

[Skeleton 组件源码](./sources/skeleton/Skeleton.tsx.txt) · [示例源码](./sources/skeleton/demo.tsx.txt) · [文档源码](./sources/skeleton/docs.md.txt)
