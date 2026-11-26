# GitHub npm 发布与 Git 安装

UI 的 npm 自动发布工作流位于 `.github/workflows/release.yml`，由 GitHub Actions 执行。目标仓库为 [DaisSu-UI/daisu-ui](https://github.com/DaisSu-UI/daisu-ui)。GitLab 保留验证流水线，已移除 npm 和 Git 产物自动发布任务；发布脚本也拒绝在 GitLab CI 中执行发布。

## GitHub Actions

仓库地址为 [DaisSu-UI/daisu-ui](https://github.com/DaisSu-UI/daisu-ui)。工作流使用 GitHub Actions，无需 GitCode 内测权限。若组织策略限制 Actions，需要仓库管理员在 Settings → Actions → General 中允许本仓库工作流。

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Actions Secrets 配置](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)

## 分支与触发条件

| 分支或标签 | 用途 | GitHub 行为 |
| --- | --- | --- |
| `developer` | 日常组件、示例和文档开发 | 自动验证，不发布 npm |
| `main` | 已验收源码和发布配置 | 自动验证；发布脚本或发布工作流变更时执行 npm 预演，不写入注册表 |
| `v<组件版本>` | 指向已进入 main 的源码提交 | 重新验证并发布 npm |
| `npm-dist` / `npm-v<版本>` | 可选的 Git 安装产物 | 不由 npm 工作流创建 |

`.github/workflows/ci.yml` 处理 developer/main 推送、对应 PR 和手动验证；`.github/workflows/release.yml` 处理 `v*` 标签实际发布，以及 main 上发布配置变更或手动触发的发布预演。自动发布进一步核对仓库必须为 `DaisSu-UI/daisu-ui`、事件必须为标签 push、标签必须等于组件包版本、触发 SHA 必须等于当前源码、源码必须已进入远端 main。

本地同时有 `github` 和 `origin` 时，发布来源优先检查 `github/main`。GitHub 的干净克隆通常将 GitHub 命名为 `origin`，此时检查 `origin/main`。特殊环境可显式设置 `RELEASE_SOURCE_REMOTE=<远程名称>`；不会仅信任本地跟踪引用，而是重新 fetch 远端 main。

## GitHub 一次性配置

1. 在 [Settings → Secrets and variables → Actions](https://github.com/DaisSu-UI/daisu-ui/settings/secrets/actions) 中添加 Repository secret `NPM_TOKEN`。使用具有 `@daisu-ui/ui` 发布权限、满足 npm 当前 2FA 策略的 npm Granular Access Token。Token 不提交到 Git，也不在聊天或日志中输出。
2. 在 Settings → Actions → General 中确认允许官方 Actions；保护 `main` 分支和 `v*` 标签，只允许发布负责人合并和创建版本标签。
3. 在 [Actions](https://github.com/DaisSu-UI/daisu-ui/actions) 页面确认 `UI validation` 成功，再选择 `Publish UI to npm` → Run workflow → `main` 测试凭据和发布预演。main 始终执行 `--dry-run`，不会发布新版本；真实发布必须推送与组件版本匹配的版本标签。

工作流使用 `actions/checkout@v4`、`actions/setup-node@v4`、`actions/upload-artifact@v4`，Node.js 24，以及 `ubuntu-latest` 托管 Runner。npm 密钥仅在身份及包权限核对、最终发布或预演两个步骤注入；普通测试和构建步骤不接收该密钥。beta 版本使用 `beta` dist-tag，正式版本使用 `latest`。

Git 推送只上传源码和工作流，不能上传 Repository secrets；配置文件已推送不代表 `NPM_TOKEN` 已配置或 npm 端发布已验证。

## 日常开发与版本发布

以下命令在仓库根目录执行，假设第二个远程名为 `github`。若从 GitHub 直接克隆且远程名为 `origin`，替换下面的远程名称。

### 1. 完成开发并升级版本

```bash
git switch developer
git pull --ff-only github developer
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
git push github developer
```

### 2. 合并到 main

在 GitHub 发起 `developer → main` 的 Pull Request，检查并合并。原生能力变更仍需在目标设备完成验收，H5 验证不能替代真机验证。

普通 developer/main 推送不发布 npm。等待 main 的 `UI validation` 成功后，再在 main 上创建新版本标签。

### 3. 推送版本标签

```bash
git fetch github
git switch main
git pull --ff-only github main
# 应无输出：同名标签不能复用或覆盖。
git ls-remote --tags github 'refs/tags/v0.1.0-beta.5*'
git tag -a v0.1.0-beta.5 -m 'Daisu UI 0.1.0-beta.5'
git push github refs/tags/v0.1.0-beta.5
```

GitHub 的 `Publish UI to npm` 工作流执行：版本及 main 来源校验 → npm Token 身份和包读写权限核对 → 安装依赖 → 发布脚本测试 → 组件测试 → 类型检查 → Demo/文档构建 → 独立 UI 包校验 → 打包及完整性校验 → 发布 `@daisu-ui/ui`。

npm 包只包含 UI 库 ESM、保留 JSX 的组件、类型、样式、README、更新日志和许可证。根 workspace、Demo、文档站、CLI/MCP 和测试不进入 npm 包。发布归档与 `npm-release.json` 保存七天。

### 4. 核对 npm 结果

```bash
npm view @daisu-ui/ui@0.1.0-beta.5 version dist.integrity --registry=https://registry.npmjs.org/
npm view @daisu-ui/ui dist-tags --json --registry=https://registry.npmjs.org/
```

需要安装或回退时，在消费项目显式安装目标版本并提交锁文件。UI 和 CLI 是独立包；此工作流只发布 `@daisu-ui/ui`。

## 发布预演的验证范围

main 预演使用 GitHub 中实际配置的 `NPM_TOKEN`，通过 `npm whoami` 核对身份、`npm access list collaborators @daisu-ui/ui <用户名>` 核对目标包的账号读写权限，并对与当前源码及校验和匹配的 UI tarball 执行 `npm publish --dry-run`。预演不占用新版本号，也不覆盖现有版本。

预演证明认证、可见的账号权限、构建和发布参数可用；Token 的最终写入策略、npm 2FA / 发布策略仍由真实版本发布时的注册表请求决定。

## 备用：手动发布

需要手动发布时，在已验收、已提交且进入 GitHub main 的干净源码上执行：

```bash
npm ci
npm login --registry=https://registry.npmjs.org/ --auth-type=web
npm run ui:npm:release -- --dry-run
npm run ui:npm:publish
```

本地脚本优先使用 `github/main`，从 GitHub 直接克隆则使用 `origin/main`。手动发布成功后不再推送同版本标签触发自动发布；后续使用新版本号。

## 可选：Git 安装产物

npm 发布不依赖 `npm-dist`。需要通过 Git 安装构建产物时，在干净源码上单独运行：

```bash
npm run ui:git:release -- --dry-run
npm run ui:git:release
```

默认推送到发布来源使用的远程：双远程工作区使用 `github`，GitHub 直接克隆使用 `origin`。该操作创建 `npm-dist` 和 `npm-v<组件版本>`，需要仓库写权限，不覆盖现有安装标签。

## GitLab 的保留范围

GitLab `.gitlab-ci.yml` 保留验证，不再包含 `publish:npm` 和 `publish:git` 自动任务。新的发布脚本拒绝 GitLab CI 发布；未来发布版本标签只推送 GitHub。现有文档部署任务与本地 Runner 不因 npm 发布迁移而删除，Runner 维护见 [本地 Runner 说明](local-runner.md)。

历史版本标签的旧配置不会被改写；不要重跑历史标签中的旧发布任务。历史标签和已发布 npm 版本也不作覆盖或重打。

## 失败与重试

| 现象 | 处理方式 |
| --- | --- |
| 看不到工作流或推送后无运行记录 | 核对 GitHub Actions 策略、工作流所在分支及触发条件 |
| 缺少 `NPM_TOKEN` | 在 GitHub Repository secrets 中配置，并核对 npm 权限和有效期 |
| npm 提示 EOTP / 无发布权限 | 核对 npm Token 的包权限和当前 2FA 策略 |
| 源码不在 main | 先合并到 GitHub main 并验收，再推送对应版本标签 |
| 组件版本与标签不符 | 修正版本并使用新的标签，不覆盖已有标签 |
| SHA 或归档完整性不符 | 重新从当前源码验证、构建、打包，不复用旧产物 |
| npm 版本已存在 | 先核对 npm 实际发布结果，不重复发布成功版本 |
| 网络或平台临时错误 | 确认 npm 尚未发布成功后重试失败流水线 |
| 源码需要修复 | 提交修复、升级版本，重新合并 main 并创建新版本标签 |
