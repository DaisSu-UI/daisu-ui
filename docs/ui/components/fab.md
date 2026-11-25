# Fab 悬浮按钮

悬浮按钮用于放置页面的主要操作。支持展开操作项、自定义触发器、位置和拖动。

```tsx
import { Fab } from '@daisu-ui/ui';
```

## 组件类型

### 基础用法

通过 `onTap` 响应悬浮按钮点击。

```tsx
<Fab
  onTap={() => {
    'background only';
    console.log('新建');
  }}
/>
```

## 交互用法

### 展开操作

设置 `expandable` 支持展开操作项，子节点作为展开后的内容。

```tsx
import { Button } from '@daisu-ui/ui';

<Fab expandable>
  <Button label="拍照" size="small" />
  <Button label="相册" size="small" />
</Fab>
```

## 组件状态

### 禁用与拖动

设置 `disabled` 禁用按钮，设置 `draggable` 允许拖动位置。

```tsx
<Fab disabled />
<Fab draggable />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| active | 当前步骤或激活状态 | `boolean` | — |
| defaultActive | 非受控模式的初始展开状态 | `boolean` | `false` |
| type | 类型 | `ButtonTone \| 'default' \| 'error'` | `'primary'` |
| position | 显示位置 | `FabPosition` | `'right-bottom'` |
| direction | 布局或展开方向 | `FabDirection` | `'top'` |
| disabled | 是否禁用 | `boolean` | `false` |
| draggable | 是否允许拖动 | `boolean` | `false` |
| expandable | 是否允许展开子操作 | `boolean` | `true` |
| inactiveIcon | 未激活状态图标 | `string` | `'add'` |
| activeIcon | 激活状态图标 | `string` | `'close'` |
| zIndex | 浮层层级 | `number` | `99` |
| gap | 相邻操作项间距 | `FabGap` | — |
| className | 根节点自定义类名 | `string` | `''` |
| children | 自定义内容 | `ReactNode` | — |
| trigger | trigger 配置 | `ReactNode \| ((state: { active: boolean; disabled: boolean }) => ReactNode)` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onActiveChange | 对应操作发生时触发 | (active: boolean) => void |
| onTap | 点击时触发 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 自定义内容 | ReactNode |
| trigger | 自定义区域内容 | ReactNode \| ((state: { active: boolean; disabled: boolean }) => ReactNode) |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| open | 打开面板 | () => void |
| close | 关闭面板 | () => void |

## 数据类型

```tsx
export type ButtonTone =
  | 'primary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral';

export type FabPosition =
  | 'left-top'
  | 'right-top'
  | 'left-bottom'
  | 'right-bottom'
  | 'left-center'
  | 'right-center'
  | 'top-center'
  | 'bottom-center';

export type FabDirection = 'top' | 'bottom' | 'left' | 'right';

export type FabGap = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
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

[Fab 组件源码](./sources/fab/Fab.tsx.txt) · [示例源码](./sources/fab/demo.tsx.txt) · [文档源码](./sources/fab/docs.md.txt)
