# 本地 GitLab Runner

当前项目 Runner 部署在开发机 `youzi-PC`，名称为 `daisu-ui-local-youzi-PC`，使用 Docker executor，锁定本项目并允许无标签任务。GitLab 不需要主动连接开发机，无需公网 IP 或开放入站端口。

## 已验证的版本

- GitLab 服务器：10.5.2。
- Runner：`gitlab/gitlab-runner:v11.11.2`。
- 构建镜像：`node:24-bookworm`。

Runner 10.5 的 Docker 客户端使用 API 1.18，无法连接本机 Docker 26。Runner 11.11.2 已验证可以连接本机 Docker 和当前 GitLab；Runner 12 起不再支持这个 GitLab 的旧版 refspec 协议，不能直接换成 latest。

Runner 每次执行一个作业，构建容器使用 2 个 CPU，Node 进程堆上限为 2 GiB。Runner 管理容器自身限制为 1 个 CPU、512 MiB。构建容器不会挂载宿主 Docker socket；只有 Runner 管理容器需要该 socket 来创建作业容器。

## 启停与日志

```bash
docker compose -f ops/local-runner/compose.yaml up -d
docker logs --tail 80 daisu-ui-local-runner
docker stop daisu-ui-local-runner
docker start daisu-ui-local-runner
```

容器设置了 `restart: unless-stopped`，Docker 服务启动后会自动恢复；如果手动停止，需手动启动。电脑关机、休眠或 Docker 停止期间，GitLab 作业会等待；任务执行中断时可在 GitLab 前台重新执行。

认证配置保存在 Docker 外部卷 `daisu-ui-runner-config`，不进入 Git 仓库。Compose 只引用该卷；不要删除卷或将里面的 `config.toml` 上传、提交或贴进日志。首次迁移到另一台电脑时，应在 GitLab 前台注册新的项目 Runner，不复制个人 SSH 凭据。

## GitLab 前台

“设置 → CI/CD → Runners”可以查看 Runner 在线状态、暂停或恢复。若旧流水线已经失败或取消，Runner 上线不会自动重试历史失败任务；可点击重试，或推送新提交触发新的流水线。

普通分支只执行验证，不需要仓库写入密钥。版本 Tag 的自动发布还需要 [Git 发布说明](git-release.md) 中的专用部署密钥和受保护 CI 变量；本地 Runner 注册令牌不等于仓库推送凭据。
