# FloatingPanel 浮动面板

浮动面板在页面底部提供可拖动的内容区域，支持多档高度和内容拖拽。

```tsx
import { FloatingPanel } from '@daisu-ui/ui';
```

## 基础用法

### 多档高度

通过 `anchors` 设置可停留的高度，`defaultHeight` 指定初始高度。

```tsx
<FloatingPanel anchors={[100, 300, 500]} defaultHeight={100}>
  <text>向上拖动查看更多内容</text>
</FloatingPanel>
```

## 交互用法

### 监听高度变化

通过 `onHeightChange` 获取面板变化后的高度。

```tsx
<FloatingPanel
  anchors={[120, 360]}
  onHeightChange={(event) => {
    'background only';
    console.log(event.height);
  }}
>
  <text>面板内容</text>
</FloatingPanel>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| height | 高度 | `number` | — |
| defaultHeight | 面板初始高度 | `number` | `0` |
| anchors | 可停留的面板高度列表，单位 px | `readonly number[]` | — |
| duration | 动画或显示时长，单位 ms | `number` | `300` |
| contentDraggable | 是否允许拖动内容区域调整高度 | `boolean` | `true` |
| safeAreaInsetBottom | 是否预留底部安全区 | `boolean` | `false` |
| safeAreaBottom | 底部安全区高度 | `number` | `0` |
| showScrollbar | 是否显示滚动条 | `boolean` | `true` |
| zIndex | 浮层层级 | `number` | `10` |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | `false` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |
| children | 自定义内容 | `ReactNode` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onHeightChange | 对应操作发生时触发 | (event: { height: number }) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 自定义内容 | ReactNode |

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
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |

## 源代码

[FloatingPanel 组件源码](./sources/floating-panel/FloatingPanel.tsx.txt) · [示例源码](./sources/floating-panel/demo.tsx.txt) · [文档源码](./sources/floating-panel/docs.md.txt)
