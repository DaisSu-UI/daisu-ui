# Toast 轻提示

轻提示用于短暂反馈操作结果，支持文字、成功、失败和持续加载等状态。

```tsx
import { Toast } from '@daisu-ui/ui';
```

## 基础用法

### 绑定提示实例

调用 `useToast()`，将返回的 `props` 绑定到 `Toast`，通过 `show()` 显示文字提示。

```tsx
import { useToast, Button } from '@daisu-ui/ui';

const toast = useToast();

<Button
  label="显示提示"
  onTap={() => {
    'background only';
    toast.show('这是一条提示');
  }}
/>
<Toast {...toast.props} />
```

## 组件状态

### 成功与加载

通过 `success()` 显示成功提示，通过 `loading()` 显示持续加载，通过 `close()` 手动关闭。

```tsx
const toast = useToast();

<Button
  label="成功"
  onTap={() => {
    'background only';
    toast.success('保存成功');
  }}
/>
<Button
  label="加载"
  onTap={() => {
    'background only';
    toast.loading('加载中');
  }}
/>
<Button
  label="关闭"
  onTap={() => {
    'background only';
    toast.close();
  }}
/>
<Toast {...toast.props} />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| msg | 消息正文 | `string` | — |
| duration | 动画或显示时长，单位 ms | `number` | — |
| direction | 布局或展开方向 | `ToastDirection` | — |
| iconName | 状态图标类型 | `ToastIconType` | — |
| iconSize | 图标尺寸 | `number` | — |
| loadingType | 加载动画类型 | `ToastLoadingType` | — |
| loadingColor | 加载指示器颜色 | `string` | — |
| loadingSize | 加载指示器尺寸 | `number` | — |
| iconColor | 图标颜色 | `string` | — |
| position | 显示位置 | `ToastPosition` | — |
| zIndex | 浮层层级 | `number` | — |
| cover | 是否添加覆盖层 | `boolean` | — |
| iconClass | A public Icon name or image URL, rather than an iconfont class. | `string` | — |
| iconNode | 自定义图标内容 | `ReactNode` | — |
| opened | 打开动画结束回调 | `() => void` | — |
| closed | 关闭动画结束回调 | `() => void` | — |
| show | 是否显示 | `boolean` | `false` |
| options | 选项配置 | `ToastOptions` | — |
| requestKey | 重复请求标识，变化时重置当前展示 | `number` | `0` |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | `false` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (show: boolean) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| iconNode | 自定义图标内容 | ReactNode |

## 数据类型

```tsx
export type ToastDirection = 'horizontal' | 'vertical';

export type ToastIconType =
  | 'success'
  | 'error'
  | 'warning'
  | 'loading'
  | 'info';

export type ToastLoadingType = 'circular' | 'spinner' | 'dots';

export type ToastPosition = 'top' | 'middle-top' | 'middle' | 'bottom';

export type ToastOptions = {
  msg?: string;
  duration?: number;
  direction?: ToastDirection;
  iconName?: ToastIconType;
  iconSize?: number;
  loadingType?: ToastLoadingType;
  loadingColor?: string;
  loadingSize?: number;
  iconColor?: string;
  position?: ToastPosition;
  zIndex?: number;
  cover?: boolean;
  /** A public Icon name or image URL, rather than an iconfont class. */
  iconClass?: string;
  iconNode?: ReactNode;
  opened?: () => void;
  closed?: () => void;
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

[Toast 组件源码](./sources/toast/Toast.tsx.txt) · [示例源码](./sources/toast/demo.tsx.txt) · [文档源码](./sources/toast/docs.md.txt)
