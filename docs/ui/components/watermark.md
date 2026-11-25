# Watermark 水印

水印用于在内容区域重复展示文字或图片标记，支持颜色、旋转和间距配置。

```tsx
import { Watermark } from '@daisu-ui/ui';
```

## 基础用法

### 文字水印

通过 `content` 设置水印文字，将水印层和页面内容放在同一容器中。

```tsx
<view style={{ height: '200px' }}>
  <text>内容区域</text>
  <Watermark content="Daisu UI" />
</view>
```

## 组件样式

### 自定义文字

通过 `size` 设置水印字号。

```tsx
<view style={{ height: '200px' }}>
  <Watermark content="内部资料" size={16} />
</view>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| content | 内容 | `string` | `''` |
| image | 自定义图片内容或地址 | `string` | `''` |
| imageWidth | 图片宽度 | `number` | `100` |
| imageHeight | 图片高度 | `number` | `100` |
| gutterX | 水平方向间隔 | `number` | `0` |
| gutterY | 垂直方向间隔 | `number` | `0` |
| width | 宽度 | `number` | `100` |
| height | 高度 | `number` | `100` |
| fullScreen | 是否全屏显示 | `boolean` | `true` |
| color | 内容颜色 | `string` | `'#c9cbd4'` |
| size | 尺寸 | `number` | `14` |
| fontStyle | 字体样式 | `'normal'\|'italic'\|'oblique'` | `'normal'` |
| fontWeight | 字重 | `CSSProperties['fontWeight']\|'bolder'\|number` | `'normal'` |
| fontFamily | 文字字体 | `string` | `'PingFang SC'` |
| rotate | 旋转角度 | `number` | `-25` |
| zIndex | 浮层层级 | `number` | `1100` |
| opacity | 透明度 | `number` | `.6` |
| layout | 排列方式 | `'grid'\|'staggered'` | `'grid'` |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | `false` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[Watermark 组件源码](./sources/watermark/Watermark.tsx.txt) · [示例源码](./sources/watermark/demo.tsx.txt) · [文档源码](./sources/watermark/docs.md.txt)
