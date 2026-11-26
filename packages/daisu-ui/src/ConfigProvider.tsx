import { useContext, useMemo } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { ConfigContext, configThemeVars } from './configContext.js';
import type { ConfigButtonDefaults, ConfigProviderTheme, ConfigProviderThemeVars, ConfigProviderValue, ConfigTagDefaults } from './configContext.js';
import { configThemeAppearance, configThemeTokens } from './configTheme.js';
export { useConfigProvider } from './configContext.js';
export type { ConfigButtonDefaults, ConfigProviderTheme, ConfigProviderThemeVars, ConfigProviderValue, ConfigTagDefaults } from './configContext.js';

export type ConfigProviderProps = {
  theme?: ConfigProviderTheme;
  themeVars?: ConfigProviderThemeVars;
  button?: ConfigButtonDefaults;
  tag?: ConfigTagDefaults;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function ConfigProvider({ theme, themeVars, button, tag, children, className = '', style }: ConfigProviderProps) {
  const parent = useContext(ConfigContext);
  const { config, scope } = useMemo(() => {
    const own = { ...configThemeVars(themeVars), ...Object.fromEntries(Object.entries(style ?? {}).filter(([key, value]) => key.startsWith('--cso-ui-') && value !== undefined).map(([key, value]) => [key, String(value)])) };
    const variables = { ...parent?.themeVars, ...own };
    const scope = theme === undefined ? { ...configThemeAppearance(parent?.theme ?? 'light'), ...variables } : { ...configThemeTokens(theme), ...variables };
    const config: ConfigProviderValue = {
      theme: theme ?? parent?.theme ?? 'light', themeVars: variables,
      button: { ...parent?.button, ...Object.fromEntries(Object.entries(button ?? {}).filter(([, value]) => value !== undefined)) },
      tag: { ...parent?.tag, ...Object.fromEntries(Object.entries(tag ?? {}).filter(([, value]) => value !== undefined)) },
      tokens: { ...parent?.tokens, ...scope },
    };
    return { config, scope };
  }, [parent, theme, themeVars, button, tag, style]);
  return <ConfigContext.Provider value={config}><view className={`ui-config-provider theme-${config.theme} ${className}`} style={{ ...scope, ...style }}>{children}</view></ConfigContext.Provider>;
}
