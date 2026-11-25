# 快速上手

面向 ReactLynx 的组件库。这里提供组件说明、API 和交互示例，右侧预览可直接操作。

## 安装

```bash
npm install daisu-ui
```

当前处于 beta 阶段，首次正式发布前可使用本地打包的 tgz 安装验证。

项目需使用 ReactLynx，并在 Rspeedy 中启用 `pluginReactLynx({ engineVersion: '4.2' })`。当前开发类型为 `@lynx-js/types@4.2.1`，原生宿主引擎须为 Lynx 4.2 或更高版本；其他依赖版本以包的 `peerDependencies` 为准。

若构建插件仍依赖 `@lynx-js/tasm@0.0.49`，在消费项目根 `package.json` 添加 `"overrides": { "@lynx-js/tasm": "0.0.53" }` 并重新安装依赖，以使用支持 Lynx 4.2 的编译器。

## 使用组件

```tsx
import { Button } from 'daisu-ui';

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
import { ConfigProvider, RootPortalHost } from 'daisu-ui';

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
