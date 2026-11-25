import { afterEach, expect, test } from '@rstest/core';
import { cleanup, render } from '@lynx-js/react/testing-library';
import { Step, Steps } from './Steps.js';
afterEach(cleanup);
test('Steps derives progress including completion and restores from controlled updates',()=>{
 const screen=render(<Steps active={1}><Step/><Step/><Step/></Steps>);
 const states=()=>Array.from(screen.container.querySelectorAll('.ui-step')).map(node=>node.getAttribute('class'));
 expect(states()[0]).toContain('ui-step-finished');expect(states()[1]).toContain('ui-step-process');expect(states()[2]).toContain('ui-step-wait');
 screen.rerender(<Steps active={3}><Step/><Step/><Step/></Steps>);expect(screen.container.querySelectorAll('.ui-step-finished')).toHaveLength(3);
 screen.rerender(<Steps active={-1}><Step/><Step/><Step/></Steps>);expect(screen.container.querySelectorAll('.ui-step-wait')).toHaveLength(3);
});
test('Steps handles conditional children, explicit status, slots, dots and terminal lines',()=>{
 const screen=render(<Steps active={0} dot vertical alignCenter space={80}>{false}{[<Step key="a" title={<text>自定义标题</text>} description={0} status="error"/>,null,<Step key="b" icon={<text>自定义图标</text>}/>]}</Steps>);
 expect(screen.container.querySelectorAll('.ui-step')).toHaveLength(2);expect(screen.container.querySelectorAll('.ui-step-line')).toHaveLength(1);expect(screen.container.querySelector('.ui-step-error')).toBeTruthy();expect(screen.container.querySelector('.ui-step-center')).toBeNull();expect(screen.getByText('自定义标题')).toBeTruthy();expect(screen.getByText('自定义图标')).toBeTruthy();expect(screen.getByText('0')).toBeTruthy();expect(screen.container.querySelector('.ui-step')!.getAttribute('style')).toContain('80px');
});
test('Steps horizontal space and empty state are supported without introducing children wrappers',()=>{
 const screen=render(<Steps space="100px" alignCenter><Step title="第一步"/><Step title="第二步"/></Steps>);
 expect(screen.container.querySelector('.ui-step')!.getAttribute('style')).toContain('100px');expect(screen.container.querySelectorAll('.ui-step-center')).toHaveLength(2);
 screen.rerender(<Steps/>);expect(screen.container.querySelectorAll('.ui-step')).toHaveLength(0);
});
