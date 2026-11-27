# loadmore 加载更多

加载更多用于展示分页列表的加载中、全部加载和失败重试状态。

```tsx
import { Loadmore } from '@daisu-ui/ui';
```

## 组件状态

### 分页状态

通过 `state` 在 `loading`、`finished` 和 `error` 之间切换，`onReload` 响应失败重试。

```tsx
<Loadmore state="loading" />
<Loadmore state="finished" />
<Loadmore
  state="error"
  onReload={() => {
    'background only';
    console.log('重试加载');
  }}
/>
```

## 内容形态

### 自定义文案

通过 `finishedText` 设置全部加载完成后的文案。

```tsx
<Loadmore state="finished" finishedText="已经到底啦" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| state | 加载中、完成、错误；未设置时保留容器并不显示状态内容 | `LoadmoreState` | — |
| loadingText | 加载中默认文字 | `string` | — |
| finishedText | 完成文字，默认复用公共Divider | `string` | — |
| errorText | 错误文字；独立“点击重试”提示不包含在此参数中 | `string` | — |
| loadingProps | 传递给公共Loading；自动保留ui-loadmore-loading类名并追加调用方className；默认28px圆环 | `LoadingProps` | — |
| loading | 各状态插槽；参数存在时替换该状态全部默认内容，支持0/空字符串等值；原始文字自动包裹text | `ReactNode` | — |
| finished | 各状态插槽；参数存在时替换该状态全部默认内容，支持0/空字符串等值；原始文字自动包裹text | `ReactNode` | — |
| error | 各状态插槽；参数存在时替换该状态全部默认内容，支持0/空字符串等值；原始文字自动包裹text | `ReactNode` | — |
| className | 根节点样式 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onReload | 仅error状态点击整个容器触发，支持自定义错误内容；组件不自动改状态或发请求 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| loading | 各状态插槽；参数存在时替换该状态全部默认内容，支持0/空字符串等值；原始文字自动包裹text | ReactNode |
| finished | 各状态插槽；参数存在时替换该状态全部默认内容，支持0/空字符串等值；原始文字自动包裹text | ReactNode |
| error | 各状态插槽；参数存在时替换该状态全部默认内容，支持0/空字符串等值；原始文字自动包裹text | ReactNode |

## 数据类型

```tsx
export type LoadmoreState = 'loading' | 'finished' | 'error';
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

### CSS 变量

以下变量可通过 ConfigProvider 的 themeVars 覆盖，未设置时使用当前主题与组件的默认样式。

| 变量 | 作用范围 |
| --- | --- |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Loadmore 组件源码](./sources/loadmore/Loadmore.tsx.txt) · [示例源码](./sources/loadmore/demo.tsx.txt) · [文档源码](./sources/loadmore/docs.md.txt)
