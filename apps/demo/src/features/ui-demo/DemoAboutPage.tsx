import { useInitData, useState } from '@lynx-js/react';
import { Cell, CellGroup, Popup, Radio, RadioGroup } from '@daisu-ui/ui';
import { version, license } from '@daisu-ui/ui/package.json';
import type { UiLocaleName } from '@daisu-ui/ui';
import { DemoIcon } from './DemoIcon.js';
import { DemoNavbar } from './DemoNavbar.js';
import { DemoTabbar } from './DemoTabbar.js';
import { DemoThemeToolbar } from './DemoThemeToolbar.js';
import { demoLanguages, demoLanguageLabels, useDemoLocale } from './demoLocale.js';
import { componentGroups } from './catalog.js';
import { demoProjectLinks } from './demoProject.js';

export function DemoAboutPage({ onBack, onHome, statusBarHeight = 0, theme, onThemeChange }: { onBack: () => void; onHome: () => void; statusBarHeight?: number; theme: 'light' | 'dark'; onThemeChange: (theme: 'light' | 'dark') => void }) {
  const { locale, setLocale, t } = useDemoLocale();
  const data = useInitData() as { browserMedia?: boolean } | undefined;
  const [link, setLink] = useState<{ title: string; url: string } | null>(null);
  const total = componentGroups.reduce((count, group) => count + group.items.length, 0);
  const openLink = (item: typeof demoProjectLinks[number]) => {
    'background only';
    if (data?.browserMedia) NativeModules.DemoBridge.postMessage(JSON.stringify({ type: 'open-link', url: item.url }));
    else setLink(item);
  };
  return <view className="page ui-demo-page">
    <DemoNavbar title={t('关于我们')} onBack={onBack} statusBarHeight={statusBarHeight} />
    <scroll-view className="ui-demo-component-scroll" style={{ zIndex: 0 }} scroll-orientation="vertical" scroll-y>
      <view className="demo-about-content">
        <view className="demo-about-hero">
          <view className="demo-about-logo"><DemoIcon name="about" /></view>
          <text className="demo-about-name">Daisu UI · {t('袋鼠 UI')}</text>
          <text className="demo-about-version">v{version}</text>
          <text className="demo-about-description">{t('面向 ReactLynx 的开源组件库，为 Flutter 宿主与 Web 提供一致的组件示例、主题与交互体验。')}</text>
        </view>
        <CellGroup title={t('偏好设置')} border>
          <Cell title={t('语言')} vertical>
            <RadioGroup<UiLocaleName> className="demo-about-languages" type="button" value={locale as UiLocaleName} onChange={value => { 'background only'; if (value) setLocale?.(value); }}>
              {demoLanguages.map(value => <Radio key={value} value={value}>{demoLanguageLabels[value]}</Radio>)}
            </RadioGroup>
          </Cell>
          <Cell description={t('语言设置会同步应用到组件、导航和示例说明。')} />
          <DemoThemeToolbar theme={theme} onChange={onThemeChange} />
        </CellGroup>
        <CellGroup title={t('项目信息')} border>
          <Cell title={t('当前版本')} value={`v${version}`} />
          <Cell title={t('组件数量')} value={String(total)} />
          <Cell title={t('开源许可')} value={license} />
          <Cell title={t('技术栈')} value="ReactLynx · TypeScript" />
          <Cell title={t('支持语言')} description={t('简体中文、英语、繁体中文')} />
        </CellGroup>
        <CellGroup title={t('项目链接')} border>
          {demoProjectLinks.map((item, index) => <Cell key={item.url} title={t(item.title)} titleWidth="calc(100% - 24px)" description={item.url} arrow last={index === demoProjectLinks.length - 1} onTap={() => { 'background only'; openLink(item); }} />)}
        </CellGroup>
        <text className="demo-about-footer">{t('由 DaisSu-UI 维护，感谢开源社区的贡献。')}</text>
      </view>
    </scroll-view>
    <DemoTabbar active="about" onDemo={onHome} />
    <Popup show={!!link} onChange={show => { 'background only'; if (!show) setLink(null); }} position="bottom" rootPortal round closable title={t(link?.title ?? '项目链接')}>
      <view className="demo-about-content"><text className="demo-about-description">{t('请在浏览器中访问以下地址')}</text><text className="demo-about-url">{link?.url}</text></view>
    </Popup>
  </view>;
}
