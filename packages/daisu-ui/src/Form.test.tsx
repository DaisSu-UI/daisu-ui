import { beforeEach, afterEach, expect, rstest, test } from '@rstest/core';
import { createRef } from '@lynx-js/react';
import { cleanup, render, waitFor } from '@lynx-js/react/testing-library';
import { Form, FormItem } from './Form.js';
import type { FormRef } from './Form.js';
import type { FormSchema } from './formModel.js';
import { zodAdapter } from './formModel.js';
import type { NodesRef } from '@lynx-js/types';
import { Input } from './Input.js';
import { Switch } from './Switch.js';
beforeEach(() => { const original = lynx.createSelectorQuery.bind(lynx); rstest.spyOn(lynx,'createSelectorQuery').mockImplementation(() => { const q = original(), select = q.select.bind(q); q.select = selector => selector.startsWith('[react-ref-') ? { invoke: () => ({ exec() {} }) } as unknown as NodesRef : select(selector); return q; }); });
afterEach(() => { rstest.restoreAllMocks(); });
const schema: FormSchema = { isRequired: () => true, validate: m => [{ path: ['user','name'], message: '姓名必填' }, { path: 'hidden', message: '隐藏项' }].filter(x => x.path === 'hidden' || !(m.user as { name: string }).name) };
test('Form validates mounted fields, maps nested issues to a parent path, and resets messages without resetting data', async () => {
  const ref = createRef<FormRef>();
  try { const screen = render(<Form ref={ref} model={{ user: { name: '' } }} schema={schema}><FormItem prop="user" title="用户"><Input /></FormItem></Form>);
    expect(await ref.current!.validate()).toEqual({ valid: false, errors: [{ prop:'user', message:'姓名必填' }] });
    await waitFor(() => expect(screen.container.querySelector('.ui-form-item-error')?.textContent).toBe('姓名必填'));
    expect(screen.container.querySelector('.ui-cell-required')).toBeTruthy(); ref.current!.reset();
    await waitFor(() => expect(screen.container.querySelector('.ui-form-item-error')).toBeNull());
  } finally { cleanup(); }
});
test('Form selected validation preserves other errors and hidden fields are removed', async () => {
  const ref=createRef<FormRef>(), engine:FormSchema={validate:()=>[{path:'a',message:'A'},{path:'b',message:'B'}]};
  try { const screen=render(<Form ref={ref} model={{a:'',b:''}} schema={engine}>{['a','b'].map(prop=><FormItem key={prop} prop={prop}/>)}</Form>);
    await ref.current!.validate(); await ref.current!.validate('a');
    await waitFor(()=>expect(screen.container.querySelectorAll('.ui-form-item-error')).toHaveLength(2));
    screen.rerender(<Form ref={ref} model={{a:'',b:''}} schema={engine}>{['a'].map(prop=><FormItem key={prop} prop={prop}/>)}</Form>);
    await waitFor(()=>expect(screen.container.querySelectorAll('.ui-form-item-error')).toHaveLength(1));
    expect((await ref.current!.validate()).errors).toEqual([{prop:'a',message:'A'}]);
  } finally {cleanup();}
});
test('Form ignores old async results after edits, reset, newer validation and unmount', async () => {
  const ref=createRef<FormRef>(); let resolve!: (v:{path:string;message:string}[])=>void;
  const engine:FormSchema={validate:()=>new Promise(r=>{resolve=r;})};
  try { const screen=render(<Form ref={ref} model={{a:''}} schema={engine}><FormItem prop="a"/></Form>);
    let result=ref.current!.validate();screen.rerender(<Form ref={ref} model={{a:'new'}} schema={engine}><FormItem prop="a"/></Form>);resolve([{path:'a',message:'old'}]);expect((await result).outOfDate).toBe(true);
    result=ref.current!.validate();ref.current!.reset();resolve([{path:'a',message:'old'}]);expect((await result).outOfDate).toBe(true);
    result=ref.current!.validate();const first=resolve, newer=ref.current!.validate();first([{path:'a',message:'old'}]);expect((await result).outOfDate).toBe(true);resolve([]);expect((await newer).valid).toBe(true);
    result=ref.current!.validate();screen.unmount();resolve([{path:'a',message:'old'}]);expect((await result).outOfDate).toBe(true);
  } finally {cleanup();}
});
test('Form change trigger and errorType none still return validation results',async()=>{
  const ref=createRef<FormRef>();let calls=0;
  const engine:FormSchema={validate:()=>{calls++;return [{path:'a',message:'错误'}];}};
  try { const screen=render(<Form ref={ref} model={{a:''}} schema={engine} validateTrigger="change" errorType="none"><FormItem prop="a"/></Form>);
    screen.rerender(<Form ref={ref} model={{a:'next'}} schema={engine} validateTrigger="change" errorType="none"><FormItem prop="a"/></Form>);
    await waitFor(()=>expect(calls).toBe(1));expect((await ref.current!.validate()).valid).toBe(false);expect(screen.container.querySelector('.ui-form-item-error')).toBeNull();
  } finally {cleanup();}
});
test('Form disabled and compact state reaches inputs/switch, explicit overrides take precedence',()=>{
  try {const screen=render(<Form model={{}} disabled><FormItem title="输入"><Input /></FormItem><FormItem disabled={false}><Switch /></FormItem></Form>);
    expect(screen.container.querySelector('.ui-textfield-disabled')).toBeTruthy();expect(screen.container.querySelector('.ui-textfield-compact')).toBeTruthy();expect(screen.container.querySelector('.ui-switch-disabled')).toBeNull();
  }finally{cleanup();}
});
test('zodAdapter accepts an external async schema without importing Zod',async()=>{
  const adapter=zodAdapter({async safeParseAsync(){return {success:false,error:{issues:[{path:['list',0,'name'],message:'名称必填'}]}};}});
  expect(await adapter.validate({})).toEqual([{path:['list','0','name'],message:'名称必填'}]);
});

