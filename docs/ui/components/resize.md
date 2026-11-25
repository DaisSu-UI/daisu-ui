# Resize 监听元素尺寸变化

尺寸监听器在子内容布局变化时报告矩形信息，适合自适应布局和组件尺寸计算。

```tsx
import { Resize } from '@daisu-ui/ui';
```

## 组件类型

### 监听布局变化

通过 `onResize` 获取内容布局变化后的宽高信息。

```tsx
import { useState } from '@lynx-js/react';

const [width, setWidth] = useState(0);

<Resize
  onResize={(rect) => {
    'background only';
    setWidth(rect.width);
  }}
>
  <view style={{ width: '100%', height: '80px' }} />
</Resize>
<text>{width}px</text>
```

## 内容形态

### 包裹动态内容

将动态内容放入 `Resize`，内容尺寸变化后通过 `onResize` 获取新的矩形信息。

```tsx
import { Button } from '@daisu-ui/ui';

const [expanded, setExpanded] = useState(false);

<Button
  label="展开"
  onTap={() => {
    'background only';
    setExpanded(!expanded);
  }}
/>
<Resize
  onResize={(rect) => {
    'background only';
    console.log(rect);
  }}
>
  <text>{expanded ? '展开后显示更多内容' : '摘要'}</text>
</Resize>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| children | 被监听的内容 | `ReactNode` | — |
| className | 根节点类名 | `string` | `''` |
| containerClassName | 监听容器类名 | `string` | `''` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onResize | 首次布局和宽 / 高变化时回调 `ResizeRect` | (rect: ResizeRect) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 被监听的内容 | ReactNode |

## 数据类型

```tsx
export type ResizeRect = {
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
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

## 源代码

[Resize 组件源码](./sources/resize/Resize.tsx.txt) · [示例源码](./sources/resize/demo.tsx.txt) · [文档源码](./sources/resize/docs.md.txt)
