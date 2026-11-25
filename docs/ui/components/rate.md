# Rate 评分

评分用于展示或选择评分等级，支持半星、只读、禁用和自定义图标。

```tsx
import { Rate } from 'daisu-ui';
```

## 组件类型

### 受控评分

通过 `value` 和 `onChange` 管理评分，事件中的 `value` 为选中的分值。

```tsx
import { useState } from '@lynx-js/react';

const [value, setValue] = useState(3);

<Rate
  value={value}
  onChange={(event) => {
    'background only';
    setValue(event.value);
  }}
/>
```

## 组件状态

### 只读与禁用

设置 `readonly` 展示只读评分，设置 `disabled` 展示禁用状态。

```tsx
<Rate value={4} readonly />
<Rate value={3} disabled />
```

## 组件样式

### 数量与尺寸

通过 `num` 设置评分图标数量，`size` 设置尺寸，`color` 设置未选中图标颜色。

```tsx
<Rate num={5} size={28} color="#f57f00" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值；传入后由调用方更新 | `number \| null` | — |
| defaultValue | 非受控模式的初始值 | `number` | `0` |
| num | 评分图标数量 | `number` | `5` |
| readonly | 是否只读 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | — |
| size | 尺寸 | `number \| string` | `24` |
| space | 相邻项间距 | `number \| string` | `6` |
| color | 内容颜色 | `string` | — |
| activeColor | 选中状态颜色 | `string \| readonly string[]` | `'#faad14'` |
| disabledColor | 禁用状态颜色 | `string` | — |
| icon | 图标内容 | `IconName` | `'star-fill'` |
| activeIcon | 激活状态图标 | `IconName` | `'star-fill'` |
| allowHalf | 是否允许选择半星 | `boolean` | `false` |
| clearable | 是否显示清空入口 | `boolean` | `false` |
| block | 是否占满父容器宽度 | `boolean` | `false` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (event: { value: number }) => void |

## 数据类型

```tsx
export type IconName = keyof typeof iconPaths;
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

## 源代码

[Rate 组件源码](./sources/rate/Rate.tsx.txt) · [示例源码](./sources/rate/demo.tsx.txt) · [文档源码](./sources/rate/docs.md.txt)