test('Form dynamically adds and removes indexed fields without keeping removed errors', async () => {
  const ref = createRef<FormRef>();
  const engine: FormSchema = { validate: model => (model.rows as string[]).flatMap((value, index) => value ? [] : [{ path: ['rows', String(index)], message: `第${index}项必填` }]) };
  const draw = (rows: { id: number; value: string }[]) => <Form ref={ref} model={{ rows: rows.map(row => row.value) }} schema={engine}>{rows.map((row, index) => <FormItem key={row.id} title={`单号${index}`} prop={`rows.${index}`} />)}</Form>;
  try {
    const screen = render(draw([{ id: 0, value: '已填写' }]));
    expect((await ref.current!.validate()).valid).toBe(true);
    screen.rerender(draw([{ id: 0, value: '已填写' }, { id: 1, value: '' }]));
    expect((await ref.current!.validate()).errors).toEqual([{ prop: 'rows.1', message: '第1项必填' }]);
    screen.rerender(draw([{ id: 0, value: '已填写' }]));
    expect((await ref.current!.validate()).valid).toBe(true);
    screen.rerender(draw([]));
    expect((await ref.current!.validate()).valid).toBe(true);
  } finally { cleanup(); }
});

test('FormItem displays a numeric zero and automatic validator failures are observable', async () => {
  let failure: unknown;
  const expected = new Error('校验服务失败');
  const engine: FormSchema = { validate: () => Promise.reject(expected) };
  const draw = (a: number) => <Form model={{ a }} schema={engine} validateTrigger="change" onValidateError={error => { failure = error; }}><FormItem title="数值" prop="a" value={a} placeholder="请输入" /></Form>;
  try {
    const screen = render(draw(0));
    expect(screen.container.querySelector('.ui-form-item-value')?.textContent).toBe('0');
    screen.rerender(draw(1));
    await waitFor(() => expect(failure).toBe(expected));
  } finally { cleanup(); }
});
