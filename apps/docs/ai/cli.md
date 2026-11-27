# @daisu-ui/cli

[@daisu-ui/cli](https://www.npmjs.com/package/@daisu-ui/cli) 是 Daisu UI 的 AI 工具包，提供命令行工具、MCP Server、版本化离线组件知识库和消费端 Skill。它将真实的 ReactLynx 组件 API、文档、示例、主题变量和更新记录接入终端、编辑器与 Agent。

[npm 包](https://www.npmjs.com/package/@daisu-ui/cli) · [源码仓库](https://github.com/DaisSu-UI/cli) · [AI 总览](#/ai-guide)

不确定 CLI、LLMs.txt、MCP 和 Skills 的区别时，先阅读 [AI 总览](#/ai-guide)。组件运行时包为 @daisu-ui/ui，CLI 是单独安装的开发工具。

## 亮点

- **离线知识库**：组件属性、事件、插槽、方法、CSS 变量、Demo 与更新记录随包提供，查询不依赖文档服务或 API Key。
- **适合 Agent 调用**：查询支持结构化输出，MCP 提供按需工具、文档资源和 Prompt。
- **匹配项目版本**：识别实际安装依赖，支持选择已收录版本，历史包名和当前 @daisu-ui/ui 按各自 API 查询。
- **ReactLynx 项目分析**：doctor、usage、lint 基于 TypeScript AST 检查集成、组件使用和已知模式，不执行被扫描代码。
- **客户端接入**：可一次配置 MCP、Skill 和 Instructions，支持预览计划并保留用户已有配置。

## 安装

需要 Node.js >=20.19.0。当前发布在 npmjs，预发布建议显式安装 beta 标签：

```bash
npm install -g @daisu-ui/cli@latest
daisu --version
```

安装完成后可使用 daisu 命令。需要固定 CLI 版本时，先用 npm view @daisu-ui/cli versions --json 查询已发布列表，再将 beta 换为其中的精确版本。

不全局安装也可使用：

```bash
npx --yes @daisu-ui/cli@latest info Button
# 或安装为消费项目的开发依赖
npm install --save-dev @daisu-ui/cli@latest
npx --no-install daisu info Button
```

首次安装和 npx 下载可能联网；安装后的本地知识查询与 MCP 默认离线。项目开发依赖用户将后文 daisu 替换为 npx --no-install daisu。

## 快速开始

在消费项目执行：

```bash
daisu list
daisu info Button
daisu demo Button basic
daisu doc Button
daisu token Button
daisu changelog
```

组件名支持公开名称、目录 ID 和中文名，例如 Button、button、按钮。分组 ID 指向该组首个公开组件；Row、Col 等成员可以单独查询。

## 命令速查

### 组件知识

| 命令 | 用途 | 选项 |
| --- | --- | --- |
| `daisu list [keyword]` | 列出或搜索组件与 Hook | `--format <format>`、`--version <version>`、`--cwd <dir>` |
| `daisu search <query>` | 离线全文搜索组件文档与使用约束 | `--limit <count>`、`--format <format>`、`--version <version>`、`--cwd <dir>` |
| `daisu info <component>` | 查询公开 API | `--format <format>`、`--version <version>`、`--cwd <dir>` |
| `daisu doc <component>` | 输出组件文档 | `--format <format>`、`--version <version>`、`--cwd <dir>` |
| `daisu demo <component> [demo]` | 列出或输出组件示例 | `--format <format>`、`--version <version>`、`--cwd <dir>` |
| `daisu token [component]` | 查询 CSS 变量 | `--format <format>`、`--version <version>`、`--cwd <dir>` |
| `daisu changelog [releaseOrComponent] [component]` | 查询更新日志 | `--format <format>`、`--version <version>`、`--cwd <dir>` |

demo 不指定示例名时列出示例；basic 读取基本用法，source 读取完整交互源码，其他示例名以实际列表为准。token 不带组件名时查询全局变量。search 检索完整组件说明和 LLM 约束，多个关键词以空格分隔并要求全部匹配。

```bash
daisu list 表单
daisu info Input --format json
daisu demo Button
daisu demo Button source
daisu search "受控" --limit 8
daisu changelog Button
```

### 项目分析

| 命令 | 用途 | 选项 |
| --- | --- | --- |
| `daisu doctor [dir]` | 诊断 ReactLynx 项目集成 | `--format <format>`、`--version <version>`、`--cwd <dir>`、`--strict` |
| `daisu usage [dir]` | 统计 TSX/JSX 组件使用 | `--format <format>`、`--version <version>`、`--cwd <dir>`、`--strict` |
| `daisu lint [dir]` | 诊断组件用法 | `--format <format>`、`--version <version>`、`--cwd <dir>`、`--strict` |

```bash
daisu doctor .
daisu usage . --format json
daisu lint .
daisu lint . --strict
```

doctor 检查 Node、依赖、JSX 集成与知识版本；usage 统计组件和 Hook；lint 检查私有导入、未知导出或属性、空按钮及已知线程回调模式。有错误时 lint 返回非零退出码，--strict 将警告也视为失败。

扫描覆盖 TS/TSX、JS/JSX 及其 c/m 扩展名，忽略依赖、输出目录、vendor 和符号链接。它不提供完整的跨文件 barrel 推导，不能代替 tsc、测试、构建和原生设备验收。

## MCP Server

启动 stdio 服务：

```bash
daisu mcp
```

全局安装后，在支持 mcpServers 的客户端中添加：


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


客户端需能在 PATH 找到 daisu，并在消费项目目录启动服务。需要固定目录时，args 使用 ["mcp", "--cwd", "/absolute/path/to/project"]。服务没有网页或监听端口，一般由客户端启动，无需提前在终端运行。

也可以让 CLI 自动配置本机入口：

```bash
daisu mcp init --client cursor --dry-run
daisu mcp init --client cursor --yes
daisu mcp doctor --client cursor
```

当前实际工具如下，来自 MCP 握手结果：

| 工具 | 用途 |
| --- | --- |
| `daisu_status` | 离线 MCP 服务、CLI 版本、可用组件库版本及数据来源。 |
| `daisu_search` | 离线全文搜索组件文档与平台约束，多个词须全部匹配，按来源文档去重。 |
| `daisu_list` | 查询组件/Hook；可按中英文名称、分类或用途搜索。 |
| `daisu_info` | 查询真实公开 Props、事件、插槽、方法、CSS 变量。 |
| `daisu_doc` | 读取组件完整 Markdown 文档和平台能力边界。 |
| `daisu_demo` | 列出示例或读取指定示例；basic 为基本用法，source 为完整交互源码。 |
| `daisu_token` | 查询组件或全局 CSS 变量及默认值。 |
| `daisu_changelog` | 按发布版本或组件筛选开发/更新记录。 |
| `daisu_lint` | 只读检查当前项目 TSX/JSX 中的组件导入、属性和回调。 |
| `daisu_usage` | 统计当前项目 TSX/JSX 组件及 Hook 使用情况。 |
| `daisu_doctor` | 检查当前项目 Node、依赖、知识库版本与 JSX 集成。 |

VS Code、Codex 等配置格式、文档资源、Prompt、版本与连接排查见 [MCP 接入详情](#/ai-mcp)。独立握手通过后，仍需在实际会话调用 daisu_status 确认工具可用。

## Agent 与 AI Skills

在消费项目中，一次接入 MCP、Skill 和 Instructions：

```bash
daisu agent list
daisu agent init --client auto --dry-run
daisu agent init --client cursor --yes
daisu agent doctor --client cursor
```

将 cursor 换为自己的客户端 ID。自动探测不明确时要求显式选择，--client all 表示明确接入全部支持的客户端。仅需 MCP 用 mcp init；Skill 内容、文件位置与移除步骤见 [AI Skills](#/ai-skills)。

## 通用参数

| 参数 | 适用命令 | 说明 |
| --- | --- | --- |
| --format text\|json\|markdown | 查询与分析命令 | 选择文本、JSON 或 Markdown 输出；以命令 --help 为准 |
| --version <版本> | 组件查询、项目分析及 MCP 服务 | 选择已收录组件版本或范围，latest 表示随包最新快照 |
| --cwd <目录> | 支持该选项的查询、接入和服务命令 | 指定版本识别或客户端目标目录 |
| --limit <数量> | search | 限制结果数，为 1–20，默认 8 |
| --strict | lint | 将 lint 警告也视为失败；doctor 和 usage 不额外产生 lint 警告诊断 |

```bash
daisu --version
daisu data list
daisu info Button --version 0.1.0-beta.1
daisu info Button --version latest --format json
daisu info Button --cwd /absolute/path/to/project
```

顶层 --version 显示 CLI 自身版本；子命令后的 --version 选择组件资料。默认依次检查显式版本、项目实际安装版本、最近 package.json 依赖声明、随包 latest。不存在对应快照时明确报错，不把其他版本冒充当前 API。

尚未安装的 file、workspace、Git 依赖无法确定精确版本，会给出警告并使用随包数据；先安装组件包或选择已收录版本。当前包使用 @daisu-ui/ui，历史 daisu-ui 快照的导入入口以返回的 importFrom 为准。

## 版本缺失时的处理

UI 包和 CLI 的 npm 版本分别发布，网站或 Git 中的新快照不会自动进入已经安装的 CLI。先执行 daisu data list；若目标版本不存在，更新到收录它的 CLI 后再次核对。

项目升级 UI 后，需安装收录该精确版本快照的 CLI，或从包含该快照的 Git 源码构建。--version latest 只选择当前 CLI 已有的快照，不能让旧包获得新 API。Bundle 引擎目标与类型依赖也按所选 UI 版本的说明核对，不从工具自身版本推断。

从 Git 构建后，在消费项目用构建入口查询或重新配置客户端：

```bash
git clone git@github.com:DaisSu-UI/cli.git
cd cli
npm ci
npm run build
node dist/index.js data list
node /absolute/path/to/cli/dist/index.js info Button --cwd /absolute/path/to/project
node /absolute/path/to/cli/dist/index.js mcp init --client cursor --dry-run --cwd /absolute/path/to/project
```

确认计划后再执行 init --yes；不能把其他组件版本的参数当作当前版本的用法。消费项目也可使用与已收录快照匹配的组件版本。维护者需单独发布新 CLI 才能把新增快照分发给 npm 用户。

## 数据校验与更新

```bash
daisu data check
daisu update
daisu update --check
```

data check 校验版本索引、结构和 SHA-256 摘要。update 默认只报告本地状态；--check 才联网查询 CLI 更新，不自动安装。升级 CLI 可重新执行 npm install -g @daisu-ui/cli@latest；升级后按 data list 核对实际收录的组件版本。

## 源码开发与资料同步

源码：[git@github.com:DaisSu-UI/cli.git](https://github.com/DaisSu-UI/cli)。源码用户可以构建后通过 node /absolute/path/to/cli/dist/index.js 使用，也可 npm pack 生成 tarball。

本地按 DaiSu-UI/{cli,daisu-ui} 并列维护且依赖就绪时，正常构建自动完成 UI 组件资料 → CLI 快照、CLI 接入说明 → UI 文档站的双向同步。CLI 的 npm run dev 持续监听；UI 的 npm run ui:docs:dev 同时更新文档与必要的演示 Bundle。

非同级目录通过 DAISU_UI_SOURCE / DAISU_UI_CLI_SOURCE 定位，DAISU_UI_AUTO_SYNC=0 关闭开发协作。单仓库仍能独立构建；CI 自动只读检查，不修补资料。安装后的查询不触发源码协作。

需要指定目录或排查时，在 CLI 仓库运行：

```bash
npm run sync -- --ui-dir /absolute/path/to/daisu-ui
npm run docs:export -- --ui-dir /absolute/path/to/daisu-ui
npm run sync -- --ui-dir /absolute/path/to/daisu-ui --check
npm run docs:export -- --ui-dir /absolute/path/to/daisu-ui --check
# 使用已安装的 CLI 直接做只读比较
daisu docs export --ui-dir /absolute/path/to/daisu-ui --check
```

--check 严格只读。版本数据提交到 CLI，接入页面和摘要清单提交到 UI，不手工修改生成页。开发文档、CLI npm 发布、组件 npm 发布与业务 Bundle 分别执行。

本文由 `@daisu-ui/cli@0.1.0-beta.8` 生成。内容在 CLI 仓库维护；更新方式见 [CLI 工具](#/ai-cli)。
