# 文档站部署

文档站、组件 npm 包和业务 Lynx Bundle 分别发布。文档产物包含网页、Markdown、LLM 资源、源码面板、独立 Demo 与接入工程下载，部署时需要整包保留。

## 构建与持续验收

```bash
npm ci
npm test
npm run test:types
npm run build
npm run test:docs:browser
DAISU_DOCS_BASE_PATH=/daisu-ui/ npm run test:docs:browser
node scripts/docs-release.mjs pack --id local-001
node scripts/docs-release.mjs verify
```

浏览器测试默认使用安装好的 Chrome；无系统浏览器时执行 npx playwright install --with-deps chromium，或设置 DAISU_DOCS_CHROME_EXECUTABLE。GitLab CI 使用固定版本的浏览器镜像，GitHub 下载与测试依赖一致的 Chromium，报告保存为 artifacts；Shell Runner 仍需在宿主安装 Chrome 或对应 Chromium 依赖，image 字段不会为 Shell Runner 创建容器。

pack 输出 artifacts/docs-site，并生成逐文件 SHA-256 清单。发布 ID 不可覆盖；本地修改后需要新 ID 和新的 --output 目录。CI 采用精确提交 SHA 作为 ID，部署复用通过校验的产物，不在服务器重新构建。

## GitHub 工作流

当前主仓库的 .github/workflows/documentation.yml 独立运行文档构建、最小工程编译、真实浏览器测试与 Flutter 模板检查。浏览器测试分别验证根路径和仓库名子目录，覆盖 GitHub Pages 的项目站路径。推送 developer / main 或创建合并请求时生成 docs-site-<提交SHA> 产物；失败时保留浏览器报告。

### GitHub Pages

沿用现有文档站和生成程序，不需要迁移到 VitePress。首次发布前，在 GitHub 仓库 Settings → Pages → Build and deployment 中将 Source 设为 GitHub Actions；在 Settings → Environments → github-pages 中确认允许 main 分支部署。站点预计地址为 https://daissu-ui.github.io/daisu-ui/，实际地址以 Actions 的部署结果为准；也可以在 Pages 设置中绑定自定义域名。

推送 main 后，Documentation 工作流在站点构建、根路径与子目录浏览器检查、Flutter 模板检查全部成功后自动发布。也可以在 Actions → Documentation → Run workflow 中选择 main，channel 选择 pages。developer 和合并请求只验证并保存产物；手动选择 artifacts 仅生成产物。工作流为 Pages 发布单独授予 pages:write 和 id-token:write 权限，使用 GitHub 自动提供的 GITHUB_TOKEN，无需配置 SSH 私钥或额外发布 Token。

Pages 直接托管经过校验的 artifacts/docs-site 整包，包含组件 Demo、源码、Markdown、LLM 文档与工程下载。相对资源路径与哈希路由可用于 /daisu-ui/ 子目录和自定义域名根目录；本地预览与线上使用同一套文档。GitHub Pages 是静态托管，不提供 Nginx 或 SSH 部署脚本中的服务器回滚；需要恢复旧版时，重新发布目标内容对应的 main 提交。

如需本地按项目站路径预览，先构建，再运行：

```bash
DAISU_DOCS_BASE_PATH=/daisu-ui/ node apps/docs/serve.mjs
# 打开 http://localhost:3090/daisu-ui/
```

### 组织根地址

https://daissu-ui.github.io/ 对应专用组织站仓库 DaisSu-UI/daissu-ui.github.io。首页与文档源码仍在 UI 仓库维护；组织站仓库只保存经过校验的发布产物。首页默认在根路径展示，文档使用哈希路由，已有 /daisu-ui/ 项目站链接仍可访问。

将本节对应的脚本合并到 main 后，在已通过 gh auth login 登录、且 SSH 可写入组织站仓库的本机终端执行一次：

```bash
bash ops/setup-root-pages.sh
```

脚本创建并核对专用组织站仓库，将 ops/root-pages.yml 安装为该仓库的发布工作流，并把 Pages 设置为 GitHub Actions。它使用组织站自身的 GITHUB_TOKEN，不需要跨仓库 Deploy Key、个人令牌 Secret 或额外仓库变量。

UI main 的 Documentation 工作流先完成构建、浏览器与模板验收，再发布 /daisu-ui/ 项目站。组织站工作流每10分钟检查项目站的 site-manifest.json；只有发布清单变化时，才下载全部资源、核对 SHA-256 和必要文件并发布到根地址。未变化的站点会跳过部署；下载失败或摘要不匹配时不会替换线上内容。GitHub 定时任务可能延迟，首次发布或需要立即更新时，在组织站的 Actions 中手动运行 Publish Daisu UI homepage。

