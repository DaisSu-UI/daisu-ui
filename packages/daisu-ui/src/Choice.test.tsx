import { afterEach, expect, test } from '@rstest/core';
import { createRef } from '@lynx-js/react';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Radio, RadioGroup } from './Radio.js';
import { Checkbox, CheckboxGroup } from './Checkbox.js';
import type { CheckboxGroupRef } from './Checkbox.js';
import { FormFieldContext } from './formContext.js';
afterEach(cleanup);
const tap = (element: Element) => fireEvent.tap(element, { eventType: 'catchEvent' });

test('Radio preserves strict values, allows clearing, and honors item overrides', () => {
  const changes: unknown[] = [];
  const draw = (value: string | number | null) => <RadioGroup value={value} allowUncheck disabled onChange={v => changes.push(v)}><Radio value={1} disabled={false}>数字</Radio><Radio value="1">字符串</Radio><Radio value={2} readonly disabled={false}>只读</Radio></RadioGroup>;
  const screen = render(draw(1));
  const radios = () => screen.container.querySelectorAll('.ui-choice');
  expect(radios()[0]!.className).toContain('ui-choice-checked');
  expect(radios()[1]!.className).not.toContain('ui-choice-checked');
  tap(radios()[0]!); tap(radios()[1]!); tap(radios()[2]!);
  expect(changes).toEqual([null]);
  screen.rerender(draw(null)); tap(radios()[0]!);
  expect(changes).toEqual([null, 1]);
});

test('Radio keeps the legacy options API and Form disabled state', () => {
  const screen = render(<RadioGroup options={[{label:'旧选项',value:'old'}]} value="old" onChange={() => {}} />);
  expect(screen.getByText('旧选项')).toBeTruthy();
  screen.rerender(<FormFieldContext.Provider value={{disabled:true,compact:true,error:false,onBlur:()=>{}}}><RadioGroup disabled={false}><Radio value={1} disabled={false}>禁用</Radio></RadioGroup></FormFieldContext.Provider>);
  expect(screen.container.querySelector('.ui-choice-disabled')).toBeTruthy();
});

test('Checkbox enforces min/max with strict names and supports custom standalone values', () => {
  const changes: unknown[] = [];
  const screen = render(<CheckboxGroup defaultValue={[1]} min={1} max={2} onChange={e=>changes.push(e.value)}><Checkbox name={1}>一</Checkbox><Checkbox name="1">字符串一</Checkbox><Checkbox name={3}>三</Checkbox></CheckboxGroup>);
  const boxes=()=>screen.container.querySelectorAll('.ui-choice');
  tap(boxes()[0]!); expect(changes).toEqual([]);
  tap(boxes()[1]!); expect(changes).toEqual([[1,'1']]);
  tap(boxes()[2]!); expect(changes).toHaveLength(1);
  tap(boxes()[0]!); expect(changes[1]).toEqual(['1']);
  screen.rerender(<Checkbox trueValue="yes" falseValue="no" defaultValue="yes" onChange={e=>changes.push(e.value)}>自定义</Checkbox>);
  tap(boxes()[0]!); expect(changes.at(-1)).toBe('no');
});

test('Checkbox toggleAll skips disabled entries on demand and respects readonly', () => {
  const ref=createRef<CheckboxGroupRef>(),changes: unknown[]=[];
  const screen=render(<CheckboxGroup ref={ref} defaultValue={[2]} onChange={e=>changes.push(e.value)}><Checkbox name={1}>一</Checkbox><Checkbox name={2} disabled>二</Checkbox><Checkbox name={3} readonly>三</Checkbox></CheckboxGroup>);
  ref.current!.toggleAll({checked:true,skipDisabled:true}); expect(changes.at(-1)).toEqual([2,1]);
  ref.current!.toggleAll({checked:false,skipDisabled:true}); expect(changes.at(-1)).toEqual([2]);
  ref.current!.toggleAll(false); expect(changes.at(-1)).toEqual([]);
  screen.rerender(<CheckboxGroup ref={ref} readonly defaultValue={[]} onChange={e=>changes.push(e.value)}><Checkbox name={1}>一</Checkbox></CheckboxGroup>);
  const count=changes.length;ref.current!.toggleAll(true);expect(changes).toHaveLength(count);
});
