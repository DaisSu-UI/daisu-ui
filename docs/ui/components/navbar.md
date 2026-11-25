# Navbar 导航栏

导航栏用于展示页面标题、返回入口和右侧操作，支持固定布局、自定义内容与胶囊导航。

```tsx
import { Navbar, NavbarCapsule } from 'daisu-ui';
```

## 组件类型

### 标准导航栏

设置 `variant="standard"` 使用标准样式，通过 `title` 设置标题，`leftArrow` 显示返回箭头。

```tsx
<Navbar
  variant="standard"
  title="页面标题"
  leftArrow
  onBack={() => {
    'background only';
    console.log('返回');
  }}
/>
```

## 内容形态

### 右侧操作

通过 `rightText` 设置右侧文字，通过 `onRightTap` 响应点击。

```tsx
<Navbar
  variant="standard"
  title="编辑资料"
  rightText="保存"
  onRightTap={() => {
    'background only';
    console.log('保存');
  }}
/>
```

## 布局能力

### 固定导航栏

设置 `fixed` 固定在顶部，配合 `placeholder` 为页面内容保留高度。

```tsx
<Navbar variant="standard" title="详情" fixed placeholder bordered />
```

## Attributes 属性

### Navbar

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| title | 字符串标题单行省略，节点对应 title 插槽 | `ReactNode` | `''` |
| variant | business沿用56px左对齐标题和圆形返回；standard为44px居中标题 | `'business' \| 'standard'` | `'business'` |
| rightLabel | 保持兼容；新参数onLeftTap/onRightTap、rightText/right优先 | `string` | — |
| rightDisabled | 两侧降低透明度并禁止事件 | `boolean` | `false` |
| rightContent | 保持兼容；新参数onLeftTap/onRightTap、rightText/right优先 | `ReactNode` | — |
| statusBarHeight | Flutter / H5 宿主注入，非负 px；不开启安全区时不使用 | `number` | `0` |
| leftText | 两侧文案 | `string` | `''` |
| rightText | 两侧文案 | `string` | — |
| leftArrow | 业务圆形返回或standard的24px箭头 | `boolean` | — |
| bordered | 底部半像素边框，默认跟随当前在线 Demo 源码 | `boolean` | `false` |
| fixed | 顶部固定，固定时生成对应变体及安全区的等高占位 | `boolean` | `false` |
| placeholder | 顶部固定，固定时生成对应变体及安全区的等高占位 | `boolean` | `false` |
| zIndex | 层级 | `number` | `10` |
| safeAreaInsetTop | 启用宿主传入的顶部安全区，保留原statusBarHeight行为 | `boolean` | — |
| leftDisabled | 两侧降低透明度并禁止事件 | `boolean` | `false` |
| left | 对应 Wot 插槽；capsule 优先于 left | `ReactNode` | — |
| right | 对应 Wot 插槽；capsule 优先于 left | `ReactNode` | — |
| capsule | 对应 Wot 插槽；capsule 优先于 left | `ReactNode` | — |
| className | 自定义类，可覆盖背景等样式 | `string` | `''` |

### NavbarCapsule

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| disabled | 是否禁用 | `boolean` | `false` |
| className | 自定义类，可覆盖背景等样式 | `string` | `''` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| Navbar.onBack | 保持兼容；新参数onLeftTap/onRightTap、rightText/right优先 | () => void |
| Navbar.onRight | 保持兼容；新参数onLeftTap/onRightTap、rightText/right优先 | () => void |
| Navbar.onLeftTap | 对应 click-left / click-right，不内置跳转 | () => void |
| Navbar.onRightTap | 对应 click-left / click-right，不内置跳转 | () => void |
| NavbarCapsule.onBack | 保持兼容；新参数onLeftTap/onRightTap、rightText/right优先 | () => void |
| NavbarCapsule.onBackHome | 对应操作发生时触发 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| Navbar.title | 字符串标题单行省略，节点对应 title 插槽 | ReactNode |
| Navbar.rightContent | 保持兼容；新参数onLeftTap/onRightTap、rightText/right优先 | ReactNode |
| Navbar.left | 对应 Wot 插槽；capsule 优先于 left | ReactNode |
| Navbar.right | 对应 Wot 插槽；capsule 优先于 left | ReactNode |
| Navbar.capsule | 对应 Wot 插槽；capsule 优先于 left | ReactNode |

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
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-surface-muted` | 共享主题 |
| `--cso-ui-text` | 共享主题 |

## 源代码

[Navbar 组件源码](./sources/navbar/Navbar.tsx.txt) · [NavbarCapsule 组件源码](./sources/navbar/Navbar.tsx.txt) · [示例源码](./sources/navbar/demo.tsx.txt) · [文档源码](./sources/navbar/docs.md.txt)
