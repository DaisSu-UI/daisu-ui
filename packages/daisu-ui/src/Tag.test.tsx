import { expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Tag } from './Tag.js';
import type { NodesRef } from '@lynx-js/types';

// Runtime accepts NodesRef; the bundled fireEvent declarations only list DOM elements.
function confirm(value: string) {
  fireEvent(lynx.createSelectorQuery().select('.ui-tag-input') as unknown as Element, Object.assign(new Event('bindEvent:confirm'), { eventName: 'confirm', eventType: 'bindEvent', detail: { value } }));
}

test('Tag supports aliases, explicit variants, content and icon slots', () => {
  try {
    const screen = render(<Tag label="旧标签" tone="info" plain />);
    expect(screen.container.querySelector('.ui-tag-primary.ui-tag-plain')).toBeTruthy();
    screen.rerender(<Tag label="旧标签" tone="danger" type="purple" plain variant="light" size="small" mark round icon="clock-circle" iconSlot={<text>自定义图标</text>}>新标签</Tag>);
    expect(screen.getByText('新标签')).toBeTruthy();
    expect(screen.queryByText('旧标签')).toBeNull();
    expect(screen.getByText('自定义图标')).toBeTruthy();
    expect(screen.container.querySelector('.ui-tag-purple.ui-tag-light.ui-tag-size-small.ui-tag-round.ui-tag-mark')).toBeTruthy();
    expect(screen.container.querySelector('.ui-tag-border')).toBeNull();
    expect(screen.container.querySelector('.ui-tag-glyph')).toBeNull();
  } finally { cleanup(); }
});

test('Tag close is available on square tags and does not emit a tag tap or remove itself', () => {
  let taps = 0, closes = 0;
  try {
    const screen = render(<Tag label="标签" closable onTap={() => taps++} onClose={() => closes++} />);
    fireEvent.tap(screen.container.querySelector('.ui-tag-close')!, { eventType: 'catchEvent' });
    expect(closes).toBe(1);
    expect(taps).toBe(0);
    expect(screen.getByText('标签')).toBeTruthy();
    fireEvent.tap(screen.container.querySelector('.ui-tag')!);
    expect(taps).toBe(1);
  } finally { cleanup(); }
});

test('Tag dynamic confirms once, clears the next edit and cancels on blur without confirming', () => {
  const values: string[] = [];
  let taps = 0;
  // Native input focus cannot execute in the test renderer; H5 verifies real focus.
  const createQuery = lynx.createSelectorQuery.bind(lynx);
  const nativeExec = rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => {
    const query = createQuery();
    const select = query.select.bind(query);
    query.select = selector => {
      const ref = select(selector);
      const invoke = ref.invoke.bind(ref);
      ref.invoke = options => options.method === 'focus' ? { exec() {} } as unknown as ReturnType<NodesRef['invoke']> : invoke(options);
      return ref;
    };
    return query;
  });
  try {
    const screen = render(<Tag dynamic type="primary" onTap={() => taps++} onConfirm={({ value }) => values.push(value)} />);
    fireEvent.tap(screen.container.querySelector('.ui-tag')!);
    const input = screen.container.querySelector('input')!;
    expect(input).toBeTruthy();
    confirm('新增');
    expect(values).toEqual(['新增']);
    expect(screen.container.querySelector('input')).toBeNull();
    expect(taps).toBe(0);
    fireEvent.tap(screen.container.querySelector('.ui-tag')!);
    const second = screen.container.querySelector('input')!;
    expect(second).not.toBe(input);
    fireEvent.blur(lynx.createSelectorQuery().select('.ui-tag-input') as unknown as Element);
    expect(values).toEqual(['新增']);
    expect(screen.container.querySelector('input')).toBeNull();
    fireEvent.tap(screen.container.querySelector('.ui-tag')!);
    confirm('');
    expect(values).toEqual(['新增', '']);
    screen.rerender(<Tag dynamic add={<text>自定义</text>} />);
    expect(screen.getByText('自定义')).toBeTruthy();
  } finally { cleanup(); nativeExec.mockRestore(); }
});
