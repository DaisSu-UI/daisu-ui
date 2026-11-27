import { useDemoLocale } from '../demoLocale.js';
import { useRef, useState } from '@lynx-js/react';
import { z } from 'zod';
import { Button, Cell, Form, FormItem, Input, Switch, Toast, useToast, zodAdapter } from '@daisu-ui/ui';
import type { FormRef, FormSchema } from '@daisu-ui/ui';

type DynamicModel = { name: string; phoneNumbers: { key: number; value: string }[] };
const required = (path: string) => path === 'name' || /^phoneNumbers\.\d+\.value$/.test(path);
const customSchema: FormSchema = {
  isRequired: required,
  validate(model) {
    const issues = [];
    if (!model.name) issues.push({ path: ['name'], message: '请输入歪比巴卜' });
    (model.phoneNumbers as DynamicModel['phoneNumbers']).forEach((item, index) => {
      if (!item.value) issues.push({ path: ['phoneNumbers', String(index), 'value'], message: `玛卡巴卡单号${index}` });
    });
    return issues;
  },
};
const zodSchema = zodAdapter(z.object({
  name: z.string().min(1, '请输入歪比巴卜'),
  phoneNumbers: z.array(z.object({ key: z.number(), value: z.string() })),
}).superRefine((model, context) => {
  model.phoneNumbers.forEach((item, index) => {
    if (!item.value) context.addIssue({ code: 'custom', path: ['phoneNumbers', index, 'value'], message: `玛卡巴卡单号${index}` });
  });
}), { isRequired: required });

export function DynamicFormExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [model, setModel] = useState<DynamicModel>({ name: '', phoneNumbers: [{ key: 0, value: '' }] });
  const [useZod, setUseZod] = useState(true);
  const form = useRef<FormRef>(null), sequence = useRef(0), toast = useToast();
  const add = () => {
    'background only';
    const key = ++sequence.current;
    setModel(old => ({ ...old, phoneNumbers: [...old.phoneNumbers, { key, value: '' }] }));
  };
  const submit = () => {
    'background only';
    void form.current?.validate().then(result => {
      if (result.valid) toast.success('校验通过');
    }).catch(() => toast.error('校验失败'));
  };

  return <view className="demo-form-dynamic">
    <Form ref={form} model={model} schema={useZod ? zodSchema : customSchema} titleWidth={120} border>
      <FormItem title={demoText("校验引擎")}>
        <Switch value={useZod} size={20} activeText="Zod" inactiveText="自定义" onChange={({ value }) => setUseZod(!!value)} />
      </FormItem>
      <FormItem title={demoText("歪比巴卜名")} prop="name">
        <Input value={model.name} clearable placeholder={demoText("请输入歪比巴卜")} onChange={name => setModel(old => ({ ...old, name }))} />
      </FormItem>
      {model.phoneNumbers.map((item, index) => <FormItem key={item.key} title={demoText(`玛卡巴卡单号${index}`)} prop={`phoneNumbers.${index}.value`}>
        <Input value={item.value} clearable placeholder={demoText("请填写玛卡巴卡单号")} onChange={value => setModel(old => ({
          ...old,
          phoneNumbers: old.phoneNumbers.map(row => row.key === item.key ? { ...row, value } : row),
        }))} />
      </FormItem>)}
      <Cell titleWidth="0px" valueAlign="left">
        <view className="demo-form-dynamic-actions">
          <Button size="small" tone="neutral" label={demoText("添加")} onTap={add} />
          <Button size="small" tone="neutral" label={demoText("删除")} onTap={() => setModel(old => ({ ...old, phoneNumbers: old.phoneNumbers.slice(0, -1) }))} />
          <Button size="small" tone="neutral" label={demoText("重置")} onTap={() => form.current?.reset()} />
          <Button size="small" label={demoText("提交")} onTap={submit} />
        </view>
      </Cell>
    </Form>
    <Toast {...demoCopy(toast.props)} />
  </view>;
}
