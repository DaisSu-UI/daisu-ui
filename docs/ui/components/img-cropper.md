# ImgCropper 图片裁剪

图片裁剪器用于选取图片区域、旋转和导出裁剪结果，浏览器模式通过 Web 宿主提供裁剪能力。

```tsx
import { ImgCropper } from '@daisu-ui/ui';
```

## 基础用法

### 打开裁剪器

设置 `mode="browser"` 使用浏览器裁剪能力，通过 `show` 控制显示，`imgSrc` 指定图片，`onConfirm` 返回裁剪结果。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from '@daisu-ui/ui';

const [show, setShow] = useState(false);

<Button
  label="裁剪图片"
  onTap={() => {
    'background only';
    setShow(true);
  }}
/>
<ImgCropper
  show={show}
  onShowChange={setShow}
  mode="browser"
  imgSrc="https://example.com/photo.jpg"
  onConfirm={(result) => {
    'background only';
    console.log(result);
  }}
/>
```

## 组件样式

### 裁剪尺寸

通过 `imgWidth` 和 `imgHeight` 指定图片初始显示尺寸；裁剪框比例由 `aspectRatio` 控制。

```tsx
<ImgCropper show={false} mode="browser" imgWidth={280} imgHeight={280} />
```

## 平台与资源说明

浏览器宿主须在挂载 lynx-view 前调用 daisu-ui/web 的 registerDaisuWebComponents，并设置 mode="browser"。支持20MB以内 PNG/JPEG/WebP/GIF 本地选图、拖动、双指/滚轮缩放、旋转及锁边。aspectRatio 控制裁剪框，imgWidth/imgHeight 仅为图片初始尺寸。导出真实 PNG/JPEG；tempFilePath 为页面内 Blob URL，关闭时保留，revokeResult 或卸载时释放，刷新后失效。持久化时需保存实际位图内容；跨域图片需允许 CORS。实例方法返回 true 表示请求已发送，onConfirm 才代表编码成功，失败由 onError 返回。Flutter 后端待接入。

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| show | 打开与关闭；未传show时可通过ref.open/close控制 | `boolean` | — |
| imgSrc | HTTP(S)、相对地址、同源Blob或8MiB以内PNG/JPEG/WebP/GIF Base64；SVG/file等不支持；跨域图片服务器须允许CORS读取，否则无法导出 | `string` | `''` |
| imgWidth | 初始宽/高，正数px或百分比；始终保留原比例，并按裁剪框锁边，不拉伸图片 | `number\|string` | — |
| imgHeight | 初始宽/高，正数px或百分比；始终保留原比例，并按裁剪框锁边，不拉伸图片 | `number\|string` | — |
| aspectRatio | 正数width:height，比例0.02–50；示例含1:1、3:2、16:9、16:10 | `string` | `'1:1'` |
| disabledRotate | 隐藏旋转按钮并阻止setRotate | `boolean` | `false` |
| exportScale | 导出像素/裁剪框CSS像素，有限正数且不超过8；结果每边1–4096、总计不超过1600万像素，超限报错 | `number` | `2` |
| maxScale | 相对当前角度最小覆盖比例的最大缩放，1–20 | `number` | `3` |
| quality | 0–1，JPEG压缩质量；PNG由浏览器无损编码 | `number` | `1` |
| fileType | png / jpg / jpeg；jpeg归一为jpg | `'png'\|'jpg'\|'jpeg'` | `'png'` |
| cancelButtonText | 底部操作文案 | `string` | `'取消'` |
| confirmButtonText | 底部操作文案 | `string` | `'完成'` |
| autoChoose | 打开且imgSrc为空时尝试打开文件选择；浏览器限制时仍可点击编辑器中的「选择图片」 | `boolean` | `false` |
| mode | browser启用已注册的浏览器编辑器；Flutter暂无裁剪后端 | `'browser'\|'none'` | `'none'` |
| rootPortal | 根部已有RootPortalHost时可启用 | `boolean` | `false` |
| topInset | 顶部保留区域及公共Overlay层级；示例保留44px导航栏 | `number` | `0` |
| zIndex | 顶部保留区域及公共Overlay层级；示例保留44px导航栏 | `number` | `1000` |
| className | 编辑器外层样式 | `string` | `''` |
| style | 编辑器外层样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onShowChange | 打开与关闭；未传show时可通过ref.open/close控制 | (show:boolean)=>void |
| onConfirm | 确认选择时触发 | (result:ImgCropperResult)=>void |
| onCancel | 取消操作时触发 | ()=>void |
| onImgLoaded | 对应操作发生时触发 | (event:{res:{width:number;height:number}})=>void |
| onImgLoadError | 对应操作发生时触发 | (event:{err:string})=>void |
| onError | 发生错误时触发 | (error:{message:string;phase?:string})=>void |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| open | 打开面板 | (src?:string)=>boolean |
| close | 关闭面板 | ()=>void |
| chooseImage | 调用实例方法 | ()=>boolean |
| confirm | 调用实例方法 | ()=>boolean |
| setRotate | 调用实例方法 | (deg:number)=>boolean |
| resetImg | 调用实例方法 | ()=>boolean |
| revertIsAnimation | 调用实例方法 | (animation:boolean)=>boolean |
| downloadResult | 调用实例方法 | (url:string)=>boolean |
| revokeResult | 调用实例方法 | (url:string)=>void |

## 数据类型

```tsx
export type ImgCropperResult = {
  tempFilePath: string;
  width: number;
  height: number;
  fileType: 'png' | 'jpg';
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

## 源代码

[ImgCropper 组件源码](./sources/img-cropper/ImgCropper.tsx.txt) · [示例源码](./sources/img-cropper/demo.tsx.txt) · [文档源码](./sources/img-cropper/docs.md.txt)
