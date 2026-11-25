import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { ConfigProvider, useConfigProvider } from './ConfigProvider.js';
import { configThemeVars } from './configContext.js';
import { Button } from './Button.js';
import { Tag } from './Tag.js';

function Snapshot() {
  const {theme,themeVars,button,tag}=useConfigProvider();
  return <text className="config-snapshot">{JSON.stringify({theme,themeVars,button,tag})}</text>;
}
test('ConfigProvider merges nested defaults and variables, preserves false/explicit props and isolates siblings', () => {
  try {
    const screen=render(<ConfigProvider theme="dark" themeVars={{primary:'#123456',buttonRadius:12}} button={{size:'large',round:true,variant:'plain'}} tag={{size:'large',variant:'light',round:true}}>
      <Button label="parent"/><Tag>parent tag</Tag>
      <ConfigProvider theme="light" themeVars={{buttonRadius:4}} button={{size:'small',variant:undefined}} tag={{round:false}}><Snapshot/><Button label="child"/><Button size="mini" round={false} variant="solid" label="explicit"/><Tag plain>explicit tag</Tag></ConfigProvider>
      <Button label="sibling"/>
    </ConfigProvider>);
    const buttons=screen.container.querySelectorAll('.ui-button');
    expect(buttons[0]!.className).toContain('ui-button-large'); expect(buttons[0]!.className).toContain('ui-button-round');
    expect(buttons[1]!.className).toContain('ui-button-small'); expect(buttons[1]!.className).toContain('ui-button-plain');
    expect(buttons[2]!.className).toContain('ui-button-mini'); expect(buttons[2]!.className).not.toContain('ui-button-round'); expect(buttons[2]!.className).toContain('ui-button-solid');
    expect(buttons[3]!.className).toContain('ui-button-large');
    const config=JSON.parse(screen.container.querySelector('.config-snapshot')!.textContent!);
    expect(config.theme).toBe('light'); expect(config.themeVars['--cso-ui-primary']).toBe('#123456'); expect(config.themeVars['--cso-ui-button-radius']).toBe('4px');
    expect(config.tag.round).toBe(false); expect(config.tag.size).toBe('large');
    expect(screen.container.querySelectorAll('.ui-tag')[1]!.className).toContain('ui-tag-plain');
  }finally{cleanup();}
});

test('ConfigProvider updates live, removes stale variables/defaults and reads scoped state without global mutations', () => {
  let count=0;
  try {
    const screen=render(<ConfigProvider theme="dark" themeVars={{buttonPrimaryBg:'#07c160'}} button={{type:'danger',variant:'base'}}><Button label="action" onTap={()=>count++}/><Snapshot/></ConfigProvider>);
    expect(screen.container.querySelector('.ui-button')!.className).toContain('ui-button-danger'); expect(screen.container.querySelector('.ui-button')!.className).toContain('ui-button-solid');
    fireEvent.tap(screen.container.querySelector('.ui-button')!);expect(count).toBe(1);
    screen.rerender(<ConfigProvider theme="light"><Button label="action"/><Snapshot/></ConfigProvider>);
    expect(screen.container.querySelector('.ui-button')!.className).toContain('ui-button-primary');
    const config=JSON.parse(screen.container.querySelector('.config-snapshot')!.textContent!);expect(config.themeVars).toEqual({}); expect(config.button).toEqual({});
    expect(screen.container.querySelector('.ui-config-provider')!.getAttribute('style') ?? '').not.toContain('#07c160');
    screen.rerender(<><Button label="outside"/><Snapshot/></>);expect(JSON.parse(screen.container.querySelector('.config-snapshot')!.textContent!).theme).toBe('light');
  }finally{cleanup();}
});

test('ConfigProvider maps supported aliases/units, skips unknown or nonfinite variables and preserves raw tokens', () => {
  expect(configThemeVars({buttonPrimaryBgColor:'#07c160',buttonPrimaryColor:'#fff',buttonHeight:44,onPrimary:'#111','--cso-ui-custom-gap':'2rem',buttonRadius:Infinity})).toEqual({'--cso-ui-button-primary-bg':'#07c160','--cso-ui-button-primary-color':'#fff','--cso-ui-button-height':'44px','--cso-ui-on-primary':'#111','--cso-ui-custom-gap':'2rem'});
});
