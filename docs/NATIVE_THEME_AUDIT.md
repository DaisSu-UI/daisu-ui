# Lynx 4.0 全库主题与滚动检查

检查覆盖全部组件样式、颜色继承、内置 SVG 图标与滑动拦截。颜色依据 Flutter 宿主 `lib/core/theme/design_tokens.dart`、`app_colors.dart`、`app_theme.dart`，不依赖宿主源码参与构建。

| 语义 | 浅色 | 深色 |
| --- | --- | --- |
| 标题 | `#303133` | `#e6e8eb` |
| 正文 / 默认图标 | `#606266` | `#babec5` |
| 辅助文字 | `#909399` | `#8a8f99` |
| 占位文字 | `#a8abb2` | `#6b7280` |
| 禁用文字 | `#c0c4cc` | `#4b5563` |
| 卡片分割线 | `rgba(126,134,142,0.08)` | `rgba(126,134,142,0.16)` |
| 弹层关闭按钮背景 | `#e5e5ea` | `#3a3a3c` |
| 弹层关闭图标 | `#8e8e93` | `#fff` |

普通属性中的嵌套 `var()` 回退会被当前 Lynx CSS serializer 记录为不支持，并可能退回黑色 / 透明。构建时将这种表达式提取为当前选择器上的私有自定义变量，再由普通属性单层引用。Lynx 4.0 支持自定义变量的嵌套引用；转换保留作用域、显式覆盖、声明顺序与 `!important`，不增加运行时组件。

受转换影响的样式包括 ActionSheet、Avatar、Calendar、Cell、DatetimePicker、Divider、DropMenu、Form、IndexBar、Keyboard、PasswordInput、Popup、RichText、Skeleton、Slider、SortButton、Table、TextField、Text。Button 等已有的自定义变量声明保留原样；回归检查遍历每份 CSS，不依赖固定组件白名单。

文字继承检查覆盖 Card、Circle、CountDown、CountTo、Grid、Loading、Loadmore、NoticeBar、Notify、RichText、Tag 等。消费方需开启下列配置，并核对 Bundle 的 page-config：

```ts
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
import { pluginLynxConfig } from '@lynx-js/config-rsbuild-plugin';

plugins: [
  pluginReactLynx({
    engineVersion: '4.0',
    enableCSSInheritance: true,
    customCSSInheritanceList: [
      'color', 'font-size', 'font-weight', 'font-family',
      'font-style', 'line-height', 'text-align', 'text-indent',
    ],
  }),
  pluginLynxConfig({ enableCSSInlineVariables: true }),
]
```

Icon 在生成 SVG 前解析 ConfigProvider 的颜色变量，支持主题切换、局部覆盖与嵌套回退。旧业务导航和表单固定灰色，以及 Avatar、DropMenu、Empty、Fab、Grid、Img、Search、Sidebar、Steps、Switch、Tag、Upload 的中性色图标已接入语义变量；Rate、Loading 的 SVG 也解析颜色变量。状态强调色、媒体浮层反色文字、二维码、条码与绘制内容按其用途保留。

Popup 内容区不再消费所有方向的原生滑动，背景遮罩继续拦截滑动；补齐纵向 flex 与最小高度约束。其余拦截点已检查：Slider、Signature、IndexBar、拖动把手属于直接操作区域；Tabs、SwipeAction 仅消费横向手势，FloatingPanel 保留拖动阶段的消费条件。

验证包含全量 CSS serializer 检查、属性保留、幂等转换、SVG 主题更新、循环变量回退、独立安装包 Lynx 4.0 编译及 page-config 检查。仍需目标 iOS / Android 4.0 宿主验收颜色、弹窗内部滚动、背景锁滚和关闭交互；浏览器或构建检查不能替代真机验收。
