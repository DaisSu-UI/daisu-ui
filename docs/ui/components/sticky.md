# Sticky 粘性布局

吸顶组件在滚动时将内容固定在容器顶部，适合分类标题、筛选栏和操作区。

```tsx
import { Sticky, StickyBox } from '@daisu-ui/ui';
```

## 基础用法

### 吸顶内容

使用 `StickyBox` 包裹内容区域，`Sticky` 中放置需要吸顶的内容。

```tsx
<StickyBox>
  <Sticky>
    <view style={{ height: '48px' }}>
      <text>吸顶标题</text>
    </view>
  </Sticky>
  <view style={{ height: '800px' }}>
    <text>滚动内容</text>
  </view>
</StickyBox>
```

## 组件样式

### 顶部偏移

通过 `offsetTop` 设置吸顶时与顶部的距离，为导航栏等内容保留空间。

```tsx
<Sticky offsetTop={44}>
  <text>为导航栏预留位置</text>
</Sticky>
```

## Attributes 属性

### Sticky

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| offsetTop | 顶部偏移距离 | `number` | `0` |
| zIndex | 浮层层级 | `number` | `1` |
| children | 自定义内容 | `ReactNode` | — |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

### StickyBox

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| children | 自定义内容 | `ReactNode` | — |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| Sticky.children | 自定义内容 | ReactNode |
| StickyBox.children | 自定义内容 | ReactNode |

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[Sticky 组件源码](./sources/sticky/Sticky.tsx.txt) · [StickyBox 组件源码](./sources/sticky/Sticky.tsx.txt) · [示例源码](./sources/sticky/demo.tsx.txt) · [文档源码](./sources/sticky/docs.md.txt)
