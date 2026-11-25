# NoticeBar 通知栏

通知栏用于展示公告与提示信息，支持滚动、图标、关闭和点击反馈。

```tsx
import { NoticeBar } from 'daisu-ui';
```

## 组件类型

### 基础通知

通过 `text` 设置通知内容。

```tsx
<NoticeBar text="温馨提示：请及时完善个人信息。" />
```

## 组件样式

### 自定义内容颜色

通过 `color` 设置通知文字颜色。

```tsx
<NoticeBar text="系统将在今晚进行维护" color="#f57f00" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| text | string或readonly string[]，按数组顺序循环 | `string \| readonly string[]` | `''` |
| type | warning/info/danger，浅深配色 | `'warning' \| 'info' \| 'danger'` | `'warning'` |
| scrollable | 水平滚动开关；即使文本短也滚动 | `boolean` | `true` |
| delay | 每轮停留秒数，负值归0，非有限值回退1 | `number` | `1` |
| speed | px/s，非正数/非有限值回退50 | `number` | `50` |
| closable | 内置关闭按钮，关闭后移除并清理动画计时 | `boolean` | `false` |
| wrapable | 水平且scrollable=false时允许多行；其他静止情况单行省略 | `boolean` | `false` |
| direction | horizontal/vertical；垂直至少两条才滚动，scrollable仅控制水平方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| prefix | 字符串作为公共Icon名称，也可传ReactNode | `ReactNode` | — |
| suffix | 后缀ReactNode，提供时替代内置关闭按钮；false隐藏后缀 | `ReactNode` | — |
| color | 文字/内置图标、背景颜色 | `string` | — |
| backgroundColor | 文字/内置图标、背景颜色 | `string` | — |
| children | 水平内容插槽，原始字符自动包原生text；垂直始终使用text数组 | `ReactNode` | — |
| className | 根节点样式 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onClose | 点击关闭时一次通知 | () => void |
| onNext | 每轮滚动结束后收到新索引，包括单条水平回到0 | (index: number) => void |
| onClick | 内容点击 `{index,text}`；关闭不透传 | (event: NoticeBarClick) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| prefix | 字符串作为公共Icon名称，也可传ReactNode | ReactNode |
| suffix | 后缀ReactNode，提供时替代内置关闭按钮；false隐藏后缀 | ReactNode |
| children | 水平内容插槽，原始字符自动包原生text；垂直始终使用text数组 | ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| reset | 重置状态 | () => void |

## 数据类型

```tsx
export type NoticeBarClick = { index: number; text: string };
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
| `--cso-ui-notice-bar-danger-bg` | 当前组件 |
| `--cso-ui-notice-bar-info-bg` | 当前组件 |
| `--cso-ui-notice-bar-radius` | 当前组件 |
| `--cso-ui-notice-bar-warning-bg` | 当前组件 |

## 源代码

[NoticeBar 组件源码](./sources/notice-bar/NoticeBar.tsx.txt) · [示例源码](./sources/notice-bar/demo.tsx.txt) · [文档源码](./sources/notice-bar/docs.md.txt)
