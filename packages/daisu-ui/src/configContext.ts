import { createContext, useContext } from '@lynx-js/react';
import { zhCN } from './locale.js';
import type { UiLocale } from './locale.js';
import type { ButtonProps } from './Button.js';
import type { TagProps } from './Tag.js';

export type ConfigProviderTheme = 'light' | 'dark';
export type ConfigButtonDefaults = Pick<ButtonProps, 'size' | 'tone' | 'round'> & { variant?: ButtonProps['variant'] | 'base'; type?: ButtonProps['tone'] };
export type ConfigTagDefaults = Pick<TagProps, 'size' | 'variant' | 'round'>;
export type ConfigProviderThemeVars = Partial<Record<
  'primary' | 'onPrimary' | 'success' | 'warning' | 'danger' | 'info' | 'canvas' | 'surface' | 'surfaceMuted' | 'text' | 'textMuted' | 'line' |
  'colorTheme' | 'buttonPrimaryBg' | 'buttonPrimaryBgColor' | 'buttonPrimaryColor' | 'buttonHeight' | 'buttonRadius' | 'buttonFontSize' | 'cellTitleColor', string | number>> &
  { [key: `--cso-ui-${string}`]: string | number | undefined };
export type ConfigProviderValue = {
  locale: UiLocale;
  theme: ConfigProviderTheme;
  themeVars: Record<string, string>;
  button: ConfigButtonDefaults;
  tag: ConfigTagDefaults;
  /** Effective explicit tokens captured at the source of a native portal. */
  tokens: Record<string, string>;
};
export const ConfigContext = createContext<ConfigProviderValue | undefined>(undefined);
const defaults: ConfigProviderValue = { locale: zhCN, theme: 'light', themeVars: {}, button: {}, tag: {}, tokens: {} };
/** Reads the nearest scoped configuration; updates are driven by Provider props. */
export function useConfigProvider(): ConfigProviderValue {
  return useContext(ConfigContext) ?? defaults;
}
const aliases: Record<string, string> = {
  colorTheme: 'primary', buttonPrimaryBg: 'button-primary-bg', buttonPrimaryBgColor: 'button-primary-bg', buttonPrimaryColor: 'button-primary-color',
  buttonHeight: 'button-height', buttonRadius: 'button-radius', buttonFontSize: 'button-font-size', cellTitleColor: 'cell-title-color',
};
const semantics = new Set(['primary', 'onPrimary', 'success', 'warning', 'danger', 'info', 'canvas', 'surface', 'surfaceMuted', 'text', 'textMuted', 'line']);
export function configThemeVars(input: ConfigProviderThemeVars | undefined): Record<string, string> {
  const output: Record<string, string> = {};
  for (const [name, value] of Object.entries(input ?? {})) {
    if (value === undefined || typeof value === 'number' && !Number.isFinite(value)) continue;
    const key = name.startsWith('--cso-ui-') ? name : aliases[name] ? `--cso-ui-${aliases[name]}` : semantics.has(name) ? `--cso-ui-${name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}` : undefined;
    if (!key) continue;
    output[key] = typeof value === 'number' && ['buttonHeight', 'buttonRadius', 'buttonFontSize'].includes(name) ? `${value}px` : String(value);
  }
  return output;
}
