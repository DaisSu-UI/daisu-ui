# 媒体组件接入与历史宿主核对

这是 2026-11-24 对原业务工程及其 Flutter 宿主的核对记录，用于说明浏览器实现与原生接入的差别。独立 UI 仓库不包含下文的 Flutter 工程或 src/lib/host.ts，也不要求消费方采用同一插件版本；新的消费项目应核对自身宿主。当前浏览器 API 以组件文档和 @daisu-ui/ui/web 入口为准。

2026-11-25 更新：当前 Lynx 工程的 Bundle 编译目标已设为 4.2，开发类型为 `@lynx-js/types@4.2.1`；本次未修改 Flutter 工程。下文宿主核对记录不代表宿主已升级。官方从 Lynx 4.1 提供实验性 `<video>`，但编译目标与类型升级不会自动完成宿主元素注册、媒体协议或真机验收。

Flutter `yxt-cso-flutter/pubspec.yaml` 锁定 `lynx_view: 1.9.0`，不能依据 pub.dev 最新 1.12.0 推断已有能力。核对 1.9.0 发布归档的 iOS `LynxXElementRegistry.m` / podspec：注册 Input、SVG、Overlay、ViewPager、WebView 等，没有 video 或 Canvas 注册；Android 使用 XElement behaviors，不能据此承诺 iOS 同样支持视频。当时原业务工程的 `src/lib/host.ts` 和 Flutter `lib/core/lynx/lynx_bridge.dart` 只实现图片选择上传、图片/文件预览，没有视频播放器生命周期、音频播放控制或图片裁剪导出协议。

## VideoPreview

用户授权先实现浏览器后，已提供公共 VideoPreview/useVideoPreview 与 /ui-demo/video-preview：HTML5实际播放、248px/全屏、多实例/ref、关闭释放。Flutter版本仍未完成。

视频预览后端需支持 url/poster/title、open/close、fullScreen、zIndex、closePosition、组件 ref 与 useVideoPreview 多实例隔离。Flutter 已依赖 video_player（视频）和 just_audio（音频），但「安装了 Flutter 播放器」不等于 Lynx 已能调用。

可接入方案：Flutter 提供视频预览能力，接收资源与预览配置，返回实例标识，并通过宿主事件报告打开/关闭/错误；或为 Lynx 注册跨端视频元素及播放控制。H5 适配同一协议。明确关闭/返回键、生命周期、音频释放与请求失效行为后，才能完成Flutter侧 VideoPreview / useVideoPreview；浏览器公共API与独立详情已经实现。不能使用 file.preview 的立即成功响应伪造播放器打开和关闭事件。

## ImgCropper

已提供浏览器公共 ImgCropper 与 /ui-demo/img-cropper：真实文件选择、拖动/双指/滚轮缩放、旋转锁边、Canvas PNG/JPEG及Blob URL下载。Flutter版本仍未完成。

裁剪后端需提供拖动/双指缩放/旋转/锁边、aspectRatio、maxScale、exportScale、PNG/JPEG quality/fileType 以及真实 `{tempFilePath,width,height}` 导出。当前图片协议是单张「选择并上传」原子操作，不能在上传前获得本地图片并裁剪。

Flutter 已依赖 image_cropper / extended_image，但尚未暴露 Lynx 裁剪能力。需要先提供独立图片选择/读取及 crop/export 接口，返回真实本地路径、尺寸及失败/取消结果，再对接公共原生编辑器与宿主导出。跨端解码器或经过验证的 Canvas 后端也可替代宿主裁剪，但本项目目前没有这条能力。当前 SVG 的外部位图嵌入在原生后端支持不完整，不能把引用原图的 SVG 当作可独立上传的 PNG 成果。

## 已完成组件的边界

QrCode/BarCode 使用纯编码和原生 SVG；BarCode 的 exportImage 返回 SVG data URL。QrCode 的浏览器 exportMode="browser" 已支持合成 Logo/背景并返回完整 PNG data URL；默认 SVG 模式拒绝未内嵌的外部图片，Flutter 尚无位图合成后端。两者不保存原生 PNG 临时文件；Signature 的 PNG 导出是自有笔迹像素编码，不具备任意 JPEG/PNG 图像解码、旋转和裁剪能力。RichText 默认过滤 audio/video；用户明确要求先实现浏览器后，已增加 @daisu-ui/ui/web 的 HTML5 播放器和显式 mediaMode="browser"，包含播放/暂停/定位/生命周期。Flutter 端仍未实现上述播放接口，浏览器能力不代表原生 VideoPreview 已完成。

这些是具体的宿主接入缺口，剩余清单继续保留未完成；浏览器实现已按用户明确要求单独提供，不能据此标记Flutter跨端能力已完成。
