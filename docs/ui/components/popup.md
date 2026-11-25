# Popup 弹出层

弹出层用于展示临时操作或内容，支持多个弹出方向、遮罩、圆角和关闭按钮。

```tsx
import { Popup } from 'daisu-ui';
```

## 组件类型

### 基础弹层

通过 `show` 和 `onChange` 控制显示状态，设置 `closable` 显示关闭按钮。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from 'daisu-ui';

const [show, setShow] = useState(false);

<Button
  label="打开弹层"
  onTap={() => {
    'background only';
    setShow(true);
  }}
/>
<Popup show={show} onChange={setShow} closable>
  <text>弹层内容</text>
</Popup>
```

## 布局能力

### 底部弹出

设置 `position="bottom"` 从底部弹出，配合 `round` 和 `safeAreaInsetBottom` 使用圆角及底部安全区。

```tsx
<Popup show={false} position="bottom" round safeAreaInsetBottom>
  <text>底部内容</text>
</Popup>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| show | 受控值 / 请求更新；关闭时回调 false | `boolean` | `false` |
| position | center/top/right/bottom/left | `PopupPosition` | `'center'` |
| transition | 居中 fade+zoom-in，其余对应方向 slide；可传名称数组 | `TransitionName \| readonly TransitionName[]` | — |
| duration | 毫秒或boolean | `number \| boolean` | `300` |
| closable | 关闭按钮 | `boolean` | `false` |
| closeOnClickModal | 遮罩点击关闭 / 展示遮罩 | `boolean` | `true` |
| modal | 遮罩点击关闭 / 展示遮罩 | `boolean` | `true` |
| modalStyle | 遮罩 CSSProperties | `CSSProperties` | — |
| zIndex | 遮罩层级，面板使用 zIndex+1 | `number` | `10` |
| lazyRender | 第一次显示时挂载；后续保留并隐藏，保存表单状态 | `boolean` | `true` |
| lockScroll | 对触摸链拦截滑动，边界同 Overlay | `boolean` | `true` |
| rootPortal | 原生 RootPortal，需要根 Host | `boolean` | `false` |
| round | 按弹出方向设置圆角 | `boolean` | `false` |
| safeAreaInsetBottom | 底部插入宿主提供的安全区高度，单位px | `boolean` | `false` |
| safeAreaBottom | 底部插入宿主提供的安全区高度，单位px | `number` | `0` |
| className | 面板样式、内容；根 Host 外层局部主题需自行传入类名 | `string` | `''` |
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
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Popup 组件源码](./sources/popup/Popup.tsx.txt) · [示例源码](./sources/popup/demo.tsx.txt) · [文档源码](./sources/popup/docs.md.txt)
