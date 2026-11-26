# Daisu UI 开发与发布指南

所有命令均在仓库根目录执行。返回 [项目首页](../README.md)。

独立的 ReactLynx 组件库、组件 Demo 和 API 文档仓库。

- `packages/daisu-ui`：发布到 npm 的 `@daisu-ui/ui` 组件包，保留 JSX、类型声明及自动样式加载。
- `apps/demo`：独立 Lynx / 浏览器示例，示例源码的唯一维护位置。
- `apps/docs`：API 文档站、源码面板与内嵌 Demo。
- `docs/ui`：组件文档、LLM 约束与平台能力说明。
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

文档开发服务默认监听 `0.0.0.0:3090`，同一局域网可使用 `http://<本机局域网 IP>:3090` 访问，内嵌 Demo 共用此地址。可用 `DAISU_DOCS_HOST` 和 `DAISU_DOCS_PORT` 调整监听地址与端口；仅需本机访问时，执行 `DAISU_DOCS_HOST=127.0.0.1 npm run ui:docs:dev`。

Demo 支持组件独立路径与深色模式，文档站可从 iframe 独立打开 Demo。文档产物为静态文件；同级 CLI 已安装开发依赖时，文档开发服务会监听组件、示例和 Markdown 并自动重建，刷新浏览器查看。单独检出 UI 或关闭自动同步时，修改后需重新执行构建。构建指南源文件位于 `apps/docs/guides`，平台接入补充说明位于 `apps/docs/guides/platform-notes.mjs`。

浏览器宿主需通过 `@daisu-ui/ui/web` 注册媒体、裁剪和二维码导出后端；Flutter 宿主能力由使用方提供。真实平台支持范围见 [媒体能力](ui/MEDIA_CAPABILITIES.md)。

仅发布 `@daisu-ui/ui` workspace；Demo 和文档均为 private；CLI/MCP 在独立仓库维护。消费项目使用 npm 版本、Git 安装 Tag 或 tarball，通过公开 API 使用组件。

默认推送远程为 `github`：`git@github.com:DaisSu-UI/daisu-ui.git`。旧 GitLab / GitCode 远程仅保留历史访问，日常代码和版本标签只推送 GitHub。迁移清单见 [MIGRATION.json](../MIGRATION.json)。

## npm 安装

组件包名为 **`@daisu-ui/ui`**，beta 版本这样安装：

```bash
npm install @daisu-ui/ui@beta
# 固定版本，升级或回退时显式指定版本号
npm install @daisu-ui/ui@0.1.0-beta.5
```

```tsx
import { Button } from '@daisu-ui/ui';
import { RouterView } from '@daisu-ui/ui/router';
```

组件入口自动加载 CSS。消费项目须具备 ReactLynx 工具链及满足 peerDependencies 的依赖，宿主引擎至少 Lynx 4.2；旧工具链需要在项目根添加 `"overrides": { "@lynx-js/tasm": "0.0.53" }`。安装后提交消费项目的 `package.json` 和 `package-lock.json`。

npm 只发布 `packages/daisu-ui` 构建的 UI 库：`dist/`、类型声明、样式、README、更新日志与许可证。不发布根 workspace、Demo、文档站、CLI/MCP、测试或 TSX 源码。

## 开发与发布分支

| 分支 | 用途 |
| --- | --- |
| `developer` | 日常组件、示例和文档开发 |
| `main` | 已验收源码；版本标签从此创建 |
| `npm-dist` | 可选的 Git 安装产物，由发布脚本维护 |

GitHub Actions 为 UI 的自动验证和 npm 发布入口；GitLab 自动发布保持关闭，GitCode 的待开通工作流已移除。

完整的 `NPM_TOKEN` Repository secret、保护分支及标签、验证和发布步骤见 [GitHub npm 发布指南](ci/git-release.md)。工作流位于 `.github/workflows/ci.yml` 与 `.github/workflows/release.yml`：developer/main 推送和 PR 仅验证，`v<组件版本>` 标签推送在完成验证后发布 npm。main 上发布配置变更会自动预演，也可在 GitHub Actions 中手动选择 main 运行发布预演；main 只执行 dry-run，不创建 npm 版本。

本地有 `github` 远程时优先校验 `github/main`，从 GitHub 直接克隆时校验 `origin/main`。发布前先将 developer 合并到 GitHub main 并验收，再推送新版本标签。GitHub 的发布密钥需在网页设置中配置，不会由 Git 推送携带。

## AI 与 MCP

AI 工具由独立的 `@daisu-ui/cli` 提供（[CLI 源码](https://github.com/DaisSu-UI/cli)，SSH：`git@github.com:DaisSu-UI/cli.git`），支持离线查询、全文搜索、项目检查、MCP 和消费端 Skill。使用方式见 [AI 总览](../apps/docs/ai/overview.md)、[CLI 工具](../apps/docs/ai/cli.md)、[MCP 接入](../apps/docs/ai/mcp.md) 与 [AI Skills](../apps/docs/ai/skills.md)。

这些接入页面由 CLI 生成并提交到本仓库。两端按 `DaiSu-UI/{daisu-ui,cli}` 同级维护且开发依赖已安装时，正常构建自动同步，文档开发服务持续监听并更新，刷新浏览器查看；无需再单独运行同步命令。单独检出 UI 时使用已保存资料构建并验证摘要，CI 只读校验。组件文档、LLM 约束、维护者 AGENTS 与 Lynx 技能仍由本仓库维护。同步与检查流程见 [独立仓库开发](ui/WORKSPACE.md)。

本机维护目录为 `/media/youzi/Project/workProject/DaiSu-UI/daisu-ui`，CLI 为同级 `cli`；工具和构建不依赖这个固定路径。CLI 推荐通过 npm install -g @daisu-ui/cli@beta 安装，也支持 Git 源码或 tarball；接入、版本选择、客户端配置及验证步骤以 AI 页面为准。

## GitHub → GitLab 自动同步

GitHub `DaisSu-UI/daisu-ui` 为主仓库，推送 main / developer 后，[同步工作流](../.github/workflows/sync-gitlab.yml) 自动将本次提交推送到 `git@git.zilueit.com:daisu-ui/daisu-ui.git` 的同名分支。可在 GitHub Actions 的 **Sync branches to GitLab** 中选择对应分支手动运行。

GitLab 项目使用专用的 `github-actions-ui-sync` Deploy Key，并允许写入；对应私钥存入本 GitHub 仓库的 Actions Repository secret `GITLAB_SSH_PRIVATE_KEY`。密钥仅供同步作业使用，临时文件权限为 0600，结束时清理。GitLab SSH 必须可从 GitHub Runner 访问。

主机公钥固定于 `.github/gitlab_known_hosts`，启用严格主机校验。服务端更换主机密钥时，先核对新指纹再更新该文件。同步采用普通分支推送；GitLab 出现独立提交导致分叉时，需要协调合并历史后重试。

同步不同步发布标签、不删除分支。npm 与文档发布继续使用 GitHub 中的现有工作流。
