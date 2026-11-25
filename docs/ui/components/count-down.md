# CountDown 倒计时

倒计时用于显示剩余时间，支持格式化、毫秒显示和命令式控制。

```tsx
import { CountDown } from '@daisu-ui/ui';
```

## 基础用法

### 显示剩余时间

通过 `time` 设置倒计时时长，单位为 ms。

```tsx
<CountDown time={3600000} />
```

## 组件样式

### 自定义格式

通过 `format` 指定显示格式，例如 `mm:ss` 展示分钟和秒。

```tsx
<CountDown time={90000} format="mm:ss" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| time | 剩余时长，单位 ms | `number` | `0` |
| millisecond | 是否启用毫秒级更新 | `boolean` | `false` |
| autoStart | 是否自动开始 | `boolean` | `true` |
| format | 显示格式或是否启用格式化 | `string` | `'HH:mm:ss'` |
| children | 自定义内容 | `ReactNode\|((current:TimeData)=>ReactNode)` | — |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 值发生变化时触发 | (current:TimeData)=>void |
| onFinish | 对应操作发生时触发 | ()=>void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 自定义内容 | ReactNode\|((current:TimeData)=>ReactNode) |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| start | 调用实例方法 | ()=>void |
| pause | 调用实例方法 | ()=>void |
| reset | 重置状态 | ()=>void |

## 数据类型

```tsx
export type TimeData = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};
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
| `--cso-ui-text` | 共享主题 |

## 源代码

[CountDown 组件源码](./sources/count-down/CountDown.tsx.txt) · [示例源码](./sources/count-down/demo.tsx.txt) · [文档源码](./sources/count-down/docs.md.txt)
