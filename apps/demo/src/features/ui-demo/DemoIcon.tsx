import type { UiDemoCategory } from './catalog.js';

const paths = {
  basic: '<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10 9-5M12 12 3 7m9 5v10"/>',
  navigation: '<path d="M5 3v18h3M11 5h10M11 12h7M11 19h10"/><circle cx="5" cy="4" r="1"/><circle cx="5" cy="12" r="1"/>',
  form: '<path d="M8 5h13M8 12h13M8 19h13M3 5h.01M3 12h.01M3 19h.01"/>',
  feedback: '<path d="M4 21V11a9 9 0 1 1 9 9H4ZM8 9h8M8 13h5"/>',
  display: '<path d="M3 3h18v18H3V3Zm0 14 6-6 4 4 3-3 5 5"/><circle cx="15.5" cy="7.5" r="1"/>',
  demo: '<rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="8" height="8" rx="1"/>',
  about: '<path d="m12 2 10 5-10 5L2 7l10-5ZM2 12l10 5 10-5M2 17l10 5 10-5"/>',
};

function markup(name: keyof typeof paths, color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

/** Inline SVG avoids platform-dependent text glyphs and external icon fonts. */
export function DemoIcon({ name }: { name: UiDemoCategory | 'demo' | 'about' }) {
  return <view className="ui-demo-line-icon">
    <svg className="ui-demo-icon-light" content={markup(name, '#4e5369')} />
    <svg className="ui-demo-icon-dark" content={markup(name, '#aeb9c8')} />
    <svg className="ui-demo-icon-selected" content={markup(name, '#1c64fd')} />
  </view>;
}
