# 浏览器能力注册

浏览器扩展入口 @daisu-ui/ui/web 用于 H5 媒体、图片裁剪与二维码导出。注册代码运行在浏览器宿主入口，在创建 lynx-view 之前调用；不能放入 ReactLynx 页面或原生 Bundle。原生环境继续使用宿主能力，这些函数不会为 Flutter 自动安装原生组件。

```tsx
import { registerDaisuWebComponents, registerRichTextMedia, registerImgCropper, registerQrCodeExport } from '@daisu-ui/ui/web';
```

## 浏览器入口

统一注册会依次注册富文本音视频、图片裁剪与二维码导出，也可以只调用需要的单项函数。注册函数无参数、无返回值；已有同名自定义元素时跳过注册，可重复调用。

```ts
import { registerDaisuWebComponents } from '@daisu-ui/ui/web';

// 在浏览器宿主挂载 lynx-view 前执行。
registerDaisuWebComponents();
```

registerRichTextMedia 对应 [RichText 富文本](rich-text.md) 音视频；registerImgCropper 对应 [ImgCropper 图片裁剪](img-cropper.md)；registerQrCodeExport 对应 [QRCode 二维码](qr-code.md) 导出。图片跨域读取和媒体播放遵循浏览器权限与资源 CORS 设置，注册不代表目标资源一定可播放或导出。

## 函数签名

### registerDaisuWebComponents

```ts
registerDaisuWebComponents(): void
```

### registerRichTextMedia

```ts
registerRichTextMedia(): void
```

### registerImgCropper

```ts
registerImgCropper(): void
```

### registerQrCodeExport

```ts
registerQrCodeExport(): void
```

## 源代码

[registerDaisuWebComponents 组件源码](./sources/web-registration/index.ts.txt) · [registerRichTextMedia 组件源码](./sources/web-registration/richTextMediaElement.ts.txt) · [registerImgCropper 组件源码](./sources/web-registration/imgCropperElement.ts.txt) · [registerQrCodeExport 组件源码](./sources/web-registration/qrCodeExportElement.ts.txt) · [文档源码](./sources/web-registration/docs.md.txt)
