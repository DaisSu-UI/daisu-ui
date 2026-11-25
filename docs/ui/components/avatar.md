# Avatar 头像

头像用于展示用户或对象的图片、文字和图标，头像组可组合多个头像并折叠超出部分。

```tsx
import { Avatar, AvatarGroup } from '@daisu-ui/ui';
```

## 组件类型

### 图片、文字和图标

通过 `src`、`text` 或 `icon` 设置头像内容，`alt` 用于图片说明及失败替代文字。

```tsx
<Avatar src="https://example.com/avatar.jpg" alt="用户头像" />
<Avatar text="张" />
<Avatar icon="user" />
```

## 组件样式

### 尺寸与形状

通过 `size` 设置头像尺寸，通过 `shape` 设置形状，`bgColor` 设置背景色。

```tsx
<Avatar text="A" size="large" />
<Avatar text="B" shape="square" bgColor="#1c64fd" />
```

## 组合用法

### 头像组

通过 `AvatarGroup.items` 配置头像组，`maxCount` 限制展示数量，超出部分折叠显示。

```tsx
<AvatarGroup
  items={[
    { key: 'a', text: 'A' },
    { key: 'b', text: 'B' },
    { key: 'c', text: 'C' },
  ]}
  maxCount={2}
/>
```

## Attributes 属性

### Avatar

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| src | 优先级children、src、text、icon | `string` | `''` |
| text | 优先级children、src、text、icon | `string` | `''` |
| icon | 优先级children、src、text、icon | `string` | `''` |
| size | 统一组内尺寸与形状，优先于各项对应参数 | `AvatarSize` | `'normal'` |
| shape | 统一组内尺寸与形状，优先于各项对应参数 | `'round' \| 'square'` | `'round'` |
| bgColor | 背景与文字/内置图标色；传背景且未传文字色时默认白字 | `string` | — |
| color | 背景与文字/内置图标色；传背景且未传文字色时默认白字 | `string` | — |
| alt | 图片失败时优先显示此文本，再使用text或icon；也是无障碍标签 | `string` | `''` |
| mode | 原生image支持的填充模式 | `'scaleToFill' \| 'aspectFit' \| 'aspectFill' \| 'center'` | `'aspectFill'` |
| children | 自定义内容，优先于图片等参数 | `ReactNode` | — |
| className | 分组根样式 | `string` | `''` |
| style | 分组根样式 | `CSSProperties` | — |

### AvatarGroup

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| items | AvatarProps加可选key，保持输入顺序；可能重排的数据应传稳定key | `readonly AvatarGroupItem[]` | 必填 |
| maxCount | 显示前N个头像，另追加+剩余数；正数向下取整，0、负值和非有限数显示全部 | `number` | — |
| cascading | 按官网实际行为：left-up的zIndex随顺序增加，right-up随顺序减小；不反转数据 | `'left-up' \| 'right-up'` | `'left-up'` |
| size | 统一组内尺寸与形状，优先于各项对应参数 | `AvatarSize` | `'normal'` |
| shape | 统一组内尺寸与形状，优先于各项对应参数 | `'round' \| 'square'` | `'round'` |
| collapseAvatar | 自定义折叠文字，空值使用+剩余数 | `string` | — |
| vertical | 纵向堆叠；否则横向 | `boolean` | `false` |
| className | 分组根样式 | `string` | `''` |
| style | 分组根样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| Avatar.onTap | 点击回调，不直接发起业务请求或导航 | () => void |
| Avatar.onError | 图片加载失败回调，detail包含平台错误信息 | (event: BaseEvent<'error', ImageErrorEvent>) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| Avatar.children | 自定义内容，优先于图片等参数 | ReactNode |

## 数据类型

```tsx
export type AvatarSize =
  | 'large'
  | 'medium'
  | 'normal'
  | 'small'
  | (string & {})
  | number;

export type AvatarGroupItem = AvatarProps & { key?: string | number };
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
| `--cso-ui-avatar-bg` | 当前组件 |
| `--cso-ui-avatar-collapse-bg` | 当前组件 |
| `--cso-ui-avatar-collapse-color` | 当前组件 |
| `--cso-ui-avatar-text` | 当前组件 |
| `--cso-ui-dark-display` | 共享主题 |
| `--cso-ui-light-display` | 共享主题 |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-text-auxiliary` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Avatar 组件源码](./sources/avatar/Avatar.tsx.txt) · [AvatarGroup 组件源码](./sources/avatar/Avatar.tsx.txt) · [示例源码](./sources/avatar/demo.tsx.txt) · [文档源码](./sources/avatar/docs.md.txt)
