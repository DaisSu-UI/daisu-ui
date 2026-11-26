# 组件库集成

消费项目通过 @daisu-ui/ui 的公开入口使用组件，不直接引用独立仓库的内部源码。

## 公开入口

| 入口 | 用途 |
| --- | --- |
| @daisu-ui/ui | 组件、hooks 与公开类型 |
| @daisu-ui/ui/router | 路由、页面容器与历史适配 |
| @daisu-ui/ui/router/location | 纯地址解析与历史状态类型 |
| @daisu-ui/ui/router/runtime | Lynx 路由运行环境初始化 |
| @daisu-ui/ui/utils | 公开辅助函数 |
| @daisu-ui/ui/web | 浏览器自定义元素注册 |

## 安装产物

组件包提供保留 JSX 的 ESM、声明文件和样式，由消费项目的 ReactLynx 编译器处理。安装后核对 peerDependencies 和引擎版本。

组件包已发布到 npmjs，当前 beta 通过以下命令安装：

```bash
npm install @daisu-ui/ui@beta
# 固定当前已发布版本
npm install --save-exact @daisu-ui/ui@0.1.0-beta.6
```

升级和回退均显式安装对应版本，并提交消费项目的 package.json 与锁文件。npm 安装不需要源码仓库 SSH 权限；Git 安装标签与本地 tarball 作为补充分发方式，详见 [版本发布](#/publishing)。组件库与 CLI 独立安装和发版。

## 应用根节点

```tsx
import { ConfigProvider, RootPortalHost } from '@daisu-ui/ui';

<ConfigProvider>
  <RootPortalHost>
    {/* 页面与路由 */}
  </RootPortalHost>
</ConfigProvider>
```

## 更新与回归

升级后检查类型、应用构建、业务回归与目标平台行为。组件库版本和业务 Bundle/Manifest 版本分别维护。

- [快速上手](#/getting-started)
- [Router 开发指南](#/router)
- [平台适配](#/platforms)

## 完整工程与支持范围

- [浏览器最小工程与下载](./web-quickstart.md)
- [Flutter Manifest 与宿主接入](./flutter-quickstart.md)
- [平台兼容性总表](./compatibility.md)
