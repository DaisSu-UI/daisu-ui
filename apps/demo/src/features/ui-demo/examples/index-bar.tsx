import { useDemoLocale } from '../demoLocale.js';
import { useEffect, useState } from '@lynx-js/react';
import { Cell, IndexBar, RootPortal } from '@daisu-ui/ui';
import { indexBarCities } from './indexBarData.js';

export function IndexBarExample() {
  const { text: demoText } = useDemoLocale();
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => { 'background only'; setMessage(''); }, 2000);
    return () => clearTimeout(timer);
  }, [message]);
  return <view className="demo-index-bar-page">
    <IndexBar listId="demo-index-bar-list" sticky sections={indexBarCities} getItemKey={({ item }) => item} renderItem={({ item, section }) => <Cell title={demoText(item)} border clickable onTap={() => { 'background only'; setMessage(`当前点击项：${section.index}，城市：${item}`); }} />} />
    {message ? <RootPortal><view className="demo-index-bar-message"><text>{demoText(message)}</text></view></RootPortal> : null}
  </view>;
}
