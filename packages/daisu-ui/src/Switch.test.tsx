import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { Switch } from './Switch.js';
import type { SwitchValue } from './Switch.js';

test('Switch compares custom values strictly, emits the target, and blocks disabled/loading interaction', async () => {
  const values: SwitchValue[] = [];
  try {
    const screen = render(<Switch value={1} activeValue={1} inactiveValue={0} onChange={({ value }) => values.push(value)} />);
    fireEvent.tap(screen.container.querySelector('.ui-switch')!);
    await waitFor(() => expect(values).toEqual([0]));
    screen.rerender(<Switch value="1" activeValue={1} inactiveValue={0} disabled onChange={({ value }) => values.push(value)} />);
    expect(screen.container.querySelector('.ui-switch-active')).toBeNull();
    fireEvent.tap(screen.container.querySelector('.ui-switch')!); expect(values).toEqual([0]);
    screen.rerender(<Switch loading onChange={({ value }) => values.push(value)} />);
    fireEvent.tap(screen.container.querySelector('.ui-switch')!); expect(values).toEqual([0]);
  } finally { cleanup(); }
});

test('Switch guard survives callback identity changes while a dialog is open, deduplicates and ignores stale results', async () => {
  let accept: (value: boolean) => void = () => {}; const values: SwitchValue[] = []; let calls = 0;
  const guard = () => { calls++; return new Promise<boolean>(resolve => { accept = resolve; }); };
  const change = ({ value }: { value: SwitchValue }) => values.push(value);
  try {
    const screen = render(<Switch beforeChange={guard} onChange={change} />);
    fireEvent.tap(screen.container.querySelector('.ui-switch')!); fireEvent.tap(screen.container.querySelector('.ui-switch')!); expect(calls).toBe(1);
    screen.rerender(<Switch beforeChange={() => guard()} onChange={change} />);
    accept(true); await waitFor(() => expect(values).toEqual([true]));
    fireEvent.tap(screen.container.querySelector('.ui-switch')!);
    screen.rerender(<Switch disabled beforeChange={guard} onChange={change} />);
    accept(true); await Promise.resolve(); await Promise.resolve(); expect(values).toEqual([true]);
  } finally { cleanup(); }
});
