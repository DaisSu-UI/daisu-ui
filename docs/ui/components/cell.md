# Cell 单元格

单元格用于展示一项信息或提供操作入口。配合 CellGroup 可组织设置列表、详情和表单布局。

```tsx
import { Cell, CellGroup } from 'daisu-ui';
```

## 组件类型

### 基础单元格

通过 `title`、`value` 和 `description` 展示信息，配合 `CellGroup` 组织一组单元格。

```tsx
<CellGroup border>
  <Cell title="单元格" value="内容" />
  <Cell title="带描述" description="补充说明" value="内容" />
</CellGroup>
```

## 交互用法

### 链接入口

设置 `arrow` 展示箭头，`clickable` 展示点击状态，通过 `onTap` 处理点击。

```tsx
<Cell
  title="个人资料"
  arrow
  clickable
  onTap={() => {
    'background only';
    console.log('打开资料');
  }}
/>
```

## 内容形态

### 组合输入框

子节点中可放置输入框，使用 `titleWidth` 设置标题宽度，`center` 让内容垂直居中。

```tsx
import { Input } from 'daisu-ui';

<Cell title="姓名" titleWidth="98px" required center>
  <Input compact placeholder="请输入姓名" />
</Cell>
```

## Attributes 属性

### Cell

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| title | 标题内容 | `ReactNode` | — |
| description | 补充描述 | `string` | — |
| value | 当前值；传入后由调用方更新 | `string` | — |
| placeholder | 占位内容或输入提示 | `string` | — |
| icon | 图标内容 | `ReactNode` | — |
| clickable | 是否显示可点击状态 | `boolean` | `false` |
| arrow | 是否显示箭头 | `boolean` | `false` |
| arrowDirection | 箭头方向 | `'right' \| 'left' \| 'up' \| 'down'` | `'right'` |
| valueAlign | 值区域对齐方式 | `'left' \| 'center' \| 'right'` | `'right'` |
| size | 尺寸 | `'medium' \| 'large'` | `'medium'` |
| center | 标题与内容是否垂直居中 | `boolean` | `false` |
| required | 是否显示必填标记 | `boolean` | `false` |
| markerSide | 必填标记相对标题的位置 | `'before' \| 'after'` | `'before'` |
| vertical | 是否垂直排列 | `boolean` | `false` |
| titleWidth | 标题区域宽度 | `string` | — |
| ellipsis | 是否截断超出范围的文字 | `boolean` | `false` |
| border | 是否显示边框 | `boolean` | — |
| last | 是否为分组最后一项 | `boolean` | `false` |
| className | 根节点自定义类名 | `string` | `''` |
| children | 自定义内容 | `ReactNode` | — |

### CellGroup

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| title | 标题内容 | `string` | — |
| value | 当前值；传入后由调用方更新 | `string` | — |
| border | 是否显示边框 | `boolean` | `false` |
| insert | 是否使用内嵌分组样式 | `boolean` | `false` |
| className | 根节点自定义类名 | `string` | `''` |
| children | 自定义内容 | `ReactNode` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| Cell.onTap | 点击时触发 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| Cell.title | 标题内容 | ReactNode |
| Cell.icon | 图标内容 | ReactNode |
| Cell.children | 自定义内容 | ReactNode |
| CellGroup.children | 自定义内容 | ReactNode |

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
| `--cso-ui-cell-title-color` | 当前组件 |
| `--cso-ui-danger` | 共享主题 |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-auxiliary` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |
| `--cso-ui-text-placeholder` | 共享主题 |

## 源代码

[Cell 组件源码](./sources/cell/Cell.tsx.txt) · [CellGroup 组件源码](./sources/cell/Cell.tsx.txt) · [示例源码](./sources/cell/demo.tsx.txt) · [文档源码](./sources/cell/docs.md.txt)
