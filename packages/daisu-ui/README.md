<p align="center">
  <img src="https://cdn.jsdelivr.net/npm/@daisu-ui/ui@beta/dist/brand/logo.svg" width="120" height="120" alt="Daisu UI 袋鼠 UI Logo" />
</p>

<h1 align="center">Daisu UI · 袋鼠 UI</h1>

<p align="center">面向 ReactLynx 的移动端组件库</p>
<p align="center">原生元素 · TypeScript · 主题定制 · 深色模式</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@daisu-ui/ui"><img src="https://img.shields.io/npm/v/@daisu-ui/ui/beta?style=flat-square&amp;logo=npm&amp;color=FF6A00" alt="npm beta version" /></a>
  <a href="https://www.npmjs.com/package/@daisu-ui/ui"><img src="https://img.shields.io/npm/dm/@daisu-ui/ui?style=flat-square&amp;logo=npm&amp;color=FF6A00" alt="npm downloads" /></a>
  <a href="https://opensource.org/license/mit"><img src="https://img.shields.io/badge/license-MIT-FF6A00?style=flat-square" alt="MIT license" /></a>
  <a href="https://lynxjs.org/"><img src="https://img.shields.io/badge/Lynx-%E2%89%A5%204.2-FF6A00?style=flat-square" alt="Lynx 4.2 or later" /></a>
</p>

## ✨ 特性

- **丰富的移动端组件**：覆盖基础布局、表单输入、数据展示、导航、反馈和媒体交互。
- **ReactLynx 原生元素**：基于 `@lynx-js/react` 与 `@lynx-js/lynx-ui`，保留 React 的组件开发方式。
- **完整的 TypeScript 类型**：提供组件 Props、事件、Ref 与独立入口的类型声明。
- **主题定制**：通过 `ConfigProvider` 和 CSS 变量统一外观，支持浅色、深色主题。
- **开箱即用的样式**：导入组件时自动加载 CSS，无需单独引入样式文件。
- **独立路由入口**：提供路由视图、导航 hooks 与宿主历史适配接口。
- **宿主能力可扩展**：上传、媒体和页面历史通过适配接口接入应用。

## 📦 安装

当前为 beta 版本，建议显式安装 `beta` 渠道：

```bash
# npm
npm install @daisu-ui/ui@beta

# pnpm
pnpm add @daisu-ui/ui@beta

# yarn
yarn add @daisu-ui/ui@beta
```

需要锁定版本时：

```bash
npm install @daisu-ui/ui@0.1.0-beta.4
```

本包包含 UI 库的 ESM、保留 JSX 的组件、类型声明、CSS 和许可证。Demo、文档应用和 CLI 不随组件包发布。

## 🚀 快速上手

在已经配置 ReactLynx 的项目中，从公开入口导入组件：

```tsx
import { root } from '@lynx-js/react';
import { Button, ConfigProvider, RootPortalHost } from '@daisu-ui/ui';

function App() {
  return (
    <ConfigProvider theme="light">
      <RootPortalHost>
        <Button
          label="开始使用 Daisu UI"
          onTap={() => {
            'background only';
            console.log('Hello Daisu UI');
          }}
        />
      </RootPortalHost>
    </ConfigProvider>
  );
}

root.render(<App />);
```

组件入口自动加载样式。`RootPortalHost` 为弹窗、Toast 等浮层提供挂载位置，在应用根部配置一次，并放在同一个 `ConfigProvider` 内。

### 环境要求

| 依赖 | 版本 |
| --- | --- |
| Lynx 原生引擎 | 4.2 或更高 |
| `@lynx-js/react` | `^0.126.2` |
| `@lynx-js/types` | `^4.2.1` |
| `@types/react` | `^18.3.0` |

使用 Rspeedy 的 `pluginReactLynx({ engineVersion: '4.2' })` 构建。组件包保留 JSX，由消费项目的 ReactLynx 编译器完成转换。

如果构建插件仍内置 `@lynx-js/tasm@0.0.49`，需要在项目根 `package.json` 配置支持 Lynx 4.2 的编译器并重新安装依赖：

```json
{
  "overrides": {
    "@lynx-js/tasm": "0.0.53"
  }
}
```

编译目标不会升级宿主引擎；宿主集成方须同步满足引擎版本要求。

## 🧩 组件一览

