import { useRef, useState } from '@lynx-js/react';
import { Button, Form, FormItem, Input, Switch, Toast, useToast } from 'daisu-ui';
import type { FormRef, FormSchema } from 'daisu-ui';
import type { UiDemoComponent } from '../catalog.js';
import { DemoGroup, ExampleBlock } from './shared.js';
const basicSchema: FormSchema = { validate(model) { const issues = []; if (!model.value1) issues.push({ path: 'value1', message: '请输入歪比巴卜' }); if (!model.value2) issues.push({ path: 'value2', message: '请输入沙卡拉卡' }); if (model.value1 !== model.value2) { issues.push({ path: 'value1', message: '两个输入框的内容必须一致' }, { path: 'value2', message: '两个输入框的内容必须一致' }); } return issues; } };
const hiddenSchema: FormSchema = { validate: m => ['visibleValue', 'hiddenValue'].filter(k => !m[k]).map(path => ({ path, message: `请输入${path === 'visibleValue' ? '可见' : '隐藏'}字段` })) };
const parentSchema: FormSchema = { validate: m => (m.user as { name: string }).name ? [] : [{ path: ['user', 'name'], message: '请输入用户名' }] };
export function FormExample({ onOpen }: { onOpen: (page: UiDemoComponent) => void }) {
  const [model, setModel] = useState({ value1: '', value2: '' }), [hidden, setHidden] = useState(false), [hiddenModel, setHiddenModel] = useState({ visibleValue: 'wot-ui', hiddenValue: '' }), [parentModel, setParentModel] = useState({ user: { name: '' } });
  const basic = useRef<FormRef>(null), hiddenForm = useRef<FormRef>(null), parent = useRef<FormRef>(null), toast = useToast();
  const submit = (ref: { current: FormRef | null }) => { 'background only'; void ref.current?.validate().then(result => { if (result.valid) toast.success('校验通过'); }).catch(() => toast.error('校验失败，请重试')); };
  const footer = (ref: { current: FormRef | null }) => <view className="demo-form-footer"><Button label="提交" size="large" block onTap={() => submit(ref)} /></view>;
  return <view className="demo-form-page"><>
    <DemoGroup title="组件类型"><ExampleBlock title="基础表单" noPadding><Form ref={basic} model={model} schema={basicSchema} titleWidth={100}>
      <FormItem title="歪比巴卜" prop="value1"><Input value={model.value1} placeholder="请输入歪比巴卜" onChange={value1 => setModel(old => ({ ...old, value1 }))} /></FormItem>
      <FormItem title="沙卡拉卡" prop="value2"><Input value={model.value2} placeholder="请输入沙卡拉卡" onChange={value2 => setModel(old => ({ ...old, value2 }))} /></FormItem>{footer(basic)}
    </Form></ExampleBlock>{['动态表单', '复杂表单'].map(label => <ExampleBlock title={label} key={label} noPadding><view className="demo-form-button-wrap"><Button label={label} size="large" block onTap={() => onOpen(label === '动态表单' ? 'form-dynamic' : label === '复杂表单' ? 'form-complex' : label === '校验提示方式' ? 'form-errors' : label === '禁用表单' ? 'form-disabled' : 'form-trigger')} /></view></ExampleBlock>)}</DemoGroup>
    <DemoGroup title="组件配置">{['校验提示方式', '禁用表单', '校验触发时机'].map(label => <ExampleBlock title={label} key={label} noPadding><view className="demo-form-button-wrap"><Button label={label} size="large" block onTap={() => onOpen(label === '动态表单' ? 'form-dynamic' : label === '复杂表单' ? 'form-complex' : label === '校验提示方式' ? 'form-errors' : label === '禁用表单' ? 'form-disabled' : 'form-trigger')} /></view></ExampleBlock>)}
      <ExampleBlock title="隐藏字段校验" noPadding><Form ref={hiddenForm} model={hiddenModel} schema={hiddenSchema} titleWidth={110}><FormItem title="显示隐藏字段"><Switch value={hidden} size={20} onChange={({ value }) => setHidden(!!value)} /></FormItem><FormItem title="可见字段" prop="visibleValue"><Input value={hiddenModel.visibleValue} placeholder="请输入可见字段" onChange={visibleValue => setHiddenModel(old => ({ ...old, visibleValue }))} /></FormItem>{hidden ? <FormItem title="隐藏字段" prop="hiddenValue"><Input value={hiddenModel.hiddenValue} placeholder="请输入隐藏字段" onChange={hiddenValue => setHiddenModel(old => ({ ...old, hiddenValue }))} /></FormItem> : null}{footer(hiddenForm)}</Form></ExampleBlock>
      <ExampleBlock title="父路径校验" noPadding><Form ref={parent} model={parentModel} schema={parentSchema} titleWidth={110}><FormItem title="用户名" prop="user"><Input value={parentModel.user.name} placeholder="请输入用户名" onChange={name => setParentModel({ user: { name } })} /></FormItem>{footer(parent)}</Form></ExampleBlock>
    </DemoGroup></>
    <Toast {...toast.props} />
  </view>;
}
