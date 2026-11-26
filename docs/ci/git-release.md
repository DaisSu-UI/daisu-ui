# GitCode npm 发布与 Git 安装

UI 的 GitCode npm 发布工作流已准备，位于 `.gitcode/workflows/release.yml`，但需要平台开通 Actions 后才能实际运行。目标仓库为 [daisu/ui](https://gitcode.com/daisu/ui)。GitLab 保留验证流水线，已移除 npm 和 Git 产物自动发布任务；发布脚本也拒绝在 GitLab CI 中执行发布。

## GitCode Actions 开通前提

GitCode 官方文档目前将 Actions 列为需要申请开通的内测功能。没有“流水线 / Actions”入口时，应先联系 GitCode 客服申请；提交工作流文件不会自动获得权限。本文描述仓库中的接入配置，平台端开通和密钥配置完成后才能执行。

- [官方快速开始](https://docs.gitcode.com/docs/help/home/org_project/pipeline/quick-start)
- [工作流目录与基本结构](https://docs.gitcode.com/docs/help/home/org_project/pipeline/writing-pipelines/workflow-file-location-structure)
- [仓库密钥管理](https://docs.gitcode.com/docs/help/home/org_project/pipeline/security-permissions/using-secrets)

## 分支与触发条件

| 分支或标签 | 用途 | GitCode 行为 |
| --- | --- | --- |
| `developer` | 日常组件、示例和文档开发 | 自动验证，不发布 npm |
| `main` | 已验收源码和发布配置 | 自动验证，不发布 npm |
| `v<组件版本>` | 指向已进入 main 的源码提交 | 重新验证并发布 npm |
| `npm-dist` / `npm-v<版本>` | 可选的 Git 安装产物 | 不由 npm 工作流创建 |

`.gitcode/workflows/ci.yml` 处理 developer/main 推送、对应 PR 和手动验证；`.gitcode/workflows/release.yml` 只处理 `v*` 标签推送。自动发布进一步核对仓库必须为 `daisu/ui`、事件必须为标签 push、标签必须等于组件包版本、触发 SHA 必须等于当前源码、源码必须已进入远端 main。

本地同时有 `gitcode` 和 `origin` 时，发布来源优先检查 `gitcode/main`。GitCode 的干净克隆通常将 GitCode 命名为 `origin`，此时检查 `origin/main`。特殊环境可显式设置 `RELEASE_SOURCE_REMOTE=<远程名称>`；不会仅信任本地跟踪引用，而是重新 fetch 远端 main。

## 平台端一次性配置

1. 申请开通 GitCode Actions 后，在“项目设置 → 基础设置 → Actions 权限控制”启用项目 Actions，并确认有可用托管 Runner。
2. 在“项目设置 → 密钥与变量 → 仓库密钥”保存 `NPM_TOKEN`。使用对 `@daisu-ui/ui` 有发布权限的 npm Granular Access Token；无人值守发布需满足 npm 当前 2FA 策略。Token 不提交到 Git，不在聊天或日志中输出。
3. 保护 `main` 分支和 `v*` 标签，只允许发布负责人合并、创建版本标签。npm 密钥仅在发布步骤通过 `${{ secrets.NPM_TOKEN }}` 注入；普通验证步骤不接收该密钥。
4. 在 GitCode 的“流水线 / Actions”页面手动运行 `UI validation`，确认依赖安装、测试、类型检查、构建和独立包校验全部通过，再进行新版本发布。

工作流使用官方 `checkout`、`setup-node`、`upload-artifact` 插件，Node.js 24，以及 `[ubuntu-latest, x64, medium]` 托管 Runner。发布串行排队，每次重新生成并校验 npm tarball；beta 版本使用 `beta` dist-tag，正式版本使用 `latest`。

## 日常开发与版本发布

以下命令在仓库根目录执行，假设第二个远程名为 `gitcode`。若从 GitCode 直接克隆且远程名为 `origin`，替换下面的远程名称。

### 1. 完成开发并升级版本

```bash
git switch developer
git pull --ff-only gitcode developer
npm ci
# 按下一次实际发布版本调整三处版本；不能复用已发布版本。
npm pkg set version=0.1.0-beta.5
npm pkg set version=0.1.0-beta.5 --workspace @daisu-ui/ui
npm pkg set 'dependencies.@daisu-ui/ui=0.1.0-beta.5' --workspace @daisu-ui/demo
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
```

更新 `packages/daisu-ui/CHANGELOG.md`，完成组件、示例和文档变更，再执行验证：

```bash
npm test
node --test scripts/release-environment.test.mjs scripts/git-release.test.mjs scripts/npm-release.test.mjs
npm run test:types
npm run build
npm run ui:check
npm run ui:pack
git diff --check
# 明确添加本次变更文件并提交。
git push gitcode developer
```

### 2. 合并到 main

在 GitCode 发起 `developer → main` 的 Pull Request，检查并合并。原生能力变更仍需在目标设备完成验收，H5 验证不能替代真机验证。

普通 developer/main 推送不发布 npm。等待 main 的 `UI validation` 成功后，再在 main 上创建新版本标签。

### 3. 推送版本标签

```bash
git fetch gitcode
git switch main
git pull --ff-only gitcode main
# 应无输出：同名标签不能复用或覆盖。
git ls-remote --tags gitcode 'refs/tags/v0.1.0-beta.5*'
git tag -a v0.1.0-beta.5 -m 'Daisu UI 0.1.0-beta.5'
git push gitcode refs/tags/v0.1.0-beta.5
```

GitCode 的 `Publish UI to npm` 工作流执行：版本及 main 来源校验 → 安装依赖 → 发布脚本测试 → 组件测试 → 类型检查 → Demo/文档构建 → 独立 UI 包校验 → 打包及完整性校验 → 发布 `@daisu-ui/ui`。

npm 包只包含 UI 库 ESM、保留 JSX 的组件、类型、样式、README、更新日志和许可证。根 workspace、Demo、文档站、CLI/MCP 和测试不进入 npm 包。发布归档与 `npm-release.json` 保存七天。

### 4. 核对 npm 结果

```bash
npm view @daisu-ui/ui@0.1.0-beta.5 version dist.integrity --registry=https://registry.npmjs.org/
npm view @daisu-ui/ui dist-tags --json --registry=https://registry.npmjs.org/
```

需要安装或回退时，在消费项目显式安装目标版本并提交锁文件。UI 和 CLI 是独立包；此工作流只发布 `@daisu-ui/ui`。

## Actions 尚未开通时

仅推送 GitCode 分支或标签不会绕过 Actions 开通要求，不能据此认定已完成自动发布。申请期间可在已验收、已提交且进入 GitCode main 的干净源码上手动发布：

```bash
npm ci
npm login --registry=https://registry.npmjs.org/ --auth-type=web
npm run ui:npm:release -- --dry-run
npm run ui:npm:publish
```

从现有双远程工作区执行时，脚本自动优先使用 `gitcode/main`。Token 或已登录 npm 账号的权限仍需满足 npm 发布要求。手动发布成功后不要再推送同版本标签触发自动发布；后续自动发布使用新版本。

## 可选：Git 安装产物

npm 发布不依赖 `npm-dist`。需要通过 Git 安装构建产物时，在干净源码上单独运行：

```bash
npm run ui:git:release -- --dry-run
npm run ui:git:release
```

默认推送到发布来源使用的远程：双远程工作区使用 `gitcode`，GitCode 直接克隆使用 `origin`。该操作创建 `npm-dist` 和 `npm-v<组件版本>`，需要仓库写权限，不覆盖现有安装标签。

## GitLab 的保留范围

GitLab `.gitlab-ci.yml` 保留验证，不再包含 `publish:npm` 和 `publish:git` 自动任务。新的发布脚本拒绝 GitLab CI 发布；未来发布版本标签只推送 GitCode。现有文档部署任务与本地 Runner 不因 npm 发布迁移而删除，Runner 维护见 [本地 Runner 说明](local-runner.md)。

历史版本标签的旧配置不会被改写；不要重跑历史标签中的旧发布任务。历史标签和已发布 npm 版本也不作覆盖或重打。

## 失败与重试

| 现象 | 处理方式 |
| --- | --- |
| 看不到 Actions 或推送后无流水线 | 先核对内测开通和项目 Actions 权限，不是增加分支即可解决 |
| 缺少 `NPM_TOKEN` | 在 GitCode 仓库密钥中配置，并核对密钥权限和有效期 |
| npm 提示 EOTP / 无发布权限 | 核对 npm Token 的包权限和当前 2FA 策略 |
| 源码不在 main | 先合并到 GitCode main 并验收，再推送对应版本标签 |
| 组件版本与标签不符 | 修正版本并使用新的标签，不覆盖已有标签 |
| SHA 或归档完整性不符 | 重新从当前源码验证、构建、打包，不复用旧产物 |
| npm 版本已存在 | 先核对 npm 实际发布结果，不重复发布成功版本 |
| 网络或平台临时错误 | 确认 npm 尚未发布成功后重试失败流水线 |
| 源码需要修复 | 提交修复、升级版本，重新合并 main 并创建新版本标签 |
