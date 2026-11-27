# 轻量控件

EmptyState 和 NumberStepper 是保留给轻量业务界面的封装。新页面需要更多外观和交互配置时，优先使用 [Empty](empty.md) 和 [InputNumber](input-number.md)。

```tsx
import { EmptyState, NumberStepper } from '@daisu-ui/ui';
```

## 基础用法

### 空状态与重试

默认标题为“暂无数据”。仅设置 actionLabel 时显示按钮，点击调用 onAction；它不会自动重新请求数据，也不支持 Empty 的图片和插槽属性。

```tsx
<EmptyState
  title="暂无记录"
  description="请调整条件后重试"
  actionLabel="重试"
  onAction={() => {
    'background only';
    console.log('重试');
  }}
/>
```

### 字符串数字步进

value / onChange 均为字符串；初始空值会回填 min，按钮和失焦时做范围归一化。默认 min=0、max=Number.MAX_SAFE_INTEGER、step=1。当前输入过滤不适合作为负数或小数录入方案，需要这些能力时使用 InputNumber。disabled 会阻止按钮和输入回调，但不会原生禁用或阻止失焦归一化。

```tsx
import { useState } from '@lynx-js/react';

const [value, setValue] = useState('1');

<NumberStepper
  value={value}
  min={0}
  max={10}
  step={1}
  onChange={(next) => {
    'background only';
    setValue(next);
  }}
/>
```

## Attributes 属性

### EmptyState

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| title | 标题内容 | `string` | — |
| description | 补充描述 | `string` | — |
| actionLabel | 空状态操作按钮文案，非空时显示按钮 | `string` | — |

### NumberStepper

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 受控字符串数字值 | `string` | 必填 |
| min | 最小值 | `number` | `0` |
| max | 最大值或数量上限 | `number` | — |
| step | 每次增加或减少的步长 | `number` | `1` |
| disabled | 拦截步进按钮和输入回调，不原生禁用输入及失焦归一化 | `boolean` | `false` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| EmptyState.onAction | 点击空状态按钮时触发，不自动请求数据 | () => void |
| NumberStepper.onChange | 变化后的字符串数字回调 | (value: string) => void |
| NumberStepper.onBlur | 失焦归一化后通知，无事件参数 | () => void |

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[EmptyState 组件源码](./sources/compact-controls/EmptyState.tsx.txt) · [NumberStepper 组件源码](./sources/compact-controls/NumberStepper.tsx.txt) · [文档源码](./sources/compact-controls/docs.md.txt)
