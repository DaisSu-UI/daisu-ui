import { isValidElement } from '@lynx-js/react';

const textFields = new Set(['title', 'label', 'description', 'text', 'msg', 'message', 'placeholder', 'inputError', 'confirmButtonText', 'cancelButtonText', 'loadingText', 'emptyText', 'tip', 'backText', 'homeText']);
const nestedFields = new Set(['options', 'actions', 'items', 'panels', 'columns', 'children', 'inputProps', 'confirmButtonProps', 'cancelButtonProps']);

/** Translate presentation fields only. Values, IDs, callbacks and user input retain their identity. */
export function createDemoCopy(t: (text: string) => string) {
  const cache = new WeakMap<object, unknown>();
  function copy<T>(value: T): T {
    if (!value || typeof value !== 'object' || isValidElement(value)) return value;
    if (cache.has(value)) return cache.get(value) as T;
    if (Array.isArray(value)) {
      const next = value.map(item => typeof item === 'object' ? copy(item) : item);
      const result = next.some((item, index) => item !== value[index]) ? next : value;
      cache.set(value, result);
      return result as T;
    }
    if (Object.getPrototypeOf(value) !== Object.prototype) return value;
    let changed = false;
    const result = { ...value } as Record<string, unknown>;
    for (const key of Object.keys(result)) {
      const before = result[key];
      const after = textFields.has(key) && typeof before === 'string' ? t(before) : nestedFields.has(key) ? copy(before) : before;
      if (before !== after) { result[key] = after; changed = true; }
    }
    const output = changed ? result : value;
    cache.set(value, output);
    return output as T;
  }
  return copy;
}
