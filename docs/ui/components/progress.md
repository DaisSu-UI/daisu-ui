# Progress 进度条

进度条用于展示任务完成情况，支持文字位置、状态颜色和自定义进度样式。

```tsx
import { Progress } from '@daisu-ui/ui';
```

## 基础用法

### 显示进度

通过 `percentage` 设置完成百分比。

```tsx
<Progress percentage={60} />
```

## 组件样式

### 自定义颜色

通过 `color` 设置进度条颜色。

```tsx
<Progress percentage={80} color="#12b886" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| percentage | 百分比；有限值裁剪至 0–100，NaN/Infinity 按 0 处理 | `number` | `0` |
| hideText | 隐藏百分比；指定 status 时显示状态图标 | `boolean` | `false` |
| color | 字符串、只读字符串数组或 `{ color, percentage }[]`，覆盖状态的进度条颜色 | `ProgressColor` | — |
| status | success / danger / warning，使用公共 Icon 和语义颜色 | `'success' \| 'danger' \| 'warning'` | — |
| duration | 每变化 1% 的毫秒数；0 立即更新，非法值回退 30 | `number` | `30` |
| percentPosition | `{ type?: 'inner' \| 'outer', align?: 'left' \| 'center' \| 'right' }`；align 用于内部文本 | `PercentPosition` | — |
| className | 根节点样式；可用 style.height 调整组件高度，内部模式轨道占满高度 | `string` | `''` |
| style | 根节点样式；可用 style.height 调整组件高度，内部模式轨道占满高度 | `CSSProperties` | — |

## 数据类型

```tsx
export type ProgressColor =
  | string
  | readonly string[]
  | readonly ProgressColorStop[];

export type PercentPosition = {
  type?: 'inner' | 'outer';
  align?: 'left' | 'center' | 'right';
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
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-primary-soft-pressed` | 共享主题 |
| `--cso-ui-surface-muted` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Progress 组件源码](./sources/progress/Progress.tsx.txt) · [示例源码](./sources/progress/demo.tsx.txt) · [文档源码](./sources/progress/docs.md.txt)
