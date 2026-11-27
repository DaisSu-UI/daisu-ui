import { DemoIcon } from './DemoIcon.js';
import { useDemoLocale } from './demoLocale.js';

export function DemoTabbar({ active, onDemo, onAbout }: { active: 'demo' | 'about'; onDemo?: () => void; onAbout?: () => void }) {
  const { t } = useDemoLocale();
  return <view className="ui-demo-tabbar">
    <view className={`ui-demo-tabbar-item ${active === 'demo' ? 'ui-demo-tabbar-item-active' : ''}`} accessibility-element accessibility-traits="button" accessibility-label="Demo" bindtap={onDemo}><DemoIcon name="demo" /><text>Demo</text></view>
    <view className={`ui-demo-tabbar-item ${active === 'about' ? 'ui-demo-tabbar-item-active' : ''}`} accessibility-element accessibility-traits="button" accessibility-label={t('关于我们')} bindtap={onAbout}><DemoIcon name="about" /><text>{t('关于我们')}</text></view>
  </view>;
}
