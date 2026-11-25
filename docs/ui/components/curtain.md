# Curtain 幕帘

幕帘用于展示活动图片或重要公告，支持关闭按钮、自定义位置和背景遮罩。

```tsx
import { Curtain } from 'daisu-ui';
```

## 基础用法

### 展示活动

通过 `value` 和 `onChange` 控制幕帘显示，通过 `src` 指定活动图片。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from 'daisu-ui';

const [show, setShow] = useState(false);

<Button
  label="打开活动"
  onTap={() => {
    'background only';
    setShow(true);
  }}
/>
<Curtain
  value={show}
  onChange={setShow}
  src="https://example.com/banner.jpg"
/>
```

## 组件样式

### 关闭按钮位置

通过 `closePosition` 设置关闭按钮位置，例如 `top-right` 表示右上方。

```tsx
<Curtain
  value={false}
  src="https://example.com/banner.jpg"
  closePosition="top-right"
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值；传入后由调用方更新 | `boolean` | 必填 |
| src | 图片或媒体地址 | `string` | 必填 |
| width | 宽度 | `number` | — |
| to | 跳转目标地址 | `string` | — |
| closePosition | 关闭按钮位置 | `CurtainClosePosition` | — |
| closeOnClickModal | 点击遮罩是否关闭 | `boolean` | — |
| closeOnClick | 点击内容是否关闭 | `boolean` | — |
| zIndex | 浮层层级 | `number` | — |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | — |
| customCloseClass | 关闭按钮类名 | `string` | — |
| customCloseStyle | 关闭按钮样式 | `CSSProperties` | — |
| className | 根节点自定义类名 | `string` | — |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onBeforeEnter | 进入动画开始前触发 | () => void |
| onEnter | 进入动画开始时触发 | () => void |
| onAfterEnter | 进入动画完成时触发 | () => void |
| onBeforeLeave | 离开动画开始前触发 | () => void |
| onLeave | 离开动画开始时触发 | () => void |
| onAfterLeave | 离开动画完成时触发 | () => void |
| onChange | 值发生变化时触发 | (value:boolean)=>void |
| onNavigate | 对应操作发生时触发 | (url:string)=>void |
| onClick | 点击时触发 | ()=>void |
| onClose | 关闭时触发 | (reason:'close'\|'modal'\|'image')=>void |
| onClickModal | 点击遮罩时触发 | ()=>void |
| onClosed | 对应操作发生时触发 | ()=>void |
| onLoad | 对应操作发生时触发 | (event:BaseEvent<'load',ImageLoadEvent>)=>void |
| onError | 发生错误时触发 | (event:BaseEvent<'error',ImageErrorEvent>)=>void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| renderClose | 自定义区域内容 | (close:()=>void)=>ReactNode |

## 数据类型

```tsx
export type CurtainClosePosition =
  | 'inset'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
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
| `--cso-ui-curtain-radius` | 当前组件 |

## 源代码

[Curtain 组件源码](./sources/curtain/Curtain.tsx.txt) · [示例源码](./sources/curtain/demo.tsx.txt) · [文档源码](./sources/curtain/docs.md.txt)
