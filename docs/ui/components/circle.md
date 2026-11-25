# Circle 环形进度条

环形进度条用于展示完成比例，支持颜色、线宽、动画和自定义中间内容。

```tsx
import { Circle } from '@daisu-ui/ui';
```

## 基础用法

### 显示进度

通过 `value` 设置当前完成比例。

```tsx
<Circle value={60} />
```

## 组件样式

### 自定义颜色与内容

通过 `color` 设置进度颜色，子节点用于自定义环形中央的内容。

```tsx
<Circle value={75} color="#12b886">
  <text>75%</text>
</Circle>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 目标百分比；裁剪至 0–100，NaN/Infinity 按 0 处理 | `number` | `0` |
| size | 圆环直径，px，有限非负数 | `number` | `120` |
| color | 颜色或只读渐变对象；键支持 `0` / `100` / `0%` / `100%`，按数值排序 | `CircleColor` | `'#1c64fd'` |
| layerColor | 轨道颜色 | `string` | `'#f2f3f5'` |
| fill | 圆环内部填充，默认透明 | `string` | — |
| speed | 每秒变化的百分比；≤0 或 >1000 时立即绘制，非法值回退 50 | `number` | `50` |
| text | 中心文字，非空时优先于 children | `string` | — |
| strokeWidth | 描边规则：前景实际描边为此值的一半；无 fill 时轨道同宽，有 fill 时轨道为完整此值 | `number` | `18` |
| strokeLinecap | round / butt / square | `'round' \| 'butt' \| 'square'` | `'round'` |
| clockwise | 是否顺时针从十二点方向展开 | `boolean` | `true` |
| children | 中心内容插槽，不传 text 时展示 | `ReactNode` | — |
| className | 根节点类名和样式；尺寸用 size 同步绘图几何 | `string` | `''` |
| style | 根节点类名和样式；尺寸用 size 同步绘图几何 | `CSSProperties` | — |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 中心内容插槽，不传 text 时展示 | ReactNode |

## 数据类型

```tsx
export type CircleColor = string | Readonly<Record<string, string>>;
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
| `--cso-ui-text` | 共享主题 |

## 源代码

[Circle 组件源码](./sources/circle/Circle.tsx.txt) · [示例源码](./sources/circle/demo.tsx.txt) · [文档源码](./sources/circle/docs.md.txt)
