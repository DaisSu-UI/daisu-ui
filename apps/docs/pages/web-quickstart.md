# 浏览器完整接入

提供可下载的最小 ReactLynx 工程，包含 UI 组件、主题、RootPortalHost、原生 Bundle 构建与浏览器宿主。项目不依赖本仓库内部源码。

## 下载并运行

[下载最小工程 ZIP](./downloads/daisu-ui-quickstart.zip)，解压后在 quickstart 目录执行：

```bash
npm ci
npm run build
npm run dev
```

打开终端输出的 http://localhost:3092。下载包固定 @daisu-ui/ui@0.1.0-beta.4，并保存锁文件；升级时显式调整版本并重新验证。也可从 UI 仓库 examples/quickstart 获取相同工程。需要 Node.js ^20.19.0 或 >=22.12.0。

## 文件与产物

| 文件 | 用途 |
| --- | --- |
| src/index.tsx | 按钮计数、主题切换与应用根节点 |
| lynx.config.ts | ReactLynx 插件、Lynx 4.2 编译目标 |
| web/main.ts | 独立浏览器宿主，先注册扩展再挂载 lynx-view |
| web/rsbuild.config.ts | 浏览器构建及开发服务，资源支持子路径 |
| dist/app.lynx.bundle | 原生宿主需要下载的 Bundle |
| dist-web/app.web.bundle | 浏览器专用 Bundle |
| h5-dist/ | 可部署到静态服务器的完整网页 |

浏览器与原生产物分别生成，不能将 app.web.bundle 交给 Flutter，也不能把 TSX 源码直接当 Bundle 加载。

## 应用根节点

```tsx
import { root, useInitData, useState } from '@lynx-js/react';
import { Button, ConfigProvider, RootPortalHost } from '@daisu-ui/ui';

function App() {
  const data = useInitData() as { theme?: string };
  const [theme, setTheme] = useState<'light' | 'dark'>(data.theme === 'dark' ? 'dark' : 'light');
  const [count, setCount] = useState(0);
  return <ConfigProvider theme={theme} style={{ height: '100%', backgroundColor: 'var(--cso-ui-surface)' }}>
    <RootPortalHost>
      <view style={{ padding: '24px' }}>
        <text style={{ color: 'var(--cso-ui-text)' }}>已点击 {count} 次</text>
        <Button label="点击" onTap={() => { 'background only'; setCount(value => value + 1); }} />
        <Button label="切换主题" onTap={() => { 'background only'; setTheme(value => value === 'light' ? 'dark' : 'light'); }} />
      </view>
    </RootPortalHost>
  </ConfigProvider>;
}

root.render(<App />);
```

从组件入口导入会自动加载样式。公开 JSX 必须由 ReactLynx 编译器处理，不能用普通 React DOM 直接渲染。

## 浏览器宿主

工程的 web/main.ts 使用 @lynx-js/web-core/client 注册 lynx-view，并在创建视图前调用 registerDaisuWebComponents。它根据打包脚本地址解析 Bundle 的相对路径，部署到 /ui/ 等子路径时无需修改固定域名。

媒体、图片裁剪和二维码 PNG 导出仍需显式设置对应组件的 browser 模式，见 [浏览器能力注册](./web-registration.md)。注册成功不代表远程图片满足 CORS 或媒体可自动播放。

## 排查步骤

- 空白页面：先检查网页脚本、app.web.bundle 和分块文件是否全部返回 200，确认使用 HTTP 服务而非 file://。
- 编译失败：检查锁文件、peerDependencies、engineVersion=4.2 以及 tasm override；不要只升级类型而不升级编译器。
- 弹层位置错误：确认根部只配置一次 RootPortalHost，并处于 ConfigProvider 内。
- 输入或媒体差异：按 [兼容性总表](./compatibility.md) 分平台核对；浏览器运行不等同于原生验收。

## 原生接入

相同工程构建的 dist/app.lynx.bundle 可通过远端 Manifest 分发，随后由 Flutter 运行时下载并校验，见 [Flutter 完整接入](./flutter-quickstart.md)。
