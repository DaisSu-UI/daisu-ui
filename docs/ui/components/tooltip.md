# Tooltip 文字提示

文字提示用于解释图标或控件含义，在触发元素附近展示简短说明。

```tsx
import { Tooltip } from '@daisu-ui/ui';
```

## 基础用法

### 点击查看说明

通过 `content` 设置说明文字，子节点作为提示的触发元素。

```tsx
import { Button } from '@daisu-ui/ui';

<Tooltip content="这里是帮助信息">
  <Button label="帮助" />
</Tooltip>
```

## 组件样式

### 方向与关闭按钮

通过 `placement` 指定提示方向，设置 `showClose` 显示关闭按钮。

```tsx
<Tooltip content="点击关闭按钮隐藏" placement="top" showClose>
  <Button label="顶部提示" />
</Tooltip>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| zIndex | 浮层层级 | `number` | — |
| offset | 相对目标元素的偏移 | `BubbleOffset` | — |
| disabled | 是否禁用 | `boolean` | — |
| className | 根节点自定义类名 | `string` | — |
| children | 自定义内容 | `ReactNode` | — |
| show | 是否显示 | `boolean` | — |
| duration | 动画或显示时长，单位 ms | `number` | — |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | — |
| style | 根节点样式 | `CSSProperties` | — |
| placement | 浮层相对触发元素的位置 | `BubblePlacement` | — |
| defaultShow | 非受控模式的初始显示状态 | `boolean` | — |
| visibleArrow | 是否显示气泡箭头 | `boolean` | — |
| showClose | 是否显示关闭按钮 | `boolean` | — |
| arrowClassName | 气泡箭头类名 | `string` | — |
| popClassName | 气泡面板类名 | `string` | — |
| popStyle | 气泡面板样式 | `CSSProperties` | — |
| contentNode | contentNode 配置 | `ReactNode` | — |
| content | 内容 | `string` | `''` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onShowChange | 显示状态变化时触发 | (show: boolean) => void |
| onChange | 值发生变化时触发 | (event: { show: boolean }) => void |
| onClose | 关闭时触发 | () => void |
| onOpen | 打开时触发 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 自定义内容 | ReactNode |
| contentNode | 自定义区域内容 | ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| open | 打开面板 | () => void |
| close | 关闭面板 | () => void |
| updatePosition | 重新计算位置 | () => void |

## 数据类型

```tsx
export type BubbleOffset =
  | number
  | readonly number[]
  | { x: number; y: number };

export type BubblePlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';
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

[Tooltip 组件源码](./sources/tooltip/Tooltip.tsx.txt) · [示例源码](./sources/tooltip/demo.tsx.txt) · [文档源码](./sources/tooltip/docs.md.txt)
