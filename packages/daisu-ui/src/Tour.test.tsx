import { expect, rstest, test } from '@rstest/core';
import { createRef } from '@lynx-js/react';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import type { NodesRef } from '@lynx-js/types';
import { Tour } from './Tour.js';
import type { TourRef } from './Tour.js';
function geometry() {
  const createQuery = lynx.createSelectorQuery.bind(lynx);
  return rstest.spyOn(lynx, 'createSelectorQuery').mockImplementation(() => {
    const query = createQuery(), select = query.select.bind(query);
    query.select = selector => { const ref = select(selector), invoke = ref.invoke.bind(ref); ref.invoke = options => options.method === 'boundingClientRect' ? { exec() { options.success?.({ left: 0, top: 0, width: 390, height: 844 }); } } as unknown as ReturnType<NodesRef['invoke']> : invoke(options); return ref; }; return query;
  });
}
const steps = [{ element: '#one', content: '第一条说明' }, { element: '#two', content: '第二条说明' }];
const target = () => ({ left: 49, top: 64, width: 292, height: 98 });
test('Tour measures after host scrolling, expands a transparent highlight and finishes only once', async () => {
  const mock = geometry(), ref = createRef<TourRef>(), events: unknown[] = [];
  try {
    const screen = render(<Tour ref={ref} show steps={steps} duration={0} padding={10} getTargetRect={target} scrollToTarget={async () => { events.push('scroll'); }} onCurrentChange={n => events.push(n)} onShowChange={show => events.push(show)} onFinish={e => events.push(e)} />);
    await waitFor(() => expect(screen.queryByText('第一条说明')).toBeTruthy());
    const hole = screen.container.querySelector('.ui-tour-highlight')!;
    expect(hole.getAttribute('style')).toContain('left: 39px'); expect(hole.getAttribute('style')).toContain('width: 312px');
    ref.current!.handleNext();
    await waitFor(() => expect(screen.queryByText('第二条说明')).toBeTruthy());
    await waitFor(() => expect(events.filter(x => x === 'scroll').length).toBe(2));
    ref.current!.handleFinish(); ref.current!.handleFinish();
    expect(events.filter(x => x === false)).toHaveLength(1); expect(events.at(-1)).toEqual({ current: 1, total: 2 });
  } finally { cleanup(); mock.mockRestore(); }
});
test('Tour missing skip strategy advances to the next available target and controlled steps wait for owner', async () => {
  const mock = geometry(), ref = createRef<TourRef>(), changes: number[] = [], errors: string[] = [];
  try {
    const screen = render(<Tour show steps={steps} missingStrategy="skip" getTargetRect={step => step.element === '#one' ? null : target()} onError={e => errors.push(e.element)} onChange={e => changes.push(e.current)} />);
    await waitFor(() => expect(screen.queryByText('第二条说明')).toBeTruthy()); expect(errors).toEqual(['#one']); expect(changes).toEqual([1]);
    screen.rerender(<Tour ref={ref} show current={0} steps={steps} getTargetRect={target} onCurrentChange={n => changes.push(n)} />);
    await waitFor(() => expect(screen.queryByText('第一条说明')).toBeTruthy());
    ref.current!.handleNext(); expect(changes).toEqual([1, 1]); expect(screen.queryByText('第二条说明')).toBeNull();
  } finally { cleanup(); mock.mockRestore(); }
});
test('Tour stale target requests cannot reopen a closed layer', async () => {
  const mock = geometry(); let resolve: (r: ReturnType<typeof target>) => void = () => {};
  try {
    const pending = new Promise<ReturnType<typeof target>>(done => { resolve = done; }); const measure = rstest.fn(() => pending);
    const screen = render(<Tour show steps={steps} getTargetRect={measure} />);
    await waitFor(() => expect(measure).toHaveBeenCalled()); screen.rerender(<Tour show={false} steps={steps} getTargetRect={measure} />);
    resolve(target()); await new Promise(done => setTimeout(done, 50)); expect(screen.queryByText('第一条说明')).toBeNull();
  } finally { cleanup(); mock.mockRestore(); }
});
