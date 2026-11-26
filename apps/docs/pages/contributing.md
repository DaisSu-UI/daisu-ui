# 贡献指南

在独立仓库中维护组件、示例与文档，让 API 描述和可运行代码同步。

## 目录约定

```text
packages/daisu-ui/src/              组件源码
apps/demo/src/features/ui-demo/     独立示例
apps/docs/                          文档站与页面导航
docs/ui/                           API 与 AI 文档
docs/MAINTENANCE.md                文件来源与生成规则
```

## 开发流程

先读取 AGENTS.md 和 Lynx 官方文档，再修改组件或文档。外部 Lynx 技能可在本机按需安装和更新，`.agents/skills/` 不随仓库分发。新增组件需提供独立示例，说明属性、事件、主题和平台范围。

## 验证

```bash
npm test
npm run test:types
npm run build
```

发布包前运行 npm run ui:check 与 npm run ui:pack，核对真实 tarball 消费和打包清单。原生能力变更需在目标设备验证。

## 提交

提交说明应描述具体行为和验证结果。文档页面与顶部菜单使用共同的导航配置，新增页面时同步提供实际内容。

- [版本发布](#/publishing)
- [源码仓库](https://github.com/DaisSu-UI/daisu-ui)
- [AI Skills](#/ai-skills)
