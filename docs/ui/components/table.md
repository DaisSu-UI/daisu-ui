# Table 表格

表格用于展示结构化数据，支持列配置、固定列、排序、合并单元格和固定行高的虚拟窗口。

```tsx
import { Table } from '@daisu-ui/ui';
```

## 组件类型

### 基础表格

通过 `data` 设置行数据，通过 `columns` 的 `prop` 和 `label` 配置列字段与表头。

```tsx
<Table
  data={[
    { name: '张三', score: 88 },
    { name: '李四', score: 95 },
  ]}
  columns={[
    { prop: 'name', label: '姓名' },
    { prop: 'score', label: '分数' },
  ]}
/>
```

## 组件样式

### 边框与表头

设置 `border` 和 `stripe` 展示边框与斑马纹，`height` 限定可见高度，列设置 `fixed` 固定在左侧。

```tsx
<Table
  border
  stripe
  height={240}
  data={[{ name: '商品一', price: 99 }]}
  columns={[
    { prop: 'name', label: '商品', fixed: true },
    { prop: 'price', label: '价格' },
  ]}
/>
```

## 交互用法

### 监听排序

在列上设置 `sortable`，通过 `onSortMethod` 获取排序字段与方向，再由调用方更新数据顺序。

```tsx
<Table
  data={[{ name: '张三', score: 88 }]}
  columns={[
    { prop: 'name', label: '姓名' },
    { prop: 'score', label: '分数', sortable: true },
  ]}
  onSortMethod={(column) => {
    'background only';
    console.log(column.prop, column.sortDirection);
  }}
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| data | 只读数组；组件不修改或排序原始数据 | `readonly T[]` | 必填 |
| columns | 只读数组；组件不修改或排序原始数据 | `readonly TableColumn<T>[]` | 必填 |
| border | 边框与斑马纹，表头随 stripe 着色 | `boolean` | `true` |
| stripe | 边框与斑马纹，表头随 stripe 着色 | `boolean` | `true` |
| height | 最大可见高度，不含外边框；设置后表体可纵向滚动。数字为 px，字符串为可解析的 Lynx 固定长度；高度百分比需要父级具有明确高度 | `number \| string` | — |
| rowHeight | 非虚拟模式最小行高，文本和自定义内容可撑高；虚拟模式为严格固定行高，单位 px | `number` | `44` |
| showHeader | 是否展示、固定表头；无 height 时随页面自然滚动 | `boolean` | `true` |
| ellipsis | 默认换行；开启后普通文本最多两行 | `boolean` | `false` |
| index | true 或列配置；默认标题“序号”、宽 100rpx（13.333333vw），从 1 开始 | `boolean \| Partial<TableColumn<T>>` | `false` |
| fixedHeader | 是否展示、固定表头；无 height 时随页面自然滚动 | `boolean` | `true` |
| cellPadding | 单元格内边距 px，数字或 [垂直,水平]；原生测量与行高同步使用，富文本表格传 0 后由内容负责边距 | `number \| readonly [number, number]` | — |
| spanMethod | `({row,column,rowIndex,columnIndex}) => {rowspan,colspan}` 或 `[rowspan,colspan]`；0 隐藏单元格，调用方负责覆盖区域的 0 配置 | `(scope: TableSpanScope<T>) => TableSpan \| readonly number[] \| void` | — |
| virtual | 有明确 height 时开启固定行高的缓冲窗口；不挂载全部行。虚拟模式不组合 rowspan/colspan，可用独立非虚拟表格展示合并行 | `boolean` | `false` |
| buffer | 有明确 height 时开启固定行高的缓冲窗口；不挂载全部行。虚拟模式不组合 rowspan/colspan，可用独立非虚拟表格展示合并行 | `number` | `5` |
| rowKey | 行属性名或 `(row,index)=>string\|number`，编辑/重排场景请传稳定唯一值 | `keyof T \| ((row: T, index: number) => string \| number)` | — |
| className | 根容器扩展 | `string` | `''` |
| style | 根容器扩展 | `CSSProperties` | — |

泛型约束：`T`。

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onSortMethod | 对应操作发生时触发 | (column: TableSortEvent<T>) => void |
| onRowClick | 对应操作发生时触发 | (event: { rowIndex: number }) => void |

## 数据类型

```tsx
export type TableColumn<T> = {
  prop: keyof T & string;
  label?: string;
  width?: number | string;
  sortable?: boolean;
  fixed?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (scope: { row: T; index: number }) => ReactNode;
};

export type TableSpanScope<T> = {
  row: T;
  column: TableColumn<T>;
  rowIndex: number;
  columnIndex: number;
};

export type TableSpan = { rowspan: number; colspan: number };

export type TableSortEvent<T> = Omit<TableColumn<T>, 'render'> & {
  sortDirection: SortButtonValue;
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

### CSS 变量

以下变量可通过 ConfigProvider 的 themeVars 覆盖，未设置时使用当前主题与组件的默认样式。

| 变量 | 作用范围 |
| --- | --- |
| `--cso-ui-canvas` | 共享主题 |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-table-stripe-bg` | 当前组件 |
| `--cso-ui-text` | 共享主题 |

## 源代码

[Table 组件源码](./sources/table/Table.tsx.txt) · [示例源码](./sources/table/demo.tsx.txt) · [文档源码](./sources/table/docs.md.txt)
