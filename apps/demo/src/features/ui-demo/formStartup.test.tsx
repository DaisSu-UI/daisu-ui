import { afterEach, beforeEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import type { NodesRef } from '@lynx-js/types';
import * as areaOptions from './areaOptions.js';
import { ComplexFormExample } from './examples/form-complex.js';
import { FormDisabledExample, FormErrorsExample } from './examples/form-config.js';

beforeEach(() => {
  const original = lynx.createSelectorQuery.bind(lynx);
  rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => {
    const query = original(), select = query.select.bind(query);
    query.select = selector => selector.startsWith('[react-ref-') ? { invoke: () => ({ exec() {} }) } as unknown as NodesRef : select(selector);
    return query;
  });
});
afterEach(() => { cleanup(); rstest.restoreAllMocks(); });

test('form validation Demo exposes message+toast and replaces errors with a single success toast', async()=>{
  const screen=render(<FormErrorsExample/>);
  fireEvent.tap(screen.getByText('message+toast').closest('.ui-choice')!,{eventType:'catchEvent'});
  const submit=()=>fireEvent.tap(screen.getByText('提交').closest('.ui-button')!);
  submit();
  await waitFor(()=>expect(screen.container.querySelectorAll('.ui-form-item-error')).toHaveLength(2));
  expect(screen.container.querySelectorAll('.ui-toast')).toHaveLength(1);
  expect(screen.container.querySelector('.ui-toast-msg')?.textContent).toBe('请输入歪比巴卜');
  submit();submit();
  await waitFor(()=>expect(screen.container.querySelectorAll('.ui-toast')).toHaveLength(1));
  for(const [index,editor] of Array.from(screen.container.querySelectorAll('.ui-textfield-native')).entries()){
    const target=lynx.createSelectorQuery().select(`.ui-textfield-native[placeholder="${editor.getAttribute('placeholder')}"]`);
    fireEvent(target as unknown as Element,Object.assign(new Event('bindEvent:input'),{eventType:'bindEvent',eventName:'input',detail:{value:`filled-${index}`}}));
  }
  submit();
  await waitFor(()=>expect(screen.container.querySelector('.ui-toast-msg')?.textContent).toBe('校验通过'));
  expect(screen.container.querySelectorAll('.ui-toast')).toHaveLength(1);
  expect(screen.container.querySelectorAll('.ui-form-item-error')).toHaveLength(0);
});

for (const disabledExample of [false, true]) {
  test(`${disabledExample ? 'disabled' : 'complex'} form constructs address options on user interaction and keeps selection working`, async () => {
    const getOptions = rstest.spyOn(areaOptions, 'getDemoAreaOptions').mockReturnValue([
      { value: '110000', text: '测试省', children: [{ value: '110100', text: '测试市', children: [{ value: '110101', text: '测试区' }] }] },
    ]);
    const screen = render(disabledExample ? <FormDisabledExample /> : <ComplexFormExample />);
    expect(getOptions).not.toHaveBeenCalled();
    const address = () => screen.getByText('地址').closest('.ui-cell')!;
    if (disabledExample) {
      fireEvent.tap(address());
      expect(getOptions).not.toHaveBeenCalled();
      fireEvent.tap(screen.container.querySelector('.ui-switch')!);
      await waitFor(() => expect(screen.getByText('已关闭')).toBeTruthy());
    }
    fireEvent.tap(address());
    expect(getOptions).toHaveBeenCalledTimes(1);
    fireEvent.tap(await screen.findByText('测试省'));
    fireEvent.tap(await screen.findByText('测试市'));
    fireEvent.tap(await screen.findByText('测试区'));
    await waitFor(() => expect(screen.getByText('测试省/测试市/测试区')).toBeTruthy());
  });
}
