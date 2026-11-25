# Form 表单

表单用于组织字段布局与校验。Form 管理数据模型和校验规则，FormItem 描述字段并承载输入控件。

```tsx
import { Form, FormItem } from '@daisu-ui/ui';
```

## 基础用法

### 受控表单

通过 `model` 绑定表单数据，`FormItem.prop` 对应字段路径，输入控件通过 `onChange` 更新数据。

```tsx
import { useState } from '@lynx-js/react';

import { Input } from '@daisu-ui/ui';

const [model, setModel] = useState({ name: '' });

<Form model={model} border>
  <FormItem title="姓名" prop="name" required>
    <Input
      value={model.name}
      onChange={(name) => {
        'background only';
        setModel({ name });
      }}
    />
  </FormItem>
</Form>
```

## 校验用法

### 提交时校验

通过 `schema` 配置校验，在提交时调用 `ref.validate()`，检查结果中的 `valid` 后再处理数据。

```tsx
import { useRef } from '@lynx-js/react';

import type { FormRef, FormSchema } from '@daisu-ui/ui';

import { Button } from '@daisu-ui/ui';

const form = useRef<FormRef>(null);

const [model, setModel] = useState({ name: '' });

const schema: FormSchema = {
  validate: (data) =>
    data.name ? [] : [{ path: 'name', message: '请输入姓名' }],
};

<Form ref={form} model={model} schema={schema}>
  <FormItem title="姓名" prop="name">
    <Input
      value={model.name}
      onChange={(name) => {
        'background only';
        setModel({ name });
      }}
    />
  </FormItem>
</Form>
<Button
  label="提交"
  onTap={async () => {
    'background only';
    const result = await form.current?.validate();
    if (result?.valid) console.log(model);
  }}
/>
```

## 组件状态

### 整体禁用

设置 `Form.disabled`，表单中的关联控件统一进入禁用状态。

```tsx
<Form model={{ name: '张三' }} disabled>
  <FormItem title="姓名" prop="name">
    <Input value="张三" />
  </FormItem>
</Form>
```

## Attributes 属性

### Form

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| disabled | 是否禁用 | `boolean` | — |
| border | 是否显示边框 | `boolean` | — |
| center | 标题与内容是否垂直居中 | `boolean` | — |
| size | 尺寸 | `'medium' \| 'large'` | — |
| titleWidth | 标题区域宽度 | `number \| string` | — |
| layout | 排列方式 | `'horizontal' \| 'vertical'` | — |
| valueAlign | 值区域对齐方式 | `'left' \| 'center' \| 'right'` | — |
| asteriskPosition | 必填标记位置 | `'start' \| 'end'` | — |
| hideAsterisk | 是否隐藏必填标记 | `boolean` | — |
| ellipsis | 是否截断超出范围的文字 | `boolean` | — |
| model | 受控表单数据对象 | `FormModel` | 必填 |
| schema | 表单校验适配器 | `FormSchema` | — |
| validateTrigger | 触发校验的时机 | `FormValidateTrigger \| readonly FormValidateTrigger[]` | — |
| resetOnChange | 数据变化时是否清除对应校验结果 | `boolean` | — |
| errorType | 校验错误展示方式 | `'message' \| 'toast' \| 'none'` | — |
| className | 根节点自定义类名 | `string` | — |
| style | 根节点样式 | `CSSProperties` | — |
| children | 自定义内容 | `ReactNode` | — |

### FormItem

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| disabled | 是否禁用 | `boolean` | — |
| border | 是否显示边框 | `boolean` | — |
| center | 标题与内容是否垂直居中 | `boolean` | — |
| size | 尺寸 | `'medium' \| 'large'` | — |
| titleWidth | 标题区域宽度 | `number \| string` | — |
| layout | 排列方式 | `'horizontal' \| 'vertical'` | — |
| valueAlign | 值区域对齐方式 | `'left' \| 'center' \| 'right'` | — |
| asteriskPosition | 必填标记位置 | `'start' \| 'end'` | — |
| hideAsterisk | 是否隐藏必填标记 | `boolean` | — |
| ellipsis | 是否截断超出范围的文字 | `boolean` | — |
| prop | 字段路径 | `string` | — |
| title | 标题内容 | `ReactNode` | — |
| value | 当前值；传入后由调用方更新 | `string \| number` | — |
| placeholder | 占位内容或输入提示 | `string` | — |
| prefixIcon | 前置图标名称 | `string` | — |
| iconSize | 图标尺寸 | `number` | `16` |
| icon | 图标内容 | `ReactNode` | — |
| label | 显示文案 | `string` | — |
| required | 是否显示必填标记 | `boolean` | — |
| validateTrigger | 触发校验的时机 | `FormProps['validateTrigger']` | — |
| clickable | 是否显示可点击状态 | `boolean` | — |
| isLink | 是否展示链接入口 | `boolean` | — |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |
| children | 自定义内容 | `ReactNode` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| Form.onValidate | 对应操作发生时触发 | (result: FormValidateResult) => void |
| Form.onValidateError | 对应操作发生时触发 | (error: unknown) => void |
| FormItem.onTap | 点击时触发 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| Form.children | 自定义内容 | ReactNode |
| FormItem.title | 标题内容 | ReactNode |
| FormItem.icon | 图标内容 | ReactNode |
| FormItem.children | 自定义内容 | ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| validate | 执行校验 | (prop?: string \| readonly string[]) => Promise<FormValidateResult> |
| reset | 重置状态 | (prop?: string \| readonly string[]) => void |

## 数据类型

```tsx
export type FormModel = Record<string, unknown>;

export type FormSchema = {
  validate: (
    model: FormModel,
  ) => readonly FormSchemaIssue[] | Promise<readonly FormSchemaIssue[]>;
  isRequired?: (path: string) => boolean | undefined;
};

export type FormValidateTrigger = 'submit' | 'change' | 'blur';

export type FormValidateResult = {
  valid: boolean;
  errors: FormError[];
  outOfDate?: boolean;
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
| `--cso-ui-danger` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-disabled` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |
| `--cso-ui-text-placeholder` | 共享主题 |

## 源代码

[Form 组件源码](./sources/form-detail/Form.tsx.txt) · [FormItem 组件源码](./sources/form-detail/Form.tsx.txt) · [示例源码](./sources/form-detail/demo.tsx.txt) · [文档源码](./sources/form-detail/docs.md.txt)
