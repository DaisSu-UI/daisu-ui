# 版本发布与 npm / Git 安装

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

GitLab 配置和重试说明见 [版本发布说明](git-release.md)，Runner 启停见 [Runner 维护说明](local-runner.md)。UI npm 发布与业务 Lynx Bundle / Manifest、Demo 和文档站部署分别执行。

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
| `NPM_TOKEN` | npm 生成的具有 `@daisu-ui/ui` 写权限的发布 Token；仅使用 GitLab 的手动 npm 任务时需要，本地登录发布无需配置此变量 |
| `GIT_RELEASE_REMOTE` | 可选；SSH 地址与网页地址不同时填写实际 SSH 仓库地址 |

可以复用已具备仓库权限的 SSH 密钥，也可以使用本项目专用的可写部署密钥。私钥放入 CI 变量，公钥由 GitLab 的账号 SSH 密钥或项目部署密钥授权；GitLab 公钥页面不保存私钥。受保护变量可供受保护分支或标签读取，版本发布脚本还会校验源码 Tag 与组件包版本一致。Runner 注册令牌用于注册执行机器，与仓库推送密钥分别配置。说明和仓库中不保存实际密钥值。

## 失败与重试

| 现象 | 处理方式 |
| --- | --- |
| npm 提示 EOTP 或浏览器验证 | 按 npm 官方交互完成认证；CI 使用满足当前 npm 策略的发布 Token |
| npm 提示同版本已存在 | 用 npm view 核对版本；已经本地发布时不要再次点击同版本 npm 任务，后续改用新版本 |
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
