# BarCode 条形码

条形码用于展示可扫描的商品或业务编码，支持不同编码格式及文字展示。

```tsx
import { BarCode } from '@daisu-ui/ui';
```

## 基础用法

### 生成条形码

通过 `value` 设置要编码的内容。

```tsx
<BarCode value="123456789012" />
```

## 组件样式

### 尺寸与颜色

通过 `height` 设置条码高度，通过 `lineColor` 设置条纹颜色。

```tsx
<BarCode value="123456789012" height={80} lineColor="#1c64fd" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | string / number；空值不显示，0 是有效内容，最多128字符 | `string \| number` | — |
| format | auto、CODE128、CODE128A、CODE128B、CODE128C、EAN13、EAN8、UPC、UPCE、CODE39、ITF14、MSI、MSI10、MSI11、MSI1010、MSI1110、pharmacode、codabar | `BarCodeFormat` | — |
| width | 整体尺寸，单位px，必须为有限正数；包括留白、条纹和文字。不是单根条纹宽度 | `number` | — |
| height | 整体尺寸，单位px，必须为有限正数；包括留白、条纹和文字。不是单根条纹宽度 | `number` | — |
| text | 自定义显示文字；默认使用编码后的文字，包括自动计算的校验位 | `string` | — |
| font | 原生字体与最大字号；文本通过独立原生布局测量，宽度不足时缩小字号；字体实际效果取决于宿主可用字体 | `string` | — |
| fontSize | 原生字体与最大字号；文本通过独立原生布局测量，宽度不足时缩小字号；字体实际效果取决于宿主可用字体 | `number` | — |
| fontOptions | bold / italic / bold italic | `'' \| 'bold' \| 'italic' \| 'bold italic'` | — |
| textMargin | 条纹与文字间距，非负有限数字 | `number` | — |
| background | 背景色与条纹/文字颜色 | `string` | — |
| lineColor | 背景色与条纹/文字颜色 | `string` | — |
| margin | 四边留白，非负有限数字 | `number` | — |
| marginTop | 各边留白，允许0 | `number` | — |
| marginBottom | 各边留白，允许0 | `number` | — |
| marginLeft | 各边留白，允许0 | `number` | — |
| marginRight | 各边留白，允许0 | `number` | — |
| displayValue | 是否展示文字 | `boolean` | — |
| textAlign | left / center / right；EAN13/EAN8/UPC/UPCE 默认数字保持分段居中，自定义text时使用该参数 | `'left' \| 'center' \| 'right'` | — |
| textPosition | top / bottom | `'top' \| 'bottom'` | — |
| className | 根容器扩展；改变绘图尺寸请使用width/height | `string` | `''` |
| style | 根容器扩展；改变绘图尺寸请使用width/height | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onValid | 对应操作发生时触发 | (valid: boolean) => void |
| onError | 发生错误时触发 | (error: Error) => void |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| exportImage | 调用实例方法 | () => Promise<string> |
| getSvg | 调用实例方法 | () => string |

## 数据类型

```tsx
export type BarCodeFormat = (typeof barCodeFormats)[number];
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[BarCode 组件源码](./sources/bar-code/BarCode.tsx.txt) · [示例源码](./sources/bar-code/demo.tsx.txt) · [文档源码](./sources/bar-code/docs.md.txt)
