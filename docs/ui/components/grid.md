# Grid 宫格

宫格用于展示一组并列入口，支持列数、边框、自定义内容和点击导航。

```tsx
import { Grid, GridItem } from '@daisu-ui/ui';
```

## 基础用法

### 图标入口

通过 `Grid.column` 设置每行列数，通过 `GridItem.icon` 和 `text` 设置每个入口。

```tsx
<Grid column={3}>
  <GridItem icon="home" text="首页" />
  <GridItem icon="image" text="相册" />
  <GridItem icon="user" text="我的" />
</Grid>
```

## 布局能力

### 四列宫格

设置 `column={4}` 每行展示四项，设置 `border` 显示边框。

```tsx
<Grid column={4} border>
  <GridItem text="入口一" />
  <GridItem text="入口二" />
  <GridItem text="入口三" />
  <GridItem text="入口四" />
</Grid>
```

## Attributes 属性

### Grid

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| column | 每行列数 | `number` | — |
| border | 是否显示边框 | `boolean` | `false` |
| gutter | 栅格列间隔，单位 px | `number` | `0` |
| square | 是否使用正方形布局 | `boolean` | `false` |
| clickable | 是否显示可点击状态 | `boolean` | `false` |
| bgColor | 背景颜色 | `string` | — |
| hoverClass | 按压状态类名 | `string` | `''` |
| center | 标题与内容是否垂直居中 | `boolean` | `true` |
| direction | 布局或展开方向 | `'vertical'\|'horizontal'` | `'vertical'` |
| reverse | 是否反向显示 | `boolean` | `false` |
| iconSize | 图标尺寸 | `number` | `32` |
| children | 自定义内容 | `ReactNode` | — |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

### GridItem

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| text | 显示文字 | `ReactNode` | — |
| icon | 图标内容 | `string` | — |
| iconColor | 图标颜色 | `string` | — |
| iconSize | 图标尺寸 | `number` | — |
| children | 自定义内容 | `ReactNode` | — |
| isDot | 是否显示圆点徽标 | `boolean` | — |
| value | 当前值；传入后由调用方更新 | `string\|number` | — |
| max | 最大值或数量上限 | `number` | — |
| type | 类型 | `BadgeProps['type']` | — |
| badgeProps | 徽标属性配置 | `BadgeProps` | — |
| ellipsis | 是否截断超出范围的文字 | `boolean` | `false` |
| url | 跳转或媒体地址 | `string` | — |
| linkType | 链接打开方式 | `'push'\|'replace'` | `'push'` |
| className | 根节点自定义类名 | `string` | `''` |
| textClassName | 文字区域类名 | `string` | `''` |
| iconClassName | 图标区域类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| Grid.onNavigate | 对应操作发生时触发 | GridNavigation |
| GridItem.onNavigate | 对应操作发生时触发 | GridNavigation |
| GridItem.onItemClick | 对应操作发生时触发 | (event:TouchEvent)=>void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| Grid.children | 自定义内容 | ReactNode |
| GridItem.text | 显示文字 | ReactNode |
| GridItem.renderIcon | 自定义图标 | ReactNode |
| GridItem.children | 自定义内容 | ReactNode |

## 数据类型

```tsx
export type GridNavigation = (
  url: string,
  options: { replace: boolean },
) => void;
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

## 源代码

[Grid 组件源码](./sources/grid/Grid.tsx.txt) · [GridItem 组件源码](./sources/grid/Grid.tsx.txt) · [示例源码](./sources/grid/demo.tsx.txt) · [文档源码](./sources/grid/docs.md.txt)
