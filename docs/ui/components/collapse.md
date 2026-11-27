# Collapse 折叠面板

折叠面板用于展开或收起分组内容，支持多项展开、手风琴和异步展开校验。

```tsx
import { Collapse, CollapseViewMore } from '@daisu-ui/ui';
```

## 基础用法

### 多项展开

通过 `items` 配置面板，每项的 `name` 标识面板，`title` 设置标题，`content` 设置内容。面板分隔线为 0.5px，右侧使用 24px 箭头图标，展开时旋转。

```tsx
<Collapse
  items={[
    { name: 'one', title: '标题一', content: <text>内容一</text> },
    { name: 'two', title: '标题二', content: <text>内容二</text> },
  ]}
/>
```

## 交互模式

### 手风琴

设置 `accordion` 后每次只展开一项，`defaultValue` 指定默认展开项。

```tsx
<Collapse
  accordion
  defaultValue={['one']}
  items={[
    { name: 'one', title: '标题一', content: <text>内容一</text> },
    { name: 'two', title: '标题二', content: <text>内容二</text> },
  ]}
/>
```

## 组件状态

### 禁用选项

在面板项上设置 `disabled`，该项不能展开。

```tsx
<Collapse
  items={[
    {
      name: 'one',
      title: '禁用面板',
      disabled: true,
      content: <text>内容</text>,
    },
  ]}
/>
```

## 内容形态

### 查看更多

通过 `text` 设置长文案，通过 `lineCount` 指定折叠时显示的行数。

```tsx
<CollapseViewMore
  text="这是一段较长的说明文字，可以在折叠状态下展示摘要，并通过查看更多展开全部内容。"
  lineCount={2}
/>
```

## Attributes 属性

### Collapse

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| items | 数据项配置 | `CollapseItemData[]` | 必填 |
| value | 当前值；传入后由调用方更新 | `string[]` | — |
| defaultValue | 非受控模式的初始值 | `string[]` | `[]` |
| accordion | 是否每次只展开一项 | `boolean` | `false` |
| className | 根节点自定义类名 | `string` | `''` |

### CollapseViewMore

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| text | 显示文字 | `string` | 必填 |
| value | 当前值；传入后由调用方更新 | `boolean` | — |
| defaultValue | 非受控模式的初始值 | `boolean` | `false` |
| lineCount | lineCount 配置 | `number` | `2` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| Collapse.onChange | 值发生变化时触发 | (value: string[]) => void |
| CollapseViewMore.onChange | 值发生变化时触发 | (value: boolean) => void |

## 数据类型

```tsx
export type CollapseItemData = {
  name: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  beforeExpand?: (name: string) => boolean | Promise<boolean>;
};
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[Collapse 组件源码](./sources/collapse/Collapse.tsx.txt) · [CollapseViewMore 组件源码](./sources/collapse/Collapse.tsx.txt) · [示例源码](./sources/collapse/demo.tsx.txt) · [文档源码](./sources/collapse/docs.md.txt)
