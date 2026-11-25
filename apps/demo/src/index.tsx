import '@daisu-ui/ui/router/runtime';
import 'url-search-params-polyfill';
import { root, useEffect, useInitData, useState } from '@lynx-js/react';
import { ConfigProvider, RootPortalHost } from '@daisu-ui/ui';
import { RouterView, connectRouterHistory } from '@daisu-ui/ui/router';
import { createAppRouter } from './app/router.js';
import { createDemoHistory } from './lib/history.js';
import type { RouterHistoryState } from '@daisu-ui/ui/router';
import { UiDemoPage } from './features/ui-demo/UiDemoPage.js';
import './styles.css';
import './features/ui-demo/styles.css';

function Demo() {
  const data = useInitData() as { page?: string; theme?: string; viewportWidth?: number; browserMedia?: boolean; navigation?: RouterHistoryState };
  const [router] = useState(() => createAppRouter(data.page, data.navigation));
  const [theme, setTheme] = useState<'light' | 'dark'>(data.theme === 'dark' ? 'dark' : 'light');
  useEffect(() => { if (data.browserMedia) return connectRouterHistory(router, createDemoHistory()); }, [router, data.browserMedia]);
  return <ConfigProvider theme={theme} className={`app-root theme-${theme}`}>
    <RootPortalHost>
      <RouterView router={router} viewportWidth={data.viewportWidth || 375} renderRoute={route =>
        <UiDemoPage page={route.page} theme={theme} onThemeChange={setTheme}
          onOpen={page => { 'background only'; void router.push(`/ui-demo/${page}`); }}
          onBack={() => { 'background only'; void router.back(); }} />
      } />
    </RootPortalHost>
  </ConfigProvider>;
}
root.render(<Demo />);
if (import.meta.webpackHot) import.meta.webpackHot.accept();
