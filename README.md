# Daisu UI · 袋鼠 UI

独立的 ReactLynx 组件库、组件 Demo 和 API 文档仓库。

- `packages/daisu-ui`：发布到 npm 的组件包，保留 JSX、类型声明及自动样式加载。
- `apps/demo`：独立 Lynx / 浏览器示例，示例源码的唯一维护位置。
- `apps/docs`：API 文档站、源码面板与内嵌 Demo。
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
