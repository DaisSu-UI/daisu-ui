# Daisu UI · 袋鼠 UI

独立的 ReactLynx 组件库、组件 Demo 和 API 文档仓库。

- `packages/daisu-ui`：发布到 npm 的 `@daisu-ui/ui` 组件包，保留 JSX、类型声明及自动样式加载。
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

浏览器宿主需通过 `@daisu-ui/ui/web` 注册媒体、裁剪和二维码导出后端；Flutter 宿主能力由使用方提供。真实平台支持范围见 [媒体能力](docs/ui/MEDIA_CAPABILITIES.md)。

仅发布 `@daisu-ui/ui` workspace；Demo、文档和 MCP 均为 private。消费项目使用 npm 版本、Git 安装 Tag 或 tarball，通过公开 API 使用组件。

Git 远程：`git@git.zilueit.com:daisu-ui/daisu-ui.git`。迁移清单见 [MIGRATION.json](MIGRATION.json)。

## npm 安装

组件包名为 **`@daisu-ui/ui`**，beta 版本这样安装：

```bash
npm install @daisu-ui/ui@beta
# 固定版本，升级或回退时显式指定版本号
npm install @daisu-ui/ui@0.1.0-beta.4
```

```tsx
import { Button } from '@daisu-ui/ui';
import { RouterView } from '@daisu-ui/ui/router';
```

组件入口自动加载 CSS。消费项目须具备 ReactLynx 工具链及满足 peerDependencies 的依赖，宿主引擎至少 Lynx 4.2；旧工具链需要在项目根添加 `"overrides": { "@lynx-js/tasm": "0.0.53" }`。安装后提交消费项目的 `package.json` 和 `package-lock.json`。

npm 只发布 `packages/daisu-ui` 构建的 UI 库：`dist/`、类型声明、样式、README、更新日志与许可证。不发布根 workspace、Demo、文档站、CLI/MCP、测试或 TSX 源码。

## 开发与发布分支

| 分支 | 用途 | 操作方式 |
| --- | --- | --- |
| `developer` | 日常组件、示例、文档开发 | 功能分支合入此分支 |
| `main` | 已验收的稳定发布源码，包括 beta | 从 developer 合并，版本 Tag 在此创建 |
| `npm-dist` | 可从 Git 安装的构建产物 | 由发布脚本维护，不手工开发 |

所有发布命令都会重新读取远端 `origin/main`，拒绝发布尚未合入 main 的提交。GitLab 设置 → 仓库 → Protected branches 中保护 `main`，允许合并/推送选择 Masters；Protected tags 中保护 `v*`。现有 `npm-v*` 是 Git 安装标签，与 npmjs 的 dist-tag 不同。

## 完整发布示例

下面假设当前为 `0.1.0-beta.4`，准备下一个版本 `0.1.0-beta.5`。命令均在仓库根目录执行；已发布版本和已有标签不得覆盖。

### 1. 开发并更新版本

```bash
git switch developer
git pull --ff-only origin developer
npm ci
# 完成组件、示例和 API 文档改动
npm pkg set version=0.1.0-beta.5
npm pkg set version=0.1.0-beta.5 --workspace @daisu-ui/ui
npm pkg set 'dependencies.@daisu-ui/ui=0.1.0-beta.5' --workspace @daisu-ui/demo
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
```

在 `packages/daisu-ui/CHANGELOG.md` 顶部增加 `## 0.1.0-beta.5`、日期及具体变化。CLI 在独立仓库维护，无需同步其版本；Demo 与文档仍为 private。

### 2. 验证并提交开发分支

```bash
npm test
npm run test:git-release
npm run test:npm-release
npm run test:types
npm run build
npm run ui:check
npm run ui:pack
git diff --check
git diff
# 审核后明确添加本次涉及的文件；组件改动也一并添加
git add package.json package-lock.json packages/daisu-ui/package.json packages/daisu-ui/CHANGELOG.md apps/demo/package.json
git commit -m "chore: release @daisu-ui/ui 0.1.0-beta.5"
git push origin developer
```

`ui:check` 会安装真实 tarball 并验证类型、保留 JSX、自动 CSS 和 Lynx/Web 消费构建。这里构建 Demo、文档是验证过程，它们不进入 npm 包。

### 3. 合入 main，先验收再发版

