# 媒体组件与宿主接入边界

UI 仓库维护组件的公开 API、浏览器适配器和接入示例。消费项目维护原生宿主的元素注册、媒体后端、系统权限、资源生命周期和设备验收；具体 Flutter 插件和业务桥接协议由消费方选择。

组件 Bundle 目标为 Lynx 4.2。宿主需核对实际内置引擎与所需元素的注册情况；Dart 插件版本、TypeScript 类型或 Bundle 编译成功都不能单独证明原生能力可用。各组件的支持范围以 [兼容性表](../../apps/docs/pages/compatibility.md) 和同版本组件文档为准。

## 浏览器接入

在挂载 `<lynx-view>` 前，从 `@daisu-ui/ui/web` 调用 `registerDaisuWebComponents()`，注册媒体、裁剪与二维码导出后端。这些浏览器后端使用 DOM、Canvas 和 HTML5 媒体能力，需放在浏览器宿主入口。

原生宿主的媒体、裁剪、键盘、手势和列表性能仍需在目标设备验证。接入模板位于 `examples/`，模板检查通过不表示完成真机验收。

## VideoPreview 与 RichText 音视频

浏览器提供 VideoPreview / useVideoPreview 的播放、关闭和实例生命周期，以及 RichText 的显式浏览器媒体模式；用法分别见 [视频预览](components/video-preview.md) 和 [富文本](components/rich-text.md)。

原生后端需要提供实际播放能力，并正确处理打开、关闭、错误、返回键、卸载和资源释放。需要全屏或多实例时，还应明确状态归属和失效请求的处理。UI 仓库尚未完成这些原生媒体后端的设备验收；宿主返回成功必须对应真实的播放器行为。

## ImgCropper 与 Upload

浏览器 ImgCropper 提供文件选择、拖动缩放、旋转和 PNG / JPEG 导出，见 [图片裁剪](components/img-cropper.md)。原生接入需提供可用的图片读取、编辑与导出后端，并返回真实文件路径、尺寸及失败或取消结果。

Upload 使用消费方注入的 `UploadAdapter`，当前选择上传入口为 `chooseAndUpload`。业务上传地址、认证和进度由适配器管理；独立选图、上传前裁剪和文件上传等扩展需先明确宿主能力和协议，见 [上传](components/upload.md)。

## 图片导出

- QrCode 的浏览器导出模式支持位图合成；默认 SVG 模式对外部图片的限制见 [二维码](components/qr-code.md)。
- BarCode 的图片导出使用 SVG data URL，见 [条形码](components/bar-code.md)。
- Signature 提供笔迹 PNG 导出，见 [签名](components/signature.md)；该编码器不提供通用图片解码和裁剪能力。

原生临时文件保存、相册写入、任意图片合成及其系统权限属于宿主能力，需要分别接入和验证。
