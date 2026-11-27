import { useDemoLocale } from './demoLocale.js';
export function DemoNavbar({ title, onBack, statusBarHeight = 0 }: { title: string; onBack?: () => void; statusBarHeight?: number }) {
  const { t } = useDemoLocale();
  const inset = Number.isFinite(statusBarHeight) ? Math.max(0, statusBarHeight) : 0;
  return <view className="ui-demo-navbar" style={{ paddingTop: `${inset}px` }}>
    <view className="ui-demo-navbar-content">
      {onBack ? <view className="ui-demo-navbar-back" bindtap={onBack} accessibility-element accessibility-label={t('返回')} accessibility-traits="button"><view className="ui-demo-navbar-back-icon" /></view> : null}
      <text className="ui-demo-navbar-title" text-maxline="1" text-overflow="ellipsis">{t(title)}</text>
    </view>
  </view>;
}
