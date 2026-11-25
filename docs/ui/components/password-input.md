# PasswordInput 密码输入框

密码输入框将内容分格显示，可与虚拟键盘组合录入验证码、支付密码等短内容。

```tsx
import { PasswordInput } from 'daisu-ui';
```

## 组件类型

### 密码格

通过 `value` 设置已输入内容，字符按格显示。

```tsx
<PasswordInput value="123" />
```

## 组合用法

### 配合虚拟键盘

通过 `onFocus` 打开虚拟键盘，键盘的 `value` 和 `onChange` 与密码格共享输入内容。

```tsx
import { useState } from '@lynx-js/react';

import { Keyboard } from 'daisu-ui';

const [value, setValue] = useState('');

const [visible, setVisible] = useState(false);

<PasswordInput
  value={value}
  onFocus={() => {
    'background only';
    setVisible(true);
  }}
/>
<Keyboard
  value={value}
  onChange={setValue}
  visible={visible}
  onVisibleChange={setVisible}
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| value | 受控展示值，超出 length 的字符不展示，不修改调用方数据 | `string` | `''` |
| mask | 用10px圆点隐藏字符；false展示明文 | `boolean` | `true` |
| info | 底部提示；错误优先，错误清空后恢复普通提示 | `string` | `''` |
| errorInfo | 底部提示；错误优先，错误清空后恢复普通提示 | `string` | `''` |
| gutter | 数字/数字字符串按px；支持px/rem/em/vw/vh/%和rpx（750设计单位换算vw） | `number \| string` | `0` |
| length | 格子数量；小数取整、负数归零、NaN/Infinity回落6；最多1000，避免异常分配 | `number` | `6` |
| focused | 当前值之后的空格显示1s闪烁光标，满位无光标；通常绑定Keyboard显隐 | `boolean` | `true` |
| disabled | 禁止触发聚焦、隐藏光标；未显式传入时继承FormItem禁用 | `boolean` | — |
| className | 根容器样式 | `string` | `''` |
| style | 根容器样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onFocus | 获得焦点时触发 | (event: CommonEvent) => void |

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
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-auxiliary` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[PasswordInput 组件源码](./sources/password-input/PasswordInput.tsx.txt) · [示例源码](./sources/password-input/demo.tsx.txt) · [文档源码](./sources/password-input/docs.md.txt)
