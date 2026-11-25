# GitLab 流水线与 Git 安装

本仓库不需要发布到 npmjs。源码保留 monorepo 结构，`npm-dist` 分支只存组件包产物；安装用 Tag 为 `npm-v<版本>`。源码 Tag 为 `v<版本>`，两者用途不同。

## 没有 Runner 时

在有仓库推送权限的开发电脑上，先提交待发布源码，确保工作区干净，再执行：

```bash
npm ci
npm run ui:git:release
```

命令会运行测试、类型检查、文档和 Demo 构建、独立 tarball 消费验证，随后打包并推送 `npm-dist` 和安装 Tag。不会改动源码分支或发布到 npmjs。已有 Tag 不会覆盖，后续发布需先升级 `packages/daisu-ui/package.json` 及 workspace 中引用它的版本并更新锁文件。

只生成产物或预演推送：

```bash
npm run ui:git:prepare
npm run ui:git:publish -- --dry-run
```

`--dry-run` 会读取远程分支和标签，但不推送。准备产物后若源码提交或版本发生变化，发布脚本会拒绝过期产物。

## 消费项目

首次发布成功后，以实际发布版本替换下面的 Tag：

```bash
npm install "git+ssh://git@git.zilueit.com/daisu-ui/daisu-ui.git#npm-v0.1.0-beta.2"
```

继续使用 `import { Button } from 'daisu-ui'`、`daisu-ui/router`、`daisu-ui/web` 等公开入口。安装端需要仓库读取权限、Git 和 SSH；已包含保留 JSX 的 ESM、类型和 CSS，不会在安装时构建组件库或安装组件库开发依赖。消费项目须具备 ReactLynx 工具链及至少 Lynx 4.2 的原生引擎。构建插件仍使用旧编译器时，在消费项目根配置 `"overrides": { "@lynx-js/tasm": "0.0.53" }`。

## Runner 接入后

`.gitlab-ci.yml` 使用旧版 GitLab 支持的 `only/except`。普通分支执行完整校验并保留 tgz 与 Git 安装包工件；推送与组件包版本一致的源码 Tag（例如 `v0.1.0-beta.2`）后，校验通过才发布。`npm-dist` 和 `npm-v*` 不会再次运行源码流水线。

在 GitLab 前台保持 Auto DevOps 关闭、自定义 CI 配置路径为 `.gitlab-ci.yml`，不需要流水线触发器、不需要 Kubernetes。

本项目已在开发机配置 [本地 Runner](local-runner.md)。如需迁移到长期在线的服务器，请管理员安装与现有 GitLab 版本兼容的 GitLab Runner，并使用项目“设置 → CI/CD → Runners”页面的 URL 和注册令牌注册项目 Runner。选择 Docker executor、默认镜像 `node:24-bookworm`、允许无标签作业；不需要 privileged 模式或 Docker-in-Docker。机器需能访问 GitLab 和 npm registry。注册令牌不写入仓库。

自动发布还需要一次性配置：

1. 创建专用 SSH 密钥，将公钥添加到本项目“设置 → 仓库 → 部署密钥”，启用写权限。
2. 在“设置 → CI/CD → 变量”中配置 `GIT_RELEASE_SSH_KEY`（私钥原文）和 `GIT_RELEASE_KNOWN_HOSTS`（由管理员确认的 GitLab SSH 主机公钥记录）。变量设为受保护，密钥不写入文件提交或打印到日志。
3. 将源码版本 Tag `v*` 设为受保护 Tag，只允许发布负责人创建，保证发布任务能读取受保护变量。
4. 若 GitLab 的 SSH 地址与网页地址不同，设置 `GIT_RELEASE_REMOTE` 为实际 SSH 仓库地址；本项目可用 `git@git.zilueit.com:daisu-ui/daisu-ui.git`。

只有 GitLab 前台访问权限时，可以完成项目侧变量与部署密钥配置，但无法在服务器上安装 Runner；没有在线 Runner 时，自动作业会保持等待，仍可使用上述本地发布命令。
