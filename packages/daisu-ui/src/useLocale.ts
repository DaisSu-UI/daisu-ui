import { useMemo } from '@lynx-js/react';
import { useConfigProvider } from './configContext.js';
import { translate } from './locale.js';
import type { UiTranslate } from './locale.js';
/** The nearest Provider owns language; no global mutable translator or browser detection. */
export function useLocale() {
  const { locale } = useConfigProvider();
  const t = useMemo<UiTranslate>(() => (key, params) => translate(locale, key, params), [locale]);
  return { locale, t };
}
