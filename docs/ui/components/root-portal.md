# Root Portal 根节点传送门

根节点传送门将弹层内容挂载到页面根部，帮助浮层脱离局部裁剪和变换容器。

```tsx
import { RootPortal, RootPortalHost } from '@daisu-ui/ui';
```

## 基础用法

### 配置挂载宿主

在页面根部放置 `RootPortalHost`，使用 `RootPortal` 将浮层挂载到该宿主。

```tsx
<RootPortalHost>
  <text>页面内容</text>
  <RootPortal>
    <view style={{ position: 'fixed', top: '80px', right: '16px' }}>
      <text>根节点浮层</text>
    </view>
  </RootPortal>
</RootPortalHost>
```

## 组合用法

### 与主题配合

将 `RootPortalHost` 放在 `ConfigProvider` 内，使根节点浮层获得相同主题配置。

```tsx
import { ConfigProvider, Button } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  <RootPortalHost>
    <Button label="页面操作" />
  </RootPortalHost>
</ConfigProvider>
```

## Attributes 属性

### RootPortal

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| children | 自定义内容 | `ReactNode` | — |

### RootPortalHost

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| children | 自定义内容 | `ReactNode` | — |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| RootPortal.children | 自定义内容 | ReactNode |
| RootPortalHost.children | 自定义内容 | ReactNode |

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[RootPortal 组件源码](./sources/root-portal/RootPortal.tsx.txt) · [RootPortalHost 组件源码](./sources/root-portal/RootPortal.tsx.txt) · [示例源码](./sources/root-portal/demo.tsx.txt) · [文档源码](./sources/root-portal/docs.md.txt)
