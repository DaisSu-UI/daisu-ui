import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Notify } from './Notify.js';
import { useNotify } from './useNotify.js';
import { ConfigProvider } from './ConfigProvider.js';
afterEach(() => { cleanup(); rstest.useRealTimers(); });
test('Notify uses local defaults, typed prefix, custom content and controlled close without a click callback', async () => {
  rstest.useFakeTimers(); const change = rstest.fn(), click = rstest.fn(), opened = rstest.fn(), closed = rstest.fn();
  const screen = render(<ConfigProvider theme="dark" themeVars={{ primary:'#123456' }}><Notify visible type="primary" duration={0} closable variant="floating" safeHeight={44} onChange={change} onClick={click} onOpened={opened} onClosed={closed} /></ConfigProvider>);
  await rstest.advanceTimersByTimeAsync(400); expect(opened).toHaveBeenCalledTimes(1); expect(screen.container.querySelector('.ui-notify-floating')).toBeTruthy(); expect(screen.container.querySelector('.ui-notify-anchor')?.hasAttribute('event-through')).toBe(false); expect(screen.container.querySelector('.ui-notify-close')?.getAttribute('flatten')).toBe('false'); fireEvent.layoutchange(screen.container.querySelector('.ui-notify-measure')!, { detail: { width: 390, height: 38 } }); expect(screen.container.querySelector('.ui-notify-anchor')?.getAttribute('style')).toContain('height: 38px'); expect(screen.container.querySelector('.ui-notify-anchor')?.getAttribute('style')).toContain('top: 44px');
  expect(screen.container.querySelector('.ui-notify-prefix .ui-icon-svg')?.getAttribute('content')).toContain('#123456');
  fireEvent.tap(screen.container.querySelector('.ui-notify-body')!); expect(click).toHaveBeenCalledTimes(1);
  fireEvent.tap(screen.container.querySelector('.ui-notify-close')!,{eventType:'catchEvent'}); fireEvent.tap(screen.container.querySelector('.ui-notify-close')!,{eventType:'catchEvent'}); expect(change).toHaveBeenCalledExactlyOnceWith(false); expect(click).toHaveBeenCalledTimes(1);
  screen.rerender(<ConfigProvider theme="dark" themeVars={{ primary:'#123456' }}><Notify visible={false} onClosed={closed} duration={0} /></ConfigProvider>); await rstest.advanceTimersByTimeAsync(400); expect(closed).toHaveBeenCalledTimes(1);
  screen.rerender(<Notify visible duration={0} prefix={null} position="bottom" safeAreaBottom={24}><text>自定义通知</text></Notify>); expect(screen.container.querySelector('.ui-notify-prefix')).toBeNull(); expect(screen.container.querySelector('.ui-notify-content')?.textContent).toBe('自定义通知'); expect(screen.container.querySelector('.ui-notify-anchor')?.getAttribute('style')).toContain('bottom: 24px');
});
test('useNotify refreshes deadlines, keeps zero-duration messages open and isolates different instances', async () => {
  rstest.useFakeTimers();
  function Demo() { const first=useNotify(),second=useNotify();return <><view className="start" bindtap={()=>{first.showNotify({message:'first',duration:100});second.showNotify({message:'second',duration:0});}}/><view className="renew" bindtap={()=>first.showNotify({message:'renewed',duration:500})}/><view className="close" bindtap={second.closeNotify}/><Notify {...first.props}/><Notify {...second.props}/></>; }
  const screen=render(<Demo/>);fireEvent.tap(screen.container.querySelector('.start')!);await rstest.advanceTimersByTimeAsync(60);fireEvent.tap(screen.container.querySelector('.renew')!);await rstest.advanceTimersByTimeAsync(200);
  expect(screen.container.querySelectorAll('.ui-notify-message')[0]?.textContent).toBe('renewed');expect(screen.container.querySelectorAll('.ui-notify')[0]?.getAttribute('style')).toContain('display: flex');
  await rstest.advanceTimersByTimeAsync(700);expect(screen.container.querySelectorAll('.ui-notify')).toHaveLength(1);expect(screen.container.querySelector('.ui-notify-message')?.textContent).toBe('second');expect(screen.container.querySelector('.ui-notify')?.getAttribute('style')).toContain('display: flex');
  fireEvent.tap(screen.container.querySelector('.close')!);await rstest.advanceTimersByTimeAsync(400);expect(screen.container.querySelector('.ui-notify-anchor')).toBeNull();
});
test('useNotify default changes are local, per-call options win and reset restores initial defaults', async () => {
  rstest.useFakeTimers();
  function Demo(){const n=useNotify({type:'success',duration:0});return <><view className="custom" bindtap={()=>{n.setNotifyDefaultOptions({type:'warning'});n.showNotify({message:42,type:'primary'});}}/><view className="defaults" bindtap={()=>n.showNotify('defaults')}/><view className="reset" bindtap={()=>{n.resetNotifyDefaultOptions();n.showNotify('reset');}}/><Notify {...n.props}/></>;}
  const screen=render(<Demo/>);fireEvent.tap(screen.container.querySelector('.custom')!);await rstest.advanceTimersByTimeAsync(40);expect(screen.container.querySelector('.ui-notify-primary')).toBeTruthy();expect(screen.container.querySelector('.ui-notify-message')?.textContent).toBe('42');
  fireEvent.tap(screen.container.querySelector('.defaults')!);expect(screen.container.querySelector('.ui-notify-warning')).toBeTruthy();fireEvent.tap(screen.container.querySelector('.reset')!);expect(screen.container.querySelector('.ui-notify-success')).toBeTruthy();screen.unmount();await rstest.advanceTimersByTimeAsync(5000);
});
test('Notify rapid close/reopen cancels stale lifecycle completion and emits the replacement lifecycle once', async () => {
  rstest.useFakeTimers();const opened=rstest.fn(),closed=rstest.fn(),change=rstest.fn();const props={duration:1000,onOpened:opened,onClosed:closed,onChange:change};
  const screen=render(<Notify {...props} visible message="first"/>);await rstest.advanceTimersByTimeAsync(100);screen.rerender(<Notify {...props} visible={false}/>);await rstest.advanceTimersByTimeAsync(100);screen.rerender(<Notify {...props} visible message="second" requestKey={2}/>);await rstest.advanceTimersByTimeAsync(400);expect(opened).toHaveBeenCalledTimes(1);expect(closed).not.toHaveBeenCalled();screen.unmount();await rstest.advanceTimersByTimeAsync(2000);expect(change).not.toHaveBeenCalled();
});

test('Notify removes the native anchor after leave so a finished instance cannot cover other notifications', async () => {
  rstest.useFakeTimers();
  const first = render(<Notify visible duration={0} message="first" />);
  const second = render(<Notify visible duration={0} message="custom" />);
  await rstest.advanceTimersByTimeAsync(400);
  second.rerender(<Notify visible={false} duration={0} message="custom" />);
  await rstest.advanceTimersByTimeAsync(400);
  expect(second.container.querySelector('.ui-notify-anchor')).toBeNull();
  expect(first.container.querySelector('.ui-notify-message')?.textContent).toBe('first');
  second.rerender(<Notify visible duration={0} message="again" />);
  await rstest.advanceTimersByTimeAsync(400);
  expect(second.container.querySelector('.ui-notify-message')?.textContent).toBe('again');
});
