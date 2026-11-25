# Pagination 分页

分页器用于切换有明确页数的数据，支持总条数、页大小、图标和自定义文案。

```tsx
import { Pagination } from 'daisu-ui';
```

## 组件类型

### 受控分页

通过 `value` 和 `onChange` 管理页码，`total` 设置总条数，`pageSize` 设置每页条数。

```tsx
import { useState } from '@lynx-js/react';

const [page, setPage] = useState(1);

<Pagination
  value={page}
  onChange={(value) => {
    'background only';
    setPage(value);
  }}
  total={100}
  pageSize={10}
/>
```

## 内容形态

### 自定义翻页文案

通过 `prevText` 和 `nextText` 设置翻页文案，`showMessage` 控制页码信息的显示。

```tsx
<Pagination totalPage={5} prevText="上一页" nextText="下一页" showMessage />
```

## 组件状态

### 单页时隐藏

设置 `hideIfOnePage`，只有一页数据时隐藏分页器。

```tsx
<Pagination total={8} pageSize={10} hideIfOnePage />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值；传入后由调用方更新 | `number` | — |
| defaultValue | 非受控模式的初始值 | `number` | `1` |
| total | 数据总条数 | `number` | — |
| totalPage | 总页数 | `number` | — |
| pageSize | 每页条数 | `number` | `10` |
| prevText | 上一步按钮文案 | `string` | `'上一页'` |
| nextText | 下一步按钮文案 | `string` | `'下一页'` |
| showIcon | 是否显示翻页图标 | `boolean` | `false` |
| showMessage | 是否显示分页信息 | `boolean` | `false` |
| hideIfOnePage | 只有一页时是否隐藏 | `boolean` | `true` |
| buttonVariant | 翻页按钮外观 | `'text' \| 'plain' \| 'dashed' \| 'base'` | `'text'` |
| className | 根节点自定义类名 | `string` | `''` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (value: number) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| renderPrev | 自定义区域内容 | (state: PaginationRenderState) => ReactNode |
| renderNext | 自定义区域内容 | (state: PaginationRenderState) => ReactNode |
| renderSize | 自定义区域内容 | (state: PaginationRenderState) => ReactNode |
| renderMessage | 自定义区域内容 | (state: PaginationRenderState) => ReactNode |

## 数据类型

```tsx
export type PaginationRenderState = {
  value: number;
  totalPage: number;
  total?: number;
  pageSize: number;
  prev: () => void;
  next: () => void;
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
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Pagination 组件源码](./sources/pagination/Pagination.tsx.txt) · [示例源码](./sources/pagination/demo.tsx.txt) · [文档源码](./sources/pagination/docs.md.txt)
