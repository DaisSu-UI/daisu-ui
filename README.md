# Daisu UI · 袋鼠 UI

独立的 ReactLynx 组件库、组件 Demo 和 API 文档仓库。

- `packages/daisu-ui`：发布到 npm 的组件包，保留 JSX、类型声明及自动样式加载。
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

仅发布 `daisu-ui` workspace；Demo 和文档均为 private。`npm run ui:pack` 在 `artifacts/` 生成 tarball。CSO 主项目通过该 tarball 消费公开 API，无需链接本仓库源码，之后可切换为已发布的 npm 版本。

Git 远程：`git@git.zilueit.com:daisu-ui/daisu-ui.git`。迁移清单见 [MIGRATION.json](MIGRATION.json)。

## 从 Git 安装与发布

无需发布到 npmjs。执行 `npm run ui:git:release` 可校验并发布 Git 安装包；Runner 接入后，版本 Tag 自动执行相同校验与发布。配置和安装说明见 [GitLab CI 与 Git 发布](docs/ci/git-release.md)。

## AI 与 MCP

安装依赖后执行 `npm run mcp` 可启动本地 stdio 服务；客户端直接使用 `node` 加 `apps/mcp/index.mjs` 的绝对路径连接。提供组件列表、组件文档、Demo 源码、全文搜索和更新记录五个工具。完整 JSON、VS Code 和 Codex 配置见 [MCP 接入](apps/docs/ai/mcp.md)，总览见 [AI 使用指南](docs/ui/AI_GUIDE.md)。`npm run test:mcp` 验证真实客户端连接，`npm test` 包含该测试。MCP workspace 为 private，随仓库使用。
