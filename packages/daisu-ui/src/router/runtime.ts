import { AbortController, AbortSignal } from 'abort-controller';

if (typeof globalThis.AbortController !== 'function') {
  Object.defineProperty(globalThis, 'AbortController', {
    value: AbortController,
    writable: true,
    configurable: true,
  });
}
if (typeof globalThis.AbortSignal !== 'function') {
  Object.defineProperty(globalThis, 'AbortSignal', {
    value: AbortSignal,
    writable: true,
    configurable: true,
  });
}

// TanStack's client build writes self.__TSR_ROUTER__ during construction.
// Lynx has globalThis on both threads, but the main thread has no browser self.
// Keep existing browser/worker globals intact and do not introduce DOM globals.
if (typeof globalThis.self === 'undefined') {
  Object.defineProperty(globalThis, 'self', {
    value: globalThis,
    writable: true,
    configurable: true,
  });
}
