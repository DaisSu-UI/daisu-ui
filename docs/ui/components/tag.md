# Tag 标签

标签用于展示分类和状态，支持语义颜色、外观、图标、关闭和动态输入。

```tsx
import { Tag } from '@daisu-ui/ui';
```

## 组件类型

### 语义标签

通过 `type` 设置标签的语义颜色，通过 `label` 设置文字。

```tsx
<Tag type="primary" label="主要标签" />
<Tag type="success" label="已完成" />
<Tag type="danger" label="待处理" />
```

## 组件样式

### 圆角与镂空

设置 `round` 使用圆角，设置 `plain` 使用镂空样式。

```tsx
<Tag type="primary" round label="圆角标签" />
<Tag type="primary" plain label="镂空标签" />
```

## 交互用法

### 关闭标签

设置 `closable` 显示关闭入口，通过 `onClose` 更新标签的显示状态。

```tsx
import { useState } from '@lynx-js/react';

const [show, setShow] = useState(true);

show ? (
<Tag
closable
label="可关闭"
onClose={() => {
'background only';
setShow(false);
}}
/>
) : null
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| type | default、primary、danger、warning、success、volcano、lightblue、cyan、pink、purple | `TagType` | — |
| size | small、medium、default、large、extra-large；字体11/12/12/14/14px，行高16/18/18/18/20px | `TagSize` | — |
| variant | dark实色、light浅色、plain镂空、dashed虚线、text纯文本 | `TagVariant` | — |
| tone | info映射primary、neutral映射default，其余tone映射同名type；plain映射variant=plain；显式type与variant优先 | `TagTone` | — |
| plain | info映射primary、neutral映射default，其余tone映射同名type；plain映射variant=plain；显式type与variant优先 | `boolean` | — |
| label | children优先；纯文本自动包裹text，保留旧label接口 | `string` | `''` |
| children | children优先；纯文本自动包裹text，保留旧label接口 | `ReactNode` | — |
| icon | 公共SVG图标或自定义图标；iconSlot优先 | `string` | `''` |
| iconSlot | 公共SVG图标或自定义图标；iconSlot优先 | `ReactNode` | — |
| add | 自定义新增按钮内容，默认plus图标与“新增标签”；dynamic时生效 | `ReactNode` | — |
| color | 内容文字与内置图标色 / 实色浅色背景及镂空虚线边框色；color不修改边框 | `string` | — |
| bgColor | 内容文字与内置图标色 / 实色浅色背景及镂空虚线边框色；color不修改边框 | `string` | — |
| round | 胶囊圆角并增加左右内边距 / 8px与4px交错圆角；同时设置时mark形状优先 | `boolean` | — |
| mark | 胶囊圆角并增加左右内边距 / 8px与4px交错圆角；同时设置时mark形状优先 | `boolean` | `false` |
| closable | 包括方形在内均可关闭；只发onClose，调用方负责移除 | `boolean` | `false` |
| dynamic | 点击挂载原生input并聚焦；确认发onConfirm，失焦取消；下一次输入从空值开始 | `boolean` | `false` |
| className | 根样式；颜色传color以覆盖内部内容 | `string` | `''` |
| style | 根样式；颜色传color以覆盖内部内容 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onTap | 标签 / 关闭按钮回调；关闭使用catchtap阻止触发标签点击，dynamic进入编辑时不发onTap | () => void |
| onClose | 标签 / 关闭按钮回调；关闭使用catchtap阻止触发标签点击，dynamic进入编辑时不发onTap | () => void |
| onConfirm | 原样返回输入，包含空串，不自动trim或更新标签列表；确认后原生blur不会重复提交 | (detail: { value: string }) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | children优先；纯文本自动包裹text，保留旧label接口 | ReactNode |
| iconSlot | 公共SVG图标或自定义图标；iconSlot优先 | ReactNode |
| add | 自定义新增按钮内容，默认plus图标与“新增标签”；dynamic时生效 | ReactNode |

## 数据类型

```tsx
export type TagType =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'volcano'
  | 'lightblue'
  | 'cyan'
  | 'pink'
  | 'purple';

export type TagSize = 'small' | 'medium' | 'default' | 'large' | 'extra-large';

export type TagVariant = 'light' | 'dark' | 'plain' | 'dashed' | 'text';

export type TagTone =
  | 'primary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral';
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
| `--cso-ui-dark-display` | 共享主题 |
| `--cso-ui-light-display` | 共享主题 |
| `--cso-ui-tag-default-color` | 当前组件 |
| `--cso-ui-tag-light-cyan-bg` | 当前组件 |
| `--cso-ui-tag-light-danger-bg` | 当前组件 |
| `--cso-ui-tag-light-default-bg` | 当前组件 |
| `--cso-ui-tag-light-lightblue-bg` | 当前组件 |
| `--cso-ui-tag-light-pink-bg` | 当前组件 |
| `--cso-ui-tag-light-primary-bg` | 当前组件 |
| `--cso-ui-tag-light-purple-bg` | 当前组件 |
| `--cso-ui-tag-light-success-bg` | 当前组件 |
| `--cso-ui-tag-light-volcano-bg` | 当前组件 |
| `--cso-ui-tag-light-warning-bg` | 当前组件 |

## 源代码

[Tag 组件源码](./sources/tag/Tag.tsx.txt) · [示例源码](./sources/tag/demo.tsx.txt) · [文档源码](./sources/tag/docs.md.txt)
