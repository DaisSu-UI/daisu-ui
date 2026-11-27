# 表单行封装

用于已有业务表单的轻量行布局。新表单推荐使用 [Form / FormItem](form.md)，这些封装不注册 Form 字段、不执行校验，也不自动继承 Form 的禁用状态。required 仅显示星号，error 由调用方提供；last 隐藏末行分隔线。FormFieldRow.disabled 只添加外观类名，自定义 children 的交互需自行拦截。FormInputRow.disabled 也不阻止原生输入或清空；需要完整禁用时使用 Input 配合 FormItem。FormTextareaRow.disabled 仅拦截 onInput 回写，仍可聚焦，不能作为原生输入禁用保证。

```tsx
import { FormFieldRow, FormInputRow, FormNumberRow, FormRadioRow, FormSelectRow, FormTextareaRow } from '@daisu-ui/ui';
```

## 基础用法

### 受控输入与错误展示

value 必须是字符串；onInput 直接接收字符串，不是原生事件。required 不会自动验证，示例由调用方计算 error。

```tsx
import { useState } from '@lynx-js/react';

const [name, setName] = useState('');

<FormInputRow
  label="姓名"
  required
  value={name}
  onInput={(value) => {
    'background only';
    setName(value);
  }}
  maxlength={30}
  error={name ? undefined : '请输入姓名'}
/>
```

### 数字、单选与多行输入

数字行使用字符串状态；单选的 options 使用 value / label。多行输入默认 maxlength=2000、maxlines=6、显示字数。

```tsx
const [count, setCount] = useState('1');

const [choice, setChoice] = useState('a');

const [note, setNote] = useState('');

<FormNumberRow
  label="数量"
  value={count}
  min={1}
  max={10}
  onChange={(value) => {
    'background only';
    setCount(value);
  }}
/>
<FormRadioRow
  label="选项"
  value={choice}
  options={[
    { value: 'a', label: '选项 A' },
    { value: 'b', label: '选项 B' },
  ]}
  onChange={(value) => {
    'background only';
    setChoice(value);
  }}
/>
<FormTextareaRow
  label="备注"
  value={note}
  maxlength={200}
  maxlines={4}
  onInput={(value) => {
    'background only';
    setNote(value);
  }}
  last
/>
```

## 组合用法

### 外部选择器与自定义内容

FormSelectRow 只展示文本并发出点击、清空回调，不包含选择器。示例点击直接回填固定值，实际项目应打开公共 Picker 等组件并在确认时回填；onClear 为必填回调。

```tsx
const [city, setCity] = useState('');

<FormSelectRow
  label="城市"
  value={city}
  placeholder="请选择城市"
  onTap={() => {
    'background only';
    setCity('杭州');
  }}
  onClear={() => {
    'background only';
    setCity('');
  }}
/>
<FormFieldRow label="说明" last>
  <text>选择面板及其草稿由调用方管理</text>
</FormFieldRow>
```

## Attributes 属性

### FormFieldRow

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| label | 左侧字段标题 | `string` | 必填 |
| required | 显示必填星号，不执行校验 | `boolean` | `false` |
| last | 隐藏底部分隔线 | `boolean` | `false` |
| disabled | 禁用外观与部分回调拦截；具体边界见本页说明 | `boolean` | `false` |
| error | 调用方提供的错误文案，非空时显示 | `string` | — |
| children | 自定义内容 | `JSX.Element` | 必填 |

### FormInputRow

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| label | 左侧字段标题 | `string` | 必填 |
| required | 显示必填星号，不执行校验 | `boolean` | `false` |
| last | 隐藏底部分隔线 | `boolean` | `false` |
| disabled | 禁用外观与部分回调拦截；具体边界见本页说明 | `boolean` | `false` |
| error | 调用方提供的错误文案，非空时显示 | `string` | — |
| value | 受控字符串值 | `string` | 必填 |
| maxlength | 最大输入长度，-1 表示不限制 | `number` | — |
| placeholder | 占位内容或输入提示 | `string` | — |
| clearable | 是否显示清空入口 | `boolean` | `true` |

