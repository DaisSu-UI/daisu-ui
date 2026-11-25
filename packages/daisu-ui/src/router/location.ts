export type { RouteQuery, RouterHistoryState, NavigationAction } from './core.js';
import type { RouteQuery, RouterHistoryState } from './core.js';

export function parseRoutePath(value: string): { path: string; query: Record<string, string> } {
  const source = value.replace(/^#/, '').split('#', 1)[0] || '/';
  const separator = source.indexOf('?');
  const path = separator < 0 ? source : source.slice(0, separator);
  const query: Record<string, string> = {};
  for (const pair of (separator < 0 ? '' : source.slice(separator + 1)).split('&')) {
    if (!pair) continue;
    const index = pair.indexOf('=');
    try {
      const key = decodeURIComponent((index < 0 ? pair : pair.slice(0, index)).replace(/\+/g, ' '));
      const entry = decodeURIComponent((index < 0 ? '' : pair.slice(index + 1)).replace(/\+/g, ' '));
      Object.defineProperty(query, key, { value: entry, enumerable: true, configurable: true, writable: true });
    } catch { /* Ignore malformed URL parameters. */ }
  }
  return { path: path.startsWith('/') ? path : `/${path}`, query };
}

export function routePath(path: string, query: RouteQuery = {}): string {
  const search = Object.keys(query).filter(key => query[key] !== undefined && query[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`).join('&');
  return `${path}${search ? `?${search}` : ''}`;
}

export function parseRouterHistoryState(value: unknown): RouterHistoryState | null {
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { return null; }
  }
  if (!value || typeof value !== 'object') return null;
  const entries = (value as RouterHistoryState).entries;
  if (!Array.isArray(entries) || entries.length === 0 || entries.length > 100) return null;
  const keys = new Set<string>();
  for (const entry of entries) {
    if (!entry || typeof entry.key !== 'string' || !entry.key || entry.key.length > 150 || keys.has(entry.key) ||
      typeof entry.path !== 'string' || !entry.path.startsWith('/') || entry.path.startsWith('//') || entry.path.length > 16000) return null;
    keys.add(entry.key);
  }
  return { entries: entries.map(({ key, path }) => ({ key, path })) };
}
