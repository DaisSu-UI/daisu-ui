import { zhCN } from './locales/zh-CN.js';
import { enUS } from './locales/en-US.js';
import { zhTW } from './locales/zh-TW.js';
export { zhCN, enUS, zhTW };
export type UiLocaleName = 'zh-CN' | 'en-US' | 'zh-TW';
export type UiMessageKey = keyof typeof zhCN.messages;
export type UiLocaleMessages = { readonly [K in UiMessageKey]: string };
export type UiLocale = { readonly name: string; readonly messages: UiLocaleMessages };
export type UiLocaleOverride = { readonly name?: string; readonly messages?: Partial<UiLocaleMessages> };
export type UiLocaleInput = UiLocaleName | UiLocaleOverride;
export type UiLocaleParams = Readonly<Record<string, string | number>>;
export type UiTranslate = (key: UiMessageKey, params?: UiLocaleParams) => string;
const builtins: Readonly<Record<UiLocaleName, UiLocale>> = { 'zh-CN': zhCN, 'en-US': enUS, 'zh-TW': zhTW };
/** Pure, synchronous resolution gives the main and background threads the same first screen. */
export function resolveLocale(input?: UiLocaleInput, parent: UiLocale = zhCN): UiLocale {
  if (input === undefined) return parent;
  if (typeof input === 'string') return builtins[input] ?? parent;
  const base = input.name && Object.prototype.hasOwnProperty.call(builtins, input.name) ? builtins[input.name as UiLocaleName] : parent;
  return { name: input.name ?? base.name, messages: { ...base.messages, ...Object.fromEntries(Object.entries(input.messages ?? {}).filter(([, value]) => typeof value === 'string')) } };
}
export function translate(locale: UiLocale, key: UiMessageKey, params?: UiLocaleParams): string {
  const text = locale.messages[key] ?? zhCN.messages[key];
  return text.replace(/\{(\w+)\}/g, (token, name: string) => params?.[name] === undefined ? token : String(params[name]));
}
export function localeDate(locale: UiLocale, stamp: number, kind: 'day' | 'month' | 'year' = 'day', shortYear = false): string {
  const date = new Date(stamp), month = date.getMonth() + 1;
  return translate(locale, `calendar.${kind}`, { year: shortYear && locale.name !== 'en-US' ? String(date.getFullYear() % 100).padStart(2, '0') : date.getFullYear(), month: shortYear ? String(month).padStart(2, '0') : month, day: shortYear ? String(date.getDate()).padStart(2, '0') : date.getDate(), monthName: translate(locale, `calendar.monthName${month}` as UiMessageKey) });
}

/** Send only a browser element's own labels across the native element protocol. */
export function localeScope(locale: UiLocale, prefix: string): UiLocaleOverride {
  return { name: locale.name, messages: Object.fromEntries(Object.entries(locale.messages).filter(([key]) => key.startsWith(prefix))) };
}
