# 独立仓库开发

组件库已从 yxt-cso-lynx 完整拆出。本仓库管理 `packages/daisu-ui`、`apps/demo` 和 `apps/docs`，不依赖主业务工程。

日常只在 `packages/daisu-ui/src` 修改组件，在 `apps/demo/src/features/ui-demo` 修改示例；无需同步主项目文件。`npm run ui:demo:dev` 构建并运行独立 Demo（3091），`npm run ui:docs:dev` 构建并预览文档（3090）。`npm run build` 构建库、Demo 与文档；文档产物 `apps/docs/dist` 可独立部署并支持子路径。

组件文档由 `apps/docs/guides` 的说明与公开类型生成，Button 文档为定板。`platform-notes.mjs` 保存浏览器注册、资源生命周期及导出约束，避免重新生成时丢失。AI 文档位于 `docs/ui/AI_GUIDE.md`、`llms.txt`、`llms-full.txt`，组件变化时同步维护。

`npm test` 验证库与 Demo，`npm run test:types` 检查 Demo 类型。`npm run ui:check` 会创建临时工程、安装真实 tarball，并检查声明、保留 JSX、自动样式及 Lynx/Web 编译。`npm run ui:pack` 输出 `artifacts/daisu-ui-*.tgz`。

CSO 的 Flutter 桥接、业务路由及其集成测试留在原工程；主应用只安装 tarball 并消费公开入口，源码维护不再跨仓库。初始化迁移信息见根目录 `MIGRATION.json`。
