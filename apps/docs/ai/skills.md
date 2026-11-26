# AI Skills

消费端 Skill 为 Agent 提供 Daisu UI 的查询顺序、ReactLynx 编写约束和验证要求。MCP 提供真正的工具调用能力；Instructions 将项目规则提供给不同客户端。三者可一起安装，也可按项目选择。

## 内置技能

| Skill | 内容 | 适用场景 | 源文件 |
| --- | --- | --- | --- |
| daisu-ui | 版本核对、API/示例查询、ReactLynx 约束与验证要求 | 组件选型、页面生成、主题和常见组件用法排查 | [SKILL.md](https://github.com/DaisSu-UI/cli/blob/main/skills/daisu-ui/SKILL.md) |

当前消费端技能随 [@daisu-ui/cli](https://www.npmjs.com/package/@daisu-ui/cli) 分发，通过下方 agent init 安装。UI 维护者的 Lynx 技能见本页末尾，分别服务于消费项目与组件库开发。

## 安装前准备

先执行 npm install -g @daisu-ui/cli@beta，或按 [CLI 工具](#/ai-cli) 使用项目依赖和源码入口。在需要生成代码的消费项目执行接入命令，不要把 CLI 仓库作为目标项目。源码用户用 `node /absolute/path/to/cli/dist/index.js` 替代 daisu；项目开发依赖用户用 `npx --no-install daisu`。

## 一次接入

```bash
daisu agent list
daisu agent init --client auto --dry-run
daisu agent init --client cursor --yes
daisu agent status --client cursor
daisu agent doctor --client cursor
```

自动识别不明确时显式指定客户端。init 默认安装 mcp,skill,instructions，--yes 表示执行已核对的计划；交互终端可不带 --yes，查看计划后确认。客户端加载项目规则、Skill 和 MCP 后，仍需在实际会话发起一次工具查询。

### 按需安装

```bash
daisu agent init --client cursor --with skill,instructions --dry-run
daisu agent init --client cursor --with skill,instructions --yes
daisu mcp init --client cursor --yes
```

--with 可以选择 mcp、skill、instructions；仅配置 MCP 使用 mcp init。项目路径默认是当前目录，可用 --cwd 明确指定。--scope user 只改变 MCP 位置，Skill 和 Instructions 始终写入指定项目；VS Code 仅支持 project。

## 各客户端的文件位置

消费端 Skill 的唯一源文件为 CLI 包内 skills/daisu-ui/SKILL.md。下表来自实际客户端适配器：

| 客户端 ID | Skill 目录 | Instructions |
| --- | --- | --- |
| `claude` | `.claude/skills/daisu-ui` | `CLAUDE.md` |
| `cursor` | `.cursor/skills/daisu-ui` | `.cursor/rules/daisu-ui.mdc` |
| `vscode` | `.github/skills/daisu-ui` | `.github/copilot-instructions.md` |
| `codex` | `.agents/skills/daisu-ui` | `AGENTS.md` |
| `opencode` | `.agents/skills/daisu-ui` | `AGENTS.md` |
| `antigravity` | `.agents/skills/daisu-ui` | `AGENTS.md` |
| `qoder` | `.qoder/skills/daisu-ui` | `AGENTS.md` |
| `qoder-cli` | `.qoder/skills/daisu-ui` | `AGENTS.md` |
| `codebuddy` | `.codebuddy/skills/daisu-ui` | `CODEBUDDY.md` |
| `codebuddy-cli` | `.codebuddy/skills/daisu-ui` | `CODEBUDDY.md` |

组件 API、平台约束与示例来自 UI 仓库的版本快照，不在 Skill 中复制另一份 API 表格。CLI 安装包已携带技能文件，无需从另一个不存在的技能仓库安装。

## 使用流程

1. 确认消费项目的组件版本，以及 CLI 或 MCP 实际选择的数据版本。
2. 用 list/search 选组件，再用 info/doc/demo 核对属性、事件、完整说明与真实示例。
3. 从 @daisu-ui/ui 的公开入口导入组件，按受控状态、主题和宿主能力约束生成代码。
4. 用 doctor/lint 提供静态诊断，再运行消费项目自己的类型检查、测试与构建。
5. 对键盘、媒体、手势和列表性能，在目标原生设备验证。

可直接提供以下任务：

```text
请先按本项目的 Daisu UI Skill 工作。
检查组件版本，查询 Form、FormItem、Input、Button 和 ConfigProvider 的公开文档。
实现带校验的资料表单，支持深色模式，并说明原生宿主需要提供的能力。
先参考真实示例，再编写 ReactLynx 代码；完成后执行本项目的验证命令。
```

若只安装 Skill 与 Instructions，Agent 仍需通过可执行的 CLI 或已连接的 MCP 获取 API。目录内存在 SKILL.md 不等于客户端已经加载，status 和 doctor 也不能代替实际会话验证。

## 更新、迁移与移除

```bash
daisu agent status --client cursor
daisu agent init --client cursor --dry-run
daisu agent remove --client cursor --dry-run
daisu agent remove --client cursor --yes
```

工具记录 .daisu/cli-state.json 的托管内容及归属。保留用户规则、其他 MCP Server 和共享内容；仅对有归属且指纹匹配的内容更新或移除。用户修改后的托管内容会提示，不强行覆盖。不要删除状态清单以绕过保护；更新 CLI、迁移安装位置或手工改动后，先查看计划和状态，再按提示处理。

--client all 表示明确接入全部支持的客户端，不是自动选择。多个客户端共享 AGENTS.md 或 MCP 文件时，移除一个客户端不会删除其他托管客户端仍需要的内容。

## UI 库维护者技能

UI 仓库维护 AGENTS.md、组件 API、示例与平台约束。Lynx API、CSS 兼容性和双线程规则以官方文档为准；外部 Lynx 技能由开发者在本机按需安装和更新，.agents/skills/ 不纳入 UI 仓库版本控制，也不是构建前提。消费端 Skill 由 CLI 维护。

在 UI 仓库修改组件时先遵循其维护规范，更新 API 文档与平台约束。本地协作仓库就绪时，构建自动同步 CLI 快照；其他布局按 CLI 工具页显式同步。消费项目安装的 daisu-ui Skill 不会替换维护者规则，也不会自动更新组件库。

- [MCP 配置和会话验证](#/ai-mcp) · [CLI 与版本快照](#/ai-cli) · [AI 总览](#/ai-guide)

本文由 `@daisu-ui/cli@0.1.0-beta.7` 生成。内容在 CLI 仓库维护；更新方式见 [CLI 工具](#/ai-cli)。
