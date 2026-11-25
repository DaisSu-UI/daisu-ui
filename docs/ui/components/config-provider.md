# ConfigProvider 全局配置

全局配置用于统一组件的明暗主题、颜色变量和默认属性，也可以在局部嵌套覆盖。

```tsx
import { ConfigProvider } from 'daisu-ui';
```

## 主题模式

### 明暗切换

通过 `theme` 在 `light` 与 `dark` 之间切换，内部组件跟随当前主题。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from 'daisu-ui';

const [dark, setDark] = useState(false);

<ConfigProvider theme={dark ? 'dark' : 'light'}>
  <Button
    label="切换主题"
    onTap={() => {
      'background only';
      setDark(!dark);
    }}
  />
</ConfigProvider>
```

## 组件样式

### 颜色与组件默认值

通过 `themeVars` 覆盖主题变量，通过 `button` 设置按钮的默认属性。

```tsx
<ConfigProvider
  themeVars={{ primary: '#7c3aed', buttonRadius: 8 }}
  button={{ round: true, size: 'large' }}
>
  <Button label="主题按钮" />
</ConfigProvider>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| theme | 外观主题 | `ConfigProviderTheme` | — |
| themeVars | 主题变量覆盖值 | `ConfigProviderThemeVars` | — |
| button | 按钮默认属性 | `ConfigButtonDefaults` | — |
| tag | 标签默认属性 | `ConfigTagDefaults` | — |
| children | 自定义内容 | `ReactNode` | — |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 自定义内容 | ReactNode |

## 数据类型

```tsx
export type ConfigProviderTheme = 'light' | 'dark';

export type ConfigProviderThemeVars = Partial<
  Record<
    | 'primary'
    | 'onPrimary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'canvas'
    | 'surface'
    | 'surfaceMuted'
    | 'text'
    | 'textMuted'
    | 'line'
    | 'colorTheme'
    | 'buttonPrimaryBg'
    | 'buttonPrimaryBgColor'
    | 'buttonPrimaryColor'
    | 'buttonHeight'
    | 'buttonRadius'
    | 'buttonFontSize'
    | 'cellTitleColor',
    string | number
  >
> & { [key: `--cso-ui-${string}`]: string | number | undefined };

export type ConfigButtonDefaults = Pick<
  ButtonProps,
  'size' | 'tone' | 'round'
> & { variant?: ButtonProps['variant'] | 'base'; type?: ButtonProps['tone'] };

export type ConfigTagDefaults = Pick<TagProps, 'size' | 'variant' | 'round'>;
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
| `--cso-ui-avatar-bg` | 共享主题 |
| `--cso-ui-avatar-collapse-bg` | 共享主题 |
| `--cso-ui-avatar-collapse-color` | 共享主题 |
| `--cso-ui-avatar-text` | 共享主题 |
| `--cso-ui-dark-display` | 共享主题 |
| `--cso-ui-disabled-text` | 共享主题 |
| `--cso-ui-light-display` | 共享主题 |
| `--cso-ui-picker-fade-bottom` | 共享主题 |
| `--cso-ui-picker-fade-top` | 共享主题 |
| `--cso-ui-surface-muted` | 共享主题 |
| `--cso-ui-tag-default-color` | 共享主题 |
| `--cso-ui-tag-light-cyan-bg` | 共享主题 |
| `--cso-ui-tag-light-danger-bg` | 共享主题 |
| `--cso-ui-tag-light-default-bg` | 共享主题 |
| `--cso-ui-tag-light-lightblue-bg` | 共享主题 |
| `--cso-ui-tag-light-pink-bg` | 共享主题 |
| `--cso-ui-tag-light-primary-bg` | 共享主题 |
| `--cso-ui-tag-light-purple-bg` | 共享主题 |
| `--cso-ui-tag-light-success-bg` | 共享主题 |
| `--cso-ui-tag-light-volcano-bg` | 共享主题 |
| `--cso-ui-tag-light-warning-bg` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-auxiliary` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[ConfigProvider 组件源码](./sources/config-provider/ConfigProvider.tsx.txt) · [示例源码](./sources/config-provider/demo.tsx.txt) · [文档源码](./sources/config-provider/docs.md.txt)
