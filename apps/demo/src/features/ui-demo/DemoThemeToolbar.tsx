import { useState } from '@lynx-js/react';
import { Cell, RootPortal } from 'daisu-ui';

/** Demo chrome, independent of the public ActionSheet component. */
export function DemoThemeToolbar({ theme, onChange }: { theme: 'light' | 'dark'; onChange: (theme: 'light' | 'dark') => void }) {
  const [open, setOpen] = useState(false);
  return <>
    <Cell title="调整主题" value={theme === 'dark' ? 'Dark' : 'Default'} arrow onTap={() => { 'background only'; setOpen(true); }} />
    {open ? <RootPortal><view className="ui-demo-page demo-theme-layer"><view className="demo-sheet-backdrop" bindtap={() => { 'background only'; setOpen(false); }} /><view className="demo-theme-sheet"><text className="demo-theme-sheet-title">切换主题色</text>{(['light', 'dark'] as const).map(value => <view key={value} className="demo-theme-option" accessibility-element accessibility-traits="button" accessibility-label={value === 'light' ? 'Default' : 'Dark'} bindtap={() => { 'background only'; onChange(value); setOpen(false); }}><text>{value === 'light' ? 'Default' : 'Dark'}</text></view>)}<view className="demo-theme-cancel demo-theme-option" bindtap={() => { 'background only'; setOpen(false); }}><text>取消</text></view></view></view></RootPortal> : null}
  </>;
}
