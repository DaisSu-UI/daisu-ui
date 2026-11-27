# Slider 滑块

滑块用于在一个数值范围内选择数值，支持区间值、步长、刻度和垂直布局。

```tsx
import { Slider } from '@daisu-ui/ui';
```

## 组件类型

### 基础滑块

通过 `value` 和 `onChange` 管理滑块值，`min` 和 `max` 指定可选范围。

```tsx
import { useState } from '@lynx-js/react';

import type { SliderValue } from '@daisu-ui/ui';

const [value, setValue] = useState<SliderValue>(30);

<Slider value={value} onChange={setValue} min={0} max={100} />
```

## 组件样式

### 步长与刻度

通过 `step` 设置步长，`marks` 设置刻度，`showValue` 显示当前值。

```tsx
<Slider
  defaultValue={40}
  step={20}
  marks={[0, 20, 40, 60, 80, 100]}
  showValue
/>
```

## 组件状态

### 禁用

设置 `disabled` 禁止拖动滑块。

```tsx
<Slider value={50} disabled />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | number 或 readonly [number, number]，数组自动开启双向范围 | `SliderValue` | — |
| defaultValue | number 或 readonly [number, number]，数组自动开启双向范围 | `SliderValue` | `0` |
| min | 默认 0 / 100 / 1，步长以 min 为起点，范围手柄不交叉 | `number` | `0` |
| max | 默认 0 / 100 / 1，步长以 min 为起点，范围手柄不交叉 | `number` | `100` |
| step | 默认 0 / 100 / 1，步长以 min 为起点，范围手柄不交叉 | `number` | `1` |
| disabled | 默认 false | `boolean` | — |
| vertical | 默认 false | `boolean` | `false` |
| height | 纵向高度，默认 248px | `number` | `248` |
| theme | default / capsule | `'default' \| 'capsule'` | `'default'` |
| showExtremes | 默认 false | `boolean` | `false` |
| showValue | 拖动时显示值，默认 true | `boolean` | `true` |
| marks | 数字数组或数字到文字的映射 | `readonly number[] \| Readonly<Record<number, string>>` | — |
| className | 根节点样式类 / 无障碍名称 | `string` | `''` |
| accessibilityLabel | 根节点样式类 / 无障碍名称 | `string` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 连续变化 / 拖动结束回调；参数为当前值 | (value: SliderValue) => void |
| onChangeEnd | 连续变化 / 拖动结束回调；参数为当前值 | (value: SliderValue) => void |

## 数据类型

```tsx
export type SliderValue = number | readonly [number, number];
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
| `--cso-ui-control-surface` | 共享主题 |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-auxiliary` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Slider 组件源码](./sources/slider/Slider.tsx.txt) · [示例源码](./sources/slider/demo.tsx.txt) · [文档源码](./sources/slider/docs.md.txt)
