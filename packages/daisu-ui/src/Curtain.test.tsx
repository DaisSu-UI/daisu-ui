import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { Curtain } from './Curtain.js';
function event(name:string,detail:object){return Object.assign(new Event(`bindEvent:${name}`),{eventType:'bindEvent',eventName:name,detail});}
afterEach(()=>{cleanup();rstest.restoreAllMocks();});
test('Curtain scales to natural image ratio and delegates navigation before controlled close',async()=>{
 const change=rstest.fn(),close=rstest.fn(),navigate=rstest.fn(),click=rstest.fn(),screen=render(<Curtain src="test.png" value width={280} to="/target" onChange={change} onClose={close} onNavigate={navigate} onClick={click}/>);
 await waitFor(()=>expect(screen.container.querySelector('.ui-curtain-image')).toBeTruthy());const image=screen.container.querySelector('.ui-curtain-image')!;
 fireEvent(image,event('load',{width:200,height:300}));await waitFor(()=>expect(image.getAttribute('style')).toContain('420px'));fireEvent.tap(image);expect(navigate).toHaveBeenCalledWith('/target');expect(click).toHaveBeenCalledTimes(1);expect(change).toHaveBeenCalledWith(false);expect(close).toHaveBeenCalledWith('image');
});
test('Curtain supports retained image clicks, custom close and source recovery after failure',async()=>{
 const change=rstest.fn(),error=rstest.fn(),screen=render(<Curtain src="bad.png" value closeOnClick={false} onChange={change} onError={error} renderClose={close=><text catchtap={close}>关闭</text>}/>);
 await waitFor(()=>expect(screen.container.querySelector('.ui-curtain-image')).toBeTruthy());fireEvent.tap(screen.container.querySelector('.ui-curtain-image')!);expect(change).not.toHaveBeenCalled();fireEvent.tap(screen.getByText('关闭'),{eventType:'catchEvent'});expect(change).toHaveBeenCalledWith(false);
 fireEvent(screen.container.querySelector('.ui-curtain-image')!,event('error',{errMsg:'failed'}));expect(error).toHaveBeenCalledTimes(1);
 screen.rerender(<Curtain src="good.png" value width={100}/>);await waitFor(()=>expect(screen.container.querySelector('.ui-curtain-image')!.getAttribute('src')).toBe('good.png'));
});
test('Curtain modal click only closes when opted in, close button uses catchtap',async()=>{
 const change=rstest.fn(),modal=rstest.fn(),screen=render(<Curtain src="test.png" value onChange={change} onClickModal={modal} closePosition="bottom-right"/>);
 await waitFor(()=>expect(screen.container.querySelector('.ui-overlay')).toBeTruthy());fireEvent.tap(screen.container.querySelector('.ui-overlay')!);expect(modal).toHaveBeenCalledTimes(1);expect(change).not.toHaveBeenCalled();
 screen.rerender(<Curtain src="test.png" value onChange={change} closeOnClickModal closePosition="bottom-right"/>);fireEvent.tap(screen.container.querySelector('.ui-overlay')!);expect(change).toHaveBeenCalledWith(false);fireEvent.tap(screen.container.querySelector('.ui-curtain-close')!,{eventType:'catchEvent'});expect(change).toHaveBeenCalledTimes(2);
});
