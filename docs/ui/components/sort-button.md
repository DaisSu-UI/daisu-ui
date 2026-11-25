# SortButton 排序按钮

排序按钮循环切换默认、升序和降序状态，适合列表与表格的排序入口。

```tsx
import { SortButton } from 'daisu-ui';
```

## 基础用法

### 受控排序

通过 `title` 设置文案，`value` 和 `onChange` 管理当前排序状态。

```tsx
import { useState } from '@lynx-js/react';

import type { SortButtonValue } from 'daisu-ui';

const [value, setValue] = useState<SortButtonValue>(0);

<SortButton
  title="价格"
  value={value}
  onChange={(event) => {
    'background only';
    setValue(event.value);
  }}
/>
```

## 组件样式

### 默认降序

设置 `descFirst`，第一次切换时优先使用降序。

```tsx
<SortButton title="销量" descFirst />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值；传入后由调用方更新 | `SortButtonValue` | — |
| defaultValue | 非受控模式的初始值 | `SortButtonValue` | `0` |
| title | 标题内容 | `string` | `''` |
| allowReset | 是否允许回到默认排序 | `boolean` | `false` |
| descFirst | 是否优先切换到降序 | `boolean` | `false` |
| line | 是否展示排序线条 | `boolean` | `false` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (event: { value: SortButtonValue }) => void |

## 数据类型

```tsx
export type SortButtonValue = -1 | 0 | 1;
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
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-text-auxiliary` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |
| `--cso-ui-text-secondary` | 共享主题 |

## 源代码

[SortButton 组件源码](./sources/sort-button/SortButton.tsx.txt) · [示例源码](./sources/sort-button/demo.tsx.txt) · [文档源码](./sources/sort-button/docs.md.txt)
