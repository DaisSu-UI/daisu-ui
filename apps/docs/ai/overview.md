# AI 总览

Daisu UI 提供面向 ReactLynx 的组件文档、版本化离线知识库、CLI、MCP Server 和消费端 Skill。可以在终端查询，也可以让编辑器中的 Agent 按需调用同一份资料。先确认项目安装的组件版本，再查询 API、示例和平台限制。

## 选择接入方式

| 场景 | 推荐入口 | 使用方式 |
| --- | --- | --- |
| 只希望 AI 阅读说明 | [LLMs.txt](#/ai-llm) | 将文档链接加入上下文，按需打开组件页 |
| 查询 API、示例、主题变量 | [CLI 工具](#/ai-cli) | 使用 `daisu info`、`doc`、`demo`、`token` 离线查询 |
| 让 AI 按需调用组件知识库 | [MCP 接入](#/ai-mcp) | 为客户端配置 `daisu mcp serve` |
| 让 Agent 完成页面开发和排查 | [AI Skills](#/ai-skills) | 一次安装 MCP、Skill 与 Instructions |
| 检查已有 ReactLynx 项目 | [CLI 工具](#/ai-cli) | 使用 `doctor`、`usage`、`lint` 分析源码 |

## 推荐使用路径

### 第一次使用

CLI 当前版本为 `0.1.0-beta.3`，在 npmjs 使用 beta 标签。先按 [CLI 安装说明](#/ai-cli) 安装 @daisu-ui/cli@beta；也可从 Git 源码构建或安装本地 tarball。CLI 安装完成后，下面的命令均可离线查询；组件包和 CLI 是两个独立的安装项。

在消费项目执行：

```bash
daisu data list
daisu doctor .
daisu list 表单
daisu info Input
daisu demo Input basic
```

使用源码时，将 `daisu` 换为 `node /绝对路径/cli/dist/index.js`。不需要为查询启动文档网站，也不需要配置 API Key。

### 接入 MCP

先全局安装已发布的 CLI：

```bash
npm install -g @daisu-ui/cli@beta
```

在支持 mcpServers 的客户端中添加以下配置，由客户端启动服务：


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


客户端需要能在 PATH 中找到 daisu，并在消费项目目录启动服务。需要固定项目时，在 args 中加上 --cwd 与消费项目绝对路径；VS Code、Codex 使用各自的配置格式，详见 [MCP 接入](#/ai-mcp)。

### 希望 Agent 完成开发任务

先预览针对当前项目的配置计划，再指定实际客户端安装：

```bash
daisu agent init --client auto --dry-run
daisu agent init --client cursor --yes
daisu agent doctor --client cursor
```

将 cursor 换为自己的客户端 ID；自动识别不明确时会要求显式选择。`agent init` 默认配置 MCP、消费端 Skill 和 Instructions。客户端完成信任或启用后，在实际会话中要求它先调用 `daisu_status`，再查询组件：

```text
请使用 Daisu UI 实现用户资料表单，目标为 ReactLynx，支持浅色和深色主题。
先调用 daisu_status 确认组件数据版本；查询 Form、FormItem、Input、Button 的
公开 API、完整文档和示例，再生成代码。说明当前平台未支持的能力。
完成后运行当前项目的类型检查、测试与构建，不直接导入组件库内部文件。
```

### 只需要 MCP 或终端查询

仅接入 MCP 使用 `daisu mcp init --client cursor --yes`；它不会安装 Skill 和 Instructions。无需编辑器工具调用时，直接执行 CLI 查询命令即可。

### 只需要文档上下文

把 [llms.txt](./llms.txt) 的完整地址交给支持网页读取的工具。需要更多约束时补充 [llms-full.txt](./llms-full.txt) 和 [组件生成约束](./component-ai-notes.txt)。准确的属性与回调签名仍以当前版本组件文档和公开类型为准。

## 能力地图

| 能力 | 提供的资料或行为 | 核对要点 |
| --- | --- | --- |
| `list` / `search` | 组件、Hook 与文档全文检索 | 英文名、中文名或用途均可检索 |
| `info` / `doc` | 公开 API 和完整组件说明 | 属性、事件、插槽、方法与平台能力 |
| `demo` | 文档示例和完整交互源码 | 不把示例私有组合当作公开组件 |
| `token` | 组件与全局 CSS 变量 | 按实际资料区分默认值与明暗主题值 |
| `doctor` / `usage` / `lint` | 依赖、JSX 集成、使用统计和用法诊断 | 源码静态检查，不能替代项目编译与设备验证 |
| MCP | 通过工具、资源和 Prompt 提供上述能力 | 实际客户端仍需完成启用和工具调用验证 |
| Skill / Instructions | 查询顺序、ReactLynx 规则和验证要求 | 由客户端加载，API 仍从知识库按版本查询 |

## 版本与内容来源

当前组件包名为 @daisu-ui/ui，CLI 为 @daisu-ui/cli；历史组件快照可能使用旧包名 daisu-ui，导入路径以所选版本返回的 importFrom 为准。CLI 版本、组件库版本和文档站版本分别管理。`daisu --version` 显示 CLI 版本，`daisu info Button --version <版本>` 选择组件数据；`daisu data list` 查看当前包实际收录的快照。查询不会自动读取最新网页，也不会因为本地 UI 源码更新而自动更新快照。

组件 API、Demo、平台约束和 LLM 资料由 UI 仓库维护；CLI 将其提取为带版本与摘要的快照。本站的 CLI、MCP、Skills 接入页由 CLI 源码生成，命令表与工具表取自实际注册。本地两个开发仓库就绪时，构建会自动同步；安装后的查询不触发源码同步。具体流程见 [CLI 工具](#/ai-cli)。

## 延伸阅读

- [LLMs.txt 与上下文使用](#/ai-llm)
- [CLI 安装、查询与版本选择](#/ai-cli)
- [MCP 客户端配置与验证](#/ai-mcp)
- [AI Skills 安装和项目规则](#/ai-skills)
- [平台适配](#/platforms) · [定制主题](#/theme-customization)
- [UI 源码仓库](https://git.zilueit.com/daisu-ui/daisu-ui) · [CLI 源码仓库](https://git.zilueit.com/daisu-ui/cli)

本文由 `@daisu-ui/cli@0.1.0-beta.3` 生成。内容在 CLI 仓库维护；更新方式见 [CLI 工具](#/ai-cli)。
