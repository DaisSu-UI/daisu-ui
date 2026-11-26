# VideoPreview 视频预览

视频预览用于展示可播放的视频内容，支持独立预览实例、全屏选项和打开、关闭、错误事件；当前提供浏览器后端。

```tsx
import { VideoPreview } from '@daisu-ui/ui';
```

## 基础用法

### 预览视频

将 `useVideoPreview()` 返回的 `props` 绑定到 `VideoPreview`，在浏览器模式下通过 `previewVideo()` 传入视频 `url`。

```tsx
import { useVideoPreview, Button } from '@daisu-ui/ui';

const preview = useVideoPreview();

<Button
  label="播放视频"
  onTap={() => {
    'background only';
    preview.previewVideo({ url: 'https://example.com/movie.mp4' });
  }}
/>
<VideoPreview {...preview.props} mediaMode="browser" />
```

## 组件样式

### 全屏预览

调用 `previewVideo()` 时设置 `fullScreen` 使用全屏预览。

```tsx
const preview = useVideoPreview();

<Button
  label="全屏播放"
  onTap={() => {
    'background only';
    preview.previewVideo({
      url: 'https://example.com/movie.mp4',
      fullScreen: true,
    });
  }}
/>
<VideoPreview {...preview.props} mediaMode="browser" />
```

## 平台与资源说明

浏览器宿主须在挂载 lynx-view 前调用 daisu-ui/web 的 registerDaisuWebComponents，并设置 mediaMode="browser"。使用 HTML5 播放控件，默认不自动播放，页面隐藏时暂停，关闭或卸载释放播放器。useVideoPreview 返回 props、previewVideo 和 closeVideoPreview，调用方须渲染绑定 props 的 VideoPreview，每个实例互相隔离。Flutter 后端待接入。

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| url | 视频、封面与标题；支持HTTP(S)和相对地址，不执行脚本/data/file地址 | `string` | — |
| poster | 视频、封面与标题；支持HTTP(S)和相对地址，不执行脚本/data/file地址 | `string` | — |
| title | 视频、封面与标题；支持HTTP(S)和相对地址，不执行脚本/data/file地址 | `string` | — |
| zIndex | 公共Overlay层级 | `number` | — |
| fullScreen | 播放区域填满预览层；默认区域高度248px；HTML5控件仍可进入浏览器原生全屏 | `boolean` | — |
| closePosition | left-top / right-top；默认 right-top，按钮40px，距顶部及对应侧边16px | `'left-top' \| 'right-top'` | — |
| show | 可选受控显示；hook提供同一组合 | `boolean` | — |
| options | 选项配置 | `VideoPreviewOptions` | — |
| requestKey | 重复请求标识，变化时重置当前展示 | `number` | `0` |
| mediaMode | browser 开启已经注册的浏览器播放器；Flutter暂无后端 | `'browser' \| 'none'` | `'none'` |
| rootPortal | 使用时根部须已放置RootPortalHost | `boolean` | `false` |
| duration | 公共Overlay淡入淡出毫秒数 | `number` | `300` |
| className | 根层样式 | `string` | `''` |
| style | 根层样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onOpen | 层实际打开和关闭时各触发一次；重复关闭不重复回调 | () => void |
| onClose | 层实际打开和关闭时各触发一次；重复关闭不重复回调 | () => void |
| onShowChange | 可选受控显示；hook提供同一组合 | (show: boolean) => void |
| onError | {src,message}，实际资源加载/播放失败及不支持的调用 | (error: { src: string; message: string }) => void |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| open | 打开面板 | (video: VideoPreviewOptions) => boolean |
| close | 关闭面板 | () => void |

## 数据类型

```tsx
export type VideoPreviewOptions = PreviewVideo & {
  zIndex?: number;
  fullScreen?: boolean;
  closePosition?: 'left-top' | 'right-top';
  onOpen?: () => void;
  onClose?: () => void;
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
| `--cso-ui-video-preview-bg` | 当前组件 |
| `--cso-ui-video-preview-video-height` | 当前组件 |

## 源代码

[VideoPreview 组件源码](./sources/video-preview/VideoPreview.tsx.txt) · [示例源码](./sources/video-preview/demo.tsx.txt) · [文档源码](./sources/video-preview/docs.md.txt)
