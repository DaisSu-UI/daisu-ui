# 国际化

Daisu UI 内置简体中文、英语和繁体中文，默认使用简体中文。语言通过 `ConfigProvider` 传入，支持运行时切换和局部覆盖。

```tsx
import { useState } from '@lynx-js/react';
import { ConfigProvider, Dialog, Search, enUS } from '@daisu-ui/ui';
import type { UiLocaleName } from '@daisu-ui/ui';

export function App() {
  const [locale, setLocale] = useState<UiLocaleName>('zh-CN');
  return <ConfigProvider locale={locale}>
    <view bindtap={() => { 'background only'; setLocale('en-US'); }}>
      <text>English</text>
    </view>
    <Search />
    <Dialog show type="confirm" msg="Business content" />
  </ConfigProvider>;
}
```

`locale` 可以是 `'zh-CN'`、`'en-US'`、`'zh-TW'`，也可以是导出的 `zhCN`、`enUS`、`zhTW` 对象。例如 `<ConfigProvider locale={enUS}>`。

## 覆盖文案与作用域

```tsx
import { ConfigProvider, Dialog } from '@daisu-ui/ui';

<ConfigProvider locale="en-US">
  <Dialog show type="confirm" />
  <ConfigProvider locale={{ messages: { 'common.confirm': 'Continue' } }}>
    <Dialog show type="confirm" />
  </ConfigProvider>
</ConfigProvider>
```

未指定 `locale` 的 Provider 继承父级语言。局部 `messages` 合并父级资源；若同时指定内置 `name`，则以该语言包作为基础。`undefined` 保留基础消息，空字符串可清空消息。修改 Provider 不会改动其他页面或兄弟作用域。

组件显式传入的 `confirmButtonText`、`placeholder`、插槽和 `formatter` 等仍然优先。选项数据、通知正文、业务标题和应用页面需要由业务自己的翻译资源管理；车牌键盘的省份简称属于输入数据，保持原值。

## 业务组合组件

```tsx
import { useLocale } from '@daisu-ui/ui';

function ConfirmCopy() {
  const { locale, t } = useLocale();
  return <view>
    <text>{locale.name}</text>
    <text>{t('common.confirm')}</text>
  </view>;
}
```

`t(key, params)` 支持命名占位符，例如 `t('pagination.total', { total: 50 })`。可用键由 `UiMessageKey` 提供类型提示。翻译只返回文本，不执行代码，也不注入 HTML。

## 弹层、日期和运行时

`RootPortalHost` 内的 Popup、Dialog、Calendar、Notify 等浮层保留调用位置的语言。已经打开的浮层会随 Provider 更新，输入、日期草稿和选择值保留。Calendar 的星期、年月、范围摘要、时间单位和无障碍标签使用当前语言；语言切换不改变毫秒时间戳或业务值格式。

根据 [Lynx 官方国际化指南](https://lynxjs.org/zh/guide/inclusion/internationalization.html)，Lynx 尚未内置 `Intl`。本库同步读取纯 JavaScript 语言包，默认文案与日期展示无需安装 Intl polyfill，也不依赖浏览器语言检测。主线程和后台线程使用相同资源，避免首屏语言不一致。

如果业务已使用 i18next，将业务语言映射为 `UiLocaleName` 后传给 Provider，并在语言切换回调中更新 ReactLynx 状态即可。库内不修改业务 i18next 实例。业务自行使用 i18next v24+ 或 `Intl.NumberFormat` / `Intl.DateTimeFormat` 时，仍需按官方指南补齐对应 polyfill。

开发诊断异常、外部服务错误、业务表单 Schema 消息和宿主系统选择器不属于库的默认文案，需由业务或宿主处理。

## 本地确认

从 Demo 首页底部进入“关于我们”（`/ui-demo/about`），在“偏好设置”中切换简体中文、English、繁體中文。语言会同步到导航、示例标题、操作文案和组件默认文本；浏览器刷新会恢复上次选择。原生宿主可通过初始化数据 `locale` 指定起始语言。

随后打开 `/ui-demo/config-provider` 的“国际化”预览，确认搜索、输入、分页、加载状态以及 Dialog / Calendar 默认文案。示例中的标识符、输入值和代码保留原始数据。浏览器标题随当前路由与语言更新为“页面名称 · Daisu UI”。
