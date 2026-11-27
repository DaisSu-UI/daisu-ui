# Popup 弹出层

弹出层用于展示临时操作或内容，支持多个弹出方向、遮罩、圆角、左侧标题和右上角圆形关闭按钮。

```tsx
import { Popup } from '@daisu-ui/ui';
```

## 组件类型

### 基础弹层

通过 `show` 和 `onChange` 控制显示状态；`title` 显示左对齐标题，`closable` 显示右上角 40px 圆形关闭按钮，标题会为按钮预留空间。同一 RootPortalHost 内按打开顺序分配弹层层级，zIndex 是最低层级；嵌套层自动高于父层，遮罩位于父面板与子面板之间。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from '@daisu-ui/ui';

const [show, setShow] = useState(false);

<Button
  label="打开弹层"
  onTap={() => {
    'background only';
    setShow(true);
  }}
/>
<Popup show={show} onChange={setShow} title="等级权益" closable>
  <text>弹层内容</text>
</Popup>
```

## 布局能力

### 底部弹出

设置 `position="bottom"` 从底部弹出，配合 `round` 和 `safeAreaInsetBottom` 使用圆角及底部安全区。

```tsx
<Popup
  show={false}
  title="等级权益"
  position="bottom"
  round
  closable
  safeAreaInsetBottom
>
  <text>底部内容</text>
</Popup>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| show | 受控值 / 请求更新；关闭时回调 false | `boolean` | — |
| position | center/top/right/bottom/left | `PopupPosition` | — |
| transition | 居中 fade+zoom-in，其余对应方向 slide；可传名称数组 | `TransitionName \| readonly TransitionName[]` | — |
| duration | 毫秒或boolean | `number \| boolean` | — |
| closable | 关闭按钮 | `boolean` | — |
| title | 左侧标题，支持文字或自定义节点；为关闭按钮预留空间 | `ReactNode` | — |
| closeOnClickModal | 遮罩点击关闭 / 展示遮罩 | `boolean` | — |
| modal | 遮罩点击关闭 / 展示遮罩 | `boolean` | — |
| modalStyle | 遮罩 CSSProperties | `CSSProperties` | — |
| zIndex | 遮罩层级，面板使用 zIndex+1 | `number` | — |
| lazyRender | 第一次显示时挂载；后续保留并隐藏，保存表单状态 | `boolean` | — |
| lockScroll | 对触摸链拦截滑动，边界同 Overlay | `boolean` | — |
| rootPortal | 原生 RootPortal，需要根 Host | `boolean` | — |
| round | 按弹出方向设置圆角 | `boolean` | — |
| safeAreaInsetBottom | 底部插入宿主提供的安全区高度，单位px | `boolean` | — |
| safeAreaBottom | 底部插入宿主提供的安全区高度，单位px | `number` | — |
| className | 面板样式、内容；根 Host 外层局部主题需自行传入类名 | `string` | — |
| style | 面板样式、内容；根 Host 外层局部主题需自行传入类名 | `CSSProperties` | — |
| children | 面板样式、内容；根 Host 外层局部主题需自行传入类名 | `ReactNode` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onBeforeEnter | 进入生命周期 | () => void |
| onEnter | 进入生命周期 | () => void |
| onAfterEnter | 进入生命周期 | () => void |
| onBeforeLeave | 离开生命周期 | () => void |
| onLeave | 离开生命周期 | () => void |
| onAfterLeave | 离开生命周期 | () => void |
| onChange | 受控值 / 请求更新；关闭时回调 false | (show: boolean) => void |
| onClose | 请求关闭，reason: modal/close | (reason: PopupCloseReason) => void |
| onClickModal | 遮罩点击，禁用自动关闭时仍触发 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| title | 左侧标题，支持文字或自定义节点；为关闭按钮预留空间 | ReactNode |
| children | 面板样式、内容；根 Host 外层局部主题需自行传入类名 | ReactNode |

## 数据类型

```tsx
export type PopupCloseReason = 'modal' | 'close';

export type PopupPosition = 'center' | 'top' | 'right' | 'bottom' | 'left';

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
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

### CSS 变量

以下变量可通过 ConfigProvider 的 themeVars 覆盖，未设置时使用当前主题与组件的默认样式。

| 变量 | 作用范围 |
| --- | --- |
| `--cso-ui-layer-close-bg` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |

## 源代码

[Popup 组件源码](./sources/popup/Popup.tsx.txt) · [示例源码](./sources/popup/demo.tsx.txt) · [文档源码](./sources/popup/docs.md.txt)
