# 版本发布与 npm / Git 安装

## 当前 npm 发布状态

以下版本已在 npmjs 公开发布（2026-11-25 核对），新项目优先使用 npm 安装。组件库与 CLI 是两个独立包，分别升级和发布。

| npm 包 | 已发布版本 | beta 标签 | 用途 |
| --- | --- | --- | --- |
| [@daisu-ui/ui](https://www.npmjs.com/package/@daisu-ui/ui) | 0.1.0-beta.4 | 0.1.0-beta.4 | ReactLynx 运行时组件依赖 |
| [@daisu-ui/cli](https://www.npmjs.com/package/@daisu-ui/cli) | 0.1.0-beta.3 | 0.1.0-beta.3 | API 查询、MCP 和 Agent 开发工具 |

注册表当前 latest 也指向上述 beta 版本；预发布仍建议显式使用 @beta 或精确版本。dist-tag 会变化，使用 npm view <包名> dist-tags --json 核对；历史 0.0.0-stage 是首次审核占位，不作为组件或 CLI 的安装目标。

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

下面假设当前为 `0.1.0-beta.5`，准备下一个版本 `0.1.0-beta.5`。命令均在仓库根目录执行；已发布版本和已有标签不得覆盖。

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
npm install @daisu-ui/ui@0.1.0-beta.5
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

Runner 启停见 [Runner 维护说明](local-runner.md)。CLI 的安装与 MCP 接入见 [AI 总览](#/ai-guide)，CLI 的 npm 包在独立仓库发布，UI 发布流水线不会自动发布 CLI。UI npm 发布与业务 Lynx Bundle / Manifest、Demo 和文档站部署分别执行。

## 已完成的一次性配置

当前 GitLab 为 10.5.2，本地 Runner 为 11.11.2，构建镜像为 `node:24-bookworm`。Runner 部署在 `youzi-PC`，详情和启停命令见 [本地 Runner 维护说明](https://git.zilueit.com/daisu-ui/daisu-ui/blob/developer/docs/ci/local-runner.md)。电脑关机、休眠或 Docker 停止期间，任务会等待。

GitLab 前台保留以下配置；迁移 Runner 或更换密钥时按此核对：

1. **设置 → CI/CD**：关闭 Auto DevOps，自定义 CI 路径为 `.gitlab-ci.yml`。不需要流水线触发器或 Kubernetes。
2. **设置 → CI/CD → Secret variables（秘密变量）**：配置下表变量，发布凭据均开启 **Protected**，点击 **Save variables**。该栏目在旧版页面的 Runners 设置下面、流水线触发器上面。
3. **设置 → 仓库 → Protected branches**：保护 `main`，合并与推送权限选择 **Masters**。**Protected Tags（受保护标签）**：保护 `v*`，允许创建选择 **Masters**，点击 **保护**。
4. Runner 锁定本项目、允许无标签任务，并保持在线。Compose 配置只引用 Docker 配置卷，认证文件不提交到仓库。

| 变量 | 值 |
| --- | --- |
| `GIT_RELEASE_SSH_KEY` | 对当前仓库有写权限的完整 SSH 私钥，保留 BEGIN/END 行和换行；需能在 CI 中非交互使用 |
| `GIT_RELEASE_KNOWN_HOSTS` | 已核验的 GitLab SSH 主机公钥记录，使用对应主机的完整 known_hosts 行 |
| `NPM_TOKEN` | npm 生成的具有 `@daisu-ui/ui` 写权限的发布 Token；GitLab 自动发布 npm 时需要，本地登录发布无需配置此变量 |
| `GIT_RELEASE_REMOTE` | 可选；SSH 地址与网页地址不同时填写实际 SSH 仓库地址 |

可以复用已具备仓库权限的 SSH 密钥，也可以使用本项目专用的可写部署密钥。私钥放入 CI 变量，公钥由 GitLab 的账号 SSH 密钥或项目部署密钥授权；GitLab 公钥页面不保存私钥。受保护变量可供受保护分支或标签读取，版本发布脚本还会校验源码 Tag 与组件包版本一致。Runner 注册令牌用于注册执行机器，与仓库推送密钥分别配置。说明和仓库中不保存实际密钥值。

## 失败与重试

| 现象 | 处理方式 |
| --- | --- |
| npm 提示 EOTP 或浏览器验证 | 按 npm 官方交互完成认证；CI 使用满足当前 npm 策略的发布 Token |
| npm 提示同版本已存在 | 用 npm view 核对版本；同一版本发布成功后不要重试成功的 npm 任务；本地发布后不推送同版本源码 Tag，后续改用新版本 |
| 来源不在 origin/main | 先将 developer 合入远端 main 并验收，再创建新版本 Tag |
| 一直“等待中” | 查看 Runner 是否在线或暂停、本机 Docker 是否运行；并发为 1 时等待其他任务完成。已失败或取消的历史任务需手动重试 |
| `verify` 失败 | 查看首个失败命令。网络等临时问题可重试；需要修改源码时，修复后使用新的版本提交和新的版本 Tag |
| 提示缺少 `GIT_RELEASE_SSH_KEY` | 核对变量是否保存、变量名是否正确，源码 Tag 是否匹配受保护的 `v*`；开启 Protected 的变量只提供给受保护引用 |
| SSH 无法读取密钥或权限被拒绝 | 检查私钥内容与换行、非交互使用条件、对应公钥的仓库写权限；不在日志中打印变量值 |
| 主机公钥校验失败 | 核对 `GIT_RELEASE_KNOWN_HOSTS` 与 GitLab 实际 SSH 主机记录，确认后更新变量 |
| 源码 Tag 与组件包版本不一致 | 核对 `packages/daisu-ui/package.json` 和 `v<版本>`；修正版本并使用新的版本 Tag |
| `npm-v<版本>` 已存在 | 先检查远端安装标签及产物，确认是否已发布；不要强推覆盖，下一次发布使用新版本号 |
| 产物版本或源码已过期 | 在当前已提交的源码上重新运行完整校验与产物准备，再发布 |

纯配置或网络问题修复后，可在 Tag 对应流水线中重试失败任务；若源码发生变化，发布新版本，不移动已有版本标签。发布任务需要上游 `verify` 工件，超过一周后应重新运行该 Tag 的校验任务以生成工件，再重试发布。若此前已经成功创建安装标签，先核对发布状态，避免重复发布同一版本。
