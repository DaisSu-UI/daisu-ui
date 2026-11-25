# Switch 开关

开关用于切换两个互斥状态，支持加载、禁用、自定义值和切换前校验。

```tsx
import { Switch } from '@daisu-ui/ui';
```

## 组件类型

### 受控开关

通过 `value` 和 `onChange` 控制开关，事件中的 `value` 为切换后的值。

```tsx
import { useState } from '@lynx-js/react';

const [value, setValue] = useState(true);

<Switch
  value={value}
  onChange={(event) => {
    'background only';
    setValue(Boolean(event.value));
  }}
/>
```

## 组件状态

### 加载与禁用

设置 `loading` 展示加载状态，设置 `disabled` 禁止切换。

```tsx
<Switch loading />
<Switch value disabled />
```

## 交互用法

### 异步校验

通过 `beforeChange` 在切换前执行异步校验，返回 `true` 后才更新状态。

```tsx
<Switch
  beforeChange={async (value) => {
    'background only';
    console.log(value);
    return true;
  }}
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值；传入后由调用方更新 | `SwitchValue` | — |
| defaultValue | 非受控模式的初始值 | `SwitchValue` | `false` |
| activeValue | 开启状态对应的值 | `SwitchValue` | `true` |
| inactiveValue | 关闭状态对应的值 | `SwitchValue` | `false` |
| activeColor | 选中状态颜色 | `string` | — |
| inactiveColor | 未选中状态颜色 | `string` | — |
| size | 尺寸 | `number \| string` | `26` |
| shape | 形状 | `'round' \| 'square'` | `'round'` |
| disabled | 是否禁用 | `boolean` | — |
| loading | 加载状态或自定义加载内容 | `boolean` | `false` |
| loadingProps | 加载指示器属性 | `Partial<LoadingProps>` | — |
| activeText | 开启状态文字 | `string` | `''` |
| inactiveText | 关闭状态文案 | `string` | `''` |
| activeIcon | 激活状态图标 | `string \| ReactNode` | — |
| inactiveIcon | 未激活状态图标 | `string \| ReactNode` | — |
| activeActionIcon | activeActionIcon 配置 | `string \| ReactNode` | — |
| inactiveActionIcon | inactiveActionIcon 配置 | `string \| ReactNode` | — |
| beforeChange | 变化前校验；返回 false 或拒绝 Promise 可阻止变化 | `(value: SwitchValue) => boolean \| Promise<boolean>` | — |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |
| accessibilityLabel | 读屏工具使用的操作说明 | `string` | `'开关'` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (event: { value: SwitchValue }) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| activeIcon | 激活状态图标 | string \| ReactNode |
| inactiveIcon | 未激活状态图标 | string \| ReactNode |
| activeActionIcon | 自定义区域内容 | string \| ReactNode |
| inactiveActionIcon | 自定义区域内容 | string \| ReactNode |

## 数据类型

```tsx
export type SwitchValue = boolean | string | number;
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
| `--cso-ui-line-strong` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |

## 源代码

[Switch 组件源码](./sources/switch/Switch.tsx.txt) · [示例源码](./sources/switch/demo.tsx.txt) · [文档源码](./sources/switch/docs.md.txt)