推荐在 GitLab 创建 `developer → main` 合并请求并审核。也可以由有权限的发布负责人执行：

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git merge --no-ff origin/developer -m "release: merge developer for 0.1.0-beta.5"
git push origin main
```

等待 main 的 `verify` 流水线通过。原生能力变化还需完成对应设备回归。首次建立 main 时，由负责人在验收通过的 developer 提交上执行 `git switch -c main`、`git push -u origin main`；后续发版无需重复创建。

### 4. 推送版本标签，自动发布

一次性配置：在 GitLab 设置 → CI/CD → Secret variables 中保存 `NPM_TOKEN`，开启 **Protected**；在仓库设置中保护 `v*` 标签。Token 必须对 `@daisu-ui/ui` 有 **Read and write** 权限，并开启 **Bypass two-factor authentication (2FA)**。配置完成后，日常发布不需要再次登录 npm 或点击发布按钮，Token 到期后更换即可。

Token 在 npm 网站头像菜单 → Access Tokens → Generate New Token → Granular Access Token 中创建。名称可填 `daisu-ui-publish`；Packages and scopes 授权 `@daisu-ui` 范围。Token 仅显示一次，复制到 GitLab 的 `NPM_TOKEN` 并保存，不提交到仓库。SSH 密钥与 npm 发布 Token 分别配置。

在已验收的 main 提交创建版本 Tag，Tag 必须与组件包版本一致。先执行 `git ls-remote`，确认远端没有同名标签：

```bash
git switch main
git pull --ff-only origin main
git ls-remote --tags origin 'refs/tags/v0.1.0-beta.5'
git tag -a v0.1.0-beta.5 -m "Daisu UI 0.1.0-beta.5"
git push origin refs/tags/v0.1.0-beta.5
```

推送后打开 GitLab → CI/CD → 流水线，选择引用为 `v0.1.0-beta.5` 的流水线。流程自动执行：

| 任务 | 行为 |
| --- | --- |
| `verify` | 检查版本与远端 main 来源，运行测试、类型检查、构建和独立包校验，准备 UI 发布产物 |
| `publish:git` | verify 成功后自动更新 `npm-dist` 和 `npm-v<版本>` |
| `publish:npm` | verify 成功后自动使用 `NPM_TOKEN` 发布 `@daisu-ui/ui` |

三个任务成功后，再核对 npm 实际版本：

```bash
npm view @daisu-ui/ui@0.1.0-beta.5 version dist.integrity --registry=https://registry.npmjs.org/
npm view @daisu-ui/ui dist-tags --json --registry=https://registry.npmjs.org/
```

普通推送 developer 或 main 只执行校验，只有版本标签触发发布。beta 版本自动发布到 `beta` 渠道，正式版本如 `0.1.0` 发布到 `latest`；Demo、文档应用和 CLI 不进入 npm 包。

首次发布可能被 npm 放入分阶段审核：网页显示 `0.0.0-stage` / Temporary Holding Version 时，表示实际版本已提交但尚未公开。等待 npm 审核完成后，再核对版本、README 和安装结果，不重复发布。

**备用：本地发布。** Runner 离线时，可在已合入远端 main 的干净源码上执行：

```bash
npm ci
npm login --registry=https://registry.npmjs.org/ --auth-type=web
npm run ui:npm:release -- --dry-run
npm run ui:npm:publish
```

本地发布成功后，不再推送同版本的源码 Tag，避免自动 npm 任务重复发布；需要 Git 分发时，单独运行 `npm run ui:git:release`。若自动流程中 npm 已成功而 Git 任务失败，仅重试失败的 Git 任务。源码或版本发生变化后重新验证并使用新版本，不覆盖既有标签或 npm 版本。

### 5. 消费端升级、回退及继续开发

```bash
# 在消费项目执行
npm install @daisu-ui/ui@0.1.0-beta.5
# 需要回退时
npm install @daisu-ui/ui@0.1.0-beta.4
# 跟随当前 beta（仍需提交更新后的锁文件）
npm install @daisu-ui/ui@beta
```

发布完成后回到组件库，把 main 的合并记录同步回开发分支，再继续开发：

```bash
git switch developer
git pull --ff-only origin developer
git merge origin/main
git push origin developer
```

## 可选：Git 仓库分发

需要仅通过自有 GitLab 安装时，Tag 流水线的 `publish:git` 生成 `npm-dist` 和 `npm-v<版本>`。先确认安装标签存在，再安装：

```bash
git ls-remote --tags origin 'refs/tags/npm-v0.1.0-beta.5*'
npm install '@daisu-ui/ui@git+ssh://git@git.zilueit.com/daisu-ui/daisu-ui.git#npm-v0.1.0-beta.5'
```

安装方需具备仓库 SSH 读取权限。本地 Git 发布可先运行 `npm run ui:git:release -- --dry-run`，确认后执行 `npm run ui:git:release`，同样要求源码已进入远端 main。

GitLab 配置和重试说明见 [版本发布说明](docs/ci/git-release.md)，Runner 启停见 [Runner 维护说明](docs/ci/local-runner.md)。UI npm 发布与业务 Lynx Bundle / Manifest、Demo 和文档站部署分别执行。

## AI 与 MCP

安装依赖后执行 `npm run mcp` 可启动本地 stdio 服务；客户端直接使用 `node` 加 `apps/mcp/index.mjs` 的绝对路径连接。提供组件列表、组件文档、Demo 源码、全文搜索和更新记录五个工具。完整 JSON、VS Code 和 Codex 配置见 [MCP 接入](apps/docs/ai/mcp.md)，总览见 [AI 使用指南](docs/ui/AI_GUIDE.md)。`npm run test:mcp` 验证真实客户端连接，`npm test` 包含该测试。MCP workspace 为 private，随仓库使用。
