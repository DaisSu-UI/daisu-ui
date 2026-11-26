import '@lynx-js/web-core/client';
import { registerDaisuWebComponents } from '@daisu-ui/ui/web';
import type { LynxViewElement } from '@lynx-js/web-core/client';
registerDaisuWebComponents();
async function mount() {
  await customElements.whenDefined('lynx-view');
  const script = [...document.scripts].find(item => /\/static\/js\/index\.[^/]+\.js$/.test(new URL(item.src, location.href).pathname));
  if (!script) throw Error('Browser entry script was not found');
  const view = document.createElement('lynx-view') as LynxViewElement;
  view.initData = { theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' };
  document.body.style.margin = '0'; document.body.style.height = '100dvh';
  view.style.cssText = 'display:block;width:100%;height:100%';
  document.body.append(view);
  view.url = new URL('../../app.web.bundle', script.src).href;
}
void mount().catch(error => { console.error(error); document.body.textContent = '示例加载失败，请检查 Bundle 和分块资源。'; });
