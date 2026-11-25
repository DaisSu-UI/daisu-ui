# Popover 气泡

气泡用于在触发元素附近展示辅助内容或菜单，支持方向、箭头和自定义内容。

```tsx
import { Popover } from '@daisu-ui/ui';
```

## 组件类型

### 文字气泡

通过 `content` 设置气泡文字，子节点作为触发元素。

```tsx
import { Button } from '@daisu-ui/ui';

<Popover content="这里是提示内容">
  <Button label="显示气泡" />
</Popover>
```

## 组件样式

### 指定方向

通过 `placement` 设置气泡相对触发元素的位置。

```tsx
<Popover content="显示在上方" placement="top">
  <Button label="上方气泡" />
</Popover>
```

## 内容形态

### 自定义内容

通过 `contentNode` 传入自定义内容节点。

```tsx
<Popover contentNode={<text>自定义气泡内容</text>}>
  <Button label="查看内容" />
</Popover>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| zIndex | 浮层层级 | `number` | — |
| offset | 相对目标元素的偏移 | `BubbleOffset` | — |
| disabled | 是否禁用 | `boolean` | — |
| className | 根节点自定义类名 | `string` | — |
| style | 根节点样式 | `CSSProperties` | — |
| show | 是否显示 | `boolean` | — |
| defaultShow | 非受控模式的初始显示状态 | `boolean` | — |
| placement | 浮层相对触发元素的位置 | `BubblePlacement` | — |
| visibleArrow | 是否显示气泡箭头 | `boolean` | — |
| showClose | 是否显示关闭按钮 | `boolean` | — |
| duration | 动画或显示时长，单位 ms | `number` | — |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | — |
| arrowClassName | 气泡箭头类名 | `string` | — |
| popClassName | 气泡面板类名 | `string` | — |
| popStyle | 气泡面板样式 | `CSSProperties` | — |
| children | 自定义内容 | `ReactNode` | — |
| contentNode | contentNode 配置 | `ReactNode` | — |
| content | 内容 | `string \| readonly PopoverMenuItem[]` | `''` |
| mode | 展示或格式化模式 | `'normal' \| 'menu'` | `'normal'` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (event: { show: boolean }) => void |
| onShowChange | 显示状态变化时触发 | (show: boolean) => void |
| onOpen | 打开时触发 | () => void |
| onClose | 关闭时触发 | () => void |
| onMenuClick | 对应操作发生时触发 | (event: { item: PopoverMenuItem; index: number }) => void |

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

export type PopoverMenuItem = {
  content: string;
  iconClass?: string;
  [key: string]: unknown;
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

### CSS 变量

以下变量可通过 ConfigProvider 的 themeVars 覆盖，未设置时使用当前主题与组件的默认样式。

| 变量 | 作用范围 |
| --- | --- |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |

## 源代码

[Popover 组件源码](./sources/popover/Popover.tsx.txt) · [示例源码](./sources/popover/demo.tsx.txt) · [文档源码](./sources/popover/docs.md.txt)
