# CSO Lynx UI 示例

`UiDemoPage.tsx` 是内部 UI 库的可运行示例。它组合 `daisu-ui` 的公开组件；Cell 自定义内容中的滑块复用公共 `Slider`，开关使用官方 `@lynx-js/lynx-ui` 原语，不调用业务接口或 Flutter 宿主业务能力。

本地 H5 预览：

```sh
npm run h5:dev
# 打开 http://localhost:3080/?demo=ui
# 直接打开 Button 示例：http://localhost:3080/?demo=ui&component=button
# 直接打开 Cell 示例：http://localhost:3080/?demo=ui&component=cell
# 直接打开 Slider 示例：http://localhost:3080/?demo=ui&component=slider
```

Flutter 调试时，将初始化数据的 `page` 设置为 `ui-demo`，或 `ui-demo/button` 一类的组件路径。

## 分批组件移植

全分类清单与验收标准见 `docs/ui/IMPLEMENTATION_PLAN.md`。
新增 `icon`、`text`、`layout` 独立入口，例如 `?demo=ui&component=icon`。
每完成一个组件同步 `docs/ui/components/` 和 `llms-full.txt`，验证后单独提交并推送。
