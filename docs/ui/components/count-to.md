# CountTo 数字滚动

数字滚动通过补间动画展示数值变化，可用于统计数据、金额和指标。

```tsx
import { CountTo } from '@daisu-ui/ui';
```

## 基础用法

### 数字动画

通过 `startVal` 和 `endVal` 设置数字动画的开始值与结束值。

```tsx
<CountTo startVal={0} endVal={2026} />
```

## 组件样式

### 金额格式

通过 `decimals` 设置小数位数，通过 `prefix` 设置金额前缀。

```tsx
<CountTo startVal={0} endVal={12345.67} decimals={2} prefix="￥" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| startVal | 有限起止数，非法值按0处理，支持递减和负数 | `number` | `0` |
| endVal | 有限起止数，非法值按0处理，支持递减和负数 | `number` | `2024` |
| duration | 时长ms，非有限值/负数归0；0时长开始后直接显示终值 | `number` | `3000` |
| autoStart | 自动播放；起止值、时长或此参数改变会重置 | `boolean` | `true` |
| decimals | 小数位数（裁剪为0–20整数）、小数分隔符、千分位分隔符，空separator关闭分组 | `number` | `0` |
| decimal | 小数位数（裁剪为0–20整数）、小数分隔符、千分位分隔符，空separator关闭分组 | `string` | `'.'` |
| separator | 小数位数（裁剪为0–20整数）、小数分隔符、千分位分隔符，空separator关闭分组 | `string` | `','` |
| prefix | 前后缀ReactNode；原始string/number使用12px/18px文字，其余作为插槽渲染 | `ReactNode` | — |
| suffix | 前后缀ReactNode；原始string/number使用12px/18px文字，其余作为插槽渲染 | `ReactNode` | — |
| useEasing | 指数缓出，false线性；结束时精确落到endVal | `boolean` | `true` |
| fontSize | 可选主数字字号px，配套行高为字号+8；不设置时使用18px/26px Token默认值 | `number` | — |
| color | 显式覆盖主题颜色，含默认前后缀 | `string` | — |
| type | default / primary / error / success / warning / info，使用语义Token | `'default'\|'primary'\|'error'\|'warning'\|'success'\|'info'` | `'default'` |
| children | 替换主数字，ReactNode或 `(value:number,formatted:string)=>ReactNode` | `ReactNode\|((value:number,formatted:string)=>ReactNode)` | — |
| className | 根节点样式 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onMounted | 组件effect挂载一次 / 本轮动画结束一次 | ()=>void |
| onFinish | 组件effect挂载一次 / 本轮动画结束一次 | ()=>void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| prefix | 前后缀ReactNode；原始string/number使用12px/18px文字，其余作为插槽渲染 | ReactNode |
| suffix | 前后缀ReactNode；原始string/number使用12px/18px文字，其余作为插槽渲染 | ReactNode |
| children | 替换主数字，ReactNode或 `(value:number,formatted:string)=>ReactNode` | ReactNode\|((value:number,formatted:string)=>ReactNode) |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| start | 调用实例方法 | ()=>void |
| pause | 调用实例方法 | ()=>void |
| reset | 重置状态 | ()=>void |

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
| `--cso-ui-count-to-font-size` | 当前组件 |
| `--cso-ui-count-to-line-height` | 当前组件 |
| `--cso-ui-danger` | 共享主题 |
| `--cso-ui-info` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-success` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-warning` | 共享主题 |

## 源代码

[CountTo 组件源码](./sources/count-to/CountTo.tsx.txt) · [示例源码](./sources/count-to/demo.tsx.txt) · [文档源码](./sources/count-to/docs.md.txt)
