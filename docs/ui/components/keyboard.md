# Keyboard 虚拟键盘

虚拟键盘为数字、身份证和车牌等输入场景提供统一按键面板，输入结果由 value 管理。

```tsx
import { Keyboard } from 'daisu-ui';
```

## 基础用法

### 数字键盘

通过 `visible` 和 `onVisibleChange` 控制键盘显示，通过 `value` 和 `onChange` 管理输入内容。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from 'daisu-ui';

const [value, setValue] = useState('');

const [visible, setVisible] = useState(false);

<Button
  label="打开键盘"
  onTap={() => {
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

## 组件样式

### 确认按钮

通过 `title` 设置键盘顶部提示，使用 `visible` 控制显示状态。

```tsx
<Keyboard visible={false} title="请输入金额" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| visible | 受控显示，收起和点外部通知 false | `boolean` | `false` |
| value | 受控或非受控输入值 | `string` | — |
| defaultValue | 受控或非受控输入值 | `string` | `''` |
| mode | default 数字、custom 右侧栏、car 车牌 | `KeyboardMode` | `'default'` |
| title | 字符串或 ReactNode 自定义标题 | `ReactNode` | — |
| extraKey | 默认布局一个额外键；custom 最多两个（如 ['00', '.']） | `string \| readonly string[]` | — |
| maxlength | 字符数上限；多字符额外键按剩余容量截断 | `number` | — |
| showDeleteKey | 数字布局显示删除键、自定义删除文字；车牌布局始终有删除键 | `boolean` | `true` |
| deleteText | 数字布局显示删除键、自定义删除文字；车牌布局始终有删除键 | `string` | `''` |
| closeText | 默认布局头部关闭按钮，custom 右侧完成键；loading 禁止完成 | `string` | `''` |
| closeButtonLoading | 默认布局头部关闭按钮，custom 右侧完成键；loading 禁止完成 | `boolean` | `false` |
| randomKeyOrder | 每次打开或切换此配置时重新打乱 1–9，0 固定 | `boolean` | `false` |
| carLang | zh 省份 / en 数字字母，受控语言由调用方更新 | `CarKeyboardLang` | — |
| autoSwitchLang | 仅未传 carLang 时，首字符切英文、删空恢复省份 | `boolean` | `false` |
| modal | 是否显示深色遮罩；false 时外部点击区透明 | `boolean` | `false` |
| hideOnClickOutside | 是否提供点外部收起区域；false 时无 Overlay | `boolean` | `true` |
| lockScroll | 复用 Popup 的原生手势拦截，不锁定 Flutter 外部滚动 | `boolean` | `true` |
| safeAreaInsetBottom | 显式传入宿主安全区 px；不猜测设备底部高度 | `boolean` | `true` |
| safeAreaBottom | 显式传入宿主安全区 px；不猜测设备底部高度 | `number` | `0` |
| zIndex | 弹层层级及可选根节点挂载 | `number` | `100` |
| rootPortal | 弹层层级及可选根节点挂载 | `boolean` | `false` |
| disabled | 禁止输入；未显式指定时继承 FormItem 禁用 | `boolean` | — |
| className | 键盘内容容器样式 | `string` | `''` |
| style | 键盘内容容器样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onVisibleChange | 受控显示，收起和点外部通知 false | (visible: boolean) => void |
| onChange | 值发生变化时触发 | (value: string) => void |
| onCarLangChange | zh 省份 / en 数字字母，受控语言由调用方更新 | (lang: CarKeyboardLang) => void |
| onInput | 原生输入事件 | (key: string) => void |
| onDelete | 对应操作发生时触发 | () => void |
| onClose | 关闭时触发 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| title | 字符串或 ReactNode 自定义标题 | ReactNode |

## 数据类型

```tsx
export type KeyboardMode = 'default' | 'custom' | 'car';

export type CarKeyboardLang = 'zh' | 'en';
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
| `--cso-ui-on-primary` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-primary-pressed` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-surface-muted` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Keyboard 组件源码](./sources/keyboard/Keyboard.tsx.txt) · [示例源码](./sources/keyboard/demo.tsx.txt) · [文档源码](./sources/keyboard/docs.md.txt)
