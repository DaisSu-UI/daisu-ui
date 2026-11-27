import '@daisu-ui/ui/router/runtime';
import 'url-search-params-polyfill';
import { root, useEffect, useInitData, useState } from '@lynx-js/react';
import { RootPortalHost } from '@daisu-ui/ui';
import { RouterView, connectRouterHistory } from '@daisu-ui/ui/router';
import { createAppRouter } from './app/router.js';
import { createDemoHistory } from './lib/history.js';
import type { RouterHistoryState } from '@daisu-ui/ui/router';
import { DemoLocaleProvider } from './features/ui-demo/demoLocale.js';
import { DemoPresentation } from './features/ui-demo/DemoPresentation.js';
import { UiDemoPage } from './features/ui-demo/UiDemoPage.js';
import './styles.css';
import './features/ui-demo/styles.css';


function Demo() {
  const data = useInitData() as { page?: string; theme?: string; viewportWidth?: number; browserMedia?: boolean; navigation?: RouterHistoryState; locale?: string };
  const [router] = useState(() => createAppRouter(data.page, data.navigation));
  const [theme, setTheme] = useState<'light' | 'dark'>(data.theme === 'dark' ? 'dark' : 'light');
  useEffect(() => { if (data.browserMedia) return connectRouterHistory(router, createDemoHistory()); }, [router, data.browserMedia]);
  return <DemoLocaleProvider initialLocale={data.locale} theme={theme}><DemoPresentation router={router} browser={!!data.browserMedia} />
    <RootPortalHost>
      <RouterView router={router} viewportWidth={data.viewportWidth || 375} renderRoute={route =>
        <UiDemoPage page={route.page} theme={theme} onThemeChange={setTheme}
          onOpen={page => { 'background only'; void router.push(`/ui-demo/${page}`); }}
          onHome={() => { 'background only'; void router.reset('/ui-demo/index'); }}
          onBack={() => { 'background only'; void router.back(); }} />
      } />
    </RootPortalHost>
  </DemoLocaleProvider>;
}
root.render(<Demo />);
if (import.meta.webpackHot) import.meta.webpackHot.accept();
