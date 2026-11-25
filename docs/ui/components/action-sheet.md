# ActionSheet 动作面板

动作面板从底部展示操作选项，支持列表、宫格面板、取消和自定义内容。

```tsx
import { ActionSheet } from '@daisu-ui/ui';
```

## 组件类型

### 操作列表

通过 `actions` 设置操作项，`show` 控制面板显示，`onSelect` 获取选中的操作。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from '@daisu-ui/ui';

const [show, setShow] = useState(false);

<Button
  label="更多操作"
  onTap={() => {
    'background only';
    setShow(true);
  }}
/>
<ActionSheet
  show={show}
  onChange={setShow}
  title="请选择操作"
  actions={[{ name: '收藏' }, { name: '分享' }]}
  cancelText="取消"
  onSelect={(selection) => {
    'background only';
    console.log(selection);
  }}
/>
```

## 组件样式

### 面板标题

通过 `title` 设置标题，通过 `cancelText` 设置取消按钮文案。

```tsx
<ActionSheet
  show={false}
  title="更多操作"
  cancelText="取消"
  actions={[{ name: '查看详情' }]}
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| zIndex | 对应 Popup 参数 | `number` | — |
| show | 受控显示 | `boolean` | `false` |
| duration | 对应 Popup 参数 | `number \| boolean` | `200` |
| rootPortal | 原生 Portal，需要 RootPortalHost | `boolean` | — |
| closeOnClickModal | 选择 / 点击遮罩后请求关闭 | `boolean` | — |
| lazyRender | 对应 Popup 参数 | `boolean` | — |
| safeAreaInsetBottom | 宿主安全区数值，px | `boolean` | `true` |
| safeAreaBottom | 宿主安全区数值，px | `number` | — |
| actions | {name?,description?,color?,disabled?,loading?}[] | `readonly ActionSheetAction[]` | `[]` |
| panels | 一维 Panel[] / 二维 Panel[][]；有 panels 时优先显示 | `readonly ActionSheetPanel[] \| readonly (readonly ActionSheetPanel[])[]` | `[]` |
| title | 标题 / 取消按钮文案 | `string` | — |
| cancelText | 标题 / 取消按钮文案 | `string` | — |
| closeOnClickAction | 选择 / 点击遮罩后请求关闭 | `boolean` | `true` |
| children | 自定义内容优先于 actions/panels | `ReactNode` | — |
| titleClassName | 自定义样式 | `string` | `''` |
| className | 自定义样式 | `string` | `''` |
| style | 自定义样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 受控显示 | (show: boolean) => void |
| onEnter | 动画生命周期 | () => void |
| onAfterEnter | 动画生命周期 | () => void |
| onLeave | 动画生命周期 | () => void |
| onAfterLeave | 动画生命周期 | () => void |
| onClickModal | 取消 / 请求关闭 / 点击遮罩 | () => void |
| onClose | 取消 / 请求关闭 / 点击遮罩 | () => void |
| onCancel | 取消 / 请求关闭 / 点击遮罩 | () => void |
| onSelect | actions/单行面板：{item,index}；多行：{item,rowIndex,colIndex} | (selection: ActionSheetSelection) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 自定义内容优先于 actions/panels | ReactNode |
| renderClose | 自定义区域内容 | (close: () => void) => ReactNode |

## 数据类型

```tsx
export type ActionSheetAction = {
  name?: string;
  description?: string;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
};

export type ActionSheetPanel = {
  icon?: IconName | ReactNode;
  image?: string;
  title: string;
  color?: string;
  disabled?: boolean;
};

export type ActionSheetSelection =
  | { item: ActionSheetAction; index: number }
  | { item: ActionSheetPanel; index: number }
  | { item: ActionSheetPanel; rowIndex: number; colIndex: number };
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
| `--cso-ui-surface-muted` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-auxiliary` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[ActionSheet 组件源码](./sources/action-sheet/ActionSheet.tsx.txt) · [示例源码](./sources/action-sheet/demo.tsx.txt) · [文档源码](./sources/action-sheet/docs.md.txt)
