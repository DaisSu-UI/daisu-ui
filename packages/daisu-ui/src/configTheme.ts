import type { ConfigProviderTheme } from './configContext.js';

/** Neutral colors match Flutter core/theme/design_tokens.dart and AppColors. */
const colors = {
  light: { canvas:'#f1f5f8',surface:'#fff','surface-muted':'#f1f5f8',text:'#303133','text-regular':'#606266','text-muted':'#909399','text-placeholder':'#a8abb2',line:'#e5eaee','line-strong':'#dddbdb','divider-line-color':'rgba(126,134,142,0.08)',disclosure:'#aeaeb2',primary:'#f86100','on-primary':'#fff',success:'#1f9d67',info:'#236fd4',warning:'#b86b00',danger:'#d63b47',hero:'#17212e','hero-text':'#fff','hero-muted':'#d5dbe4' },
  dark: { canvas:'#0f1418',surface:'#1c2126','surface-muted':'#12171b',text:'#e6e8eb','text-regular':'#babec5','text-muted':'#8a8f99','text-placeholder':'#6b7280',line:'#2a2f35','line-strong':'#494a4a','divider-line-color':'rgba(126,134,142,0.16)',disclosure:'#636366',primary:'#ff812e','on-primary':'#16110d',success:'#56c891',info:'#78aeff',warning:'#f0b450',danger:'#ff7f8a',hero:'#0c1117','hero-text':'#f7f9fc','hero-muted':'#b4c0d0' },
};
export function configThemeTokens(theme: ConfigProviderTheme): Record<string, string> {
  return { ...Object.fromEntries(Object.entries(colors[theme]).map(([key,value]) => [`--cso-ui-${key}`,value])), ...configThemeAppearance(theme) };
}
export function configThemeAppearance(theme: ConfigProviderTheme): Record<string,string> {
  return {
    '--cso-ui-light-display':theme==='light'?'flex':'none', '--cso-ui-dark-display':theme==='dark'?'flex':'none',
    '--cso-ui-layer-close-bg':theme==='dark'?'#3a3a3c':'#e5e5ea',
    '--cso-ui-layer-close-color':theme==='dark'?'#fff':'#8e8e93',
    '--cso-ui-disabled-text':theme==='dark'?'#4b5563':'#c0c4cc',
    '--cso-ui-avatar-bg':theme==='dark'?'var(--cso-ui-surface-muted)':'var(--cso-ui-line)',
    '--cso-ui-avatar-text':theme==='dark'?'var(--cso-ui-text)':'var(--cso-ui-text-auxiliary,var(--cso-ui-text-muted))',
    '--cso-ui-avatar-collapse-bg':theme==='dark'?'var(--cso-ui-surface-muted)':'#ebedf0',
    '--cso-ui-avatar-collapse-color':'var(--cso-ui-text-muted)',
    '--cso-ui-tag-default-color':theme==='dark'?'#babec5':'#606266',
    ...Object.fromEntries(Object.entries({'default': '#f2f3f5', 'primary': '#f5f8ff', 'danger': '#fff5f5', 'warning': '#fff6eb', 'success': '#f3fbf9', 'volcano': '#fff2e8', 'lightblue': '#e8fbff', 'cyan': '#f4fbfd', 'pink': '#fff0f5', 'purple': '#f9f5ff'}).map(([key,value]) => [`--cso-ui-tag-light-${key}-bg`,theme==='dark'?'var(--cso-ui-surface-muted)':value])),
    '--cso-ui-picker-fade-top':theme==='dark'?'linear-gradient(0deg,rgba(0,0,0,.2),rgba(0,0,0,.85))':'linear-gradient(0deg,rgba(255,255,255,.2),rgba(255,255,255,.85))',
    '--cso-ui-picker-fade-bottom':theme==='dark'?'linear-gradient(180deg,rgba(0,0,0,.2),rgba(0,0,0,.85))':'linear-gradient(180deg,rgba(255,255,255,.2),rgba(255,255,255,.85))',
  };
}
