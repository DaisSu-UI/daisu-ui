import type { ConfigProviderTheme } from './configContext.js';

/** These palettes preserve the existing business theme; CSS variables remain public. */
const colors = {
  light: { canvas:'#f5f7fa',surface:'#fff','surface-muted':'#f8fafc',text:'#17212e','text-muted':'#697586',line:'#e6eaf0',primary:'#f86100','on-primary':'#fff',success:'#1f9d67',info:'#236fd4',warning:'#b86b00',danger:'#d63b47',hero:'#17212e','hero-text':'#fff','hero-muted':'#d5dbe4' },
  dark: { canvas:'#10151c',surface:'#171e27','surface-muted':'#202936',text:'#f3f6fa','text-muted':'#aeb9c8',line:'#303b4a',primary:'#ff812e','on-primary':'#16110d',success:'#56c891',info:'#78aeff',warning:'#f0b450',danger:'#ff7f8a',hero:'#0c1117','hero-text':'#f7f9fc','hero-muted':'#b4c0d0' },
};
export function configThemeTokens(theme: ConfigProviderTheme): Record<string, string> {
  return { ...Object.fromEntries(Object.entries(colors[theme]).map(([key,value]) => [`--cso-ui-${key}`,value])), ...configThemeAppearance(theme) };
}
export function configThemeAppearance(theme: ConfigProviderTheme): Record<string,string> {
  return {
    '--cso-ui-light-display':theme==='light'?'flex':'none', '--cso-ui-dark-display':theme==='dark'?'flex':'none',
    '--cso-ui-disabled-text':theme==='dark'?'#58585b':'#c9cbd4',
    '--cso-ui-avatar-bg':theme==='dark'?'var(--cso-ui-surface-muted)':'var(--cso-ui-line)',
    '--cso-ui-avatar-text':theme==='dark'?'var(--cso-ui-text)':'var(--cso-ui-text-auxiliary,var(--cso-ui-text-muted))',
    '--cso-ui-avatar-collapse-bg':theme==='dark'?'var(--cso-ui-surface-muted)':'#ebedf0',
    '--cso-ui-avatar-collapse-color':theme==='dark'?'var(--cso-ui-text-auxiliary,var(--cso-ui-text-muted))':'#969799',
    '--cso-ui-tag-default-color':theme==='dark'?'#e5e6eb':'#4e5369',
    ...Object.fromEntries(Object.entries({'default': '#f2f3f5', 'primary': '#f5f8ff', 'danger': '#fff5f5', 'warning': '#fff6eb', 'success': '#f3fbf9', 'volcano': '#fff2e8', 'lightblue': '#e8fbff', 'cyan': '#f4fbfd', 'pink': '#fff0f5', 'purple': '#f9f5ff'}).map(([key,value]) => [`--cso-ui-tag-light-${key}-bg`,theme==='dark'?'var(--cso-ui-surface-muted)':value])),
    '--cso-ui-picker-fade-top':theme==='dark'?'linear-gradient(0deg,rgba(0,0,0,.2),rgba(0,0,0,.85))':'linear-gradient(0deg,rgba(255,255,255,.2),rgba(255,255,255,.85))',
    '--cso-ui-picker-fade-bottom':theme==='dark'?'linear-gradient(180deg,rgba(0,0,0,.2),rgba(0,0,0,.85))':'linear-gradient(180deg,rgba(255,255,255,.2),rgba(255,255,255,.85))',
  };
}
