# 定制主题

使用 ConfigProvider 为整页或局部区域提供主题变量和组件默认值。

## 设置作用域

```tsx
import { Button, ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider themeVars={{ '--cso-ui-primary': '#1769ff' }}>
  <Button label="确认" />
</ConfigProvider>
```

当前 CSS 变量沿用 --cso-ui- 前缀。themeVars 支持组件读取的语义变量；变量值须符合对应 CSS 属性的要求。

## 组件默认值

```tsx
<ConfigProvider button={{ size: 'small', tone: 'primary' }}>
  <Button label="继承默认值" />
  <Button label="局部覆盖" size="large" />
</ConfigProvider>
```

组件显式属性优先于 Provider 默认值。嵌套 Provider 按字段继承并覆盖，独立作用域之间互不影响。

## 浮层主题

RootPortalHost 放在同一 ConfigProvider 内。通过 rootPortal 渲染的浮层会携带对应主题配置。

## 变量选择

优先使用语义变量，再按组件文档中的 CSS 变量表局部调整。未被组件读取的变量不会改变外观。

- [ConfigProvider API](config-provider.md)
- [深色模式](#/dark-mode)
