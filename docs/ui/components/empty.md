# Empty 缺省提示

缺省提示用于展示无数据、网络异常或搜索无结果等状态，可组合图片、文案与底部操作。

```tsx
import { Empty } from '@daisu-ui/ui';
```

## 组件类型

### 缺省状态

通过 `icon` 设置缺省图标，通过 `tip` 设置提示文案。

```tsx
<Empty icon="no-content" tip="暂无内容" />
```

## 内容形态

### 自定义图片和操作

通过 `image` 自定义图片内容，通过 `bottom` 设置底部操作。

```tsx
import { Icon, Button } from '@daisu-ui/ui';

<Empty
  image={<Icon name="no-result" size={100} />}
  tip="未找到相关内容"
  bottom={<Button label="重新搜索" />}
/>
```

## 组件样式

### 图标尺寸

通过 `iconSize` 设置缺省图标尺寸。

```tsx
<Empty icon="no-message" tip="暂无消息" iconSize={140} />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| icon | 公共Icon名称，也可传位图URL、本地构建资源或SVG URL | `string` | `'empty'` |
| iconSize | number或CSS长度字符串，数字按px，宽高相同 | `number \| string` | `98` |
| iconColor | 内置图标颜色；图片资源自身颜色保持原样 | `string` | — |
| tip | string/ReactNode，默认16px/24px、字重600，距图标12px；未提供时不留文字间距 | `ReactNode` | — |
| image | 自定义图片区域ReactNode，提供时替代icon，false可显式隐藏图标 | `ReactNode` | — |
| bottom | 底部内容ReactNode，间距由调用者控制 | `ReactNode` | — |
| className | 根节点样式 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| tip | string/ReactNode，默认16px/24px、字重600，距图标12px；未提供时不留文字间距 | ReactNode |
| image | 自定义图片区域ReactNode，提供时替代icon，false可显式隐藏图标 | ReactNode |
| bottom | 底部内容ReactNode，间距由调用者控制 | ReactNode |

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
| `--cso-ui-empty-padding-bottom` | 当前组件 |
| `--cso-ui-text` | 共享主题 |

## 源代码

[Empty 组件源码](./sources/empty/Empty.tsx.txt) · [示例源码](./sources/empty/demo.tsx.txt) · [文档源码](./sources/empty/docs.md.txt)
