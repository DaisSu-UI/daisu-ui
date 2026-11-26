import { useState } from '@lynx-js/react';
import { Cell, Popup } from '@daisu-ui/ui';

/** Theme options use the same heading and close control as other popup surfaces. */
export function DemoThemeToolbar({ theme, onChange }: { theme: 'light' | 'dark'; onChange: (theme: 'light' | 'dark') => void }) {
  const [open, setOpen] = useState(false);
  return <>
    <Cell title="调整主题" value={theme === 'dark' ? 'Dark' : 'Default'} arrow onTap={() => { 'background only'; setOpen(true); }} />
    <Popup show={open} onChange={setOpen} rootPortal position="bottom" round closable title="切换主题色" zIndex={1100} className="ui-demo-page">
      {(['light', 'dark'] as const).map(value => <view key={value} className="demo-theme-option" accessibility-element accessibility-traits="button" accessibility-label={value === 'light' ? 'Default' : 'Dark'} bindtap={() => { 'background only'; onChange(value); setOpen(false); }}><text>{value === 'light' ? 'Default' : 'Dark'}</text></view>)}
      <view className="demo-theme-cancel demo-theme-option" bindtap={() => { 'background only'; setOpen(false); }}><text>取消</text></view>
    </Popup>
  </>;
}
