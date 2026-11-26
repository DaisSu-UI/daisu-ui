# 同步输入封装

SyncedInput 与 SyncedTextarea 是受控原生输入封装：首次使用 default-value，外部 value 改变后通过节点 setValue 同步，并记录原生输入值以减少重复写入。需要清空、密码、禁用、计数等完整 UI 时使用 [Input](input.md) / [Textarea](textarea.md)。它们不支持 disabled、readonly 或 Input 的其他参数；聚焦及程序回填效果仍需在目标宿主验证。

```tsx
import { SyncedInput, SyncedTextarea } from '@daisu-ui/ui';
```

## 基础用法

### 输入和外部回填

onInput 直接接收 string，调用方必须回写 value；onBlur 不带事件参数。外部回填在 useEffect 中同步到原生节点。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from '@daisu-ui/ui';

const [value, setValue] = useState('初始值');

<SyncedInput
  value={value}
  placeholder="请输入"
  maxlength={40}
  onInput={(next) => {
    'background only';
    setValue(next);
  }}
/>
<Button
  label="回填"
  onTap={() => {
    'background only';
    setValue('回填内容');
  }}
/>
<Button
  label="清空"
  onTap={() => {
    'background only';
    setValue('');
  }}
/>
```

### 多行输入与键盘策略

SyncedInput 默认 softInputMode="nothing"、avoidKeyboard=false，可显式调整；SyncedTextarea 固定采用这两项设置，没有对应的公开参数。键盘避让应由页面及宿主统一管理。

```tsx
const [value, setValue] = useState('');

<SyncedTextarea
  value={value}
  maxlength={200}
  maxlines={4}
  placeholder="请输入备注"
  onInput={(next) => {
    'background only';
    setValue(next);
  }}
/>
```

## Attributes 属性

### SyncedInput

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| className | 根节点自定义类名 | `string` | — |
| value | 当前值；传入后由调用方更新 | `string` | 必填 |
| placeholder | 占位内容或输入提示 | `string` | — |
| maxlength | 最大输入长度，-1 表示不限制 | `number` | — |
| softInputMode | 宿主键盘调整模式，默认 nothing | `'unspecified' \| 'nothing' \| 'pan' \| 'resize'` | `'nothing'` |
| avoidKeyboard | 是否启用原生键盘避让，默认 false | `boolean` | `false` |

### SyncedTextarea

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| className | 根节点自定义类名 | `string` | — |
| value | 当前值；传入后由调用方更新 | `string` | 必填 |
| placeholder | 占位内容或输入提示 | `string` | — |
| maxlength | 最大输入长度，-1 表示不限制 | `number` | — |
| maxlines | 原生多行输入的最大行数 | `number` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| SyncedInput.onInput | 输入后的字符串回调，非原生事件；调用方回写 value | (value: string) => void |
| SyncedInput.onBlur | 失焦通知，无事件参数 | () => void |
| SyncedTextarea.onInput | 输入后的字符串回调，非原生事件；调用方回写 value | (value: string) => void |
| SyncedTextarea.onBlur | 失焦通知，无事件参数 | () => void |

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[SyncedInput 组件源码](./sources/synced-input/SyncedInput.tsx.txt) · [SyncedTextarea 组件源码](./sources/synced-input/SyncedTextarea.tsx.txt) · [文档源码](./sources/synced-input/docs.md.txt)
