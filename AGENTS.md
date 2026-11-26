# Daisu UI

Git 提交信息的标题和正文统一使用中文；技术名称、版本号和标识符保留原文。

开发前阅读 https://lynxjs.org/next/llms.txt，并按任务查阅 Lynx 官方文档。外部 Lynx 技能由开发者在本机按需安装和更新；`.agents/skills/` 不纳入版本控制，不作为构建或 CI 前提。

库代码位于 `packages/daisu-ui/src`；示例位于 `apps/demo/src/features/ui-demo`；文档位于 `docs/ui`，生成规则与示例说明位于 `apps/docs/guides`。生产包与独立构建不得硬依赖消费方业务工程或兄弟目录。组件包必须保留 JSX，公开入口自动加载样式；账号、Token、业务协议由宿主提供。

运行 `npm test`、`npm run test:types`、`npm run build`；发布前运行 `npm run ui:check` 和 `npm run ui:pack`，只发布 @daisu-ui/ui workspace，apps 均为 private。浏览器自定义元素被 invoke 的方法同步返回可克隆值，异步结果通过带请求标识的事件传回。

保持 Daisu UI 示例的独立详情、明暗主题与交互标准；原生未支持的能力明确标注，不能用浏览器能力代替真机验收。FeedList 滚动后端变更须在目标设备完成性能回归。

组件 API、示例与 LLM 约束在本仓库维护；CLI/MCP/客户端和消费端 Skill 在独立 CLI 仓库维护。`apps/docs/ai/overview.md`、`cli.md`、`mcp.md`、`skills.md` 与 `cli-manifest.json` 由 CLI 的 `docs export` 生成，不手工编辑。默认本地构建可与已安装依赖的同级 CLI 自动协作，文档开发服务持续监听；单独检出时仍独立构建。可用 DAISU_UI_CLI_SOURCE 指定 CLI、DAISU_UI_AUTO_SYNC=0 关闭；CI 与 --check 只读验证，自动同步不得触发发布。

文件维护来源见 `docs/MAINTENANCE.md`。根目录 README.md / LICENSE 为唯一源文件，包内副本由组件构建同步。`docs/ui/llms.txt` 由 UI 文档生成器按真实组件与导航清单生成，不手工编辑；完整说明和逐组件约束分别维护在 llms-full.txt 与 COMPONENT_AI_NOTES.md。文档构建须通过页面、资源与章节链接校验，Markdown 导出应能被 AI 直接读取。

GitHub → GitLab 同步只推送 main / developer 同名分支，不强推、不同步发布标签；使用 UI 项目专用 Deploy Key Secret 和已核对的主机公钥，临时私钥在作业结束后清理。
