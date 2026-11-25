export default {
  "qr-code": "浏览器宿主须在挂载 lynx-view 前调用 daisu-ui/web 的 registerDaisuWebComponents。设置 exportMode=\"browser\" 后，exportImage 异步加载并内嵌 Logo/背景，返回完整 PNG data URL；示例用 Img 展示真实返回值。跨域图片需允许 CORS。默认 svg 模式拒绝未内嵌的外部图片，避免导出缺图；getSvg 保留原始图片引用。Flutter 尚无位图合成后端。",
  "video-preview": "浏览器宿主须在挂载 lynx-view 前调用 daisu-ui/web 的 registerDaisuWebComponents，并设置 mediaMode=\"browser\"。使用 HTML5 播放控件，默认不自动播放，页面隐藏时暂停，关闭或卸载释放播放器。useVideoPreview 返回 props、previewVideo 和 closeVideoPreview，调用方须渲染绑定 props 的 VideoPreview，每个实例互相隔离。Flutter 后端待接入。",
  "img-cropper": "浏览器宿主须在挂载 lynx-view 前调用 daisu-ui/web 的 registerDaisuWebComponents，并设置 mode=\"browser\"。支持20MB以内 PNG/JPEG/WebP/GIF 本地选图、拖动、双指/滚轮缩放、旋转及锁边。aspectRatio 控制裁剪框，imgWidth/imgHeight 仅为图片初始尺寸。导出真实 PNG/JPEG；tempFilePath 为页面内 Blob URL，关闭时保留，revokeResult 或卸载时释放，刷新后失效。持久化时需保存实际位图内容；跨域图片需允许 CORS。实例方法返回 true 表示请求已发送，onConfirm 才代表编码成功，失败由 onError 返回。Flutter 后端待接入。",
  "rich-text": "音视频默认过滤。浏览器宿主注册 daisu-ui/web 的 registerDaisuWebComponents 并设置 mediaMode=\"browser\" 才启用 HTML5 播放；Flutter 未提供对应后端。播放器支持播放、暂停和定位，关闭/卸载时释放资源。"
};
