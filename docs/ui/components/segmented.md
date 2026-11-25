# Segmented 分段器

分段器用于展示多个选项并允许用户选择其中单个选项。适合在同一区域切换少量互斥选项及其关联内容。

```tsx
import { Segmented } from 'daisu-ui';
```

## 组件类型

### 基础用法

通过 `options` 设置选项列表，通过 `value` 和 `onChange` 管理当前选中项。非受控使用时可通过 `defaultValue` 设置初始选中项。

```tsx
import { useState } from '@lynx-js/react';

const [value, setValue] = useState<string | number>('点赞');

<Segmented
  options={['评论', '点赞', '贡献', '打赏']}
  value={value}
  onChange={(option) => {
    'background only';
    setValue(option.value);
  }}
/>
```

## 组件状态

### 禁用

设置 `disabled` 禁用整个分段器，也可以为 `options` 中的单个选项设置 `disabled`。

```tsx
<Segmented
  disabled
  defaultValue="点赞"
  options={['评论', '点赞', '贡献', '打赏']}
/>
<Segmented
  options={[
    { value: '评论' },
    { value: '点赞', disabled: true },
    { value: '贡献' },
  ]}
/>
```

## 组件变体

### 轮廓主题

通过 `theme="outline"` 切换为轮廓样式，默认使用 `card` 卡片主题。

```tsx
<Segmented
  theme="outline"
  defaultValue="点赞"
  options={['评论', '点赞', '贡献', '打赏']}
/>
```

## 组件样式

### 自定义渲染分段器标签

通过 `renderLabel` 自定义标签，回调提供 `option`、`active` 和 `disabled`。选项的额外数据可放入 `payload`。

```tsx
<Segmented
  options={[
    { value: '李雷', payload: { role: '设计师' } },
    { value: '韩梅梅', payload: { role: '开发者' } },
  ]}
  renderLabel={({ option, active }) => (
    <view>
      <text>
        {active ? '✓ ' : ''}
        {option.value}
      </text>
      <text>{option.payload?.role}</text>
    </view>
  )}
/>
```

## 特殊样式

### 在弹出框中使用

通过 `Popup` 的 `show` 控制弹出框，在其中放入分段器即可使用；选中项仍由 `value` 和 `onChange` 管理。

```tsx
import { Button, Popup } from 'daisu-ui';

const [show, setShow] = useState(false);

const [value, setValue] = useState<string | number>('点赞');

<Button
  label="打开弹出框"
  onTap={() => {
    'background only';
    setShow(true);
  }}
/>
<Popup
  show={show}
  onChange={(next) => {
    'background only';
    setShow(next);
  }}
  position="bottom"
  closable
  round
  rootPortal
  style={{ padding: '24px', minHeight: '180px' }}
>
  <Segmented
    value={value}
    options={['评论', '点赞', '贡献', '打赏']}
    onChange={(option) => {
      'background only';
      setValue(option.value);
    }}
  />
</Popup>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| options | 等宽选项；值须唯一，字符串与数值严格区分 | `readonly SegmentedInput<T>[]` | `[]` |
| value | 对应 v-model:value，受控值 | `SegmentedValue` | — |
| defaultValue | 非受控初始值 | `SegmentedValue` | — |
| disabled | 禁用全部选项，保留选中显示，不触发事件 | `boolean` | `false` |
| theme | 卡片滑块或轮廓分隔样式 | `'card' \| 'outline'` | `'card'` |
| className | 对应 custom-class | `string` | `''` |

泛型约束：`T = unknown`。

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 用户选择不同的可用项时触发；参数包含 value、disabled、payload | (option: SegmentedOption<T>) => void |
| onClick | 每次点击可用项触发，包括重复点击当前项；先change后click | (option: SegmentedOption<T>) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| renderLabel | 对应 label 插槽，可渲染头像等内容 | (state: { option: SegmentedOption<T>; active: boolean; disabled: boolean }) => ReactNode |

## 数据类型

```tsx
export type SegmentedInput<T = unknown> = SegmentedValue | SegmentedOption<T>;

export type SegmentedValue = string | number;

export type SegmentedOption<T = unknown> = {
  value: SegmentedValue;
  disabled?: boolean;
  payload?: T;
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
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-surface-muted` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Segmented 组件源码](./sources/segmented/Segmented.tsx.txt) · [示例源码](./sources/segmented/demo.tsx.txt) · [文档源码](./sources/segmented/docs.md.txt)
