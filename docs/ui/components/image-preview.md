# ImagePreview 图片预览

图片预览用于全屏查看图片组，支持切换、缩放、长按事件与自定义内容。

```tsx
import { ImagePreview } from '@daisu-ui/ui';
```

## 基础用法

### 打开预览

将 `useImagePreview()` 返回的 `props` 绑定到 `ImagePreview`，调用 `previewImage()` 并传入 `images` 打开预览。

```tsx
import { useImagePreview, Button } from '@daisu-ui/ui';

const preview = useImagePreview();

<Button
  label="预览图片"
  onTap={() => {
    'background only';
    preview.previewImage({ images: ['https://example.com/photo.jpg'] });
  }}
/>
<ImagePreview {...preview.props} />
```

## 内容形态

### 多张图片

通过 `images` 设置图片组，通过 `startPosition` 指定初始显示的图片索引。

```tsx
const preview = useImagePreview();

<Button
  label="查看相册"
  onTap={() => {
    'background only';
    preview.previewImage({
      images: ['https://example.com/a.jpg', 'https://example.com/b.jpg'],
      startPosition: 1,
    });
  }}
/>
<ImagePreview {...preview.props} />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| images | 预览图片地址列表 | `readonly string[]` | — |
| startPosition | 预览初始索引 | `number` | — |
| showIndex | 是否显示当前索引 | `boolean` | — |
| loop | 是否循环切换 | `boolean` | — |
| closeable | 是否展示关闭入口 | `boolean` | — |
| closeIcon | 关闭图标 | `string` | — |
| closeIconPosition | 关闭图标位置 | `'top-left'\|'top-right'` | — |
| closeOnClick | 点击内容是否关闭 | `boolean` | — |
| zIndex | 浮层层级 | `number` | — |
| show | 是否显示 | `boolean` | — |
| options | 选项配置 | `ImagePreviewOptions` | — |
| requestKey | 重复请求标识，变化时重置当前展示 | `number` | `0` |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | `false` |
| duration | 动画或显示时长，单位 ms | `number` | `300` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onOpen | 打开时触发 | ()=>void |
| onClose | 关闭时触发 | ()=>void |
| onChange | 值发生变化时触发 | (index:number)=>void |
| onClick | 点击时触发 | (index:number)=>void |
| onLongPress | 对应操作发生时触发 | (index:number)=>void |
| onShowChange | 显示状态变化时触发 | (show:boolean)=>void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| renderClose | 自定义区域内容 | (close:()=>void)=>ReactNode |
| renderIndicator | 自定义区域内容 | (info:{current:number;total:number})=>ReactNode |
| renderContent | 自定义内容 | (info:ImagePreviewSlot)=>ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| open | 打开面板 | (input?:readonly string[]\|ImagePreviewOptions)=>void |
| close | 关闭面板 | ()=>void |
| setActive | 调用实例方法 | (index:number)=>void |

## 数据类型

```tsx
export type ImagePreviewOptions = {
  images?: readonly string[];
  startPosition?: number;
  showIndex?: boolean;
  loop?: boolean;
  closeable?: boolean;
  closeIcon?: string;
  closeIconPosition?: 'top-left' | 'top-right';
  closeOnClick?: boolean;
  zIndex?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (index: number) => void;
  onClick?: (index: number) => void;
  onLongPress?: (index: number) => void;
};

export type ImagePreviewSlot = {
  current: number;
  total: number;
  images: readonly string[];
  close: () => void;
};
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
| `--cso-ui-image-preview-bg` | 当前组件 |

## 源代码

[ImagePreview 组件源码](./sources/image-preview/ImagePreview.tsx.txt) · [示例源码](./sources/image-preview/demo.tsx.txt) · [文档源码](./sources/image-preview/docs.md.txt)
