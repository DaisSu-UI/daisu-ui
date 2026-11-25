# MCP 接入

Daisu UI 提供本地 stdio MCP Server，基于官方 MCP SDK，将当前仓库的组件文档、独立 Demo、主题变量与更新记录提供给 AI 客户端。服务直接读取本地版本资料，无需先启动 Demo 或文档网站。

## 准备与启动

先克隆仓库并安装依赖。使用项目要求的 Node.js 版本（20.19+ 的 20.x 或 22.12+）：

```bash
git clone git@git.zilueit.com:daisu-ui/daisu-ui.git
cd daisu-ui
npm ci
```

在仓库根目录启动：

```bash
npm run mcp
```

该命令通过标准输入和输出通信，启动后等待 MCP 客户端的协议消息，没有 HTTP 页面或监听端口。连接编辑器时，由客户端自动启动服务，无需提前在终端运行。客户端应直接执行下面配置中的 node 命令，避免 npm 的提示输出干扰 stdio 协议。

## 通用客户端配置

在支持 mcpServers 配置的客户端中添加：

```json
{
  "mcpServers": {
    "daisu-ui": {
      "command": "node",
      "args": [
        "/media/youzi/Project/workProject/daisu-ui/apps/mcp/index.mjs"
      ]
    }
  }
}
```

上面是本机仓库的实际路径，其他电脑需要改为自己的绝对路径。服务按入口文件位置定位文档，不依赖客户端的工作目录。若编辑器找不到 node，将 command 改为 Node.js 可执行文件的绝对路径；路径含空格时保留为一个 args 元素，不额外加 shell 引号。

### Cursor

在消费项目的 .cursor/mcp.json 中使用上面的 JSON，或通过 Cursor 的 MCP 设置添加同样的 stdio 服务。保存后确认 daisu-ui 已连接并允许客户端调用其工具。

### VS Code

VS Code 的项目配置文件为 .vscode/mcp.json，使用 servers 字段：

```json
{
  "servers": {
    "daisu-ui": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/media/youzi/Project/workProject/daisu-ui/apps/mcp/index.mjs"
      ]
    }
  }
}
```

通过编辑器的 MCP 服务管理入口启动并确认信任该服务，然后在支持工具调用的聊天模式使用。

### Codex

使用 CLI 注册本地服务：

```bash
codex mcp add daisu-ui -- node /media/youzi/Project/workProject/daisu-ui/apps/mcp/index.mjs
codex mcp list
```

也可以在 ~/.codex/config.toml 中添加：

```toml
[mcp_servers.daisu-ui]
command = "node"
args = ["/media/youzi/Project/workProject/daisu-ui/apps/mcp/index.mjs"]
```

注册后，在新的 Codex 会话中确认服务及工具可用，再要求它查询 Daisu UI 文档。

## 可用工具

| 工具 | 参数 | 用途 |
| --- | --- | --- |
| list_components | query 可选 | 列出组件；按英文名称或中文标题筛选 |
| get_component | component；section 可选 | 读取组件文档；section 为 full、api、examples、tokens，默认 full |
| get_demo | component | 读取独立 Demo 的真实 ReactLynx 源码 |
| search_docs | query；limit 可选 | 全文搜索组件文档；多个关键词以空格分隔，limit 为 1–20，默认 8 |
| get_changelog | 无 | 读取仓库真实更新记录 |

component 支持组件目录 ID 和公开组件名，例如 button、Button、FormItem、ConfigProvider。FormItem 等关联组件返回其所在组件组的文档。tokens 返回文档中的主题定制与 CSS 变量说明；未记录的章节会明确说明，不补造参数。

## 文档资源

| URI | 内容 |
| --- | --- |
| daisu-ui://docs/llms | 文档索引与组件目录 |
| daisu-ui://docs/llms-full | 完整 AI 文档与组件约束 |
| daisu-ui://docs/agent-rules | 仓库 AGENTS.md 开发规则 |

## 验证连接

连接成功后，客户端应发现上面的五个工具。可以发送以下提示：

```text
请调用 Daisu UI 的 list_components，筛选 Button。
再调用 get_component，component 为 Button，section 为 api；
调用 get_demo 获取实际示例，使用真实参数生成支持深色模式的 ReactLynx 按钮。
```

开发服务时运行集成测试，它会通过官方客户端建立真实 stdio 连接，验证工具发现、文档读取、搜索与资源访问：

```bash
npm run test:mcp
```

## 常见问题与版本

- 无法启动：确认已在克隆仓库执行 npm ci，Node.js 版本符合要求，args 指向真实存在的 apps/mcp/index.mjs。
- 没有工具：确认客户端使用 stdio，服务已启动并启用；配置格式应与客户端匹配。
- 查询资料过旧：服务读取本地 checkout 的资料，拉取对应版本后重启连接。文档站版本菜单定位更新记录，不会替换本地仓库内容。
- 修改了组件 API：同步维护组件文档；需要重新生成文档时运行 npm run build，然后重启 MCP 服务重新载入资料。

服务仅查询固定的文档清单与 Demo，不执行生成代码，也不代替消费项目运行测试。当前服务随 Git 仓库提供，尚未单独发布到 npm，不需要安装不存在的全局命令。

- [AI 总览](#/ai-guide)
- [LLM 文档](#/ai-llm)
- [AI Skills](#/ai-skills)
