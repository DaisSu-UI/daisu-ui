# Agent Skills

Skills 为 AI 提供特定任务的工作规则。本仓库在 .agents/skills 中维护 Lynx 开发技能，开发前按任务读取相应的 SKILL.md。

## 已安装的技能

| 技能 | 适用任务 |
| --- | --- |
| lynx-api-docs | 原生元素、布局与平台 API 查询 |
| reactlynx-best-practices | 双线程边界、生命周期、事件与组件库发布 |
| lynx-check-css-support | 查询 CSS 属性和值在目标平台与版本上的支持度 |
| lynx-ui | 选择与组合官方 Lynx UI 组件 |

## 在项目中使用

将独立仓库作为 AI 工作目录，先读取根目录 AGENTS.md，再按任务打开技能入口：

```text
.agents/skills/lynx-api-docs/SKILL.md
.agents/skills/reactlynx-best-practices/SKILL.md
.agents/skills/lynx-check-css-support/SKILL.md
.agents/skills/lynx-ui/SKILL.md
```

技能引用的配套文档和脚本也位于对应目录。需要在其他项目使用时，应携带整个技能目录，并核对目标项目的 Lynx 版本与构建工具。

## 任务选择

调整元素布局前查阅 API 文档，新增 CSS 时查询兼容性，编写组件时核对 ReactLynx 双线程规则，使用官方组件前核对其公开参数。

## 验证命令

```bash
npm test
npm run test:types
npm run build
```

发布组件包前，还需运行 npm run ui:check 和 npm run ui:pack。Web 预览用于验证浏览器行为，原生能力仍由消费项目完成目标设备验证。

- [AI 使用指南](#/ai-guide)
- [MCP 接入](#/ai-mcp)
