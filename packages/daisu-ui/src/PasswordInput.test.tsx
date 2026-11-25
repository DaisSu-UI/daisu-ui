import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { PasswordInput } from './PasswordInput.js';
import { PasswordInputExample } from '../../../apps/demo/src/features/ui-demo/examples/password-input.js';
import { passwordGutter, passwordLength } from './passwordInputModel.js';
import { FormFieldContext } from './formContext.js';

test('PasswordInput handles invalid lengths and spacing without unbounded arrays or invalid styles', () => {
  expect(passwordLength(NaN)).toBe(6); expect(passwordLength(Infinity)).toBe(6);
  expect(passwordLength(-1)).toBe(0); expect(passwordLength(4.9)).toBe(4); expect(passwordLength(1e9)).toBe(1000);
  expect(passwordGutter(10)).toEqual({ value: '10px', spaced: true });
  expect(passwordGutter('15rpx')).toEqual({ value: '2vw', spaced: true });
  expect(passwordGutter('2em')).toEqual({ value: '2em', spaced: true });
  for (const value of [NaN, Infinity, -10, '-2px', '0rem', 'bad']) expect(passwordGutter(value)).toEqual({ value: '0px', spaced: false });
});

test('PasswordInput masks accessible content, positions the caret, truncates display and prioritizes errors', () => {
  try {
    const screen = render(<PasswordInput value="123" info="六位密码" />);
    expect(screen.container.querySelectorAll('.ui-password-input-dot').length).toBe(3);
    const cells = screen.container.querySelectorAll('.ui-password-input-item');
    expect(cells[3]!.querySelector('.ui-password-input-cursor')).toBeTruthy();
    expect(screen.container.textContent).not.toContain('123');
    expect(screen.container.querySelector('.ui-password-input-security')?.getAttribute('accessibility-label')).not.toContain('123');
    screen.rerender(<PasswordInput value="1234567" length={4} mask={false} info="提示" errorInfo="错误" />);
    expect(screen.container.querySelectorAll('.ui-password-input-item').length).toBe(4);
    expect(screen.container.querySelector('.ui-password-input-cursor')).toBeNull();
    expect(screen.container.querySelector('.ui-password-input-security')?.textContent).toBe('1234');
    expect(screen.container.querySelector('.ui-password-input-info')?.textContent).toBe('错误');
    screen.rerender(<PasswordInput value="京😀" focused={false} gutter="10px" />);
    expect(screen.container.querySelectorAll('.ui-password-input-dot').length).toBe(2);
    expect(screen.container.querySelector('.ui-password-input-cursor')).toBeNull();
    expect(screen.container.querySelector('.ui-password-input-bordered')).toBeNull();
    expect(screen.container.querySelectorAll('.ui-password-input-item')[1]?.getAttribute('style')).toMatch(/margin-left:\s*10px/);
  } finally { cleanup(); }
});

test('PasswordInput only requests focus, opens no native editor and inherits FormItem disabled', () => {
  let requests = 0;
  try {
    const screen = render(<PasswordInput onFocus={() => requests++} />);
    fireEvent.tap(screen.container.querySelector('.ui-password-input-security')!); expect(requests).toBe(1);
    expect(screen.container.querySelector('input,textarea,.ui-keyboard')).toBeNull();
    screen.rerender(<FormFieldContext.Provider value={{ disabled: true, compact: false, error: false, onBlur: () => {} }}><PasswordInput onFocus={() => requests++} /></FormFieldContext.Provider>);
    fireEvent.tap(screen.container.querySelector('.ui-password-input-security')!); expect(requests).toBe(1);
    expect(screen.container.querySelector('.ui-password-input-cursor')).toBeNull();
  } finally { cleanup(); }
});

test('PasswordInput examples keep values independent, share Keyboard, enforce length and recover from error after delete', () => {
  try {
    const screen = render(<PasswordInputExample />);
    const focus = (index: number) => fireEvent.tap(screen.container.querySelectorAll('.ui-password-input-security')[index]!);
    const key = (label: string) => fireEvent.tap(screen.container.querySelector(`.ui-keyboard-key[accessibility-label="${label}"]`)!, { eventType: 'catchEvent' });
    expect(screen.container.querySelectorAll('.ui-password-input').length).toBe(6);
    focus(0); key('4'); key('5'); key('6'); key('7');
    expect(screen.container.querySelectorAll('.ui-password-input')[0]!.querySelectorAll('.ui-password-input-dot').length).toBe(6);
    expect(screen.container.querySelectorAll('.ui-password-input')[1]!.querySelectorAll('.ui-password-input-dot').length).toBe(2);
    focus(1); key('3'); key('4'); key('5');
    expect(screen.container.querySelectorAll('.ui-password-input')[1]!.querySelectorAll('.ui-password-input-dot').length).toBe(4);
    focus(4); key('1'); key('1'); key('1'); expect(screen.container.querySelector('.ui-password-input-error')?.textContent).toBe('密码错误');
    key('删除'); expect(screen.container.querySelector('.ui-password-input-error')).toBeNull();
    expect(screen.container.querySelector('.ui-password-input-info')?.textContent).toBe('密码为 6 位数字');
  } finally { cleanup(); }
});
