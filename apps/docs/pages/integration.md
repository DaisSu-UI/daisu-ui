# 组件库集成

消费项目通过 daisu-ui 的公开入口使用组件，不直接引用独立仓库的内部源码。

## 公开入口

| 入口 | 用途 |
| --- | --- |
| daisu-ui | 组件、hooks 与公开类型 |
| daisu-ui/router | 路由、页面容器与历史适配 |
| daisu-ui/router/location | 纯地址解析与历史状态类型 |
| daisu-ui/router/runtime | Lynx 路由运行环境初始化 |
| daisu-ui/utils | 公开辅助函数 |
| daisu-ui/web | 浏览器自定义元素注册 |

## 安装产物

组件包提供保留 JSX 的 ESM、声明文件和样式，由消费项目的 ReactLynx 编译器处理。安装后核对 peerDependencies 和引擎版本。

未发布的开发版本可在独立仓库运行 npm run ui:pack，再安装生成的 tarball。消费项目提交依赖与锁文件，避免依赖开发者机器上的源码链接。

## 应用根节点

```tsx
import { ConfigProvider, RootPortalHost } from 'daisu-ui';

<ConfigProvider>
  <RootPortalHost>
    {/* 页面与路由 */}
  </RootPortalHost>
</ConfigProvider>
```

## 更新与回归

升级后检查类型、应用构建、业务回归与目标平台行为。组件库版本和业务 Bundle/Manifest 版本分别维护。

- [快速上手](#/getting-started)
- [Router 开发指南](router.md)
- [平台适配](#/platforms)
