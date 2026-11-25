# MCP 接入

MCP Server 由独立的 `@daisu-ui/cli` 提供，通过 stdio 通信，stdout 仅输出 JSON-RPC。组件知识读取随包的版本快照；项目检查限定在服务启动时指定的消费项目目录中。先完成 [CLI 安装](#/ai-cli)，再选择自动配置或手工配置。

## 自动配置

在消费项目执行，先查看计划再写入：

```bash
daisu mcp list
daisu mcp init --client auto --dry-run
daisu mcp init --client cursor --yes
daisu mcp status --client cursor
daisu mcp doctor --client cursor
```

替换 cursor 为实际客户端 ID。自动识别不明确时要求显式选择；不会默认配置所有客户端。默认 project 范围，将消费项目绝对路径写入 --cwd，使用当前 Node 和 CLI 的绝对入口，启动不需要访问注册表。

`mcp init` 只配置 MCP；需要同时安装 Skill 和 Instructions 时使用 [agent init](#/ai-skills)。已有其他 MCP Server 和用户配置会保留。写入后，客户端可能还需要信任项目、启用服务、批准工具或重启。

## 支持的客户端

表格来自当前客户端适配器；路径为项目范围的默认位置。OpenCode 与 CodeBuddy CLI 会识别已有兼容配置，具体目标路径以 init 的计划和 status 为准。

| 客户端 ID | 客户端 | 项目 MCP 文件 | 范围 |
| --- | --- | --- | --- |
| `claude` | Claude Code | `.mcp.json` | project / user |
| `cursor` | Cursor | `.cursor/mcp.json` | project / user |
| `vscode` | VS Code | `.vscode/mcp.json` | project |
| `codex` | Codex | `.codex/config.toml` | project / user |
| `opencode` | OpenCode | `opencode.json` | project / user |
| `antigravity` | Antigravity | `.agents/mcp_config.json` | project / user |
| `qoder` | Qoder IDE | `.mcp.json` | project / user |
| `qoder-cli` | Qoder CLI | `.mcp.json` | project / user |
| `codebuddy` | CodeBuddy IDE | `.mcp.json` | project / user |
| `codebuddy-cli` | CodeBuddy CLI | `.mcp.json` | project / user |

`--scope user` 只改变 MCP 配置位置，不固定消费项目 --cwd；需要稳定的项目版本和分析目录时优先使用 project。VS Code 仅支持 project。使用 `daisu mcp list --format json` 查看实际用户路径和探测依据。

## 手工配置

让 CLI 输出符合当前客户端格式和本机路径的片段：

```bash
daisu mcp print --client cursor
daisu mcp print --client vscode
daisu mcp print --client codex
```

下面展示全局安装 npm install -g @daisu-ui/cli@beta 后的简洁配置，使用 daisu mcp。客户端必须能在 PATH 找到 daisu；工作目录应为消费项目。需要固定目录时，args 使用 ["mcp", "--cwd", "/absolute/path/to/consumer-project"]。合并服务条目到已有配置，不覆盖整个文件。

print 只输出配置，不写文件。默认生成本机 Node 和 CLI 的绝对入口及消费项目目录，适合编辑器无法读取全局 PATH 的情况；目录含空格时保留为单个参数。

### Cursor 与通用 JSON

Cursor 使用 .cursor/mcp.json；支持 mcpServers 的其他客户端采用同样的服务条目：


```json
{
  "mcpServers": {
    "daisu-ui": {
      "command": "daisu",
      "args": [
        "mcp"
      ]
    }
  }
}
```


### VS Code

项目文件为 .vscode/mcp.json，使用 servers 字段与 type: stdio：


```json
{
  "servers": {
    "daisu-ui": {
      "type": "stdio",
      "command": "daisu",
      "args": [
        "mcp"
      ]
    }
  }
}
```


### Codex

项目文件为 .codex/config.toml，使用独立 TOML 服务表。Codex 必须信任并加载该项目配置，仍需在会话中验证工具可用：


```toml
[mcp_servers.daisu-ui]
command = "daisu"
args = ["mcp"]
```


以上片段由 CLI 的实际配置适配器生成。其他客户端使用对应的 mcp print 结果，OpenCode 的 command 为数组，不能套用 mcpServers 格式。

## 启动方式与版本

独立启动可运行 `daisu mcp` 或 `daisu mcp serve --cwd /absolute/path/to/consumer-project`。服务没有 HTTP 页面或监听端口，启动后等待客户端消息；一般由客户端自动启动，无需提前开一个终端运行。

默认 --runner local 使用当前安装的绝对入口。--runner global 生成 daisu mcp serve，要求客户端 PATH 能找到全局命令。--runner npx 可从 npm 启动，首次启动可能联网；使用 --pin 固定当前或指定 CLI 版本，不能代替组件数据版本选择。

在服务启动命令上添加 `--version <组件版本>` 可固定默认数据；工具调用的 version 参数可逐次选择。未显式指定时按消费项目依赖选择快照，先调用 daisu_status 核对来源。修改了本地 UI 源码不会改变已收录数据；重新同步和安装 CLI 数据后重启服务。

## 验证连接

```bash
daisu mcp doctor --client cursor --no-registration
daisu mcp doctor --client cursor --timeout 15000
```

| 状态 | 代表的结果 | 后续操作 |
| --- | --- | --- |
| server-ready | 独立进程能列工具、查询状态和 Button API | 在实际客户端会话调用工具 |
| registered | 支持登记查询的客户端识别了服务 | 确认当前会话已启用服务和目标工具 |
| pending-approval | 客户端等待信任或批准，退出码 2 | 在客户端完成信任或服务批准 |
| failed | 配置、服务调用或明确客户端状态失败，退出码 1 | 根据诊断结果修复后重试 |

doctor 分开报告配置、服务握手和客户端登记。Codex、Claude Code、OpenCode 支持只读登记查询；其他客户端可能报告 unsupported 或需要手工确认。`sessionVerified` 为 false，独立握手不能证明当前会话已能调用工具；诊断不会自动修改项目信任或工具过滤。

在实际 AI 会话发送：

```text
请先调用 daisu_status，说明当前 CLI、组件数据版本及来源。
再调用 daisu_info 查询 Button，调用 daisu_demo 读取 basic 示例。
请依据返回的公开属性生成 ReactLynx 用法，不猜测未返回的参数。
```

## 工具

下表通过真实 MCP 握手获取，参数名后 ? 表示可选。工具查询默认离线，limit 的有效范围和版本错误以服务实际返回为准。

| 工具 | 说明 | 参数 |
| --- | --- | --- |
| daisu_status | 离线 MCP 服务、CLI 版本、可用组件库版本及数据来源。 | — |
| daisu_search | 离线全文搜索组件文档与平台约束，多个词须全部匹配，按来源文档去重。 | `query`、`limit?`、`version?` |
| daisu_list | 查询组件/Hook；可按中英文名称、分类或用途搜索。 | `keyword?`、`version?` |
| daisu_info | 查询真实公开 Props、事件、插槽、方法、CSS 变量。 | `component`、`version?` |
| daisu_doc | 读取组件完整 Markdown 文档和平台能力边界。 | `component`、`version?` |
| daisu_demo | 列出示例或读取指定示例；basic 为基本用法，source 为完整交互源码。 | `component`、`demo?`、`version?` |
| daisu_token | 查询组件或全局 CSS 变量及默认值。 | `component?`、`version?` |
| daisu_changelog | 按发布版本或组件筛选开发/更新记录。 | `release?`、`component?`、`version?` |
| daisu_lint | 只读检查当前项目 TSX/JSX 中的组件导入、属性和回调。 | `dir?`、`version?` |
| daisu_usage | 统计当前项目 TSX/JSX 组件及 Hook 使用情况。 | `dir?`、`version?` |
| daisu_doctor | 检查当前项目 Node、依赖、知识库版本与 JSX 集成。 | `dir?`、`version?` |

## 资源与提示词

| 资源 | 说明 |
| --- | --- |
| daisu://versions | 随包可离线查询的 Daisu UI 版本 |
| daisu://components/{component} | 组件 Markdown 文档 |
| daisu://guides/{guide} | UI 维护的使用约束：llms、llms-full、component-ai-notes；历史快照可能未收录 |

guide 支持 llms、llms-full、component-ai-notes；历史快照未收录时会明确报错。资源使用服务默认数据版本，工具可单次指定 version。

| 提示词 | 说明 |
| --- | --- |
| daisu_component_usage | 根据真实 Daisu API 编写 ReactLynx 组件用法 |

## 迁移与排查

- 找不到命令：使用源码入口绝对路径，或检查 Node 与 CLI 的安装位置。迁移目录后重新预览 init，不要保留旧入口。
- 版本缺失：先调用 daisu_status 或执行 daisu data list，补充对应快照；不要强制使用不匹配的 API。
- 项目诊断目录不对：项目范围配置中的 --cwd 应指向消费项目，不是 CLI 或 UI 仓库。
- 已配置但会话没有工具：检查信任、启用状态和工具过滤；重启或重新加载客户端后实际调用验证。
- 已有同名服务：先确认原配置归属。旧的 UI 仓库 apps/mcp 已退役，新服务统一使用 CLI 的 daisu_* 工具与 daisu:// 资源；手工配置需先备份并合并替换同名服务。
- 仅移除 CLI 托管内容：先运行 `daisu mcp remove --client cursor --dry-run`，核对后加 --yes；手工配置或用户改动不会被当成可直接覆盖的托管内容。

- [CLI 工具](#/ai-cli) · [AI Skills](#/ai-skills) · [AI 总览](#/ai-guide)

本文由 `@daisu-ui/cli@0.1.0-beta.3` 生成。内容在 CLI 仓库维护；更新方式见 [CLI 工具](#/ai-cli)。
