# IndexBar 索引栏

索引栏适合按字母或分类组织长列表，支持索引点击、拖动定位和分组标题。

```tsx
import { IndexBar, IndexAnchor } from 'daisu-ui';
```

## 组件类型

### 字母分组列表

通过 `sections` 配置索引和分组数据，`listId` 标识列表，`renderItem` 定义每行内容。

```tsx
import { Cell } from 'daisu-ui';

<IndexBar
  listId="contact-list"
  sections={[
    { index: 'A', data: ['阿明', '安然'] },
    { index: 'B', data: ['白云'] },
  ]}
  renderItem={({ item }) => <Cell title={item} />}
/>
```

## 组件样式

### 自定义行高

通过 `itemHeight` 设置列表行高，通过 `anchorHeight` 设置分组标题高度。

```tsx
<IndexBar
  listId="city-list"
  itemHeight={48}
  anchorHeight={32}
  sections={[{ index: 'A', data: ['安庆'] }]}
  renderItem={({ item }) => <text>{item}</text>}
/>
```

## Attributes 属性

### IndexBar

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| listId | 当前 Lynx 页面内唯一的原生 List ID；保活的不同页面实例也须使用不同ID | `string` | 必填 |
| sections | `{ index: string 或 number, data: readonly T[] }`，保留输入顺序，index须唯一 | `readonly IndexBarSection<T>[]` | 必填 |
| getItemKey | 分组内稳定行标识；省略时用行序号，可能重排的数据应明确提供 | `(state: IndexBarRenderItem<T>) => string \| number` | — |
| sticky | 固定当前分组标题，下一分组到达时向上推离 | `boolean` | — |
| itemHeight | 列表行高，px；自定义行内容须与此尺寸一致 | `number` | — |
| anchorHeight | 分组标题高，px；自定义标题需改变高度时同步设置 | `number` | — |
| className | 根节点样式，支持指定可测量的高度 | `string` | — |
| style | 根节点样式，支持指定可测量的高度 | `CSSProperties` | — |

泛型约束：`T`。

### IndexAnchor

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| index | 序号列或分组索引 | `AnchorIndex` | 必填 |
| children | 自定义内容 | `ReactNode` | — |
| className | 根节点样式，支持指定可测量的高度 | `string` | `''` |
| style | 根节点样式，支持指定可测量的高度 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| IndexBar.onChange | 点击、滑动定位或列表滚动导致激活索引变化时触发；挂载时不触发 | (event: { index: AnchorIndex }) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| IndexBar.renderItem | 对应默认插槽的列表内容；通常返回公共 Cell | (state: IndexBarRenderItem<T>) => ReactNode |
| IndexBar.renderAnchor | 对应 IndexAnchor 默认插槽，替换标题内容 | (state: { section: IndexBarSection<T>; sectionIndex: number }) => ReactNode |
| IndexAnchor.children | 自定义内容 | ReactNode |

## 数据类型

```tsx
export type IndexBarSection<T> = { index: AnchorIndex; data: readonly T[] };

export type IndexBarRenderItem<T> = {
  item: T;
  itemIndex: number;
  section: IndexBarSection<T>;
  sectionIndex: number;
};

export type AnchorIndex = string | number;
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
| `--cso-ui-canvas` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-auxiliary` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[IndexBar 组件源码](./sources/index-bar/IndexBar.tsx.txt) · [IndexAnchor 组件源码](./sources/index-bar/IndexBar.tsx.txt) · [示例源码](./sources/index-bar/demo.tsx.txt) · [文档源码](./sources/index-bar/docs.md.txt)
