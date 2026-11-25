# 独立仓库开发

组件库已从 yxt-cso-lynx 完整拆出。本仓库管理 `packages/daisu-ui`、`apps/demo` 和 `apps/docs`，不依赖主业务工程。

日常只在 `packages/daisu-ui/src` 修改组件，在 `apps/demo/src/features/ui-demo` 修改示例；无需同步主项目文件。`npm run ui:demo:dev` 构建并运行独立 Demo（3091），`npm run ui:docs:dev` 构建并预览文档（3090）。`npm run build` 构建库、Demo 与文档；文档产物 `apps/docs/dist` 可独立部署并支持子路径。

组件文档由 `apps/docs/guides` 的说明与公开类型生成，Button 文档为定板。`platform-notes.mjs` 保存浏览器注册、资源生命周期及导出约束，避免重新生成时丢失。AI 文档位于 `docs/ui/AI_GUIDE.md`、`llms.txt`、`llms-full.txt`，组件变化时同步维护。

`npm test` 验证库与 Demo，`npm run test:types` 检查 Demo 类型。`npm run ui:check` 会创建临时工程、安装真实 tarball，并检查声明、保留 JSX、自动样式及 Lynx/Web 编译。`npm run ui:pack` 输出 `artifacts/daisu-ui-*.tgz`。

CSO 的 Flutter 桥接、业务路由及其集成测试留在原工程；消费方安装 Git 版本 Tag 或 tarball 并使用公开入口，源码维护不再跨仓库。初始化迁移信息见根目录 `MIGRATION.json`。

文档站页头提供 AI 菜单，分别访问使用指南、LLM 文档、MCP 和 Skills。版本号菜单依据 CHANGELOG 的实际版本标题生成，定位对应更新记录，不切换为不存在的历史文档快照。LLM 文档构建为站点根路径下的 llms.txt 与 llms-full.txt。

指南、设计系统、AI 与左侧完整目录共用 apps/docs/public/navigation.js 配置。指南按快速开始、工程实践与社区分组；设计系统包含设计、定制主题、深色模式和样式覆盖。导航中只配置有实际内容的页面。

文档阅读页采用完整左侧目录、中央正文与右侧页内目录布局。顶部搜索支持 Ctrl/⌘ K，覆盖指南与组件页面。AI 总览按接入方式、推荐路径、能力地图和延伸阅读组织，逐组件约束保存在 COMPONENT_AI_NOTES.md，并生成 component-ai-notes.txt。

MCP 服务位于 apps/mcp，基于官方 SDK 的 stdio 传输，只读取当前仓库文档与独立 Demo。npm run mcp 启动，npm run test:mcp 执行真实客户端集成测试（npm test 包含该测试）。修改工具或参数时同步更新 AI 总览、apps/docs/ai/mcp.md 与 LLM 文档，不单独发布 MCP workspace。

## 版本发布

日常通过 `v<版本>` 源码 Tag 触发 GitLab 校验和自动发布，消费方安装 `npm-v<版本>` 标签。版本更新、锁文件、流水线检查、升级/回退与失败重试见 [版本发布说明](../ci/git-release.md)，本机 Runner 启停见 [维护说明](../ci/local-runner.md)。文档站“工程实践 → 版本发布”复用同一份说明。
