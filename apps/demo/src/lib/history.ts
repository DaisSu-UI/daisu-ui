import { parseRouterHistoryState } from '@daisu-ui/ui/router';
import type { RouterHistoryAdapter } from '@daisu-ui/ui/router';
export function createDemoHistory(): RouterHistoryAdapter {
  'background only';
  const emitter = lynx.getJSModule('GlobalEventEmitter');
  return {
    write(state, action) { 'background only'; NativeModules.DemoBridge.postMessage(JSON.stringify({ state, action })); },
    subscribe(listener) {
      'background only';
      const receive = (value: unknown) => { 'background only'; const state = parseRouterHistoryState(value); if (state) listener(state); };
      emitter.addListener('demo.navigation', receive);
      return () => emitter.removeListener('demo.navigation', receive);
    },
  };
}
