# Img 图片

图片组件提供加载、失败、圆角和预览处理，支持不同填充方式与自定义占位内容。

```tsx
import { Img } from '@daisu-ui/ui';
```

## 基础用法

### 显示图片

通过 `src` 指定图片地址，通过 `width` 和 `height` 设置显示尺寸。

```tsx
<Img src="https://example.com/photo.jpg" width={120} height={120} />
```

## 组件样式

### 圆形图片

设置 `round` 展示圆形图片，配合相同的宽高使用。

```tsx
<Img src="https://example.com/avatar.jpg" width={80} height={80} round />
```

## 内容形态

### 加载失败处理

通过 `onError` 接收图片加载失败事件。

```tsx
<Img
  src="https://example.com/photo.jpg"
  width={120}
  height={120}
  onError={(event) => {
    'background only';
    console.log(event);
  }}
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| src | 位图来源/预览替换来源；支持原生可读取URL、本地构建资源、位图data URL | `string` | — |
| previewSrc | 位图来源/预览替换来源；支持原生可读取URL、本地构建资源、位图data URL | `string` | — |
| width | number或CSS长度字符串，数字按px；传百分比时依赖父容器实际尺寸 | `number \| string` | — |
| height | number或CSS长度字符串，数字按px；传百分比时依赖父容器实际尺寸 | `number \| string` | — |
| mode | scaleToFill/aspectFit/aspectFill、widthFix/heightFix、center/top/bottom/left/right及四角 | `ImgMode` | — |
| round | 圆形或圆角裁剪；radius支持数字与长度字符串 | `boolean` | — |
| radius | 圆形或圆角裁剪；radius支持数字与长度字符串 | `number \| string` | — |
| showLoading | 是否展示对应占位 | `boolean` | — |
| showError | 是否展示对应占位 | `boolean` | — |
| loading | ReactNode插槽，默认32px image/image-failloading图标 | `ReactNode` | — |
| error | ReactNode插槽，默认32px image/image-failloading图标 | `ReactNode` | — |
| enablePreview | 仅成功加载且有src时触发预览 | `boolean` | — |
| alt | 外层原生无障碍标签，并非传给image的HTML alt | `string` | — |
| customImage | 内部image类名、根节点类名及样式 | `string` | — |
| className | 内部image类名、根节点类名及样式 | `string` | — |
| style | 内部image类名、根节点类名及样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onPreview | 显式预览适配器 `(url:string)=>void\|Promise<void>`；同一实例防止并发重复调用 | ImgPreview |
| onPreviewError | 适配器缺失或拒绝时的Error通知 | (error: Error) => void |
| onClick | 任意加载状态下均可点击通知 | () => void |
| onLoad | 原生完整事件，load.detail包含图片width/height | (event: BaseEvent<'load', ImageLoadEvent>) => void |
| onError | 原生完整事件，load.detail包含图片width/height | (event: BaseEvent<'error', ImageErrorEvent>) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| loading | ReactNode插槽，默认32px image/image-failloading图标 | ReactNode |
| error | ReactNode插槽，默认32px image/image-failloading图标 | ReactNode |

## 数据类型

```tsx
export type ImgMode =
  | 'scaleToFill'
  | 'aspectFit'
  | 'aspectFill'
  | 'widthFix'
  | 'heightFix'
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right';

export type ImgPreview = (url: string) => void | Promise<void>;
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
| `--cso-ui-img-loading-bg` | 当前组件 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Img 组件源码](./sources/img/Img.tsx.txt) · [示例源码](./sources/img/demo.tsx.txt) · [文档源码](./sources/img/docs.md.txt)
