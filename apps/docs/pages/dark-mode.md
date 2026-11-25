# 深色模式

通过 ConfigProvider 的 theme 控制明暗主题，主题切换使用同一套组件和语义变量。

## 开启深色主题

```tsx
import { ConfigProvider, RootPortalHost } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  <RootPortalHost>
    {/* 页面内容 */}
  </RootPortalHost>
</ConfigProvider>
```

## 响应宿主设置

应用接收宿主或浏览器提供的主题状态，再将 light 或 dark 传给 ConfigProvider。不要在组件渲染期间直接读取浏览器 DOM API。

## 自定义内容

```css
.profile-card {
  background-color: var(--cso-ui-surface);
  color: var(--cso-ui-text);
  border-color: var(--cso-ui-line);
}
```

局部内容使用语义变量，避免为深色模式复制组件或写死整套颜色。图标的显式 color 会覆盖默认主题色。

## 验证范围

切换主题后核对正文、占位、边框、禁用与选中状态，以及通过 RootPortal 渲染的弹层。文档站右上角的开关可切换站点与组件预览主题。

- [定制主题](#/theme-customization)
- [样式覆盖](#/style-overrides)
