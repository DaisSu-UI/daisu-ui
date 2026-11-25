# Backtop 回到顶部

回到顶部按钮根据滚动距离显示，点击后将滚动请求交给页面处理。

```tsx
import { Backtop } from 'daisu-ui';
```

## 基础用法

### 与滚动容器组合

将滚动距离传入 `scrollTop`，通过 `onBacktop` 处理回到顶部的滚动请求。

```tsx
import { useState } from '@lynx-js/react';

const [scrollTop, setScrollTop] = useState(0);

const [target, setTarget] = useState(0);

<scroll-view
  scroll-y
  style={{ height: '400px' }}
  scroll-top={target}
  bindscroll={(event) => {
    'background only';
    setScrollTop(event.detail.scrollTop);
  }}
>
  <view style={{ height: '1200px' }}>
    <text>滚动内容</text>
  </view>
</scroll-view>
<Backtop
  scrollTop={scrollTop}
  onBacktop={() => {
    'background only';
    setTarget(target === 0 ? 0.01 : 0);
  }}
/>
```

## 组件样式

### 方形与文案

设置 `shape="square"` 使用方形按钮，通过 `text` 设置文字。

```tsx
<Backtop
  scrollTop={500}
  shape="square"
  text="顶部"
  onBacktop={(request) => {
    'background only';
    console.log(request);
  }}
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| scrollTop | 外部 scroll-view/List 的滚动距离 | `number` | 必填 |
| top | 严格大于此距离显示 | `number` | `300` |
| duration | 传给滚动控制器的毫秒数，负值取0、无效数回退100 | `number` | `100` |
| zIndex | 定位层级 | `number` | `10` |
| bottom | 距视口底部、右侧的px距离 | `number` | `100` |
| right | 距视口底部、右侧的px距离 | `number` | `20` |
| shape | 48×48按钮，圆形或4px圆角方形 | `'circle' \| 'square'` | `'circle'` |
| text | 默认图标下的10px文字 | `string` | — |
| iconStyle | 图标容器样式；color会传给原版SVG图标 | `CSSProperties` | — |
| children | 完全替换默认图标与文字 | `ReactNode` | — |
| className | 按钮样式 | `string` | `''` |
| style | 按钮样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onBacktop | 请求所属滚动容器回到顶部；接收目标时长 | (request: BacktopRequest) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 完全替换默认图标与文字 | ReactNode |

## 数据类型

```tsx
export type BacktopRequest = { duration: number };
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
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |

## 源代码

[Backtop 组件源码](./sources/backtop/Backtop.tsx.txt) · [示例源码](./sources/backtop/demo.tsx.txt) · [文档源码](./sources/backtop/docs.md.txt)
