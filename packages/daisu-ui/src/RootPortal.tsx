import { createContext, createPortal, useCallback, useContext, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import { ConfigContext } from './configContext.js';
import type { NodesRef } from '@lynx-js/types';
import { PopupStackProvider } from './popupLayer.js';

const PortalTarget = createContext<NodesRef | null | undefined>(undefined);

export type RootPortalHostProps = { children?: ReactNode };
export type RootPortalProps = { children?: ReactNode };

/** Place once inside the page root, above transformed/clipped layout containers. */
export function RootPortalHost({ children }: RootPortalHostProps) {
  const [target, setTarget] = useState<NodesRef | null>(null);
  const attach = useCallback((node: NodesRef | null) => { 'background only'; setTarget(node); }, []);
  return <PopupStackProvider><PortalTarget.Provider value={target}>{children}<view className="ui-root-portal-target" flatten={false} ref={attach} /></PortalTarget.Provider></PopupStackProvider>;
}

export function useHasRootPortal() { return useContext(PortalTarget) !== undefined; }

/** Uses ReactLynx's native portal; no DOM or fixed-position fallback. */
export function RootPortal({ children }: RootPortalProps) {
  const target = useContext(PortalTarget), config = useContext(ConfigContext);
  if (target === undefined) throw new Error('RootPortal requires a RootPortalHost at the page root.');
  return target ? createPortal(config ? <ConfigContext.Provider value={config}><view className={`ui-config-portal theme-${config.theme}`} style={config.tokens}>{children}</view></ConfigContext.Provider> : children, target) : null;
}
