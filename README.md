# Daisu UI · 袋鼠 UI

独立的 ReactLynx 组件库、组件 Demo 和 API 文档仓库。

- `packages/daisu-ui`：通过 GitLab 分发、由 npm 安装的组件包，保留 JSX、类型声明及自动样式加载。
- `apps/demo`：独立 Lynx / 浏览器示例，示例源码的唯一维护位置。
- `apps/docs`：API 文档站、源码面板与内嵌 Demo。
- `apps/mcp`：本地 stdio MCP Server，供 AI 查询组件文档、API、Demo 与主题变量。
- `docs/ui`：组件文档、AI 指南、LLM 文档及平台能力说明。
- `fixtures/ui-consumer`：独立 tarball 消费验收工程。

```bash
npm ci
npm test
npm run test:types
npm run build
npm run ui:check
npm run ui:pack
```

```bash
npm run ui:demo:dev  # http://localhost:3091/#/ui-demo/index
npm run ui:docs:dev  # http://localhost:3090
```

Demo 支持组件独立路径与深色模式，文档站可从 iframe 独立打开 Demo。当前文档预览为静态构建，修改组件、示例或 Markdown 后重新执行构建。构建指南源文件位于 `apps/docs/guides`，平台接入补充说明位于 `apps/docs/guides/platform-notes.mjs`。

浏览器宿主需通过 `daisu-ui/web` 注册媒体、裁剪和二维码导出后端；Flutter 宿主能力由使用方提供。真实平台支持范围见 [媒体能力](docs/ui/MEDIA_CAPABILITIES.md)。

仅发布 `daisu-ui` workspace；Demo、文档和 MCP 均为 private。消费项目可安装 Git 版本 Tag 或 `npm run ui:pack` 生成的 tarball，通过公开 API 使用组件。

Git 远程：`git@git.zilueit.com:daisu-ui/daisu-ui.git`。迁移清单见 [MIGRATION.json](MIGRATION.json)。

## 从 Git 安装与发布

当前已发布 `0.1.0-beta.2`，GitLab 自动发布流水线已验证通过，无需发布到 npmjs：

```bash
npm install "git+ssh://git@git.zilueit.com/daisu-ui/daisu-ui.git#npm-v0.1.0-beta.2"
```

日常发版：完成源码变更 → 更新版本、workspace 引用和更新日志 → 提交 → 推送 `v<版本>` 标签 → 等待 Tag 流水线的 `verify` 与 `publish:git` 成功。流水线会自动维护 `npm-dist` 分支和 `npm-v<版本>` 安装标签。

完整版本更新命令、GitLab 前台配置、安装升级和失败重试见 [版本发布说明](docs/ci/git-release.md)，也可从文档站“工程实践 → 版本发布”查看。本地 Runner 的启停方式见 [Runner 维护说明](docs/ci/local-runner.md)。Runner 离线时可运行 `npm run ui:git:release -- --dry-run` 完整预演，再用 `npm run ui:git:release` 本地发布。

## AI 与 MCP

安装依赖后执行 `npm run mcp` 可启动本地 stdio 服务；客户端直接使用 `node` 加 `apps/mcp/index.mjs` 的绝对路径连接。提供组件列表、组件文档、Demo 源码、全文搜索和更新记录五个工具。完整 JSON、VS Code 和 Codex 配置见 [MCP 接入](apps/docs/ai/mcp.md)，总览见 [AI 使用指南](docs/ui/AI_GUIDE.md)。`npm run test:mcp` 验证真实客户端连接，`npm test` 包含该测试。MCP workspace 为 private，随仓库使用。
