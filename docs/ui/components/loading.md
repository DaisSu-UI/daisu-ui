# Loading 加载指示器

加载指示器用于告知用户正在处理任务，支持圆环、旋转线条、圆点和波浪样式。

```tsx
import { Loading } from '@daisu-ui/ui';
```

## 组件类型

### 加载动画

通过 `type` 设置动画，支持 `circular`、`spinner`、`dots` 和 `wave`。

```tsx
<Loading type="circular" />
<Loading type="spinner" />
<Loading type="dots" />
<Loading type="wave" />
```

## 组件样式

### 颜色与尺寸

通过 `color` 设置颜色，通过 `size` 设置尺寸。

```tsx
<Loading color="#12b886" size={32} />
```

## 内容形态

### 加载文案

通过 `text` 设置加载文案，设置 `direction="horizontal"` 使用横向排列。

```tsx
<Loading text="加载中" />
<Loading text="加载中" direction="horizontal" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| type | 渐变圆环、十二条旋转指示器、三圆点和四柱波形 | `LoadingType` | `'circular'` |
| color | 动画及默认文字色；圆环SVG使用字面颜色，不使用CSS变量或currentColor | `string` | `'#1c64fd'` |
| size | 非负数、数字字符串、px/rpx/rem/vw/vh；非法值回退28px，rpx按750设计宽换算vw | `LoadingSize` | `28` |
| text | 加载文字；children优先 | `string` | — |
| label | 旧文字别名，优先级children、text、label；使用label且未指定direction时保留水平排列、8px间距及原13px文字 | `string` | — |
| children | 文字或自定义内容；自定义内容自行使用text包裹文字 | `ReactNode` | — |
| direction | 指示器与文字方向，间隔6px | `'vertical' \| 'horizontal'` | — |
| className | 根样式；动画颜色通过color设置 | `string` | `''` |
| spinnerClassName | 动画容器样式类 | `string` | `''` |
| style | 根样式；动画颜色通过color设置 | `CSSProperties` | — |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 文字或自定义内容；自定义内容自行使用text包裹文字 | ReactNode |

## 数据类型

```tsx
export type LoadingType = 'circular' | 'spinner' | 'dots' | 'wave';

export type LoadingSize = 'small' | 'medium' | 'large' | (string & {}) | number;
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
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Loading 组件源码](./sources/loading/Loading.tsx.txt) · [示例源码](./sources/loading/demo.tsx.txt) · [文档源码](./sources/loading/docs.md.txt)
