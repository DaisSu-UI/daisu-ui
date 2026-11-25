# Notify 消息通知

消息通知用于展示页面级状态，支持成功、警告、失败以及不同位置和外观。

```tsx
import { Notify } from 'daisu-ui';
```

## 基础用法

### 绑定通知实例

将 `useNotify()` 返回的 `props` 绑定到 `Notify`，通过 `showNotify()` 显示通知。

```tsx
import { useNotify, Button } from 'daisu-ui';

const notify = useNotify();

<Button
  label="显示通知"
  onTap={() => {
    'background only';
    notify.showNotify('这是一条通知');
  }}
/>
<Notify {...notify.props} />
```

## 组件状态

### 成功通知

调用 `showNotify()` 时设置 `type="success"`，通过 `message` 指定通知文案。

```tsx
const notify = useNotify();

<Button
  label="保存成功"
  onTap={() => {
    'background only';
    notify.showNotify({ type: 'success', message: '信息保存成功' });
  }}
/>
<Notify {...notify.props} />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| type | primary / success / warning / danger | `NotifyType` | — |
| message | string 或 number；默认内容单行省略，复杂内容使用 children | `string \| number` | — |
| duration | 显示时长，ms；≤0 或非有限值不自动关闭，不含离场动画时间 | `number` | — |
| position | top / bottom | `NotifyPosition` | — |
| color | 自定义文字、前缀及关闭图标颜色 / 背景颜色，支持有效 Lynx CSS 颜色 | `string` | — |
| background | 自定义文字、前缀及关闭图标颜色 / 背景颜色，支持有效 Lynx CSS 颜色 | `string` | — |
| zIndex | 浮层层级 | `number` | — |
| safeHeight | 顶部偏移；数字及纯数字字符串为 px，rpx 转为 vw，其他有效 CSS 长度直接传递 | `number \| string` | — |
| safeAreaBottom | 宿主提供的底部安全区，有限非负 px；仅 bottom 使用 | `number` | — |
| rootPortal | 使用现有原生 Portal 逃离滚动与裁剪容器 | `boolean` | — |
| closable | 展示关闭按钮，catchtap 阻止其触发 onClick | `boolean` | — |
| variant | filled 使用状态浅色背景；floating 使用表面色、12px 外边距、8px 圆角与静态阴影 | `NotifyVariant` | — |
| className | 通知内容容器的类与样式 | `string` | — |
| style | 通知内容容器的类与样式 | `CSSProperties` | — |
| visible | 受控显隐；自动到时或关闭按钮调用 onChange(false)，调用方应回写状态 | `boolean` | `false` |
| requestKey | 内容连续展示时递增，以重新开始计时；useNotify 自动管理 | `number` | `0` |
| options | 同名 NotifyOptions 覆盖组件直接传入的默认选项；不含 visible、children 等控制属性 | `NotifyOptions` | — |
| children | 替换 message，可放公共组件及多行自定义内容 | `ReactNode` | — |
| prefix | 默认类型图标；传 null 隐藏，ReactNode 自定义 | `ReactNode` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onClick | 点击通知正文；参数为 Lynx TouchEvent，不会自动关闭 | (event: TouchEvent) => void |
| onOpened | 入场 / 离场动画完成后调用；快速反向会取消过期阶段 | () => void |
| onClosed | 入场 / 离场动画完成后调用；快速反向会取消过期阶段 | () => void |
| onChange | 受控显隐；自动到时或关闭按钮调用 onChange(false)，调用方应回写状态 | (visible: boolean) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 替换 message，可放公共组件及多行自定义内容 | ReactNode |
| prefix | 默认类型图标；传 null 隐藏，ReactNode 自定义 | ReactNode |
| renderClose | `(close: () => void) => ReactNode`，closable 为 true 时使用 | (close: () => void) => ReactNode |

## 数据类型

```tsx
export type NotifyType = 'primary' | 'success' | 'warning' | 'danger';

export type NotifyPosition = 'top' | 'bottom';

export type NotifyVariant = 'filled' | 'floating';

export type NotifyOptions = {
  type?: NotifyType;
  message?: string | number;
  duration?: number;
  position?: NotifyPosition;
  color?: string;
  background?: string;
  zIndex?: number;
  safeHeight?: number | string;
  safeAreaBottom?: number;
  rootPortal?: boolean;
  closable?: boolean;
  variant?: NotifyVariant;
  className?: string;
  style?: CSSProperties;
  onClick?: (event: TouchEvent) => void;
  onOpened?: () => void;
  onClosed?: () => void;
};
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
| `--cso-ui-danger` | 共享主题 |
| `--cso-ui-danger-soft` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-primary-soft` | 共享主题 |
| `--cso-ui-success` | 共享主题 |
| `--cso-ui-success-soft` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-warning` | 共享主题 |
| `--cso-ui-warning-soft` | 共享主题 |

## 源代码

[Notify 组件源码](./sources/notify/Notify.tsx.txt) · [示例源码](./sources/notify/demo.tsx.txt) · [文档源码](./sources/notify/docs.md.txt)
