import { useConfigProvider } from './configContext.js';
import { configThemeTokens } from './configTheme.js';
const defaults = { light: configThemeTokens('light'), dark: configThemeTokens('dark') };

/** SVG content is a separate document and cannot read the view's CSS vars. */
export function resolveThemeColor(value: string, tokens: Record<string, string>, seen = new Set<string>()): string | undefined {
  value = value.trim();
  const match = /^var\(\s*(--[\w-]+)\s*(?:,\s*([\s\S]*))?\)$/.exec(value);
  if (!match) return !value || value === 'currentColor' ? undefined : value;
  const [, name, fallback] = match;
  if (seen.has(name!)) return undefined;
  const next = new Set(seen).add(name!);
  return (tokens[name!] ? resolveThemeColor(tokens[name!]!, tokens, next) : undefined)
    ?? (fallback ? resolveThemeColor(fallback.trim(), tokens, next) : undefined);
}

export function useThemeColor(value?: string, token = '--cso-ui-text-regular') {
  const config = useConfigProvider();
  const tokens = { ...defaults[config.theme], ...config.tokens };
  return (value ? resolveThemeColor(value, tokens) : undefined)
    ?? resolveThemeColor(`var(${token})`, tokens)
    ?? defaults[config.theme]['--cso-ui-text-regular']!;
}
