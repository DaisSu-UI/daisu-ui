# SwipeAction 滑动操作

滑动操作通过左右滑动展示快捷操作，适合列表中的删除、收藏等操作入口。

```tsx
import { SwipeAction } from '@daisu-ui/ui';
```

## 基础用法

### 右侧操作

通过 `right` 设置向左滑动后展示的操作区，子节点作为列表内容。

```tsx
import { Button, Cell } from '@daisu-ui/ui';

<SwipeAction right={<Button label="删除" tone="danger" />}>
  <Cell title="向左滑动" value="展示操作" />
</SwipeAction>
```

## 组件状态

### 禁用滑动

设置 `disabled` 禁止展开滑动操作区。

```tsx
<SwipeAction disabled right={<Button label="删除" />}>
  <Cell title="禁用滑动" />
</SwipeAction>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值；传入后由调用方更新 | `SwipeActionStatus` | — |
| defaultValue | 非受控模式的初始值 | `SwipeActionStatus` | `'close'` |
| disabled | 是否禁用 | `boolean` | `false` |
| beforeClose | 关闭前校验 | `SwipeActionBeforeClose` | — |
| left | 左侧内容 | `ReactNode` | — |
| right | 右侧内容 | `ReactNode` | — |
| children | 自定义内容 | `ReactNode` | — |
| duration | 动画或显示时长，单位 ms | `number` | `600` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (value: SwipeActionStatus) => void |
| onClick | 点击时触发 | (event: SwipeActionClickEvent) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| left | 左侧内容 | ReactNode |
| right | 右侧内容 | ReactNode |
| children | 自定义内容 | ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| close | 关闭面板 | (reason?: SwipeActionReason, position?: SwipeActionPosition) => Promise<boolean> |

## 数据类型

```tsx
export type SwipeActionStatus = 'left' | 'close' | 'right';

export type SwipeActionBeforeClose = (
  reason: SwipeActionReason,
  position: SwipeActionPosition,
) => boolean | Promise<boolean>;

export type SwipeActionClickEvent = { value: SwipeActionPosition };
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

[SwipeAction 组件源码](./sources/swipe-action/SwipeAction.tsx.txt) · [示例源码](./sources/swipe-action/demo.tsx.txt) · [文档源码](./sources/swipe-action/docs.md.txt)
