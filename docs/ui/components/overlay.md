# Overlay 遮罩层

遮罩层用于突出前景内容并阻隔背景交互，支持显示控制、过渡和自定义层级。

```tsx
import { Overlay } from '@daisu-ui/ui';
```

## 基础用法

### 点击关闭遮罩

通过 `show` 控制遮罩显示，在 `onTap` 中更新显示状态即可关闭。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from '@daisu-ui/ui';

const [show, setShow] = useState(false);

<Button
  label="显示遮罩"
  onTap={() => {
    'background only';
    setShow(true);
  }}
/>
<Overlay
  show={show}
  onTap={() => {
    'background only';
    setShow(false);
  }}
/>
```

## 内容形态

### 自定义内容

将需要展示的前景内容放在遮罩子节点中。

```tsx
<Overlay show={false}>
  <view style={{ marginTop: '120px', padding: '20px' }}>
    <text>前景内容</text>
  </view>
</Overlay>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| show | 受控显示，onTap 不自行改变 show | `boolean` | `false` |
| duration | 毫秒、{enter,leave} 或 boolean（false 为0） | `TransitionProps['duration']` | `300` |
| lockScroll | 原生 consume-slide-event 拦截全方向滑动，catchtouchmove 阻止事件冒泡 | `boolean` | `true` |
| zIndex | 层级 | `number` | `10` |
| rootPortal | 使用原生 createPortal，须在应用根提供 RootPortalHost | `boolean` | `false` |
| children | 自定义类、CSSProperties、嵌入内容 | `ReactNode` | — |
| className | 自定义类、CSSProperties、嵌入内容 | `string` | `''` |
| style | 自定义类、CSSProperties、嵌入内容 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onBeforeEnter | 进入生命周期 | () => void |
| onEnter | 进入生命周期 | () => void |
| onAfterEnter | 进入生命周期 | () => void |
| onBeforeLeave | 离开生命周期 | () => void |
| onLeave | 离开生命周期 | () => void |
| onAfterLeave | 离开生命周期 | () => void |
| onTap | 点击遮罩；内容用 catchtap 阻止冒泡 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 自定义类、CSSProperties、嵌入内容 | ReactNode |

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[Overlay 组件源码](./sources/overlay/Overlay.tsx.txt) · [示例源码](./sources/overlay/demo.tsx.txt) · [文档源码](./sources/overlay/docs.md.txt)
