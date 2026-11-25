# 样式覆盖

组件支持通过公开属性、className、style 与主题变量调整外观。优先选择组件公开的定制入口。

## 使用组件属性

```tsx
import { Button } from '@daisu-ui/ui';

<Button label="确认" size="large" round />
```

尺寸、形态、颜色和状态应优先由对应属性表达，让交互与外观保持同步。

## 添加局部类名

```tsx
<Button label="保存" className="profile-submit" />
```

```css
.profile-submit {
  border-radius: 12px;
}
```

使用局部类名，避免宽泛选择器影响其他页面的组件。样式通过消费项目的 Lynx 编译工具处理。

## 设置主题变量

多个组件共享同一外观时，通过 ConfigProvider 的 themeVars 配置语义变量。单个组件的专属变量以其 API 文档为准。

## 平台兼容性

原生 Lynx 与浏览器的元素及 CSS 支持范围不同。新增样式前查询对应平台和引擎版本，不直接假设所有浏览器 CSS 都能在原生运行。

- [定制主题](#/theme-customization)
- [平台适配](#/platforms)
