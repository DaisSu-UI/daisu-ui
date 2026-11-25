# Tabbar 标签栏

标签栏用于切换应用中的主要页面，支持图标、徽标、异步切换校验和底部安全区。

```tsx
import { Tabbar } from 'daisu-ui';
```

## 组件类型

### 基础标签栏

通过 `items` 配置标签项，`value` 指定当前项，`onChange` 返回新的选中值。

```tsx
import { useState } from '@lynx-js/react';

const [value, setValue] = useState<string | number>(0);

<Tabbar
  value={value}
  onChange={(event) => {
    'background only';
    setValue(event.value);
  }}
  items={[
    { name: 0, title: '首页', icon: 'home' },
    { name: 1, title: '我的', icon: 'user' },
  ]}
/>
```

## 布局能力

### 固定底部

设置 `fixed` 固定在底部，配合 `placeholder` 和 `safeAreaInsetBottom` 预留内容与安全区空间。

```tsx
<Tabbar
  fixed
  placeholder
  safeAreaInsetBottom
  items={[
    { name: 'home', title: '首页', icon: 'home' },
    { name: 'me', title: '我的', icon: 'user' },
  ]}
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| items | 对应 Wot TabbarItem 子节点，等宽排列 | `readonly TabbarItem[]` | 必填 |
| value | 对应 v-model，受控或非受控；严格匹配名称，否则使用索引 | `TabbarValue` | — |
| defaultValue | 对应 v-model，受控或非受控；严格匹配名称，否则使用索引 | `TabbarValue` | `0` |
| beforeChange | false、异常或拒绝均阻止切换；旧确认结果不会覆盖新点击 | `TabbarBeforeChange` | — |
| fixed | 固定底部，按需在原位置保留等高占位 | `boolean` | `false` |
| placeholder | 固定底部，按需在原位置保留等高占位 | `boolean` | `false` |
| bordered | 默认形状的顶部细边框；round 忽略此项 | `boolean` | `false` |
| safeAreaInsetBottom | 启用宿主传入的底部安全区 | `boolean` | `false` |
| bottomSafeAreaHeight | 宿主安全距离，px；负数、非有限值按0处理 | `number` | `0` |
| shape | round 水平外边距16px、圆角、阴影 | `'default' \| 'round'` | `'default'` |
| activeColor | 文字与内置图标颜色；SVG 图标请传实际颜色值，如 #1c64fd | `string` | — |
| inactiveColor | 文字与内置图标颜色；SVG 图标请传实际颜色值，如 #1c64fd | `string` | — |
| zIndex | 固定定位层级 | `number` | `10` |
| className | 根节点类名 | `string` | `''` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 成功切换后触发；重复点击当前项不触发 | (event: { value: TabbarValue }) => void |

## 数据类型

```tsx
export type TabbarItem = {
  name?: TabbarValue;
  title?: string;
  icon?: string;
  value?: string | number;
  isDot?: boolean;
  max?: number;
  badgeProps?: Omit<BadgeProps, 'children'>;
  renderIcon?: (state: { active: boolean }) => ReactNode;
  children?: ReactNode;
  className?: string;
};

export type TabbarValue = string | number;

export type TabbarBeforeChange = (
  value: TabbarValue,
) => boolean | Promise<boolean>;
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
| `--cso-ui-dark-display` | 共享主题 |
| `--cso-ui-light-display` | 共享主题 |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |

## 源代码

[Tabbar 组件源码](./sources/tabbar/Tabbar.tsx.txt) · [示例源码](./sources/tabbar/demo.tsx.txt) · [文档源码](./sources/tabbar/docs.md.txt)
