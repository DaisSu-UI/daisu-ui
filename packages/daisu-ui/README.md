# Daisu UI · 袋鼠 UI

面向 ReactLynx 的 UI 组件库，提供表单、展示、反馈、导航组件和独立路由入口。组件使用 Lynx 原生元素，ESM 产物保留 JSX，由消费项目的 ReactLynx 编译器处理。

## 安装

```sh
npm install @daisu-ui/ui@beta
```

消费项目需安装 `@lynx-js/react@^0.126.2`、`@lynx-js/types@^4.2.1` 和 `@types/react@^18.3.0`，使用 Rspeedy 的 `pluginReactLynx({ engineVersion: '4.2' })` 构建。库开发使用 `@lynx-js/types@4.2.1`，iOS 与 Android 均以 Lynx 4.2 作为设备回归目标；首个 beta 尚需完成这两个平台的完整真机验收，不能将 Web 预览通过视为原生验收。编译目标不会升级接收端的原生引擎，宿主集成方须确保引擎至少为 4.2。

若构建插件仍内置 `@lynx-js/tasm@0.0.49`，需在消费项目根 `package.json` 添加 `"overrides": { "@lynx-js/tasm": "0.0.53" }` 并更新锁文件；旧编译器最高只支持 Lynx 3.9。当前 workspace 已配置此覆盖，独立仓库保留此配置。

## 使用

```tsx
import { root } from '@lynx-js/react';
import { Button, ConfigProvider, RootPortalHost } from '@daisu-ui/ui';

root.render(
  <ConfigProvider>
    <RootPortalHost>
      <Button label="确定" onTap={() => { 'background only'; console.log('tap'); }} />
    </RootPortalHost>
  </ConfigProvider>,
);
```

从 `@daisu-ui/ui` 导入组件时会自动加载样式，无需额外引入 CSS；生产构建会保留该副作用。`RootPortalHost` 承载弹窗、Toast 等浮层；需要与内容处于同一个 `ConfigProvider` 内。主题 API 见仓库的 `docs/ui/components/`；通过 `npm run ui:docs:dev` 预览文档与独立 Demo。为兼容现有页面，CSS 变量暂时保留 `--cso-ui-*` 命名，类名前缀保留 `ui-`。

### 公开入口

| 入口 | 内容 |
| --- | --- |
| `@daisu-ui/ui` | UI 组件、hooks、类型及 tokens |
| `@daisu-ui/ui/styles.css` | 全部组件及通用控件样式，保留为兼容入口，常规使用无需手动引入 |
| `@daisu-ui/ui/router` | Router、RouterView、路由 hooks 和宿主历史适配接口 |
| `@daisu-ui/ui/router/location` | 无渲染依赖的地址编解码和宿主历史类型，供纯 Web 宿主使用 |
| `@daisu-ui/ui/router/runtime` | Lynx 路由运行环境初始化，有副作用，须保留 |
| `@daisu-ui/ui/utils` | Demo 可复用的日期、轮播和按压状态辅助 API |

使用路由时，在应用入口、加载 TanStack Router 之前引入 `@daisu-ui/ui/router/runtime`。路由入口也包含运行环境初始化与 URLSearchParams 兼容处理。使用 TanStack 的路由树 API 时，应在应用直接声明 `@tanstack/react-router@1.170.46` 依赖，并按 ReactLynx 官方接入配置将 `react`、`react/jsx-runtime`、`react/jsx-dev-runtime` 映射到 `@lynx-js/react/compat` 及对应 JSX runtime。

```tsx
import '@daisu-ui/ui/router/runtime';
import { RouterView, createRouter } from '@daisu-ui/ui/router';
```

### 宿主能力

组件包不包含业务会话、请求地址或 FlutterBridge。`Upload` 使用调用方传入的 `UploadAdapter` 接入选图、上传和预览；路由通过 `RouterHistoryAdapter` 接入宿主历史。业务网络请求及鉴权继续由应用负责。

`EmbeddedLayout` 与业务状态、搜索工具栏等组件留在主应用。`PagedList` 继续使用官方 `FeedList`，没有更换滚动后端。

## 本仓库开发

本仓库以 npm workspace 管理组件包、独立 Demo 和文档。组件源码唯一位于 packages/daisu-ui/src，示例唯一位于 apps/demo/src/features/ui-demo，组件包不依赖主业务工程。Demo 使用公开 exports；库测试通过源码 alias 共享上下文，真实产物由隔离 tarball 消费验收。

```sh
npm ci
npm test
npm run test:types
npm run build
npm run ui:check
npm run ui:pack
```

ui:check 创建临时工程、安装真实 tarball 并检查声明、保留 JSX、样式和 Lynx/Web 构建。ui:pack 输出 artifacts/ 下的 npm tarball。主业务工程只安装 tarball 或已发布版本，不再构建库源码。

## 发布与切换

npm 包名为 `@daisu-ui/ui`，预发布渠道为 `beta`。仅发布本 UI 库的构建产物、类型、样式、更新日志与许可证，不含 Demo、文档应用或 CLI/MCP。

源码采用 `developer → main` 审核发布；本地与 CI 发布脚本都会核对提交已合入远端 main。在仓库根执行：

```sh
npm ci
npm login --registry=https://registry.npmjs.org/ --auth-type=web
npm run ui:npm:release -- --dry-run
npm run ui:npm:publish
```

完整更新版本、合并分支、创建源码 Tag、GitLab NPM_TOKEN 配置与安装回退示例见 [仓库 README](https://git.zilueit.com/daisu-ui/daisu-ui/blob/main/README.md)。npm 组件包与应用 Manifest/Bundle 分别发布。

## License

MIT。第三方版权与改编说明见 `THIRD_PARTY_NOTICES.md` 及包内 `dist/icons/LICENSE.tabler`。

### 浏览器富文本音视频

浏览器宿主在挂载 `<lynx-view>` 之前调用 `import { registerRichTextMedia } from '@daisu-ui/ui/web'; registerRichTextMedia();`。Lynx 富文本传 `mediaMode="browser"`，即可使用 HTML5 视频控件和音频播放条，以及 ref 的 playMedia/pauseMedia/seekMedia。默认不加载 DOM 代码。该模式目前仅用于浏览器，Flutter 默认继续使用 `mediaMode="none"`。详见 `docs/ui/components/rich-text.md`。

浏览器宿主可统一调用 `registerDaisuWebComponents()` 注册富文本音视频、视频预览、图片裁剪和二维码 PNG 导出。`VideoPreview` 使用 `mediaMode="browser"`；`ImgCropper` 使用 `mode="browser"`，真实导出PNG/JPEG Blob URL并支持下载。参见仓库 `docs/ui/components/video-preview.md` 与 `img-cropper.md`；Flutter后端尚未接入。
