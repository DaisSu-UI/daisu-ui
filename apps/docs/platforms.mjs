const special = {
  "rich-text": [
    "图文可预览；音视频需 browser 后端",
    "图文待验收；音视频后端未接入",
    "注册媒体元素、CORS、自动播放策略",
  ],
  "video-preview": [
    "需 browser 后端",
    "视频后端未接入",
    "HTML5 媒体；原生播放器生命周期协议",
  ],
  "img-cropper": [
    "需 browser 后端",
    "裁剪/位图导出后端未接入",
    "文件选择、图片解码、CORS、Blob URL 生命周期",
  ],
  "qr-code": [
    "SVG；PNG 需 browser 后端",
    "SVG 待验收；PNG 合成后端未接入",
    "外链 Logo/背景内嵌；跨域图像许可",
  ],
  upload: [
    "需调用方 UploadAdapter",
    "需宿主 UploadAdapter，待设备验收",
    "选图、授权、上传、失败/取消均由宿主提供",
  ],
  "paged-list": [
    "FeedList 组合示例",
    "官方 FeedList 后端，待设备验收",
    "原生刷新、唯一 listId、固定高度；性能须真机验证",
  ],
  "index-bar": [
    "有浏览器示例",
    "列表/索引手势待设备验收",
    "固定行高、列表定位和拖动手势",
  ],
  sidebar: [
    "有浏览器示例",
    "导航与列表联动待设备验收",
    "锚点列表与页面切换分别验证",
  ],
  input: [
    "有浏览器示例",
    "需原生 input 注册，待设备验收",
    "输入法、合成事件、聚焦、键盘避让",
  ],
  textarea: [
    "有浏览器示例",
    "需原生 textarea 注册，待设备验收",
    "多行高度、字数、输入法与键盘避让",
  ],
  "synced-input": [
    "组合示例与类型检查",
    "需原生输入及 setValue，待设备验收",
    "外部回填与宿主键盘策略",
  ],
  signature: [
    "有浏览器示例；PNG 编码",
    "笔迹/触摸待设备验收",
    "独立 PNG 编码；不提供通用 Canvas 解码能力",
  ],
  "bar-code": [
    "SVG 展示与导出",
    "SVG 待设备验收",
    "导出 SVG data URL，不是 PNG 临时文件",
  ],
  "web-registration": [
    "仅浏览器宿主入口",
    "不适用；不注册原生元素",
    "挂载 lynx-view 前注册，不能放入原生 Bundle",
  ],
};

export function compatibilityRows(sources, catalog) {
  const labels = new Map(catalog.map((item) => [item.id, item.label]));
  return Object.entries(sources).map(([id, entry]) => {
    const [web, native, requirement] = special[id] || [
      entry.demo ? "有浏览器示例" : "组合示例与类型检查",
      "源码实现，待目标设备验收",
      "Lynx 4.2+；实际宿主元素及渲染后端需匹配",
    ];
    return {
      id,
      label: labels.get(id) || id,
      names: entry.components.map((item) => item.name),
      web,
      android: native,
      ios: native,
      requirement,
    };
  });
}

export function renderCompatibility(version, rows) {
  return `# 平台兼容性总表

本表对应 @daisu-ui/ui@${version}，由公开 API 文档清单生成。新增组件自动进入表格，特殊能力在 apps/docs/platforms.mjs 维护。可按名称、平台状态或宿主要求筛选。

## 如何理解状态

- “有浏览器示例”表示提供了实现和入口，不表示所有交互都已逐项自动化验收；浏览器回归的具体场景见 CI 报告。
- Android / iOS 默认标记“待目标设备验收”。类型检查、网页预览和插件依赖声明均不能代替真机验证，不将源码实现直接标为原生已支持。
- 当前组件 Bundle 编译目标为 Lynx 4.2，开发类型为 @lynx-js/types@4.2.1。lynx_view 的 Dart 插件版本不能单独证明实际内置引擎及 XElement 注册已匹配。
- 本轮未完成 Android / iOS 真机验收，所以没有填写虚构的设备型号、系统版本或测试日期。

## 组件与公开 API

| 组件 / 公开导出 | Web | Android | iOS | 宿主与资源要求 |
| --- | --- | --- | --- | --- |
${rows.map((row) => `| [${row.label}](./${row.id}.md) · ${row.names.join("、")} | ${row.web} | ${row.android} | ${row.ios} | ${row.requirement} |`).join("\n")}

## 真机验收记录

消费项目应记录 UI 精确版本、Bundle 哈希、Lynx 原生引擎版本、lynx_view 与平台插件锁定版本、设备/系统、场景、结果、日期及报告链接。按设备和场景分别记录；已通过的 Android 测试不能自动推广为 iOS 通过。

建议至少验证：中文输入与回填、系统键盘避让、RootPortal 弹层与返回键、侧滑及列表手势冲突、长列表与刷新、媒体关闭释放、图片权限与跨域导出、深色模式和大字体。

## 接入与排查

- [浏览器完整接入](./web-quickstart.md)
- [Flutter 接入](./flutter-quickstart.md)
- [平台适配](./platforms.md)
- [浏览器能力注册](./web-registration.md)
`;
}
