# Tab 标签页

标签页用于在同一页面内切换内容，支持滑动标签、下划线、内容切换和吸顶。

```tsx
import { Tabs } from 'daisu-ui';
```

## 组件类型

### 标准标签页

设置 `variant="standard"`，通过 `items` 的 `title`、`name` 和 `children` 配置标签与内容。

```tsx
<Tabs
  variant="standard"
  items={[
    { title: '标签一', name: 'one', children: <text>内容一</text> },
    { title: '标签二', name: 'two', children: <text>内容二</text> },
  ]}
/>
```

## 交互用法

### 受控切换

通过 `value` 和 `onChange` 管理当前标签，选项设置 `disabled` 后不可选择。

```tsx
import { useState } from '@lynx-js/react';

const [value, setValue] = useState<string | number>('one');

<Tabs
  variant="standard"
  value={value}
  onChange={(next) => {
    'background only';
    setValue(next);
  }}
  items={[
    { title: '标签一', name: 'one' },
    { title: '标签二', name: 'two' },
    { title: '禁用', name: 'three', disabled: true },
  ]}
/>
```

## 组件样式

### 自定义颜色

通过 `color` 设置选中颜色，通过 `lineWidth` 设置指示线宽度。

```tsx
<Tabs
  variant="standard"
  color="#f86100"
  lineWidth={24}
  items={[{ title: '精选' }, { title: '推荐' }]}
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| items | 数据项配置 | `readonly TabsItem[]` | 必填 |
| variant | 外观变体 | `'standard'` | — |
| value | 当前值；传入后由调用方更新 | `TabsValue` | — |
| defaultValue | 非受控模式的初始值 | `TabsValue` | `0` |
| slidable | 标签栏滑动策略 | `'auto' \| 'always'` | `'auto'` |
| slidableNum | 开启滑动布局的标签数量 | `number` | `6` |
| mapNum | 超过指定数量时展示标签导航 | `number` | `10` |
| mapTitle | 标签导航标题 | `string` | `''` |
| showScrollbar | 是否显示滚动条 | `boolean` | `false` |
| sticky | 是否吸顶 | `boolean` | `false` |
| offsetTop | 顶部偏移距离 | `number` | `0` |
| swipeable | 是否允许滑动切换内容 | `boolean` | `false` |
| animated | 是否启用切换动画 | `boolean` | `false` |
| duration | 动画或显示时长，单位 ms | `number` | `300` |
| lineTheme | 标签指示线外观 | `TabsLineTheme` | `'normal'` |
| lineWidth | 指示线宽度 | `number \| string` | — |
| lineHeight | 行高或指示线高度 | `number \| string` | — |
| color | 内容颜色 | `string` | — |
| inactiveColor | 未选中状态颜色 | `string` | — |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |
| ref | 组件实例引用 | `Ref<TabsRef>` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (value: TabsValue, event: TabsEvent) => void |
| onClick | 点击时触发 | (event: TabsEvent) => void |
| onDisabled | 对应操作发生时触发 | (event: TabsEvent) => void |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| setActive | 调用实例方法 | (value: TabsValue) => void |
| scrollIntoView | 调用实例方法 | () => void |
| updateLineStyle | 调用实例方法 | () => void |

## 数据类型

```tsx
export type TabsItem = {
  name?: TabsValue;
  title: string;
  disabled?: boolean;
  lazy?: boolean;
  badgeProps?: Omit<BadgeProps, 'children'>;
  children?: ReactNode;
  className?: string;
};

export type TabsValue = string | number;

export type TabsEvent = { index: number; name: TabsValue };

export type TabsLineTheme = 'normal' | 'text' | 'underline' | 'dot';
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
| `--cso-ui-disabled-text` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-surface-muted` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Tabs 组件源码](./sources/tabs/Tabs.tsx.txt) · [示例源码](./sources/tabs/demo.tsx.txt) · [文档源码](./sources/tabs/docs.md.txt)
