# Cascader 级联选择

级联选择器适合省市区、分类等层级数据，支持逐级选择和异步加载。

```tsx
import { Cascader } from '@daisu-ui/ui';
```

## 组件类型

### 层级选择

通过 `options` 配置层级数据，子级放在 `children` 中，`visible` 控制面板显示。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from '@daisu-ui/ui';

const [visible, setVisible] = useState(false);

<Button
  label="选择地区"
  onTap={() => {
    'background only';
    setVisible(true);
  }}
/>
<Cascader
  visible={visible}
  onVisibleChange={setVisible}
  options={[
    {
      value: 'zj',
      label: '浙江',
      children: [{ value: 'hz', label: '杭州' }],
    },
  ]}
/>
```

## 组件样式

### 自定义标题

通过 `title` 设置级联面板标题。

```tsx
<Cascader
  visible={false}
  title="选择分类"
  options={[{ value: 'book', label: '图书' }]}
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| valueKey | 选项值字段名 | `string` | — |
| textKey | 文字字段名 | `string` | — |
| childrenKey | 子节点字段名 | `string` | — |
| tipKey | 选项说明字段名 | `string` | — |
| isLeafKey | 叶子节点字段名 | `string` | — |
| value | 当前值；传入后由调用方更新 | `CascaderValue` | — |
| options | 选项配置 | `readonly CascaderInput[]` | — |
| visible | 是否显示选择面板 | `boolean` | — |
| title | 标题内容 | `string` | `'请选择'` |
| placeholder | 占位内容或输入提示 | `string` | `'请选择'` |
| checkStrictly | 是否允许选择中间层级 | `boolean` | `false` |
| confirmText | 确认文案 | `string` | `'确认'` |
| lazyLoad | 异步加载下一级数据 | `CascaderLazyLoad` | — |
| beforeConfirm | 确认前校验 | `(value: CascaderScalar, options: CascaderOption[]) => boolean \| Promise<boolean>` | — |
| disabled | 是否禁用 | `boolean` | — |
| loading | 加载状态或自定义加载内容 | `boolean` | `false` |
| loadingColor | 加载指示器颜色 | `string` | `'#4D80F0'` |
| lineTheme | 标签指示线外观 | `TabsLineTheme` | — |
| lineWidth | 指示线宽度 | `number \| string` | — |
| lineHeight | 行高或指示线高度 | `number \| string` | — |
| closeOnClickModal | 点击遮罩是否关闭 | `boolean` | `true` |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | `false` |
| safeAreaInsetBottom | 是否预留底部安全区 | `boolean` | `true` |
| safeAreaBottom | 底部安全区高度 | `number` | `0` |
| zIndex | 浮层层级 | `number` | `100` |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onVisibleChange | 面板显示状态变化时触发 | (visible: boolean) => void |
| onChange | 值发生变化时触发 | (event: CascaderSelection) => void |
| onConfirm | 确认选择时触发 | (event: CascaderSelection) => void |
| onClose | 关闭时触发 | () => void |
| onCancel | 取消操作时触发 | () => void |
| onOpen | 打开时触发 | () => void |
| onLoadError | 对应操作发生时触发 | (error: unknown) => void |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| open | 打开面板 | () => void |
| close | 关闭面板 | () => void |

## 数据类型

```tsx
export type CascaderValue = CascaderScalar | readonly CascaderScalar[];

export type CascaderLazyLoad = (
  option: CascaderOption | null,
  tabIndex: number,
  resolve: (options: readonly CascaderInput[]) => void,
) => void | Promise<void>;

export type CascaderOption = {
  value: CascaderScalar;
  text: string;
  children?: readonly CascaderOption[];
  disabled?: boolean;
  tip?: string;
  isLeaf?: boolean;
  [key: string]: unknown;
};

export type CascaderSelection = {
  value: CascaderValue;
  selectedOptions: CascaderOption[];
};

export type TabsLineTheme = 'normal' | 'text' | 'underline' | 'dot';
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
| `--cso-ui-disabled-text` | 共享主题 |
| `--cso-ui-light-display` | 共享主题 |
| `--cso-ui-primary` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Cascader 组件源码](./sources/cascader/Cascader.tsx.txt) · [示例源码](./sources/cascader/demo.tsx.txt) · [文档源码](./sources/cascader/docs.md.txt)
