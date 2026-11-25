# DropMenu 下拉菜单

下拉菜单适合筛选和排序，由 DropMenu 容器与多个 DropMenuItem 组成。

```tsx
import { DropMenu, DropMenuItem } from '@daisu-ui/ui';
```

## 基础用法

### 单项筛选

在 `DropMenu` 中放置 `DropMenuItem`，通过 `options` 配置选项，`value` 和 `onChange` 管理选中值。

```tsx
import { useState } from '@lynx-js/react';

const [value, setValue] = useState<string | number>(0);

<DropMenu>
  <DropMenuItem
    value={value}
    onChange={(event) => {
      'background only';
      setValue(event.value);
    }}
    options={[
      { value: 0, label: '全部商品' },
      { value: 1, label: '新款商品' },
    ]}
  />
</DropMenu>
```

## 内容形态

### 自定义筛选内容

通过 `title` 设置菜单标题，子节点中放置自定义筛选内容。

```tsx
<DropMenu>
  <DropMenuItem title="筛选">
    <text>自定义筛选内容</text>
  </DropMenuItem>
</DropMenu>
```

## Attributes 属性

### DropMenu

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| zIndex | 浮层层级 | `number` | `12` |
| direction | 布局或展开方向 | `'down' \| 'up'` | `'down'` |
| topOffset | 顶部偏移 | `number` | `0` |
| modal | 是否显示遮罩 | `boolean` | `true` |
| closeOnClickModal | 点击遮罩是否关闭 | `boolean` | `true` |
| duration | 动画或显示时长，单位 ms | `number` | `200` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |
| children | 自定义内容 | `ReactNode` | — |

### DropMenuItem

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值；传入后由调用方更新 | `DropMenuValue` | — |
| defaultValue | 非受控模式的初始值 | `DropMenuValue` | — |
| options | 选项配置 | `readonly DropMenuOption[]` | `[]` |
| disabled | 是否禁用 | `boolean` | `false` |
| title | 标题内容 | `string` | — |
| icon | 图标内容 | `string` | `'caret-down'` |
| iconSize | 图标尺寸 | `number` | `16` |
| iconName | 状态图标类型 | `string` | `'check'` |
| activeColor | 选中状态颜色 | `string` | — |
| beforeToggle | 切换前校验 | `(event: { status: boolean }) => boolean \| Promise<boolean>` | — |
| valueKey | 选项值字段名 | `string` | `'value'` |
| labelKey | 显示文案字段名 | `string` | `'label'` |
| tipKey | 选项说明字段名 | `string` | `'tip'` |
| popupClassName | 弹层类名 | `string` | `''` |
| popupStyle | 弹层样式 | `CSSProperties` | — |
| popupHeight | 弹层高度 | `string \| number` | — |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | `false` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |
| children | 自定义内容 | `ReactNode` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| DropMenuItem.onChange | 值发生变化时触发 | (event: { value: DropMenuValue; selectedItem: DropMenuOption }) => void |
| DropMenuItem.onOpen | 打开时触发 | () => void |
| DropMenuItem.onOpened | 对应操作发生时触发 | () => void |
| DropMenuItem.onClose | 关闭时触发 | () => void |
| DropMenuItem.onClosed | 对应操作发生时触发 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| DropMenu.children | 自定义内容 | ReactNode |
| DropMenuItem.children | 自定义内容 | ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| getShowPop | 调用实例方法 | () => boolean |
| open | 打开面板 | () => void |
| close | 关闭面板 | () => void |
| toggle | 调用实例方法 | () => void |

## 数据类型

```tsx
export type DropMenuValue = string | number;

export type DropMenuOption = Record<string, unknown>;
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
| `--cso-ui-dark-display` | 共享主题 |
| `--cso-ui-light-display` | 共享主题 |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-auxiliary` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[DropMenu 组件源码](./sources/drop-menu/DropMenu.tsx.txt) · [DropMenuItem 组件源码](./sources/drop-menu/DropMenu.tsx.txt) · [示例源码](./sources/drop-menu/demo.tsx.txt) · [文档源码](./sources/drop-menu/docs.md.txt)
