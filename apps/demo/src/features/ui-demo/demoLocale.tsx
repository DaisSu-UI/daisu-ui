import { createContext, useContext, useMemo, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import { ConfigProvider, useLocale } from '@daisu-ui/ui';
import type { UiLocaleName } from '@daisu-ui/ui';
import { translateDemo } from './demoMessages.js';
import { createDemoCopy } from './demoCopy.js';

type DemoLocaleControl = { locale: UiLocaleName; setLocale: (locale: UiLocaleName) => void };
const DemoLocaleContext = createContext<DemoLocaleControl | null>(null);
export const demoLanguages = ['zh-CN', 'en-US', 'zh-TW'] as const;
export const demoLanguageLabels = { 'zh-CN': '简体中文', 'en-US': 'English', 'zh-TW': '繁體中文' } as const;

export function DemoLocaleProvider({ initialLocale, children, theme = 'light' }: { initialLocale?: string; children?: ReactNode; theme?: 'light' | 'dark' }) {
  const [locale, setLocale] = useState<UiLocaleName>(demoLanguages.includes(initialLocale as UiLocaleName) ? initialLocale as UiLocaleName : 'zh-CN');
  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <DemoLocaleContext.Provider value={value}><ConfigProvider locale={locale} theme={theme} className={`app-root theme-${theme}`}>{children}</ConfigProvider></DemoLocaleContext.Provider>;
}

/** Demo copy and component defaults share one language, including kept-alive routes. */
export function useDemoLocale() {
  const control = useContext(DemoLocaleContext);
  const { locale: inherited } = useLocale();
  const locale = control?.locale ?? inherited.name;
  const t = useMemo(() => (text: string) => translateDemo(text, locale), [locale]);
  const text = useMemo(() => <T,>(value: T): T => typeof value === 'string' ? translateDemo(value, locale) as T : value, [locale]);
  const copy = useMemo(() => createDemoCopy(t), [t]);
  return { locale, setLocale: control?.setLocale, t, text, copy };
}
