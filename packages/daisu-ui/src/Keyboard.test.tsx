import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Keyboard } from './Keyboard.js';
import { keyboardAppend, keyboardDigits, keyboardKeys, shuffleKeyboardDigits } from './keyboardModel.js';

function press(container: HTMLElement, label: string) {
  const key = [...container.querySelectorAll('.ui-keyboard-key')].find(element => element.getAttribute('accessibility-label') === label);
  if (!key) throw new Error(`Missing key: ${label}`);
  fireEvent.tap(key, { eventType: 'catchEvent' });
}

test('Keyboard limits multi-character extra keys, keeps all shuffled digits and uses complete car layouts', () => {
  expect(keyboardAppend('12345', '00', 6)).toBe('123450');
  expect(keyboardAppend('123456', '1', 6)).toBe('123456');
  expect(keyboardAppend('', '京', NaN)).toBe('');
  expect([...shuffleKeyboardDigits(() => 0)].sort()).toEqual(keyboardDigits);
  expect(keyboardDigits[0]).toBe('1');
  expect(keyboardKeys('default', keyboardDigits, undefined, false, '', 'zh').at(-1)?.type).toBe('blank');
  const car = keyboardKeys('car', keyboardDigits, undefined, true, '', 'zh');
  expect(car.some(key => key.text === '京')).toBe(true);
  expect(car[30]).toEqual({ text: 'ABC', type: 'extra', wider: true });
  expect(keyboardKeys('car', keyboardDigits, undefined, true, '', 'en').some(key => key.text === 'I' || key.text === 'O')).toBe(false);
});

test('Keyboard edits an uncontrolled value, enforces maxlength, deletes and closes without duplicate events', () => {
  const values: string[] = [], inputs: string[] = [], visibility: boolean[] = []; let deletes = 0, closes = 0;
  try {
    const screen = render(<Keyboard visible mode="custom" extraKey={['00', '.']} closeText="完成" defaultValue="12" maxlength={4} onChange={value => values.push(value)} onInput={key => inputs.push(key)} onDelete={() => deletes++} onVisibleChange={value => visibility.push(value)} onClose={() => closes++} />);
    press(screen.container, '00'); press(screen.container, '1'); press(screen.container, '删除'); press(screen.container, '.');
    expect(values).toEqual(['1200', '120', '120.']); expect(inputs).toEqual(['00', '.']); expect(deletes).toBe(1);
    press(screen.container, '完成'); expect(visibility).toEqual([false]); expect(closes).toBe(1);
  } finally { cleanup(); }
});

test('Keyboard respects controlled values/language and automatically switches only uncontrolled car language', () => {
  const values: string[] = [], langs: string[] = [];
  const props = { visible: true, mode: 'car' as const, autoSwitchLang: true, onChange: (value: string) => values.push(value), onCarLangChange: (lang: 'zh' | 'en') => langs.push(lang) };
  try {
    const screen = render(<Keyboard {...props} />);
    press(screen.container, '京'); expect(values).toEqual(['京']); expect(langs).toEqual(['en']);
    press(screen.container, 'A'); press(screen.container, '删除'); press(screen.container, '删除');
    expect(values).toEqual(['京', '京A', '京', '']); expect(langs.at(-1)).toBe('zh');
    screen.rerender(<Keyboard {...props} value="粤" carLang="zh" />);
    press(screen.container, '沪'); press(screen.container, '津');
    expect(values.slice(-2)).toEqual(['粤沪', '粤津']);
    expect(screen.container.querySelector('[accessibility-label="京"]')).toBeTruthy();
    press(screen.container, 'ABC'); expect(langs.at(-1)).toBe('en');
    expect(screen.container.querySelector('[accessibility-label="京"]')).toBeTruthy();
  } finally { cleanup(); }
});

test('Keyboard supports transparent/no overlay, blocks hidden/disabled/loading actions and cancels moved touches', () => {
  const values: string[] = []; let closes = 0;
  try {
    const props = { visible: true, onChange: (value: string) => values.push(value), onClose: () => closes++ };
    const screen = render(<Keyboard {...props} />);
    expect(screen.container.querySelector('.ui-overlay')?.getAttribute('style')).toContain('transparent');
    const one = screen.container.querySelector('[accessibility-label="1"]')!;
    fireEvent.touchstart(one, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchmove(one, { touches: [{ clientX: 20, clientY: 0 }] });
    fireEvent.tap(one, { eventType: 'catchEvent' }); expect(values).toEqual([]);
    screen.rerender(<Keyboard {...props} hideOnClickOutside={false} disabled />);
    expect(screen.container.querySelector('.ui-overlay')).toBeNull(); press(screen.container, '1'); expect(values).toEqual([]);
    screen.rerender(<Keyboard {...props} mode="custom" closeText="完成" closeButtonLoading />);
    press(screen.container, '完成'); expect(closes).toBe(0);
    screen.rerender(<Keyboard {...props} visible={false} />);
    press(screen.container, '1'); expect(values).toEqual([]);
    screen.rerender(<Keyboard {...props} />);
    fireEvent.tap(screen.container.querySelector('.ui-overlay')!); expect(closes).toBe(1);
  } finally { cleanup(); }
});
