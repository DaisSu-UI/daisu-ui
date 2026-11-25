# RichText 富文本

富文本用于展示 HTML 内容，支持段落、图片、表格和媒体内容，并提供点击、加载与预览事件。

```tsx
import { RichText } from '@daisu-ui/ui';
```

## 组件类型

### 展示 HTML

通过 `content` 传入 HTML 字符串，组件展示其中的段落、标题等内容。

```tsx
<RichText content="<h2>文章标题</h2><p>这里是文章正文。</p>" />
```

## 内容形态

### 表格与列表

`content` 支持表格和列表标签，可在同一段富文本中组合展示。

```tsx
<RichText content="<ul><li>项目一</li><li>项目二</li></ul><table><tr><td>名称</td><td>数值</td></tr><tr><td>完成率</td><td>80%</td></tr></table>" />
```

## 交互用法

### 链接点击

通过 `onLinkClick` 响应链接点击，事件中的 `href` 为链接地址。

```tsx
<RichText
  content='<p><a href="https://example.com">查看详情</a></p>'
  onLinkClick={(event) => {
    'background only';
    console.log(event);
  }}
/>
```

## 平台与资源说明

音视频默认过滤。浏览器宿主注册 daisu-ui/web 的 registerDaisuWebComponents 并设置 mediaMode="browser" 才启用 HTML5 播放；Flutter 未提供对应后端。播放器支持播放、暂停和定位，关闭/卸载时释放资源。

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| baseUrl | HTTP(S) 基址，只补全图片资源，不改 href | `string` | — |
| allowDataImage | 允许不超过 64 KiB 的 PNG/JPEG/GIF/WebP Base64 图片；不接受 SVG，不自动预览 | `boolean` | `false` |
| enableAnchor | 开启目录与原生锚点查询 | `boolean` | `false` |
| tagStyle | Record<string,string>；默认样式→tagStyle→classStyles→HTML style；不直接使用页面同名 class | `Record<string,string>` | — |
| classStyles | Record<string,string>；默认样式→tagStyle→classStyles→HTML style；不直接使用页面同名 class | `Record<string,string>` | — |
| mediaMode | none 过滤音视频；browser 使用已注册的 daisu-ui/web 浏览器播放器 | `'none'\|'browser'` | `'none'` |
| content | HTML 字符串；为空、过滤后为空、解析失败显示 children | `string` | `''` |
| selectable | 映射原生 text-selection；选择体验依目标平台 | `boolean` | `false` |
| previewImage | 已加载的普通图片点击自动预览；链接图片只触发 linkClick | `boolean` | `true` |
| loadingImage | 加载/失败占位图片；占位失败退回文字，不重复触发资源错误 | `string` | — |
| errorImage | 加载/失败占位图片；占位失败退回文字，不重复触发资源错误 | `string` | — |
| children | 自定义内容 | `ReactNode` | — |
| className | 根节点类名与 CSSProperties | `string` | `''` |
| style | 根节点类名与 CSSProperties | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onMediaPlay | 对应操作发生时触发 | (event:RichTextMediaEvent)=>void |
| onMediaPause | 对应操作发生时触发 | (event:RichTextMediaEvent)=>void |
| onMediaEnded | 对应操作发生时触发 | (event:RichTextMediaEvent)=>void |
| onMediaTimeUpdate | 对应操作发生时触发 | (event:RichTextMediaTimeUpdate)=>void |
| onLoad | 对应操作发生时触发 | (event:{imageCount:number})=>void |
| onError | 发生错误时触发 | (error:RichTextError)=>void |
| onLinkClick | 对应操作发生时触发 | (event:{href:string})=>void |
| onImageClick | 对应操作发生时触发 | (event:{src:string;index:number})=>void |
| onImageLoad | 对应操作发生时触发 | (event:{src:string;index:number;width:number;height:number})=>void |
| onScrollToAnchor | 接入实际父滚动容器，参数 {id,rect,offset,duration}，可返回 Promise | (target:{id:string;rect:RichTextRect;offset:number;duration:number})=>void\|Promise<void> |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 自定义内容 | ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| playMedia | 调用实例方法 | (id:string)=>boolean |
| pauseMedia | 调用实例方法 | (id?:string)=>boolean |
| seekMedia | 调用实例方法 | (id:string,seconds:number)=>boolean |
| getText | 调用实例方法 | ()=>string |
| getHeadings | 调用实例方法 | ()=>RichTextHeading[] |
| getAnchorRect | 调用实例方法 | (id:string)=>Promise<RichTextRect> |
| scrollToAnchor | 调用实例方法 | (id:string,options?:{offset?:number;duration?:number})=>Promise<void> |

## 数据类型

```tsx
export type RichTextMediaEvent = {
  id: string;
  type: RichTextMediaType;
  src: string;
};

export type RichTextMediaTimeUpdate = RichTextMediaEvent & {
  currentTime: number;
  duration: number;
};

export type RichTextError = {
  source: 'parse' | 'image' | 'audio' | 'video';
  message?: string;
  code?: string;
  src?: string;
  index?: number;
};

export type RichTextRect = {
  top: number;
  left: number;
  width: number;
  height: number;
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
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-rich-text-color` | 当前组件 |
| `--cso-ui-rich-text-font-size` | 当前组件 |
| `--cso-ui-rich-text-image-state-bg` | 当前组件 |
| `--cso-ui-rich-text-image-state-color` | 当前组件 |
| `--cso-ui-rich-text-line-height` | 当前组件 |
| `--cso-ui-rich-text-video-height` | 当前组件 |
| `--cso-ui-surface-muted` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[RichText 组件源码](./sources/rich-text/RichText.tsx.txt) · [示例源码](./sources/rich-text/demo.tsx.txt) · [文档源码](./sources/rich-text/docs.md.txt)
