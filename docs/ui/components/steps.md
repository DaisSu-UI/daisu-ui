# Steps 步骤条

步骤条用于展示任务流程和当前进度，支持方向、状态与自定义图标内容。

```tsx
import { Steps, Step } from 'daisu-ui';
```

## 组件类型

### 水平步骤条

在 `Steps` 中组合 `Step`，通过 `active` 指定当前步骤索引。

```tsx
<Steps active={1}>
  <Step title="已下单" />
  <Step title="运输中" />
  <Step title="已完成" />
</Steps>
```

## 布局能力

### 垂直步骤条

设置 `vertical` 使用垂直排列，通过 `description` 设置步骤补充说明。

```tsx
<Steps active={1} vertical>
  <Step title="提交申请" description="资料已提交" />
  <Step title="审核中" description="请耐心等待" />
</Steps>
```

## Attributes 属性

### Steps

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| active | 当前步骤或激活状态 | `number` | `0` |
| vertical | 是否垂直排列 | `boolean` | `false` |
| dot | 是否显示圆点 | `boolean` | `false` |
| space | 相邻项间距 | `number \| string` | — |
| alignCenter | 是否居中对齐 | `boolean` | `false` |
| children | 自定义内容 | `ReactNode` | — |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

### Step

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| title | 标题内容 | `ReactNode` | — |
| description | 补充描述 | `ReactNode` | — |
| icon | 图标内容 | `ReactNode` | — |
| status | 当前状态 | `StepStatus` | — |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| Steps.children | 自定义内容 | ReactNode |
| Step.title | 标题内容 | ReactNode |
| Step.description | 补充描述 | ReactNode |
| Step.icon | 图标内容 | ReactNode |

## 数据类型

```tsx
export type StepStatus = 'finished' | 'process' | 'wait' | 'error';
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from 'daisu-ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

### CSS 变量

以下变量可通过 ConfigProvider 的 themeVars 覆盖，未设置时使用当前主题与组件的默认样式。

| 变量 | 作用范围 |
| --- | --- |
| `--cso-ui-danger` | 共享主题 |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-step-dot-finished-bg` | 共享主题 |
| `--cso-ui-step-finished-bg` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Steps 组件源码](./sources/steps/Steps.tsx.txt) · [Step 组件源码](./sources/steps/Steps.tsx.txt) · [示例源码](./sources/steps/demo.tsx.txt) · [文档源码](./sources/steps/docs.md.txt)
