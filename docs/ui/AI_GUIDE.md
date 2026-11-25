# AI 使用指南

Daisu UI 提供面向 AI 工具的文档索引、组件资料、MCP Server 和 Agent Skills。你可以按使用场景选择接入方式，让 AI 准确理解组件 API、示例代码、主题变量与平台能力。

## 选择接入方式

| 场景 | 推荐入口 | 适合工具 |
| --- | --- | --- |
| 让 AI 读取完整组件说明 | [LLMs.txt](#/ai-llm) | 支持 URL 文档读取的编辑器与 AI 工具 |
| 查询组件 API、示例和 CSS 变量 | [组件文档](#/button) | 浏览器、代码编辑器与仓库检索工具 |
| 在 AI 客户端中按需读取项目资料 | [MCP 接入](#/ai-mcp) | 支持 stdio MCP 的编辑器与 Agent 客户端 |
| 让 Agent 按项目规范完成开发任务 | [AI Skills](#/ai-skills) | Codex、Cursor、Cline 等可读取技能目录的 Agent |

## 推荐使用路径

### 只想让 AI 理解组件文档

将 [llms.txt](./llms.txt) 的完整地址加入工具的文档集或知识库。它提供组件目录、公开入口和关键限制，适合先做选型，再按需读取细节。

需要更完整的上下文时，使用 [llms-full.txt](./llms-full.txt)。逐组件的生成约束另见 [组件生成约束](./component-ai-notes.txt)。

```text
请先阅读 Daisu UI 的 llms.txt，按需查阅完整文档。
使用 Form、FormItem、Input 和 Button 实现用户资料表单。
核对属性、事件签名与平台说明，支持浅色和深色主题。
```

### 想准确查询 API、示例和主题变量

打开对应组件页，核对用法、Attributes、Events、Methods 与主题变量。页面的源码入口可查看当前实现，独立 Demo 可验证交互。

- [Button 按钮](button.md)
- [Form 表单](form.md)
- [ConfigProvider 全局配置](config-provider.md)

生成代码时从 daisu-ui 的公开入口导入组件，让消费项目的 ReactLynx 编译器处理 JSX。

### 想接入 MCP

在独立仓库执行 npm ci 后，可通过以下命令启动本地服务：

```bash
npm run mcp
```

在支持 mcpServers 的客户端中添加配置，由客户端自动启动：

```json
{
  "mcpServers": {
    "@daisu-ui/ui": {
      "command": "node",
      "args": ["/media/youzi/Project/workProject/daisu-ui/apps/mcp/index.mjs"]
    }
  }
}
```

将路径改为自己的仓库绝对路径。连接后可调用 list_components、get_component、get_demo、search_docs 和 get_changelog。服务使用 stdio 通信，不需要先启动文档网站。

[MCP 接入](#/ai-mcp) 提供完整准备步骤、Cursor / VS Code / Codex 配置与连接验证。

### 希望 Agent 完成完整开发任务

让 Agent 读取根目录规则，再按任务加载 [AI Skills](#/ai-skills)。布局、CSS 兼容性、双线程与官方组件 API 分别有对应技能。

```text
AGENTS.md
.agents/skills/lynx-api-docs/SKILL.md
.agents/skills/reactlynx-best-practices/SKILL.md
.agents/skills/lynx-check-css-support/SKILL.md
.agents/skills/lynx-ui/SKILL.md
```

完成后运行测试、类型检查和构建；原生键盘、媒体、手势和列表性能仍需结合目标设备验证。

## 能力地图

| 需要了解的内容 | 资料位置 | 使用要点 |
| --- | --- | --- |
| 组件属性、事件和实例方法 | 组件 API 文档与公开类型 | 不使用公开类型以外的参数 |
| 组件组合和交互状态 | 独立 Demo 与示例源码 | 使用受控状态，核对草稿与确认事件 |
| 颜色、尺寸与深色模式 | 设计系统与 ConfigProvider | 使用语义变量与主题作用域 |
| Lynx 元素和 CSS 支持 | API 与 CSS 兼容性 Skills | 按渲染后端和引擎版本查询 |
| 上传、媒体与原生能力 | 平台说明和宿主适配接口 | 区分浏览器后端与原生宿主能力 |
| 按需调用组件知识库 | 本地 MCP Server | 查询组件、API、Demo、主题变量和更新记录 |
| 组件差异与版本变化 | 版本导航和更新日志 | 按当前文档版本生成代码 |

## 延伸阅读

- [LLMs.txt 与完整文档](#/ai-llm)
- [MCP 接入说明](#/ai-mcp)
- [AI Skills](#/ai-skills)
- [定制主题](#/theme-customization)
- [平台适配](#/platforms)
- [贡献指南](#/contributing)
