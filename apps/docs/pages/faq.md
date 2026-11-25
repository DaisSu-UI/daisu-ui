# 常见问题

## 使用普通 React 可以直接运行吗

组件采用 ReactLynx 和 Lynx 原生元素，消费项目需要使用对应的编译器与运行时。Web 预览也通过 Lynx Web 承载。

## 是否需要手动引入样式

从 @daisu-ui/ui 导入组件时，入口会自动加载样式。消费项目应保留 CSS 副作用，并使用公开 exports。

## 为什么浮层需要根节点配置

使用 rootPortal 的弹窗、Toast 等组件需要在应用根部配置 RootPortalHost，并将它放在同一 ConfigProvider 内，以继承主题。

## 浏览器可用的能力是否代表原生也可用

需要分别核对。视频播放、图片裁剪、上传、键盘及手势受平台后端和宿主协议影响。具体能力以组件文档和目标设备验证结果为准。

## 如何更改主题和局部样式

用 ConfigProvider 的 theme/themeVars 设置作用域，用组件显式属性、className 和 style 调整局部外观。详见 [定制主题](#/theme-customization) 和 [样式覆盖](#/style-overrides)。

## 当前版本如何安装

UI 包 @daisu-ui/ui 已发布 npmjs，使用 npm install @daisu-ui/ui@beta 或固定版本安装。CLI 独立安装 npm install -g @daisu-ui/cli@beta。详见 [快速上手](#/getting-started) 与 [CLI 工具](#/ai-cli)。版本菜单列出更新记录，不会改变 npm 依赖。