### FormNumberRow

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| label | 左侧字段标题 | `string` | 必填 |
| required | 显示必填星号，不执行校验 | `boolean` | `false` |
| last | 隐藏底部分隔线 | `boolean` | `false` |
| disabled | 禁用外观与部分回调拦截；具体边界见本页说明 | `boolean` | `false` |
| error | 调用方提供的错误文案，非空时显示 | `string` | — |
| value | 受控字符串值 | `string` | 必填 |
| min | 最小值 | `number` | — |
| max | 最大值或数量上限 | `number` | — |
| step | 每次增加或减少的步长 | `number` | — |

### FormRadioRow

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| label | 左侧字段标题 | `string` | 必填 |
| required | 显示必填星号，不执行校验 | `boolean` | `false` |
| last | 隐藏底部分隔线 | `boolean` | `false` |
| disabled | 禁用外观与部分回调拦截；具体边界见本页说明 | `boolean` | `false` |
| error | 调用方提供的错误文案，非空时显示 | `string` | — |
| value | 受控字符串值 | `string` | 必填 |
| options | 选项配置 | `RadioOption[]` | 必填 |

### FormSelectRow

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| label | 左侧字段标题 | `string` | 必填 |
| required | 显示必填星号，不执行校验 | `boolean` | `false` |
| last | 隐藏底部分隔线 | `boolean` | `false` |
| disabled | 禁用外观与部分回调拦截；具体边界见本页说明 | `boolean` | `false` |
| error | 调用方提供的错误文案，非空时显示 | `string` | — |
| value | 受控字符串值 | `string` | — |
| placeholder | 占位内容或输入提示 | `string` | 必填 |
| clearable | 是否显示清空入口 | `boolean` | `true` |

### FormTextareaRow

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| label | 左侧字段标题 | `string` | 必填 |
| required | 显示必填星号，不执行校验 | `boolean` | `false` |
| last | 隐藏底部分隔线 | `boolean` | `false` |
| disabled | 禁用外观与部分回调拦截；具体边界见本页说明 | `boolean` | `false` |
| error | 调用方提供的错误文案，非空时显示 | `string` | — |
| value | 受控字符串值 | `string` | 必填 |
| maxlength | 最大输入长度，-1 表示不限制 | `number` | `2000` |
| maxlines | 原生多行输入的最大行数 | `number` | `6` |
| placeholder | 占位内容或输入提示 | `string` | — |
| showWordLimit | 是否显示字数统计 | `boolean` | `true` |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| FormInputRow.onInput | 输入后的字符串回调，调用方回写 value | (value: string) => void |
| FormInputRow.onBlur | 失焦通知，无事件参数 | () => void |
| FormNumberRow.onChange | 变化后的字符串回调，调用方回写 value | (value: string) => void |
| FormNumberRow.onBlur | 失焦通知，无事件参数 | () => void |
| FormRadioRow.onChange | 变化后的字符串回调，调用方回写 value | (value: string) => void |
| FormSelectRow.onTap | 请求打开调用方的选择面板 | () => void |
| FormSelectRow.onClear | 请求清空选择值，必填回调 | () => void |
| FormTextareaRow.onInput | 输入后的字符串回调，调用方回写 value | (value: string) => void |
| FormTextareaRow.onBlur | 失焦通知，无事件参数 | () => void |

## 数据类型

```tsx
export type RadioOption = {
  label: string;
  value: string;
  disabled?: boolean;
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

## 源代码

[FormFieldRow 组件源码](./sources/form-rows/FormFieldRow.tsx.txt) · [FormInputRow 组件源码](./sources/form-rows/FormFieldRow.tsx.txt) · [FormNumberRow 组件源码](./sources/form-rows/FormFieldRow.tsx.txt) · [FormRadioRow 组件源码](./sources/form-rows/FormFieldRow.tsx.txt) · [FormSelectRow 组件源码](./sources/form-rows/FormFieldRow.tsx.txt) · [FormTextareaRow 组件源码](./sources/form-rows/FormFieldRow.tsx.txt) · [文档源码](./sources/form-rows/docs.md.txt)