| 分类 | 部分组件 |
| --- | --- |
| 基础与布局 | Button、Text、Icon、Row / Col、Grid、Cell、Card |
| 表单与选择 | Input、Textarea、Form、Checkbox、Radio、Switch、Picker、Calendar、Upload |
| 数据展示 | Avatar、Badge、Tag、Table、Progress、Skeleton、CountDown、Swiper |
| 操作反馈 | Popup、Dialog、Toast、Notify、ActionSheet、Popover、Tooltip |
| 导航与滚动 | Navbar、Tabbar、Tabs、Sidebar、IndexBar、PagedList、Backtop |
| 媒体与工具 | Img、ImagePreview、RichText、VideoPreview、ImgCropper、QrCode、Signature |

组件、hooks 和类型统一从 `@daisu-ui/ui` 导入，按实际场景组合使用。

## 🎨 主题定制

通过 `ConfigProvider` 统一设置主题：

```tsx
import { Button, ConfigProvider } from '@daisu-ui/ui';

export function DarkExample() {
  return (
    <ConfigProvider theme="dark">
      <Button label="深色模式" />
    </ConfigProvider>
  );
}
```

主题变量与组件属性均有 TypeScript 声明。需要自定义品牌色、间距或圆角时，可使用 `ConfigProvider` 的主题配置及 CSS 变量。

## 🔌 公开入口

| 入口 | 用途 |
| --- | --- |
| `@daisu-ui/ui` | 组件、hooks、类型与主题 tokens |
| `@daisu-ui/ui/router` | 路由视图、路由 hooks 与宿主历史适配 |
| `@daisu-ui/ui/router/runtime` | 路由运行环境初始化 |
| `@daisu-ui/ui/router/location` | 无渲染依赖的地址编解码与历史类型 |
| `@daisu-ui/ui/utils` | 日期、轮播和按压状态等辅助 API |
| `@daisu-ui/ui/web` | 浏览器媒体、裁剪及二维码导出后端注册 |
| `@daisu-ui/ui/styles.css` | 兼容的独立样式入口，常规使用无需手动导入 |

### 浏览器媒体能力

在浏览器宿主挂载 `<lynx-view>` 前注册 Web 后端：

```ts
import { registerDaisuWebComponents } from '@daisu-ui/ui/web';

registerDaisuWebComponents();
```

`RichText`、`VideoPreview` 使用 `mediaMode="browser"`，`ImgCropper` 使用 `mode="browser"`。浏览器后端提供 HTML5 音视频播放、图片裁剪和二维码 PNG 导出；原生宿主需要实现对应适配。

### 路由接入

使用路由时，在加载路由逻辑前初始化运行环境：

```ts
import '@daisu-ui/ui/router/runtime';
import { RouterView, createRouter } from '@daisu-ui/ui/router';
```

使用 TanStack 路由树 API 时，在应用中直接声明 `@tanstack/react-router@1.170.46`，并将 `react`、`react/jsx-runtime`、`react/jsx-dev-runtime` 分别映射到 ReactLynx 对应的兼容入口。

## 📱 平台与宿主

Daisu UI 的原生引擎目标为 Lynx 4.2，浏览器使用 Lynx Web。布局、手势、性能和原生能力需要在目标设备验收，当前 beta 尚未完成 Android / iOS 全部组件的完整真机回归。

上传通过 `UploadAdapter` 接入选图、上传和预览；路由通过 `RouterHistoryAdapter` 接入页面历史。网络请求、鉴权与业务会话由使用方应用负责。

## AI 与 CLI

独立的 [CLI 仓库](https://git.zilueit.com/daisu-ui/cli) 提供离线组件查询、MCP 和消费端 Skill，通过 npm install -g @daisu-ui/cli@beta 安装，也支持 Git 源码和 tarball。先核对实际组件版本，再用 daisu info/doc/demo/token 查询；客户端一键接入使用 daisu agent init，仅 MCP 使用 daisu mcp init。

在 UI 仓库运行 npm run ui:docs:dev，可从 AI 菜单访问总览、LLMs.txt、CLI、MCP 与 Skills。CLI 快照不会因文档站或源码更新自动刷新；项目编译与原生能力仍需独立验证。

## 🤝 参与开发

源码维护在 [Daisu UI GitLab 仓库](https://git.zilueit.com/daisu-ui/daisu-ui)，需要仓库访问权限。开发约定、发布操作与变更记录在仓库维护，组件版本变化也可查看安装包内的 `CHANGELOG.md`。

## 📄 开源协议

[MIT](https://opensource.org/license/mit)。第三方版权与改编说明见包内 `THIRD_PARTY_NOTICES.md`，Tabler 图标许可见 `dist/icons/LICENSE.tabler`。