两处站点使用同一份已验证产物。源脚本和工作流在 UI 仓库维护；组织站仓库仅保存由初始化脚本管理的工作流。更新 ops/root-pages.yml 后重新运行初始化脚本同步。

初始化需要组织建仓和 Pages 管理权限，以及组织站仓库的 SSH 写入权限。同名仓库未标记为本项目的发布仓库时，脚本会停止并保留其中内容；使用本机 SSH 别名时可通过 DAISU_ROOT_GIT_URL 指定组织站仓库地址。

### SSH 服务器部署

维护者可以在 Actions 手动运行 Documentation，channel 选择 preview、production 或 rollback。生产与回滚只允许 main；部署使用 docs-preview / docs-production 环境，可在仓库中设置环境审批。配置 DOCS_SSH_PRIVATE_KEY、DOCS_SSH_KNOWN_HOSTS、DOCS_SSH_TARGET 三个 Secret，以及 DOCS_DEPLOY_ROOT 变量，密钥不会写入仓库。preview 按当前分支名称生成独立 previews/branch-<规范化分支名>-<名称哈希> 目录，不同分支互不覆盖，同一分支后续部署更新自己的预览。

Flutter CI 固定本次验证的 Flutter 3.41.6，只运行 Dart 分析与 Manifest 加载测试，不把它当作 Lynx 原生引擎或真机通过记录。

## GitLab 兼容任务与分支预览

verify 任务构建并保存 artifacts/docs-site；docs:browser 下载该产物，在真实浏览器中测试正文搜索、章节定位、示例联动、超时/失败重试、移动布局、主题和 Markdown 下载。失败时保留 Playwright 报告、截图及追踪。

无需配置服务器即可从流水线下载完整站点产物用于预览。在有部署服务器时，developer 分支提供手动 docs:preview 任务，发布到独立 previews/developer 目录，避免替换 production。其他分支可下载产物或由维护者增加相应预览任务。

## 可配置的服务器部署

默认提供 SSH / Nginx 部署适配器，不绑定固定服务器或域名；尚未指定目标服务器时只生成产物，不代表网站已经上线。GitLab Pages 也可直接使用整包静态产物，启用前需核对实际 GitLab Pages 服务及版本配置。

服务器需要 Node.js >=20.19.0、静态文件服务器、SSH 账户和发布目录写入权限。在 GitLab 的 CI/CD 变量中设置 DOCS_SSH_TARGET（user@host）、DOCS_DEPLOY_ROOT（例如 /srv/daisu-docs）。SSH 密钥和 known_hosts 由 Runner 提供，脚本不关闭主机验证，也不在仓库保存凭据。

```bash
node scripts/docs-release.mjs deploy --source artifacts/docs-site --root /srv/daisu-docs --channel previews/developer
# 验收后，可由 main 分支的 docs:production 手动任务执行
bash ops/deploy-docs.sh production
```

发布先验证资源清单，再写入 releases/<提交SHA>，最后原子切换 production 或 previews/<分支> 符号链接。站点是相对资源路径，支持部署到子目录。并发发布由部署脚本在同一发布根目录内加锁串行处理，兼容旧版 GitLab。

## Nginx 示例

```nginx
server {
    listen 80;
    server_name docs.example.com;
    root /srv/daisu-docs/production;
    index index.html;

    location / { try_files $uri $uri/ =404; }
    location ^~ /previews/ { alias /srv/daisu-docs/previews/; }
    location ~* \.(json|md|txt)$ { add_header Cache-Control "no-cache"; }
}
```

为实际域名配置 HTTPS；哈希路由不需要把未知文件一律回退为 index.html，否则资源缺失会被误判为成功。不同 Nginx 模块的 MIME 设置可能不同，建议把 .md 配置为 text/markdown，JSON 为 application/json，WASM 为 application/wasm。项目本地预览服务器已配置这些类型。

## 回滚

回滚切换到保留的已验证产物，不重建历史源码。先在流水线变量中设置 DOCS_ROLLBACK_RELEASE 为既有发布 ID，再执行 main 分支的手动 docs:rollback；也可在部署服务器执行：

```bash
node .docs-release.mjs rollback --root /srv/daisu-docs --channel production --id 已验收的发布ID
```

不存在、哈希不匹配或 ID 不合法的产物会被拒绝，当前 production 链接保持原状态。发布脚本不自动删除历史 release，保留策略由维护者结合回滚窗口管理。

## 平台与正式上线

文档站浏览器回归只验证站点和 Web Demo，不代替组件原生验收。接入范围见 [平台兼容性总表](./compatibility.md)，组件发版见 [版本发布](./publishing.md)。首次正式上线前需在 GitHub 仓库启用 Pages 并完成流水线部署；选择 SSH 服务器部署时，还需指定实际域名、部署目录与服务器身份。
