import { useEffect } from '@lynx-js/react';
import { useRouterSnapshot } from '@daisu-ui/ui/router';
import type { AppRouter } from '../../app/router.js';
import { publishDemoPresentation } from '../../lib/history.js';
import { useDemoLocale } from './demoLocale.js';
import { demoPageTitle } from './demoPageTitle.js';

export function DemoPresentation({ router, browser }: { router: AppRouter; browser: boolean }) {
  const { locale } = useDemoLocale();
  const snapshot = useRouterSnapshot(router);
  const page = snapshot.entries[snapshot.entries.length - 1]!.route.page;
  useEffect(() => {
    if (browser) publishDemoPresentation(demoPageTitle(page, locale), locale);
  }, [page, locale, browser]);
  return null;
}
