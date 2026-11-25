# Transition 动画

动画组件通过 show 控制内容的进入与离开，支持淡入、缩放、滑动和自定义过渡类名。

```tsx
import { Transition } from 'daisu-ui';
```

## 组件类型

### 淡入淡出

通过 `show` 控制显示状态，设置 `name="fade"` 使用淡入淡出。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from 'daisu-ui';

const [show, setShow] = useState(true);

<Button
  label="切换"
  onTap={() => {
    'background only';
    setShow(!show);
  }}
/>
<Transition show={show} name="fade">
  <text>动画内容</text>
</Transition>
```

## 组件变体

### 组合动画

`name` 支持动画名称数组，可组合淡入与缩放；通过 `duration` 设置时长。

```tsx
<Transition show name={['fade', 'zoom-in']} duration={300}>
  <text>淡入并缩放</text>
</Transition>
```

## 生命周期

### 动画结束回调

通过 `onAfterEnter` 处理进入动画结束后的操作。

```tsx
<Transition
  show
  name="slide-up"
  onAfterEnter={() => {
    'background only';
    console.log('进入完成');
  }}
>
  <text>内容</text>
</Transition>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示 | `boolean` | 必填 |
| name | 名称或标识 | `TransitionName \| readonly TransitionName[]` | `'fade'` |
| duration | 动画或显示时长，单位 ms | `number \| boolean \| { enter: number; leave: number }` | `300` |
| lazyRender | 首次展示时再挂载内容 | `boolean` | `false` |
| destroy | 离开后是否卸载内容 | `boolean` | `true` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |
| interactiveDuringLeave | Keep a modal's hit target until its leave animation has finished. | `boolean` | `false` |
| enterClassName | 进入起始状态类名 | `string` | `''` |
| enterActiveClassName | 进入过程类名 | `string` | `''` |
| enterToClassName | 进入结束状态类名 | `string` | `''` |
| leaveClassName | 离开起始状态类名 | `string` | `''` |
| leaveActiveClassName | 离开过程类名 | `string` | `''` |
| leaveToClassName | 离开结束状态类名 | `string` | `''` |
| children | 自定义内容 | `ReactNode` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onBeforeEnter | 进入动画开始前触发 | () => void |
| onEnter | 进入动画开始时触发 | () => void |
| onAfterEnter | 进入动画完成时触发 | () => void |
| onBeforeLeave | 离开动画开始前触发 | () => void |
| onLeave | 离开动画开始时触发 | () => void |
| onAfterLeave | 离开动画完成时触发 | () => void |
| onTap | 点击时触发 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 自定义内容 | ReactNode |

## 数据类型

```tsx
export type TransitionName =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out';
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from 'daisu-ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[Transition 组件源码](./sources/transition/Transition.tsx.txt) · [示例源码](./sources/transition/demo.tsx.txt) · [文档源码](./sources/transition/docs.md.txt)
