# Gap 间隔槽

间隔槽用于在内容块之间保留指定高度，也可为底部安全区提供占位。

```tsx
import { Gap } from '@daisu-ui/ui';
```

## 基础用法

### 内容间隔

通过 `height` 设置内容块之间的间隔高度。

```tsx
<text>上方内容</text>
<Gap height={20} />
<text>下方内容</text>
```

## 组件样式

### 背景颜色

通过 `bgColor` 设置间隔槽背景色。

```tsx
<Gap height={12} bgColor="#f7f8fa" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| height | 数值与纯数字字符串为px；rpx换算vw，其余合法Lynx CSS长度原样传递 | `number \| string` | `14` |
| bgColor | 背景色，未传时允许className覆盖 | `string` | — |
| safeAreaBottom | 在原高度上追加底部安全区 | `boolean` | `false` |
| bottomSafeAreaHeight | 宿主注入的底部安全区px值；负数/非有限数取0 | `number` | `0` |
| className | 根节点定制，style优先 | `string` | `''` |
| style | 根节点定制，style优先 | `CSSProperties` | — |

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[Gap 组件源码](./sources/gap/Gap.tsx.txt) · [示例源码](./sources/gap/demo.tsx.txt) · [文档源码](./sources/gap/docs.md.txt)
