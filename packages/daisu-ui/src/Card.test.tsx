import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Card } from './Card.js';
afterEach(cleanup);
test('Card preserves business defaults and exposes standard/rectangle without losing description and footer',()=>{
 const screen=render(<Card title="标题" description="说明" footer={<text>操作</text>}><text>内容</text></Card>);expect(screen.container.querySelector('.ui-card-business')).toBeTruthy();expect(screen.getByText('说明')).toBeTruthy();expect(screen.container.querySelector('.ui-card-content-line')).toBeNull();
 screen.rerender(<Card variant="standard" title="标题" description="说明"/>);expect(screen.container.querySelector('.ui-card-standard')).toBeTruthy();expect(screen.container.querySelector('.ui-card-body')).toBeTruthy();expect(screen.container.querySelector('.ui-card-footer')).toBeNull();
 screen.rerender(<Card type="rectangle" title="标题"/>);expect(screen.container.querySelector('.ui-card-rectangle')).toBeTruthy();expect(screen.container.querySelector('.ui-card-content-line')).toBeTruthy();
});
test('Card complex slots keep interactions and falsy numeric content is rendered, section classes are forwarded',()=>{
 const click=rstest.fn(),screen=render(<Card variant="standard" title={<view bindtap={click}><text>自定义标题</text></view>} footer={0} customTitleClass="title-extra" customContentClass="body-extra" customFooterClass="footer-extra">{0}</Card>);fireEvent.tap(screen.getByText('自定义标题').parentElement!);expect(click).toHaveBeenCalledTimes(1);expect(screen.container.querySelectorAll('text').length).toBe(3);expect(screen.container.querySelector('.title-extra')).toBeTruthy();expect(screen.container.querySelector('.body-extra')).toBeTruthy();expect(screen.container.querySelector('.footer-extra')).toBeTruthy();
 screen.rerender(<Card title={false} footer={false}/>);expect(screen.container.querySelector('.ui-card-header')).toBeNull();expect(screen.container.querySelector('.ui-card-footer')).toBeNull();
});
