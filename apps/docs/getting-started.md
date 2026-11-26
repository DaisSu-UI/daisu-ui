# 快速上手

面向 ReactLynx 的组件库。这里提供组件说明、API 和交互示例，右侧预览可直接操作。

## 安装

```bash
npm install @daisu-ui/ui@beta
# 固定当前已公开发布的版本
npm install --save-exact @daisu-ui/ui@0.1.0-beta.4
```

组件包已发布到 [npmjs](https://www.npmjs.com/package/@daisu-ui/ui)，固定版本示例使用已公开的 0.1.0-beta.4，@beta 会安装该标签当前指向的版本。上面两种安装方式任选其一；npm 安装不需要克隆组件库或配置 GitLab SSH。安装后提交消费项目的 package.json 和锁文件。

项目需使用 ReactLynx，并在 Rspeedy 中启用 `pluginReactLynx({ engineVersion: '4.2' })`。当前开发类型为 `@lynx-js/types@4.2.1`，原生宿主引擎须为 Lynx 4.2 或更高版本；其他依赖版本以包的 `peerDependencies` 为准。

若构建插件仍依赖 `@lynx-js/tasm@0.0.49`，在消费项目根 `package.json` 添加 `"overrides": { "@lynx-js/tasm": "0.0.53" }` 并重新安装依赖，以使用支持 Lynx 4.2 的编译器。

## 使用组件

```tsx
import { Button } from '@daisu-ui/ui';

export function Example() {
  return <Button label="开始使用" onTap={() => {
    'background only';
    console.log('Hello Daisu UI');
  }} />;
}
```

组件入口会自动加载样式，无需额外导入 CSS。

## 主题与弹层

```tsx
import { ConfigProvider, RootPortalHost } from '@daisu-ui/ui';

export function App() {
  return <ConfigProvider theme="light">
    <RootPortalHost>
      <Example />
    </RootPortalHost>
  </ConfigProvider>;
}
```

使用需要根节点传送门的弹层时，在应用根部配置一次 `RootPortalHost`。

## 预览说明

网页预览运行于 Lynx Web。原生布局、手势、性能和宿主能力仍需在目标 Android / iOS 设备验证。上传、相机等示例由实际应用注入宿主能力，独立 Demo 展示组件状态与交互。

## 使用 AI 开发

CLI 与组件库分别安装。全局安装已发布的 CLI 后，在消费项目查询 API 或接入编辑器：

```bash
npm install -g @daisu-ui/cli@beta
daisu data list
daisu doctor .
daisu info Button
daisu agent init --client cursor --dry-run
daisu agent init --client cursor --yes
```

CLI 提供离线知识查询、MCP 和消费端 Skill，不是运行组件的必需依赖。先确认 data list 收录了项目的组件版本；若缺失，按 [CLI 版本匹配步骤](#/ai-cli?section=ai-cli-版本缺失时的处理) 更新工具或使用源码入口，组件本身可继续按本站对应版本文档使用。客户端 ID、简洁 MCP 配置和版本选择见 [AI 总览](#/ai-guide)、[CLI 工具](#/ai-cli) 与 [MCP 接入](#/ai-mcp)。

## 升级与回退

在消费项目显式安装目标版本，核对类型、构建与业务回归后提交锁文件。使用 beta 标签会安装该标签当前指向的版本；需要可重复安装时固定版本并保留锁文件。

```bash
npm view @daisu-ui/ui dist-tags --json --registry=https://registry.npmjs.org/
npm install @daisu-ui/ui@beta
```

开发分支、main 发布来源校验、版本标签和 npm / Git 分发见 [版本发布](#/publishing)。

## 完整工程与支持范围

- [浏览器最小工程与下载](./web-quickstart.md)
- [Flutter Manifest 与宿主接入](./flutter-quickstart.md)
- [平台兼容性总表](./compatibility.md)
