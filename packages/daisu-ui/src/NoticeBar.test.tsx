import { afterEach, expect, rstest, test } from '@rstest/core';
import { createRef } from '@lynx-js/react';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { NoticeBar } from './NoticeBar.js';
import type { NoticeBarRef } from './NoticeBar.js';
afterEach(()=>{cleanup();rstest.useRealTimers();});
function layout(node: Element, width: number, height=20){fireEvent(node,Object.assign(new Event('bindEvent:layoutchange'),{eventType:'bindEvent',eventName:'layoutchange',detail:{width,height}}));}
function measure(container:Element,width=200){layout(container.querySelector('.ui-notice-bar-viewport')!,300);layout(container.querySelector('.ui-notice-bar-content')!,width);}
test('NoticeBar measures horizontal duration, repeats from outside and emits the displayed text index',async()=>{
  rstest.useFakeTimers();const next=rstest.fn(),click=rstest.fn(),screen=render(<NoticeBar text={['first','second']} speed={100} delay={.1} onNext={next} onClick={click}/>);
  const content=()=>screen.container.querySelector('.ui-notice-bar-content')!;measure(screen.container);await rstest.advanceTimersByTimeAsync(32);
  expect(content().getAttribute('style')).toContain('2000ms');expect(content().getAttribute('style')).toContain('-200px');
  await rstest.advanceTimersByTimeAsync(2100);expect(next).toHaveBeenCalledWith(1);expect(screen.getByText('second')).toBeTruthy();fireEvent.tap(content());expect(click).toHaveBeenCalledWith({index:1,text:'second'});
  // The replacement node must report its own width even if two strings have equal widths.
  layout(content(),200);await rstest.advanceTimersByTimeAsync(32);expect(content().getAttribute('style')).toContain('5010ms');
  await rstest.advanceTimersByTimeAsync(5110);expect(next).toHaveBeenLastCalledWith(0);
});
test('NoticeBar vertical cycle returns seamlessly to first, reset restarts index and one item stays still',async()=>{
  rstest.useFakeTimers();const next=rstest.fn(),click=rstest.fn(),ref=createRef<NoticeBarRef>(),screen=render(<NoticeBar ref={ref} direction="vertical" text={['A','B']} delay={.1} speed={100} onNext={next} onClick={click}/>);
  const viewport=()=>screen.container.querySelector('.ui-notice-bar-viewport')!,content=()=>screen.container.querySelector('.ui-notice-bar-content')!;layout(viewport(),300);await rstest.advanceTimersByTimeAsync(332);
  fireEvent.tap(content());expect(click).toHaveBeenLastCalledWith({index:1,text:'B'});await rstest.advanceTimersByTimeAsync(332);expect(next.mock.calls.map(call=>call[0])).toEqual([1,0]);
  ref.current!.reset();await rstest.advanceTimersByTimeAsync(0);layout(viewport(),300);fireEvent.tap(content());expect(click).toHaveBeenLastCalledWith({index:0,text:'A'});
  screen.rerender(<NoticeBar direction="vertical" text="Only" onNext={next}/>);layout(viewport(),300);await rstest.advanceTimersByTimeAsync(10000);expect(next).toHaveBeenCalledTimes(2);
});
test('NoticeBar close cancels timers and stops click propagation, reset does not reopen a dismissed bar',async()=>{
  rstest.useFakeTimers();const close=rstest.fn(),next=rstest.fn(),click=rstest.fn(),ref=createRef<NoticeBarRef>(),screen=render(<NoticeBar ref={ref} text="Message" closable delay={0} speed={100} onClose={close} onNext={next} onClick={click}/>);measure(screen.container);await rstest.advanceTimersByTimeAsync(32);fireEvent.tap(screen.container.querySelector('.ui-notice-bar-close')!,{eventType:'catchEvent'});expect(close).toHaveBeenCalledTimes(1);expect(click).not.toHaveBeenCalled();expect(screen.container.querySelector('.ui-notice-bar')).toBeNull();ref.current!.reset();await rstest.advanceTimersByTimeAsync(5000);expect(next).not.toHaveBeenCalled();expect(screen.container.querySelector('.ui-notice-bar')).toBeNull();
});
test('NoticeBar source/option changes cancel stale cycles; static slots and multiline never schedule animation',async()=>{
  rstest.useFakeTimers();const next=rstest.fn(),screen=render(<NoticeBar text="Old" delay={0} speed={100} onNext={next}/>);measure(screen.container);await rstest.advanceTimersByTimeAsync(100);screen.rerender(<NoticeBar text="New" scrollable={false} wrapable onNext={next} prefix={<text>前</text>} suffix={<text>后</text>}>多行内容</NoticeBar>);measure(screen.container);await rstest.advanceTimersByTimeAsync(10000);expect(next).not.toHaveBeenCalled();expect(screen.container.querySelector('.ui-notice-bar-wrap')).toBeTruthy();expect(screen.getByText('多行内容')).toBeTruthy();expect(screen.getByText('前')).toBeTruthy();expect(screen.getByText('后')).toBeTruthy();screen.unmount();await rstest.advanceTimersByTimeAsync(1000);expect(next).not.toHaveBeenCalled();
});
