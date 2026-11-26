# LLMs.txt

Daisu UI 为 AI 提供索引、扩展说明和逐组件约束。可以将网页链接加入上下文，也可以通过 CLI 与 MCP 按版本读取离线快照。生成代码前，确认资料与消费项目实际安装的 @daisu-ui/ui 版本一致。

[llms.txt](https://llmstxt.org/) 提供面向 AI 的文档索引和阅读入口。Daisu UI 将组件目录、公开入口和平台约束整理为文本资源；它提供上下文，不会自行安装 MCP、Skill 或组件包。不同接入方式见 [AI 总览](#/ai-guide)。

## 选择文档

| 入口 | 内容 | 使用方式 |
| --- | --- | --- |
| [llms.txt](./llms.txt) | 组件目录、公开入口与关键限制 | 首次阅读与组件选型 |
| [llms-full.txt](./llms-full.txt) | 更详细的组件、主题与平台约束 | 需要较完整上下文时补充 |
| [组件生成约束](./component-ai-notes.txt) | 逐组件状态、事件及生成规则 | 在任务涉及的组件上核对细节 |
| [组件文档](#/button) | 实际属性、事件、方法、示例和源码入口 | 编码前核对公开签名 |

前三个文件来自 UI 仓库的 docs/ui，随文档站构建输出到站点根路径。llms.txt 列出所有组件和指南的可直接读取 Markdown 链接，站点也导出对应原始正文；AI 不必执行单页站点 JavaScript。点击链接复制完整 URL，交给支持网页读取的工具；部署在子路径时也应使用实际部署后的完整地址。文档索引和约束不能代替组件 API 表与公开类型。

## 在 AI 工具中使用

### Cursor

在编辑器的文档索引或 Docs 设置中添加上方 llms.txt 的完整 URL，等待索引后，在会话中引用该文档。可按任务增加完整说明和具体组件页。[Cursor 文档搜索说明](https://cursor.com/docs/agent/tools/search)。

### TRAE 与其他工具

在支持 URL 文档摄取的客户端中，将完整地址加入文档集或知识库，并在任务中选择该上下文。TRAE 可使用其文档集入口；这与 CLI 的客户端自动配置是不同的接入方式，不需要先配置 MCP。

### 直接提供链接

也可在提示词中附上实际部署地址：先读 llms.txt，再按需读取完整说明与组件 API。localhost 资源需要 AI 工具能够访问你的本机；远端会话应使用可访问的部署 URL，或改用本地 CLI/MCP。

## 通过 CLI 查询

先完成 [CLI 安装](#/ai-cli)，在消费项目执行：

```bash
daisu data list
daisu doctor .
daisu info Form
daisu doc Input
daisu demo Input basic
daisu search "受控" --limit 8
```

CLI 查询随包快照，默认根据项目安装版本选择，不会即时读取网站。先用 data list 核对所需版本；npm 包与 Git 源码中的快照可能不同，缺失时按 [CLI 版本匹配说明](#/ai-cli) 处理。`daisu info Input --version <组件版本>` 可选择已收录数据；CLI 自身版本用 daisu --version 查看。

## 通过 MCP 读取

[配置 MCP](#/ai-mcp) 后，先调用 daisu_status 核对版本，再使用 daisu_info、daisu_doc 和 daisu_demo 查询具体组件。使用约束可通过以下资源读取：

```text
daisu://guides/llms
daisu://guides/llms-full
daisu://guides/component-ai-notes
```

资源采用服务启动时选择的组件数据版本。历史快照可能未收录 guide，缺失时会明确报错；不要把其他版本资料当作当前 API。

## 提问示例

```text
请先确认当前项目安装的 Daisu UI 版本。
阅读对应版本的文档索引，按需查询 Form、FormItem、Input、Button 的
公开属性、事件签名和真实示例，实现受控资料表单并支持深色模式。
页面使用 ReactLynx 元素，文字放在 text 内，不引用库内部文件。
若目标宿主缺少所需能力，请指出接入要求，再执行当前项目的验证命令。
```

## 版本与验证

网站资源对应当前文档构建，CLI/MCP 对应已安装 CLI 的离线快照。文档站版本菜单定位真实更新记录，不会切换本地依赖或 CLI 数据。属性和事件以同版本组件文档及公开类型为准；媒体、上传、键盘与原生手势结合平台说明和设备验收。

资料更新后，维护者先更新 UI 文档；本地协作仓库就绪时，正常构建自动提取快照并导出接入页。其他目录或排查场景可显式 sync / docs export，校验后重新分发 CLI 知识包。已安装的 CLI 查询不触发这些开发同步。详见 [同步流程](#/ai-cli)。

- [AI 总览](#/ai-guide) · [CLI 工具](#/ai-cli) · [MCP 接入](#/ai-mcp) · [AI Skills](#/ai-skills)
