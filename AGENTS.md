# Daisu UI

开发前阅读 https://lynxjs.org/next/llms.txt，并按任务读取 `.agents/skills` 中的 Lynx 技能。

库代码位于 `packages/daisu-ui/src`；示例位于 `apps/demo/src/features/ui-demo`；文档位于 `docs/ui`，生成规则与示例说明位于 `apps/docs/guides`。生产包与独立构建不得硬依赖 CSO 业务工程或兄弟目录。组件包必须保留 JSX，公开入口自动加载样式；账号、Token、业务协议由宿主提供。

运行 `npm test`、`npm run test:types`、`npm run build`；发布前运行 `npm run ui:check` 和 `npm run ui:pack`，只发布 @daisu-ui/ui workspace，apps 均为 private。浏览器自定义元素被 invoke 的方法同步返回可克隆值，异步结果通过带请求标识的事件传回。

保持 Daisu UI 示例的独立详情、明暗主题与交互标准；原生未支持的能力明确标注，不能用浏览器能力代替真机验收。FeedList 滚动后端变更须在目标设备完成性能回归。

组件 API、示例与 LLM 约束在本仓库维护；CLI/MCP/客户端和消费端 Skill 在独立 CLI 仓库维护。`apps/docs/ai/overview.md`、`cli.md`、`mcp.md`、`skills.md` 与 `cli-manifest.json` 由 CLI 的 `docs export` 生成，不手工编辑。默认本地构建可与已安装依赖的同级 CLI 自动协作，文档开发服务持续监听；单独检出时仍独立构建。可用 DAISU_UI_CLI_SOURCE 指定 CLI、DAISU_UI_AUTO_SYNC=0 关闭；CI 与 --check 只读验证，自动同步不得触发发布。
