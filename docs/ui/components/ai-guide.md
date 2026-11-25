# AI 使用指南

使用 Daisu UI 开发页面时，可以把组件文档、公开类型和示例提供给 AI，帮助它生成符合 ReactLynx 约束的代码。

## 开始使用

先明确页面用途、需要的组件与目标平台，再让 AI 按对应组件文档实现。

```text
请使用 Daisu UI 实现一个用户资料表单。
使用 Form、FormItem、Input、Button，并遵循各组件的公开 API。
页面面向 ReactLynx，所有文字放在 text 元素中。
```

## 查询组件

组件文档包含用法、属性、事件、内容插槽和主题说明。生成代码前先核对参数类型与回调签名。

```tsx
import { Button, Input, Form, FormItem } from '@daisu-ui/ui';
```

## 组合页面

输入状态通过组件的受控属性管理，弹层类组件应绑定相应 hook 返回的 props。根节点传送门需要在页面根部配置 RootPortalHost。

## 平台与主题

使用 ConfigProvider 配置主题。浏览器 Demo 展示 Lynx Web 效果，涉及键盘、手势、媒体和宿主能力时，还需结合目标平台的实现与验证结果。

## 参考资料

- [开始使用](#/getting-started)
- [全局配置](config-provider.md)
- [表单](form.md)
- [Lynx 官方文档](https://lynxjs.org/next/llms.txt)
