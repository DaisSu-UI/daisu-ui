# Daisu UI 组件 Demo

独立示例通过 daisu-ui 的公开 API 组合组件，不依赖业务工程。

运行 npm run ui:demo:dev 后访问 http://localhost:3091/#/ui-demo/index；组件可通过 #/ui-demo/button 等地址独立打开。浅深主题由初始化数据和示例工具栏控制。

图片、视频、音频使用本仓库维护的本地资源，插画源文件位于 apps/demo/assets-source，生成命令位于 scripts/generate-demo-assets.mjs。图标名称由公共 iconNames 生成分类，图形来自 Tabler Icons。

原生构建将本地图片内嵌为 Base64，适用于只分发 Bundle、没有静态资源服务的宿主，避免把 `/static/image/...` 交给原生图片加载器。浏览器构建仍使用相对路径加载图片。音视频为独立资源，原生宿主需提供可访问的媒体地址或对应资源服务。

组件变更时同步 docs/ui/components、AI 指南和 LLM 文档，并通过测试、类型检查及构建。需要真实宿主能力的示例由使用方注入接口。

滚动与层级：所有示例和库内滚动容器已显式设置 `style.zIndex=0`（不依赖标签选择器），按 Lynx 官方规则建立原生滚动层叠上下文。Steps 数字、Swiper 指示器、AvatarGroup、Calendar 日期等带层级的内容需保留在所属滚动容器内；不要通过提高 z-index 掩盖滚动脱离。组件自身的局部层级和实际 fixed 浮层分别保留。设备复测请检查这些页面的外层滚动、日历首次打开、Sticky 吸顶与滚回复位。

语言与关于页面：从首页底部进入“关于我们”（`#/ui-demo/about`），统一切换简体中文、English、繁體中文及主题。页面展示实际包版本、组件数量、MIT 许可和 GitHub/npm/文档入口。浏览器保存语言偏好；初始化参数 `locale` 优先于浏览器保存值。原生宿主可通过 initData.locale 指定起始语言，项目链接在原生端展示地址。组件值、ID、表单输入和示例代码不参与文案转换。浏览器标题由单一活动路由监听器同步，保留页面不会覆盖当前详情标题。
