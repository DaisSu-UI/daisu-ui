# 文件维护清单

本仓库维护 UI 组件、独立 Demo、文档站、接入示例及其验证和发布工具。CLI、MCP 与消费端 Skill 的实现由 [CLI 仓库](https://github.com/DaisSu-UI/cli) 维护。

## 手工维护的源文件

| 内容 | 唯一维护位置 |
| --- | --- |
| 组件、样式、公开类型与测试 | `packages/daisu-ui/src/` |
| Demo 与示例 | `apps/demo/src/`、`apps/demo/web/`；生成媒体见下表 |
| 演示媒体生成规则 | `scripts/generate-demo-assets.mjs` |
| 组件文档说明与示例模板 | `apps/docs/guides/`；Button 定板为 `docs/ui/components/button.md` |
| 文档页面、导航与平台范围 | `apps/docs/pages/`、`apps/docs/public/`、`apps/docs/platforms.mjs`；自动生成项见下表 |
| 完整 LLM 约束与逐组件补充 | `docs/ui/llms-full.txt`、`docs/ui/COMPONENT_AI_NOTES.md` |
| 项目说明与许可证 | 根目录 `README.md`、`LICENSE` |
| 组件更新记录和第三方声明 | `packages/daisu-ui/CHANGELOG.md`、`THIRD_PARTY_NOTICES.md` |
| 独立消费验收和接入模板 | `fixtures/ui-consumer/`、`examples/` |

## 自动生成并提交的文件

这些文件保留在 Git 中，确保单独检出 UI 仓库也能构建和验证。修改源文件后运行生成命令，不直接修改生成结果。

| 生成结果 | 来源与更新方式 |
| --- | --- |
| `packages/daisu-ui/README.md`、`LICENSE` | 根目录同名文件；`npm run ui:build` 自动复制 |
| `docs/ui/components/*.md`（Button 定板除外）、`component-sources.json`、`llms.txt`、`apps/docs/pages/compatibility.md` | 公开类型、Demo、`apps/docs/guides/`、导航和平台清单；`node apps/docs/generate.mjs` |
| `apps/docs/ai/{overview,cli,mcp,skills}.md`、`cli-manifest.json` | CLI 的 `src/site-docs.ts` 与命令/客户端注册；在 CLI 构建后运行 `node dist/index.js docs export --ui-dir <UI仓库>` |
| `packages/daisu-ui/src/icons/paths.ts`、`LICENSE.tabler` | `icons/catalog.json` 与锁定版本的 Tabler Icons；`npm run icons:generate` |
| `apps/demo/assets-source/`、`apps/demo/src/assets/` 中的演示图片与音视频 | `scripts/generate-demo-assets.mjs` 中的场景与生成规则；按生成的 `assets-source/README.md` 使用 `node scripts/generate-demo-assets.mjs` |

`npm run build` 会生成 UI 文档；同级 CLI 开发依赖就绪时，也会同步 CLI 接入页及组件知识快照。`DAISU_UI_AUTO_SYNC=0` 关闭跨仓库协作。CI 与 `--check` 只读校验，生成内容需要在本地更新并提交。

`apps/docs/ai/llm.md`、`apps/docs/getting-started.md` 和普通指南由 UI 手工维护，不属于 CLI 导出文件。

## 外部资料与本地产物

Lynx API、CSS 兼容性和双线程规则以 [官方文档入口](https://lynxjs.org/next/llms.txt) 为准。外部 Agent 技能由开发者按需安装和更新；`.agents/skills/` 已被 Git 忽略，构建和 CI 不依赖它。消费项目的 `daisu-ui` Skill 由 CLI 安装，与本机 Lynx 开发技能分别管理。

`node_modules/`、`dist/`、`dist-web/`、`h5-dist/`、`artifacts/`、Flutter 的 `.dart_tool/` 和 `build/` 都是已忽略的依赖、缓存或构建产物，可由安装、构建和验证命令重新生成。

迁移时的一次性清单和分批实施记录已从当前目录移除，历史可通过 Git 查询。当前公开 API 与平台范围以组件文档和兼容性表为准；消费方业务工程的依赖版本与验收记录由消费方维护。

## 发布与运维

GitHub Actions 负责 UI 验证、npm 发布与项目站部署；组织站使用 ops/root-pages.yml 和 scripts/pull-project-site.mjs 定期同步经 SHA-256 校验的项目站产物；GitHub → GitLab 工作流负责 main / developer 分支同步。GitLab 的验证配置和本地 Runner 工具仍属于现用的仓库运维文件。认证材料放在 CI Secrets 或本机受管配置中。

npm 仅发布 `packages/daisu-ui` 的编译产物、包配置、README、更新记录和许可证；Demo、文档站、开发技能和测试工程不随 npm 包发布。
