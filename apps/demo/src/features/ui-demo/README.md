# Daisu UI 组件 Demo

独立示例通过 daisu-ui 的公开 API 组合组件，不依赖业务工程。

运行 npm run ui:demo:dev 后访问 http://localhost:3091/#/ui-demo/index；组件可通过 #/ui-demo/button 等地址独立打开。浅深主题由初始化数据和示例工具栏控制。

图片、视频、音频使用本仓库维护的本地资源，插画源文件位于 apps/demo/assets-source，生成命令位于 scripts/generate-demo-assets.mjs。图标名称由公共 iconNames 生成分类，图形来自 Tabler Icons。

组件变更时同步 docs/ui/components、AI 指南和 LLM 文档，并通过测试、类型检查及构建。需要真实宿主能力的示例由使用方注入接口。
