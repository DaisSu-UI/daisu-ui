# Signature 签名

签名组件记录手写笔迹，支持清空、撤销、确认和自定义画笔样式。

```tsx
import { Signature } from 'daisu-ui';
```

## 基础用法

### 手写签名

通过 `onConfirm` 接收确认后的签名结果。

```tsx
<Signature
  onConfirm={(result) => {
    'background only';
    console.log(result);
  }}
/>
```

## 组件样式

### 画笔颜色

通过 `penColor` 设置画笔颜色。

```tsx
<Signature penColor="#1c64fd" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| width | 宽度为 px数字或有效Lynx长度；高度为有限正 px，宽度随容器变化，export按原生实际尺寸 | `number\|string` | `'100%'` |
| height | 宽度为 px数字或有效Lynx长度；高度为有限正 px，宽度随容器变化，export按原生实际尺寸 | `number` | `150` |
| penColor | 后续笔画颜色、普通线宽；旧笔画保留创建时样式 | `string` | `'#000'` |
| lineWidth | 后续笔画颜色、普通线宽；旧笔画保留创建时样式 | `number` | `3` |
| backgroundColor | 画板及导出背景；透明画板在白色纸面上显示以保证默认黑色笔迹可见，纸面可用 `--cso-ui-signature-background` 定制 | `string` | `'transparent'` |
| exportScale | PNG尺寸倍率，不依赖设备 DPR；每边≤4096px且总像素≤400万，超限返回失败 | `number` | `1` |
| disabled | 禁止书写并取消进行中的笔画；不会清空已有签名，操作按钮仍可用 | `boolean` | `false` |
| disableScroll | 画板原生手势消费，避免书写拖动外层滚动；不全局锁定页面 | `boolean` | `true` |
| enableHistory | 启用撤销恢复及每次操作的笔画数，step裁剪为≥1整数 | `boolean` | `false` |
| step | 启用撤销恢复及每次操作的笔画数，step裁剪为≥1整数 | `number` | `1` |
| pressure | 模拟速度笔锋，不是设备真实压感；慢写粗、快写细，以20%变化限制平滑线宽 | `boolean` | `false` |
| minWidth | 笔锋宽度范围及速度阈值(px/ms)，非法值使用有效默认值 | `number` | `2` |
| maxWidth | 笔锋宽度范围及速度阈值(px/ms)，非法值使用有效默认值 | `number` | `6` |
| minSpeed | 笔锋宽度范围及速度阈值(px/ms)，非法值使用有效默认值 | `number` | `1.5` |
| clearText | 默认按钮文案 | `string` | `'清空'` |
| confirmText | 默认按钮文案 | `string` | `'确认'` |
| revokeText | 历史按钮文案 | `string` | `'撤销'` |
| restoreText | 历史按钮文案 | `string` | `'恢复'` |
| className | 根节点类名、样式 | `string` | `''` |
| style | 根节点类名、样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onStart | 输入开始、移动、正常结束；参数为原始Lynx TouchEvent或MouseEvent；取消不提交、不发onEnd | (event:TouchEvent\|MouseEvent)=>void |
| onSigning | 输入开始、移动、正常结束；参数为原始Lynx TouchEvent或MouseEvent；取消不提交、不发onEnd | (event:TouchEvent\|MouseEvent)=>void |
| onEnd | 输入开始、移动、正常结束；参数为原始Lynx TouchEvent或MouseEvent；取消不提交、不发onEnd | (event:TouchEvent\|MouseEvent)=>void |
| onConfirm | `(result: SignatureResult) => void`，成功或失败均回调 | (result:SignatureResult)=>void |
| onClear | 主动清空时触发 | ()=>void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| renderFooter | `(actions: SignatureFooter) => ReactNode` 自定义底部操作；传返回null的函数隐藏 | (actions:SignatureFooter)=>ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| init | 调用实例方法 | (forceUpdate?:boolean) => Promise<void> |
| clear | 调用实例方法 | ()=>void |
| confirm | 调用实例方法 | ()=>SignatureResult |
| revoke | 调用实例方法 | ()=>void |
| restore | 调用实例方法 | ()=>void |

## 数据类型

```tsx
export type SignatureFooter = SignatureRef & {
  currentStep: number;
  historyList: readonly SignatureStroke[];
  canUndo: boolean;
  canRedo: boolean;
};

export type SignatureResult = {
  success: boolean;
  dataUrl: string;
  width: number;
  height: number;
  error?: string;
};
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
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-signature-background` | 当前组件 |

## 源代码

[Signature 组件源码](./sources/signature/Signature.tsx.txt) · [示例源码](./sources/signature/demo.tsx.txt) · [文档源码](./sources/signature/docs.md.txt)
