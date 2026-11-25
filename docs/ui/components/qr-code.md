# QRCode 二维码

二维码用于将文本或链接编码为可扫描图案，支持尺寸、颜色与导出。

```tsx
import { QrCode } from 'daisu-ui';
```

## 基础用法

### 文本与链接

通过 `text` 设置二维码内容，可以传入普通文字或链接。

```tsx
<QrCode text="https://example.com" />
```

## 组件样式

### 颜色与尺寸

通过 `size` 设置二维码尺寸，通过 `colorDark` 设置深色模块颜色。

```tsx
<QrCode text="Daisu UI" size={180} colorDark="#1c64fd" />
```

## 平台与资源说明

浏览器宿主须在挂载 lynx-view 前调用 daisu-ui/web 的 registerDaisuWebComponents。设置 exportMode="browser" 后，exportImage 异步加载并内嵌 Logo/背景，返回完整 PNG data URL；示例用 Img 展示真实返回值。跨域图片需允许 CORS。默认 svg 模式拒绝未内嵌的外部图片，避免导出缺图；getSvg 保留原始图片引用。Flutter 尚无位图合成后端。

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| text | 显示文字 | `string` | — |
| size | 尺寸 | `number` | — |
| correctLevel | 二维码纠错级别 | `'L' \| 'M' \| 'Q' \| 'H'` | — |
| colorDark | 二维码深色模块颜色 | `string` | — |
| colorLight | 二维码浅色模块颜色 | `string` | — |
| margin | 外部留白或码图边距 | `number` | — |
| logo | 二维码中心图标地址 | `string` | — |
| logoWidth | 中心图标宽度 | `number` | — |
| logoHeight | 中心图标高度 | `number` | — |
| logoBackgroundColor | 中心图标背景色 | `string` | — |
| logoRadius | 中心图标圆角 | `number` | — |
| logoBorderColor | 中心图标边框色 | `string` | — |
| logoBorderWidth | 中心图标边框宽度 | `number` | — |
| dotType | 二维码模块形状 | `'square' \| 'dots' \| 'rounded' \| 'liquid'` | — |
| dotScale | 二维码模块缩放比例 | `number` | — |
| enableGradient | 是否使用渐变色 | `boolean` | — |
| gradientColor | 渐变结束颜色 | `string` | — |
| gradientColors | 渐变颜色列表 | `string[]` | — |
| gradientDirection | 渐变方向 | `'diagonal' \| 'horizontal' \| 'vertical' \| number` | — |
| backgroundImage | 背景图片地址 | `string` | — |
| exportMode | exportMode 配置 | `'svg'\|'browser'` | `'svg'` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onClick | 点击时触发 | ()=>void |
| onError | 发生错误时触发 | (error:Error)=>void |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| exportImage | 调用实例方法 | ()=>Promise<string> |
| getSvg | 调用实例方法 | ()=>string |

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from 'daisu-ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[QrCode 组件源码](./sources/qr-code/QrCode.tsx.txt) · [示例源码](./sources/qr-code/demo.tsx.txt) · [文档源码](./sources/qr-code/docs.md.txt)
