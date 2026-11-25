# Icon 图标

图标用于表示操作、状态和导航。支持305个内置 SVG 图标名称、图片地址、自定义颜色与尺寸，内置图形基于 Tabler Icons 3.53.0（MIT）。

```tsx
import { Icon } from '@daisu-ui/ui';
```

## 组件类型

### 内置图标

通过 `name` 指定内置图标名称。

```tsx
<Icon name="home" />
<Icon name="search-line" />
<Icon name="settings" />
```

## 组件样式

### 颜色与尺寸

通过 `color` 设置图标颜色，`size` 设置图标尺寸，单位为 px。

```tsx
<Icon name="heart-fill" size={32} color="#f14646" />
```

## 交互用法

### 点击图标

通过 `onTap` 响应点击，为可操作图标设置 `accessibilityLabel` 说明用途。

```tsx
<Icon
  name="download"
  accessibilityLabel="下载文件"
  onTap={() => {
    'background only';
    console.log('下载');
  }}
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| name | 名称或标识 | `IconName \| (string & {})` | 必填 |
| color | 内容颜色 | `string` | — |
| size | 尺寸 | `number` | `16` |
| className | 根节点自定义类名 | `string` | `''` |
| accessibilityLabel | 读屏工具使用的操作说明 | `string` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onTap | 点击时触发 | () => void |

## 数据类型

```tsx
export type IconName = keyof typeof iconPaths;
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
| `--cso-ui-dark-display` | 共享主题 |
| `--cso-ui-light-display` | 共享主题 |

## 源代码

[Icon 组件源码](./sources/icon/Icon.tsx.txt) · [示例源码](./sources/icon/demo.tsx.txt) · [文档源码](./sources/icon/docs.md.txt)
