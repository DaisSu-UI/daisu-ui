import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { SwiperNav } from './SwiperNav.js';
afterEach(cleanup);
test('SwiperNav supports shared indicator variants, selecting a page, and directional controls',()=>{
 const select=rstest.fn(),change=rstest.fn(),screen=render(<SwiperNav current={1} total={3} type="dots-bar" showControls onSelect={select} onChange={change}/>);expect(screen.container.querySelectorAll('.ui-swiper-dot')).toHaveLength(3);fireEvent.tap(screen.container.querySelectorAll('.ui-swiper-dot')[2]!,{eventType:'catchEvent'});expect(select).toHaveBeenCalledWith(2);fireEvent.tap(screen.container.querySelector('.ui-swiper-control-prev')!,{eventType:'catchEvent'});expect(change).toHaveBeenCalledWith({dir:'prev'});
 screen.rerender(<SwiperNav current={7} total={3} type="fraction"/>);expect(screen.getByText('3/3')).toBeTruthy();screen.rerender(<SwiperNav total={1}/>);expect(screen.container.querySelector('.ui-swiper-indicator')).toBeNull();
});
