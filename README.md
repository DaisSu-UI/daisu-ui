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
npm install @daisu-ui/ui@0.1.0-beta.3
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

下面假设当前为 `0.1.0-beta.3`，准备下一个版本 `0.1.0-beta.4`。命令均在仓库根目录执行；已发布版本和已有标签不得覆盖。

### 1. 开发并更新版本

```bash
git switch developer
git pull --ff-only origin developer
npm ci
# 完成组件、示例和 API 文档改动
npm pkg set version=0.1.0-beta.4
npm pkg set version=0.1.0-beta.4 --workspace @daisu-ui/ui
npm pkg set 'dependencies.@daisu-ui/ui=0.1.0-beta.4' --workspace @daisu-ui/demo
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
```

在 `packages/daisu-ui/CHANGELOG.md` 顶部增加 `## 0.1.0-beta.4`、日期及具体变化。CLI 在独立仓库维护，无需同步其版本；Demo 与文档仍为 private。

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
git commit -m "chore: release @daisu-ui/ui 0.1.0-beta.4"
git push origin developer
```

`ui:check` 会安装真实 tarball 并验证类型、保留 JSX、自动 CSS 和 Lynx/Web 消费构建。这里构建 Demo、文档是验证过程，它们不进入 npm 包。

### 3. 合入 main，先验收再发版

推荐在 GitLab 创建 `developer → main` 合并请求并审核。也可以由有权限的发布负责人执行：

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git merge --no-ff origin/developer -m "release: merge developer for 0.1.0-beta.4"
git push origin main
```

等待 main 的 `verify` 流水线通过。原生能力变化还需完成对应设备回归。首次建立 main 时，由负责人在验收通过的 developer 提交上执行 `git switch -c main`、`git push -u origin main`；后续发版无需重复创建。

### 4. 选择一种 npm 发布方式

**本地发布（已登录 npm 的电脑）：**

```bash
git switch main
git pull --ff-only origin main
npm ci
npm login --registry=https://registry.npmjs.org/ --auth-type=web
npm whoami --registry=https://registry.npmjs.org/
# 全量校验、准备产物并预演，不写入 npm
npm run ui:npm:release -- --dry-run
# 发布刚才准备的同一份产物；需要时按 npm 提示完成双重验证
npm run ui:npm:publish
npm view @daisu-ui/ui@0.1.0-beta.4 version dist.integrity --registry=https://registry.npmjs.org/
npm view @daisu-ui/ui dist-tags --json --registry=https://registry.npmjs.org/
```

发布前工作区必须干净，源码/版本改变后重新运行完整预演。预发布版本默认走 `beta`，不会更新 `latest`；正式版如 `0.1.0` 默认走 `latest`。也可用 `npm run ui:npm:publish -- --tag next` 指定渠道；脚本禁止将预发布版本放入 `latest`。正式版尚未发布时，消费者应显式安装 `@beta` 或版本号。

**GitLab 发布（不在本地执行实际 publish）：**

在 GitLab 设置 → CI/CD → Secret variables 配置受保护的 `NPM_TOKEN`，使用 npm 网站 Access Tokens 中对 `@daisu-ui/ui` 有写权限、满足当前 npm 双重验证策略的 Token。不要提交 Token，也不要把 SSH 密钥当作 npm Token。然后在已验收的 main 提交创建版本 Tag：

```bash
git ls-remote --tags origin 'refs/tags/v0.1.0-beta.4'
git tag -a v0.1.0-beta.4 -m "Daisu UI 0.1.0-beta.4"
git push origin refs/tags/v0.1.0-beta.4
```

Tag 流水线先运行 `verify`，自动执行 `publish:git`；npm 任务为手动门禁，在同一流水线点击 `publish:npm` 的播放按钮，成功后再核对上面的 `npm view` 命令。不需要流水线触发器或 Auto DevOps。

选择本地 npm 发布后，同样可创建源码 Tag 生成 Git 安装产物，**不要再运行同版本的 `publish:npm` 任务**。npm 不允许覆盖已发布版本；如果 npm 已发布而 Git 任务失败，仅重试失败的 Git 任务。

### 5. 消费端升级、回退及继续开发

```bash
# 在消费项目执行
npm install @daisu-ui/ui@0.1.0-beta.4
# 需要回退时
npm install @daisu-ui/ui@0.1.0-beta.3
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
git ls-remote --tags origin 'refs/tags/npm-v0.1.0-beta.4*'
npm install '@daisu-ui/ui@git+ssh://git@git.zilueit.com/daisu-ui/daisu-ui.git#npm-v0.1.0-beta.4'
```

安装方需具备仓库 SSH 读取权限。本地 Git 发布可先运行 `npm run ui:git:release -- --dry-run`，确认后执行 `npm run ui:git:release`，同样要求源码已进入远端 main。

GitLab 配置和重试说明见 [版本发布说明](docs/ci/git-release.md)，Runner 启停见 [Runner 维护说明](docs/ci/local-runner.md)。UI npm 发布与业务 Lynx Bundle / Manifest、Demo 和文档站部署分别执行。

## AI 与 MCP

安装依赖后执行 `npm run mcp` 可启动本地 stdio 服务；客户端直接使用 `node` 加 `apps/mcp/index.mjs` 的绝对路径连接。提供组件列表、组件文档、Demo 源码、全文搜索和更新记录五个工具。完整 JSON、VS Code 和 Codex 配置见 [MCP 接入](apps/docs/ai/mcp.md)，总览见 [AI 使用指南](docs/ui/AI_GUIDE.md)。`npm run test:mcp` 验证真实客户端连接，`npm test` 包含该测试。MCP workspace 为 private，随仓库使用。
