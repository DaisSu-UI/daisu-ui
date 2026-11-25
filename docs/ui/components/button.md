# Button 按钮

按钮用于触发操作，例如提交表单、确认选择或打开页面。支持语义颜色、多种外观、加载状态和图标内容。

```tsx
import { Button } from 'daisu-ui';
```

## 组件类型

### 类型

通过 `tone` 设置按钮的语义颜色，默认为 `primary`。

```tsx
<Button label="主要按钮" />
<Button label="成功按钮" tone="success" />
<Button label="信息按钮" tone="info" />
<Button label="警告按钮" tone="warning" />
<Button label="危险按钮" tone="danger" />
<Button label="中性按钮" tone="neutral" />
```

## 组件状态

### 禁用

设置 `disabled` 后，按钮会降低透明度并停止响应点击。

```tsx
<Button label="默认按钮" disabled />
```

### 加载

设置 `loading` 显示加载指示器。加载期间不会触发 `onTap`，适合防止操作重复提交。

```tsx
<Button label="加载中" loading />
<Button label="加载中" tone="success" variant="plain" loading />
```

## 组件变体

使用 `variant` 设置外观，各种变体均可与 `tone`、`disabled` 和 `loading` 组合。

### 实心

默认的 `solid` 变体，用于页面主要操作。

```tsx
<Button label="主要按钮" variant="solid" />
```

### 镂空

`plain` 使用透明背景和实线边框。

```tsx
<Button label="主要按钮" variant="plain" />
```

### 虚线

`dashed` 使用透明背景和虚线边框。

```tsx
<Button label="添加项目" variant="dashed" />
```

### 柔和

`soft` 使用浅色背景，降低按钮的视觉强调程度。

```tsx
<Button label="主要按钮" variant="soft" />
```

### 柔和描边

`subtle` 在浅色背景上增加同色边框。

```tsx
<Button label="主要按钮" variant="subtle" />
```

### 文字

`text` 使用透明背景，不显示边框。

```tsx
<Button label="查看详情" variant="text" />
```

## 组件样式

### 尺寸

`size` 支持 `mini`、`small`、`medium` 和 `large`，默认值为 `medium`。默认高度依次为 28、32、40 和 44px。

```tsx
<Button label="迷你按钮" size="mini" />
<Button label="小号按钮" size="small" />
<Button label="普通按钮" size="medium" />
<Button label="大号按钮" size="large" />
```

### 细边框与圆角

设置 `hairline` 将描边宽度设为 0.5px；设置 `round` 使用胶囊形圆角。

```tsx
<Button label="细边框" variant="plain" hairline />
<Button label="圆角按钮" variant="plain" round />
<Button label="圆角细边框" variant="plain" hairline round />
```

## 特殊样式

### 自定义类名

使用 `className` 添加业务需要的样式。

```tsx
<Button label="主要按钮" className="custom-button" />
```

```css
.custom-button {
  width: 160px;
  margin-top: 16px;
}
```

## 内容形态

### 文本按钮

通过 `label` 设置文本内容。

```tsx
<Button label="确认" />
<Button label="取消" tone="info" />
```

### 纯图标按钮

`icon` 接收 React 节点。仅传入图标时，按钮宽度与当前尺寸的高度相同。建议为纯图标按钮设置 `accessibilityLabel`，让读屏工具能够说明操作用途。

```tsx
import { Button, Icon } from 'daisu-ui';

<Button
  icon={<Icon name="delete" color="#ffffff" />}
  accessibilityLabel="删除"
  round
/>
```

### 图文按钮

同时设置 `icon` 和 `label`，图标会显示在文字前面。加载时，加载指示器会替代图标。

```tsx
<Button
  label="下载"
  icon={<Icon name="download" color="#ffffff" />}
/>
```

## 布局能力

### 块级按钮

设置 `block` 占满父容器宽度，适合表单底部的提交操作。

```tsx
<Button label="提交" block size="large" />
<Button label="确认提交" block size="large" round />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| label | 按钮文本 | `string` | — |
| tone | 语义颜色 | `primary` / `success` / `info` / `warning` / `danger` / `neutral` | `primary` |
| variant | 按钮外观 | `solid` / `plain` / `dashed` / `soft` / `subtle` / `text` | `solid` |
| size | 按钮尺寸 | `mini` / `small` / `medium` / `large` | `medium` |
| round | 胶囊形圆角 | `boolean` | `false` |
| disabled | 禁用状态 | `boolean` | `false` |
| loading | 加载状态，同时阻止点击 | `boolean` | `false` |
| hairline | 将描边宽度设为 0.5px | `boolean` | `false` |
| block | 占满父容器宽度 | `boolean` | `false` |
| icon | 前置图标内容 | `ReactNode` | — |
| className | 根节点自定义类名 | `string` | `''` |
| accessibilityLabel | 读屏描述 | `string` | 跟随 `label` |

`tone`、`variant`、`size` 和 `round` 可通过 [ConfigProvider 全局配置](config-provider.md) 设置默认值，按钮自身传入的属性优先。

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onTap | 点击按钮时触发；禁用或加载期间不触发 | `() => void` |

```tsx
<Button label="确认" onTap={() => {
  'background only';
  console.log('确认操作');
}} />
```

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| icon | 文字前的自定义图标；加载期间由加载指示器替代 | `ReactNode` |

文本内容通过 `label` 设置。

## 主题定制

### 全局配置

在 `ConfigProvider` 中统一设置按钮默认样式与主题变量。

```tsx
import { Button, ConfigProvider } from 'daisu-ui';

<ConfigProvider
  button={{ round: true, size: 'large' }}
  themeVars={{
    buttonPrimaryBg: '#f86100',
    buttonPrimaryColor: '#ffffff',
    buttonRadius: 8,
  }}
>
  <Button label="确认提交" />
</ConfigProvider>
```

### CSS 变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| --cso-ui-button-primary-bg | 跟随 `--cso-ui-primary` | 主要按钮背景色 |
| --cso-ui-button-primary-color | 跟随 `--cso-ui-on-primary` | 主要按钮文字与加载指示器颜色 |
| --cso-ui-button-height | `40px` | 默认尺寸的高度 |
| --cso-ui-button-font-size | `16px` | 默认尺寸的字号 |
| --cso-ui-button-radius | `4px` | 默认圆角 |
| --cso-ui-button-pressed-opacity | `0.85` | 实心按钮按压透明度 |

语义颜色跟随 `ConfigProvider` 的明暗主题；`mini`、`small`、`large` 会使用各自的高度与内边距。

## 源代码

[组件源码](./sources/Button.tsx.txt) · [示例源码](./sources/button-demo.tsx.txt) · [文档源码](./sources/button.md.txt)
