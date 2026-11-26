# 独立仓库开发

本仓库独立管理 `packages/daisu-ui`、`apps/demo`、`apps/docs` 和接入示例；组件包与构建不依赖消费方业务工程。

日常只在 `packages/daisu-ui/src` 修改组件，在 `apps/demo/src/features/ui-demo` 修改示例；无需同步主项目文件。`npm run ui:demo:dev` 构建并运行独立 Demo（3091），`npm run ui:docs:dev` 构建并预览文档（3090）。`npm run build` 构建库、Demo 与文档；文档产物 `apps/docs/dist` 可独立部署并支持子路径。

组件文档由 `apps/docs/guides` 的说明与公开类型生成，Button 文档为定板。`platform-notes.mjs` 保存浏览器注册、资源生命周期及导出约束，避免重新生成时丢失。UI 专属的 AI 资料为 `docs/ui/llms.txt`、`llms-full.txt` 和 `COMPONENT_AI_NOTES.md`，组件变化时同步维护。

`npm test` 验证库与 Demo，`npm run test:types` 检查 Demo 类型。`npm run ui:check` 会创建临时工程、安装真实 tarball，并检查声明、保留 JSX、自动样式及 Lynx/Web 编译。`npm run ui:pack` 输出 `artifacts/daisu-ui-*.tgz`。

消费方通过 npm 版本、Git 安装标签或 tarball 使用公开入口，并自行管理业务路由、账号、网络和宿主桥接。文件来源及生成规则见 [文件维护清单](../MAINTENANCE.md)。

文档站页头提供 AI 菜单，提供 AI 总览、LLMs.txt、@daisu-ui/cli 和 AI Skills 四个主入口；完整 MCP 详情从总览和 CLI 页面访问。版本号菜单依据 CHANGELOG 的实际版本标题生成，定位对应更新记录，不切换为不存在的历史文档快照。LLM 文档构建为站点根路径下的 llms.txt 与 llms-full.txt。

指南、设计系统、AI 与左侧完整目录共用 apps/docs/public/navigation.js 配置。指南按快速开始、工程实践、组合与工具、社区分组；设计系统包含设计、定制主题、深色模式和样式覆盖。导航中只配置有实际内容的页面。

文档阅读页采用完整左侧目录、中央正文与右侧页内目录布局。顶部搜索支持 Ctrl/⌘ K，覆盖指南与组件页面。AI 总览按接入方式、推荐路径、能力地图和延伸阅读组织，逐组件约束保存在 COMPONENT_AI_NOTES.md，并生成 component-ai-notes.txt。

CLI、MCP、客户端与消费端 Skill 由独立的 `@daisu-ui/cli` 仓库维护。其 `docs export --ui-dir <本仓库>` 生成本站的 `apps/docs/ai/{overview,cli,mcp,skills}.md` 与 `cli-manifest.json`；这些文件提交到本仓库，不手工编辑。CLI 的 `docs export ... --check` 比较实际实现与导出结果，`sync ... --check` 比较组件知识快照。两者严格只读。

本仓库 `npm run build` 与 `npm run ui:docs:build` 默认发现已安装开发依赖的同级 CLI，自动生成组件说明、导出接入页并刷新 CLI 知识快照；无需手动同步。`npm run ui:docs:dev` 同时监听两端源文件，修改后自动更新文档与必要的 Demo Bundle，刷新浏览器查看。CLI 的 `npm run build` / `npm run dev` 也会同步。监听合并修改并串行执行，忽略生成文件，内容相同不重写快照时间或生成文件。

只检出 UI 时继续校验已保存的接入页摘要，保持独立构建；CI 和文档 `check` 只读。非同级目录用 `DAISU_UI_CLI_SOURCE` 指定 CLI，CLI 用 `DAISU_UI_SOURCE` 指定 UI；`DAISU_UI_AUTO_SYNC=0` 可关闭自动协作，显式路径错误会直接报错。`npm run test:ai-docs` 验证校验器。组件资料以本仓库为准并提取到 CLI；接入说明以 CLI 为准并导出到本仓库。维护者 AGENTS 保留在本仓库；外部 Lynx 技能由开发者本机管理，仓库不保存其参考资料副本。

## 版本发布

日常通过 `v<版本>` 源码 Tag 触发 GitLab 校验和自动发布，消费方安装 `npm-v<版本>` 标签。版本更新、锁文件、流水线检查、升级/回退与失败重试见 [版本发布说明](../ci/git-release.md)，本机 Runner 启停见 [维护说明](../ci/local-runner.md)。文档站“工程实践 → 版本发布”复用同一份说明。

## 目录与 AI 文档维护

推荐工作区布局为 <workspace>/{daisu-ui,cli}。源码地址分别是 git@github.com:DaisSu-UI/daisu-ui.git 与 git@github.com:DaisSu-UI/cli.git；构建和查询不依赖固定的本机目录。

修改接入说明时，在 CLI 的 src/site-docs.ts 维护总览、安装、MCP 和 Skills，由正常构建自动导出到 UI；LLM 页面 apps/docs/ai/llm.md 及 docs/ui 中的约束由 UI 维护。客户端配置片段从真实适配器生成，验证时使用临时项目，不修改真实编辑器配置。文档中明确区分工具版本、组件数据版本与实际会话验收。

文档构建导出每篇指南和组件的 Markdown，llms.txt 从实际组件清单与导航生成。浏览器链接按共享别名表解析，保留章节锚点与外部 URL；构建校验站内页面、资源和章节，缺失时失败。Runner 说明作为版本发布的补充页提供，AI 主菜单保持四项。

“组合与工具”收录表单行、同步输入、PagedList、轻量控件、工具 Hook 与浏览器注册。公开可调用导出必须关联文档，生成器检查覆盖范围；CLI 区分组件 Props 与 Hook / 工具的调用参数。相关示例同样参加消费端类型检查。

## 文档站验收与发布

全文搜索从真实 Markdown 章节生成 search-index.json；示例预览仅在浏览器宿主中扫描实际 Demo 标题，通过来源与请求标识校验的消息定位示例，不把 DOM 代码放进原生 Bundle。兼容表源为 apps/docs/platforms.mjs，默认不声明真机通过。接入工程维护在 examples，ZIP 排除本机依赖缓存。

运行 npm run test:docs:browser 和 npm run test:docs:release。GitHub Documentation 工作流生成已验证站点产物，手动部署和回滚可复用同一产物；GitLab 保留兼容文档任务。GitHub Pages 与组织首页发布流程见 apps/docs/pages/docs-deployment.md；其他服务器部署按实际配置启用。
