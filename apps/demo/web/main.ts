import { connectDocsPreview } from './docsPreview';
import { registerDaisuWebComponents } from '@daisu-ui/ui/web';
import '@lynx-js/web-core/plugins/scroll-view-mouse-drag';
import '@lynx-js/web-core/client';
import type { LynxViewElement } from '@lynx-js/web-core/client';
import { parseRouterHistoryState } from '@daisu-ui/ui/router/location';
import type { NavigationAction } from '@daisu-ui/ui/router/location';
import { createBrowserRouterHistory } from './routerHistory';
import { applyDemoPresentation, readDemoLocale } from './presentation';
import { demoProjectLinks } from '../src/features/ui-demo/demoProject';
import './style.css';

registerDaisuWebComponents();
async function mount() {
  await customElements.whenDefined('lynx-view');
  const query = new URLSearchParams(location.search);
  // Hash routes keep the static Demo deployable under documentation subpaths.
  if (!location.hash.startsWith('#/')) history.replaceState(history.state, '', `${location.pathname}${location.search}#/ui-demo/${query.get('component') || 'index'}`);
  const view = document.createElement('lynx-view') as LynxViewElement;
  const navigation = createBrowserRouterHistory(window, '/ui-demo/index', state => view.sendGlobalEvent('demo.navigation', [state]));
  const scheme = matchMedia('(prefers-color-scheme: dark)');
  view.injectStyleRules = ['x-input.ui-textfield-native::part(input), x-textarea.ui-textfield-native::part(textarea) { --placeholder-color: var(--ui-textfield-placeholder, var(--cso-ui-text-placeholder, #a9acb8)); }'];
  view.initData = {
    locale: readDemoLocale(window), browserMedia: true, page: navigation.initialPage, navigation: navigation.initialState,
    theme: query.get('theme') || (scheme.matches ? 'dark' : 'light'), viewportWidth: innerWidth,
  };
  const entry = [...document.scripts].find(script => /\/static\/js\/index(?:\.[^/]+)?\.js$/.test(new URL(script.src, location.href).pathname));
  if (!entry) throw new Error('Demo entry script was not found');
  const base = new URL('../../', entry.src);
  view.nativeModulesMap = { DemoBridge: new URL('native-modules/demo-bridge.js', base).href };
  view.onNativeModulesCall = (name, data, moduleName) => {
    if (moduleName !== 'DemoBridge' || name !== 'postMessage' || typeof data !== 'string') throw new Error('Invalid Demo navigation request');
    const message = JSON.parse(data);
    if (applyDemoPresentation(document, window, message)) return true;
    if (message.type === 'open-link') {
      if (!demoProjectLinks.some(link => link.url === message.url)) throw new Error('Invalid Demo project link');
      location.assign(message.url);
      return true;
    }
    const state = parseRouterHistoryState(message.state);
    if (!state || !['push','replace','back','reset','restore','sync'].includes(message.action)) throw new Error('Invalid Demo history state');
    navigation.sync(state, message.action as NavigationAction | 'sync');
    return true;
  };
  const preview = connectDocsPreview(view, query.get('docsToken'), query.get('component') || 'index');
  window.addEventListener('pagehide', () => { navigation.dispose(); preview.dispose(); }, { once: true });
  view.addEventListener('error', () => preview.error());
  view.addEventListener('error', event => console.error('Demo runtime error', event));
  document.body.append(view);
  const bundleUrl = new URL('app.web.bundle', base);
  // A fresh documentation preview must load the same release as its page shell.
  const previewToken = query.get('docsToken');
  if (previewToken) bundleUrl.searchParams.set('docsToken', previewToken);
  view.url = bundleUrl.href;
}
void mount().catch(error => {
  console.error('Demo startup failed', error);
  if (window.parent !== window) window.parent.postMessage({ channel: 'daisu-demo', type: 'error', token: new URLSearchParams(location.search).get('docsToken') }, location.origin);
});
