# 设计

Daisu UI 使用统一的组件语义、尺寸和反馈规则，帮助 ReactLynx 应用在不同页面保持一致。

## 语义颜色

主题通过用途定义颜色。主要操作使用 primary，成功、提示、警告和危险反馈分别使用 success、info、warning、danger。背景、表面、正文和分隔线采用独立变量。

| 变量 | 用途 |
| --- | --- |
| --cso-ui-primary | 主要操作 |
| --cso-ui-canvas | 页面背景 |
| --cso-ui-surface | 内容表面 |
| --cso-ui-text | 正文 |
| --cso-ui-text-muted | 辅助文字 |
| --cso-ui-line | 分隔线与边框 |

## 交互一致性

禁用、加载、选中和错误状态由组件属性表达。输入组件使用明确的值与变化回调；弹层使用显隐状态或配套 hook 控制。

## 内容与层级

使用间距、字号和背景区分层级。自定义内容通过 ReactNode 或组件公开的渲染属性传入，避免依赖内部元素结构。

## 原生与浏览器

布局和交互需符合目标 Lynx 版本的实际支持范围。Web Demo 用于交互预览，原生键盘、手势及性能需在目标设备核对。

- [定制主题](#/theme-customization)
- [深色模式](#/dark-mode)
- [样式覆盖](#/style-overrides)
