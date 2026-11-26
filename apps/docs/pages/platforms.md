# 平台适配

组件使用 Lynx 原生元素，浏览器 Demo 运行于 Lynx Web。组件 API 的可用范围由渲染后端、引擎版本和宿主能力共同决定。

## 原生元素与样式

消费项目须安装对应 ReactLynx 依赖并设置编译目标。发布 Bundle 不会自动升级 Flutter 等宿主内置的原生引擎。

新增元素、CSS 或手势行为时，查阅本地 Lynx API 与兼容性技能，并在目标设备验证。

## 浏览器媒体后端

浏览器宿主在挂载 lynx-view 前注册扩展元素：

```ts
import { registerDaisuWebComponents } from '@daisu-ui/ui/web';

registerDaisuWebComponents();
```

RichText 和 VideoPreview 使用 mediaMode="browser"；ImgCropper 使用 mode="browser"；QrCode 使用 exportMode="browser"。这些模式不会自动为原生宿主添加后端。

## 上传与宿主接口

Upload 使用调用方提供的 UploadAdapter。选图、授权、网络上传与结果持久化由消费项目负责，组件包不内置账号或 Token。

## 发布与验收

Lynx 应用根据宿主协议分发 Bundle。Web 预览通过后，仍需核对原生键盘、手势、媒体能力与真实列表性能。

- [Upload API](upload.md)
- [VideoPreview API](video-preview.md)
- [ImgCropper API](img-cropper.md)

## 完整工程与支持范围

- [浏览器最小工程与下载](./web-quickstart.md)
- [Flutter Manifest 与宿主接入](./flutter-quickstart.md)
- [平台兼容性总表](./compatibility.md)
