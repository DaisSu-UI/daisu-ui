import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { Dialog } from './Dialog.js';
import type { DialogResult } from './Dialog.js';
import { useDialog } from './useDialog.js';

test('Dialog prompt rejects invalid input and confirms valid values without global-regexp state leaking', async () => {
  const results: DialogResult[] = [];
  const pattern = /^\d+$/g;
  try {
    const screen = render(<Dialog show type="prompt" inputValue="bad" inputPattern={pattern} inputError="请输入数字" onResult={r => results.push(r)} />);
    await waitFor(() => expect(screen.container.querySelectorAll('.ui-dialog-action')).toHaveLength(2));
    fireEvent.tap(screen.container.querySelectorAll('.ui-dialog-action .ui-button')[1]!);
    expect(screen.getByText('请输入数字')).toBeTruthy(); expect(results).toEqual([]);
    screen.rerender(<Dialog show type="prompt" inputValue="123" inputPattern={pattern} onResult={r => results.push(r)} />);
    await waitFor(() => expect(screen.queryByText('请输入数字')).toBeNull());
    fireEvent.tap(screen.container.querySelectorAll('.ui-dialog-action .ui-button')[1]!);
    await waitFor(() => expect(results[0]?.value).toBe('123'));
    expect(pattern.lastIndex).toBe(0);
  } finally { cleanup(); }
});

test('Dialog async confirmation ignores duplicate taps and invalidates completion after closing', async () => {
  let accept: (value: boolean) => void = () => {}; let calls = 0; const results: DialogResult[] = [];
  const beforeConfirm = () => { calls++; return new Promise<boolean>(resolve => { accept = resolve; }); };
  const props = { beforeConfirm, onResult: (r: DialogResult) => results.push(r) };
  try {
    const screen = render(<Dialog {...props} show type="confirm" />);
    await waitFor(() => expect(screen.container.querySelectorAll('.ui-button')).toHaveLength(2));
    const button = screen.container.querySelectorAll('.ui-button')[1]!;
    fireEvent.tap(button); fireEvent.tap(button); expect(calls).toBe(1);
    screen.rerender(<Dialog {...props} show={false} type="confirm" />);
    accept(true); await Promise.resolve(); await Promise.resolve(); expect(results).toEqual([]);
    screen.rerender(<Dialog {...props} requestKey={2} show type="confirm" />);
    fireEvent.tap(screen.container.querySelectorAll('.ui-button')[1]!); expect(calls).toBe(2);
    accept(true); await waitFor(() => expect(results).toHaveLength(1));
  } finally { cleanup(); }
});

test('useDialog binds an explicit instance, resolves confirm and rejects cancellation', async () => {
  let result: Promise<DialogResult> | undefined;
  function Demo() { const dialog = useDialog(); return <><view className="open" bindtap={() => { result = dialog.confirm({ title: '确认' }); }} /><Dialog {...dialog.props} /></>; }
  try {
    const screen = render(<Demo />);
    fireEvent.tap(screen.container.querySelector('.open')!);
    await waitFor(() => expect(screen.getByText('确认')).toBeTruthy());
    fireEvent.tap(screen.container.querySelectorAll('.ui-button')[1]!);
    expect((await result)?.action).toBe('confirm');
    fireEvent.tap(screen.container.querySelector('.open')!);
    await waitFor(() => expect(screen.container.querySelector('.ui-transition-zoom-in-enter-from')).toBeTruthy());
    fireEvent.tap(screen.container.querySelector('.ui-button')!);
    try { await result; throw new Error('expected cancellation'); } catch (error) { expect((error as DialogResult).action).toBe('cancel'); }
  } finally { cleanup(); }
});
