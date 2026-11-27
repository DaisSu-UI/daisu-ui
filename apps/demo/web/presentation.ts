const storageKey = 'daisu-demo-locale';
const languages = ['zh-CN', 'en-US', 'zh-TW'];
type BrowserPreferences = { location: Pick<Location, 'search'>; localStorage: Pick<Storage, 'getItem' | 'setItem'> };

export function readDemoLocale(browser: BrowserPreferences) {
  const requested = new URLSearchParams(browser.location.search).get('locale');
  if (requested && languages.includes(requested)) return requested;
  try {
    const saved = browser.localStorage.getItem(storageKey);
    if (saved && languages.includes(saved)) return saved;
  } catch { /* The Demo also works with browser storage disabled. */ }
  return 'zh-CN';
}

export function applyDemoPresentation(document: Pick<Document, 'title' | 'documentElement'>, browser: BrowserPreferences, message: unknown) {
  if (!message || typeof message !== 'object' || (message as { type?: unknown }).type !== 'presentation') return false;
  const { title, locale } = message as { title?: unknown; locale?: unknown };
  if (typeof title !== 'string' || !title.trim() || typeof locale !== 'string' || !languages.includes(locale)) throw new Error('Invalid Demo presentation');
  document.title = title;
  document.documentElement.lang = locale;
  try { browser.localStorage.setItem(storageKey, locale); } catch { /* Optional persistence. */ }
  return true;
}
