# Dialog 对话框

对话框用于确认操作、展示提醒或收集简单输入，支持异步确认与自定义内容。

```tsx
import { Dialog } from '@daisu-ui/ui';
```

## 组件类型

### 消息提醒

将 `useDialog()` 返回的 `props` 绑定到 `Dialog`，调用 `alert()` 显示提醒，通过 `title` 和 `msg` 设置内容。

```tsx
import { useDialog, Button } from '@daisu-ui/ui';

const dialog = useDialog();

<Button
  label="显示提醒"
  onTap={() => {
    'background only';
    void dialog.alert({ title: '提示', msg: '操作已完成' });
  }}
/>
<Dialog {...dialog.props} />
```

### 确认操作

调用 `confirm()` 显示确认对话框，用户确认时 Promise 完成，取消时进入拒绝分支。

```tsx
const dialog = useDialog();

<Button
  label="删除"
  onTap={async () => {
    'background only';
    try {
      await dialog.confirm({
        title: '删除确认',
        msg: '确定删除这条记录吗？',
      });
      console.log('已确认');
    } catch {
      console.log('已取消');
    }
  }}
/>
<Dialog {...dialog.props} />
```

## 组件样式

### 按钮主题

设置 `theme="button"` 使用按钮样式的操作区。

```tsx
<Dialog show={false} title="操作确认" msg="请选择操作" theme="button" />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| title | ReactNode 标题 / 纯文本正文 | `ReactNode` | — |
| msg | ReactNode 标题 / 纯文本正文 | `string` | — |
| type | alert/confirm/prompt | `'alert' \| 'confirm' \| 'prompt'` | `'alert'` |
| theme | button/text；horizontal/vertical | `'button' \| 'text'` | `'button'` |
| actionLayout | button/text；horizontal/vertical | `'horizontal' \| 'vertical'` | `'horizontal'` |
| actions | {text,action?:confirm/cancel/action,...公共ButtonProps}[]，优先于默认按钮 | `readonly DialogAction[]` | — |
| showCancelButton | 取消按钮 | `boolean` | — |
| confirmButtonText | 默认文案 | `string` | `'确定'` |
| cancelButtonText | 默认文案 | `string` | `'取消'` |
| confirmButtonProps | 部分DialogAction或string；null隐藏按钮 | `Partial<DialogAction> \| string \| null` | — |
| cancelButtonProps | 部分DialogAction或string；null隐藏按钮 | `Partial<DialogAction> \| string \| null` | — |
| inputValue | 初始值；{placeholder,maxlength,type,multiline,maxlines} | `string \| number` | `''` |
| inputProps | 初始值；{placeholder,maxlength,type,multiline,maxlines} | `DialogInputProps` | — |
| inputPattern | 正则 / (string)=>boolean或错误字符串 | `RegExp` | — |
| inputValidate | 正则 / (string)=>boolean或错误字符串 | `(value: string) => boolean \| string` | — |
| inputError | 校验提示 | `string` | `'输入内容不正确'` |
| showErr | 校验提示 | `boolean` | `false` |
| beforeConfirm | (string)=>boolean或Promise<boolean>；false拦截，异常显示可重试错误 | `(value: string) => boolean \| Promise<boolean>` | — |
| icon | 公共Icon名称/语义success、danger、warning、info / 颜色 / 头图地址 | `string` | — |
| iconColor | 公共Icon名称/语义success、danger、warning、info / 颜色 / 头图地址 | `string` | — |
| headerImage | 公共Icon名称/语义success、danger、warning、info / 颜色 / 头图地址 | `string` | — |
| closeOnClickModal | 遮罩关闭 / 关闭按钮 | `boolean` | `false` |
| showClose | 遮罩关闭 / 关闭按钮 | `boolean` | `false` |
| zIndex | 层级 / 懒挂载 | `number` | `99` |
| lazyRender | 层级 / 懒挂载 | `boolean` | `true` |
| requestKey | useDialog内部请求编号，替换请求时使旧确认失效 | `number` | `0` |
| show | 受控显示 / 关闭请求 / {action,value,index?}结果 | `boolean` | `false` |
| rootPortal | 原生Portal，需Host | `boolean` | `false` |
| className | 自定义样式 | `string` | `''` |
| style | 自定义样式 | `CSSProperties` | — |
| children | 内容、头部、操作区；renderActions接收confirm/cancel/close/pending | `ReactNode` | — |
| header | 内容、头部、操作区；renderActions接收confirm/cancel/close/pending | `ReactNode` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 受控显示 / 关闭请求 / {action,value,index?}结果 | (show: boolean) => void |
| onResult | 受控显示 / 关闭请求 / {action,value,index?}结果 | (result: DialogResult) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| title | ReactNode 标题 / 纯文本正文 | ReactNode |
| children | 内容、头部、操作区；renderActions接收confirm/cancel/close/pending | ReactNode |
| header | 内容、头部、操作区；renderActions接收confirm/cancel/close/pending | ReactNode |
| renderActions | 内容、头部、操作区；renderActions接收confirm/cancel/close/pending | (controls: { confirm: () => void; cancel: () => void; close: () => void; pending: boolean }) => ReactNode |

## 数据类型

```tsx
export type DialogAction = Omit<ButtonProps, 'onTap' | 'label'> & {
  text: string;
  action?: 'confirm' | 'cancel' | 'action';
};

export type DialogResult = {
  action: 'confirm' | 'cancel' | 'modal' | 'close' | 'action';
  value: string;
  index?: number;
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
| `--cso-ui-canvas` | 共享主题 |
| `--cso-ui-danger` | 共享主题 |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Dialog 组件源码](./sources/dialog/Dialog.tsx.txt) · [示例源码](./sources/dialog/demo.tsx.txt) · [文档源码](./sources/dialog/docs.md.txt)
