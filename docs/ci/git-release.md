# 版本发布与 Git 安装

Daisu UI 通过自己的 GitLab 仓库分发组件包，消费项目仍用 npm 安装、记录依赖和锁文件。当前已完成 `0.1.0-beta.2` 自动发布，[流水线 #1792](https://git.zilueit.com/daisu-ui/daisu-ui/pipelines/1792) 的校验和发布任务均通过，也已验证远端安装、类型检查以及 Lynx 4.2 / Web 消费构建。

## 发布约定

| 名称 | 示例 | 用途 |
| --- | --- | --- |
| 源码分支 | `developer` | 维护组件、示例、文档和构建脚本 |
| 源码版本 Tag | `v0.1.0-beta.3` | 发布负责人创建，触发版本校验和自动发布 |
| 产物分支 | `npm-dist` | 流水线维护，根目录为可安装的组件包及 `dist` |
| 安装版本 Tag | `npm-v0.1.0-beta.3` | 流水线创建，消费项目固定使用此版本 |

源码保留 monorepo 结构，实际库位于 `packages/daisu-ui`。安装 Tag 指向整理后的组件包提交，包含保留 JSX 的 ESM、类型声明和 CSS；安装时无需构建库源码。`apps/demo`、`apps/docs`、`apps/mcp` 均为 private，不随组件包发布。本流程不调用 `npm publish`，无需 npmjs 账号或 Token。

## 日常自动发布

下面以准备下一个版本 `0.1.0-beta.3` 为例。`0.1.0-beta.2` 已发布，后续使用新的版本号，不覆盖已有标签。

### 1. 同步源码并完成开发

在仓库根目录执行：

```bash
git switch developer
git pull --ff-only origin developer
npm ci
```

完成并提交本次组件、示例和文档改动。功能改动可先运行 `npm test`、`npm run test:types`、`npm run build`；涉及包入口、依赖或打包配置时，再运行 `npm run ui:check` 和 `npm run ui:pack` 验证真实包消费。

### 2. 更新版本及锁文件

```bash
npm pkg set version=0.1.0-beta.3
npm pkg set version=0.1.0-beta.3 --workspace daisu-ui --workspace @daisu-ui/mcp
npm pkg set 'dependencies.daisu-ui=0.1.0-beta.3' --workspace @daisu-ui/demo
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
```

这些命令同步根 workspace、组件包、私有 MCP 工作区和 Demo 引用，不会发布 MCP，也不会自动创建 Git 标签。核对以下文件的版本及引用一致：

- `package.json`
- `packages/daisu-ui/package.json`
- `apps/demo/package.json`
- `apps/mcp/package.json`
- `package-lock.json`

在 `packages/daisu-ui/CHANGELOG.md` 顶部增加新版本标题、日期、具体变更和兼容性说明。文档站的版本菜单依据该文件生成，当前组件包版本必须有对应的更新日志标题。安装示例需要更新时，同步 README 和集成说明。

### 3. 提交版本并推送源码 Tag

先检查远端是否已有同名版本，命令无输出才表示对应远端标签不存在：

```bash
git ls-remote --tags origin 'refs/tags/v0.1.0-beta.3' 'refs/tags/npm-v0.1.0-beta.3'
git diff --check
git diff
git add package.json package-lock.json packages/daisu-ui/package.json packages/daisu-ui/CHANGELOG.md apps/demo/package.json apps/mcp/package.json
git commit -m "chore: release 0.1.0-beta.3"
git status --short
```

版本提交后工作区应干净；如果同步修改了其他说明文件，也应审核并提交。再创建和推送标签：

```bash
git tag -a v0.1.0-beta.3 -m "Daisu UI 0.1.0-beta.3"
git push --atomic origin developer refs/tags/v0.1.0-beta.3
```

源码 Tag 必须严格等于组件包版本加 `v` 前缀。`v*` 受保护，只有 GitLab 的 Masters 角色可以创建。`--atomic` 确保分支和标签一起推送成功；若被拒绝，先解决权限或分支冲突，再检查远端状态。

### 4. 查看版本流水线

打开项目的 [CI/CD → 流水线](https://git.zilueit.com/daisu-ui/daisu-ui/pipelines)，选择引用为 `v0.1.0-beta.3` 的流水线，确认下面两个任务成功：

| 任务 | 执行内容 |
| --- | --- |
| `verify` | 安装锁定依赖，运行组件/Demo/MCP 测试、Git 发布集成测试、类型检查、Demo/文档构建、独立 tarball 消费校验和打包，准备 Git 安装产物 |
| `publish:git` | 使用 CI 变量中的 SSH 凭据，将产物推送至 `npm-dist`，创建对应 `npm-v*` 安装标签 |

一次推送分支和 Tag 可能产生两条流水线：`developer` 只执行校验，源码版本 Tag 的流水线还会执行发布。当前 Runner 每次运行一个任务，排队时可能显示“等待中”或等待前一阶段，查看 Tag 对应的流水线判断发版结果。

`verify` 的工件保留一周，包括 `artifacts/daisu-ui-<版本>.tgz` 和 `artifacts/git-package/`。安装版本长期保留在 Git Tag 中，不依赖流水线工件的有效期。产物分支和安装标签不会再次运行源码流水线。

### 5. 确认发布完成

两个任务均成功后，检查安装标签：

```bash
git ls-remote --heads --tags origin 'refs/heads/npm-dist' 'refs/tags/npm-v0.1.0-beta.3*'
```

然后在消费项目安装该版本，并执行消费项目自己的测试、类型检查和构建。首次接入、依赖或打包方式变化时，建议用全新的临时项目验证，避免本地 workspace 或已有安装缓存掩盖问题。

## 消费项目安装、升级与回退

当前已发布并验证的版本可这样安装：

```bash
npm install "git+ssh://git@git.zilueit.com/daisu-ui/daisu-ui.git#npm-v0.1.0-beta.2"
```

新版本发布成功后，显式安装新的 Tag：

```bash
npm install "git+ssh://git@git.zilueit.com/daisu-ui/daisu-ui.git#npm-v0.1.0-beta.3"
```

提交消费项目的 `package.json` 和 `package-lock.json`。依赖已固定到具体 Tag，普通 `npm install` 或 `npm ci` 会继续安装锁定的版本；升级时需要明确更换 Tag。需要回退时，重新安装此前验证过的安装 Tag，再提交依赖和锁文件；已发布的标签不移动、不删除重建。

安装端需要仓库读取权限、Git 和 SSH。继续使用 `import { Button } from 'daisu-ui'`、`daisu-ui/router`、`daisu-ui/utils` 和 `daisu-ui/web` 等公开入口，组件入口自动加载 CSS。消费项目需要 ReactLynx 工具链、满足包的 `peerDependencies`，原生引擎至少为 Lynx 4.2。当前构建插件仍内置旧编译器时，在消费项目根配置 `"overrides": { "@lynx-js/tasm": "0.0.53" }` 并更新锁文件。

本流程发布组件包；组件 Demo、文档站的线上部署，以及业务 Lynx Bundle / Manifest 的发布，由各自工程单独执行。

## 本地发布与预演

Runner 离线时，可在有仓库推送权限的开发电脑执行与 CI 相同的校验和发布。先更新版本、更新日志和锁文件，提交全部待发布源码并确认工作区干净：

```bash
npm ci
npm run ui:git:release -- --dry-run
```

该命令运行完整校验并检查远端推送条件，不写入远端。确认后执行实际发布：

```bash
npm run ui:git:release
```

本地发布使用开发电脑现有的 Git SSH 权限，推送 `npm-dist` 和安装 Tag，不会替你推送源码分支或创建源码 Tag。同一版本选择自动或本地其中一种发布方式，避免双方同时创建同名安装标签。

需要分别准备产物、检查推送条件时，也可使用：

```bash
npm run ui:git:prepare
npm run ui:git:publish -- --dry-run
```

这两个命令只构建并检查产物，不替代完整测试。准备之后若源码提交或版本号发生变化，必须重新校验和生成产物；发布脚本会拒绝过期产物。

## 已完成的一次性配置

当前 GitLab 为 10.5.2，本地 Runner 为 11.11.2，构建镜像为 `node:24-bookworm`。Runner 部署在 `youzi-PC`，详情和启停命令见 [本地 Runner 维护说明](https://git.zilueit.com/daisu-ui/daisu-ui/blob/developer/docs/ci/local-runner.md)。电脑关机、休眠或 Docker 停止期间，任务会等待。

GitLab 前台保留以下配置；迁移 Runner 或更换密钥时按此核对：

1. **设置 → CI/CD**：关闭 Auto DevOps，自定义 CI 路径为 `.gitlab-ci.yml`。不需要流水线触发器或 Kubernetes。
2. **设置 → CI/CD → Secret variables（秘密变量）**：配置下表变量，两项都开启 **Protected**，点击 **Save variables**。该栏目在旧版页面的 Runners 设置下面、流水线触发器上面。
3. **设置 → 仓库 → Protected Tags（受保护标签）**：保护 `v*`，允许创建选择 **Masters**，点击 **保护**。
4. Runner 锁定本项目、允许无标签任务，并保持在线。Compose 配置只引用 Docker 配置卷，认证文件不提交到仓库。

| 变量 | 值 |
| --- | --- |
| `GIT_RELEASE_SSH_KEY` | 对当前仓库有写权限的完整 SSH 私钥，保留 BEGIN/END 行和换行；需能在 CI 中非交互使用 |
| `GIT_RELEASE_KNOWN_HOSTS` | 已核验的 GitLab SSH 主机公钥记录，使用对应主机的完整 known_hosts 行 |
| `GIT_RELEASE_REMOTE` | 可选；SSH 地址与网页地址不同时填写实际 SSH 仓库地址 |

可以复用已具备仓库权限的 SSH 密钥，也可以使用本项目专用的可写部署密钥。私钥放入 CI 变量，公钥由 GitLab 的账号 SSH 密钥或项目部署密钥授权；GitLab 公钥页面不保存私钥。受保护变量可供受保护分支或标签读取，版本发布脚本还会校验源码 Tag 与组件包版本一致。Runner 注册令牌用于注册执行机器，与仓库推送密钥分别配置。说明和仓库中不保存实际密钥值。

## 失败与重试

| 现象 | 处理方式 |
| --- | --- |
| 一直“等待中” | 查看 Runner 是否在线或暂停、本机 Docker 是否运行；并发为 1 时等待其他任务完成。已失败或取消的历史任务需手动重试 |
| `verify` 失败 | 查看首个失败命令。网络等临时问题可重试；需要修改源码时，修复后使用新的版本提交和新的版本 Tag |
| 提示缺少 `GIT_RELEASE_SSH_KEY` | 核对变量是否保存、变量名是否正确，源码 Tag 是否匹配受保护的 `v*`；开启 Protected 的变量只提供给受保护引用 |
| SSH 无法读取密钥或权限被拒绝 | 检查私钥内容与换行、非交互使用条件、对应公钥的仓库写权限；不在日志中打印变量值 |
| 主机公钥校验失败 | 核对 `GIT_RELEASE_KNOWN_HOSTS` 与 GitLab 实际 SSH 主机记录，确认后更新变量 |
| 源码 Tag 与组件包版本不一致 | 核对 `packages/daisu-ui/package.json` 和 `v<版本>`；修正版本并使用新的版本 Tag |
| `npm-v<版本>` 已存在 | 先检查远端安装标签及产物，确认是否已发布；不要强推覆盖，下一次发布使用新版本号 |
| 产物版本或源码已过期 | 在当前已提交的源码上重新运行完整校验与产物准备，再发布 |

纯配置或网络问题修复后，可在 Tag 对应流水线中重试失败任务；若源码发生变化，发布新版本，不移动已有版本标签。发布任务需要上游 `verify` 工件，超过一周后应重新运行该 Tag 的校验任务以生成工件，再重试发布。若此前已经成功创建安装标签，先核对发布状态，避免重复发布同一版本。
