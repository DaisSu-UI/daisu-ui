# Sidebar 侧边栏

侧边栏用于纵向分类导航，可与内容区组合实现页面切换或锚点联动。

```tsx
import { Sidebar } from '@daisu-ui/ui';
```

## 组件类型

### 基础分类

通过 `items` 配置分类，`value` 指定当前分类，`onChange` 返回选中的值与文案。

```tsx
import { useState } from '@lynx-js/react';

const [value, setValue] = useState<string | number>('hot');

<Sidebar
  value={value}
  onChange={(event) => {
    'background only';
    setValue(event.value);
  }}
  items={[
    { value: 'hot', label: '热门推荐' },
    { value: 'new', label: '新品上架' },
  ]}
/>
```

## 交互用法

### 切换前确认

通过 `beforeChange` 在切换前执行校验，返回 `true` 允许切换，返回 `false` 阻止切换。

```tsx
<Sidebar
  items={[
    { value: 0, label: '分类一' },
    { value: 1, label: '分类二' },
  ]}
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
| items | 对应 SidebarItem 子项，value 必须唯一 | `readonly SidebarItem[]` | 必填 |
| value | 对应 model-value，严格区分数字与字符串 | `SidebarValue` | — |
| defaultValue | 非受控初始值，未匹配项时无选中态 | `SidebarValue` | `0` |
| beforeChange | 当前官网签名；不是旧版 {value, resolve} 回调 | `SidebarBeforeChange` | — |
| className | 对应 custom-class / custom-style | `string` | `''` |
| style | 对应 custom-class / custom-style | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 切换到另一可用项且钩子允许后触发 | (event: { value: SidebarValue; label: string }) => void |

## 数据类型

```tsx
export type SidebarItem = {
  value: SidebarValue;
  label: string;
  disabled?: boolean;
  icon?: string;
  renderIcon?: (state: { active: boolean; disabled: boolean }) => ReactNode;
  badge?: string | number;
  isDot?: boolean;
  max?: number;
  badgeProps?: SidebarBadgeProps;
  className?: string;
  style?: CSSProperties;
};

export type SidebarValue = string | number;

export type SidebarBeforeChange = (
  value: SidebarValue,
) => boolean | Promise<boolean>;
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
| `--cso-ui-canvas` | 共享主题 |
| `--cso-ui-dark-display` | 共享主题 |
| `--cso-ui-disabled-text` | 共享主题 |
| `--cso-ui-light-display` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |

## 源代码

[Sidebar 组件源码](./sources/sidebar/Sidebar.tsx.txt) · [示例源码](./sources/sidebar/demo.tsx.txt) · [文档源码](./sources/sidebar/docs.md.txt)
