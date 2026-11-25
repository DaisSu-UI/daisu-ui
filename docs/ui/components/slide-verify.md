# SlideVerify 滑动验证

滑动验证要求用户拖动滑块完成确认，适合表单提交前的交互校验。

```tsx
import { SlideVerify } from 'daisu-ui';
```

## 基础用法

### 滑动确认

滑块到达确认位置后触发 `onSuccess`。

```tsx
<SlideVerify
  onSuccess={() => {
    'background only';
    console.log('验证通过');
  }}
/>
```

## 组件状态

### 禁用与自定义文案

设置 `disabled` 禁止拖动，通过 `text` 和 `successText` 设置验证前后的文案。

```tsx
<SlideVerify disabled />
<SlideVerify text="拖动滑块完成验证" successText="验证成功" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| width | 宽度 | `number \| string` | `'100%'` |
| height | 高度 | `number \| string` | `40` |
| tolerance | 滑动确认的允许误差 | `number` | `10` |
| text | 显示文字 | `ReactNode` | `'向右滑动验证'` |
| successText | successText 配置 | `ReactNode` | `'验证通过'` |
| disabled | 是否禁用 | `boolean` | — |
| backgroundColor | 背景颜色 | `string` | — |
| activeBackgroundColor | 激活状态背景色 | `string` | — |
| icon | 图标内容 | `string` | `'double-right'` |
| successIcon | 成功状态图标 | `string` | `'check-circle-fill'` |
| iconSize | 图标尺寸 | `number` | `20` |
| successIconSize | 成功状态图标尺寸 | `number` | `20` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onSuccess | 对应操作发生时触发 | () => void |
| onFail | 对应操作发生时触发 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| text | 显示文字 | ReactNode |
| successText | 自定义区域内容 | ReactNode |
| renderIcon | 自定义图标 | ReactNode |
| renderSuccessIcon | 自定义区域内容 | ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| init | 调用实例方法 | () => Promise<void> |
| reset | 重置状态 | () => void |

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
| `--cso-ui-canvas` | 共享主题 |
| `--cso-ui-success` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-surface-muted` | 共享主题 |
| `--cso-ui-text` | 共享主题 |

## 源代码

[SlideVerify 组件源码](./sources/slide-verify/SlideVerify.tsx.txt) · [示例源码](./sources/slide-verify/demo.tsx.txt) · [文档源码](./sources/slide-verify/docs.md.txt)
