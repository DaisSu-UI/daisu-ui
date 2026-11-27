import { createContext, useContext, useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';

type Layers = Map<object, number>;
const StackContext = createContext<Layers | undefined>(undefined);
export const PopupParentContext = createContext<number | undefined>(undefined);

/** One stack per native portal host; opening a layer never lowers an existing layer. */
export function PopupStackProvider({ children }: { children?: ReactNode }) {
  const [layers] = useState<Layers>(() => new Map());
  return <StackContext.Provider value={layers}>{children}</StackContext.Provider>;
}

export function usePopupLayer(show: boolean, minimum: number) {
  const layers = useContext(StackContext), parent = useContext(PopupParentContext);
  const token = useRef({});
  const base = Math.max(Number.isFinite(minimum) ? minimum : 10, parent === undefined ? 0 : parent + 2);
  const [allocated, setAllocated] = useState(base);
  useEffect(() => {
    if (!show) return;
    let next = base;
    layers?.forEach((layer, key) => { if (key !== token.current) next = Math.max(next, layer + 2); });
    layers?.set(token.current, next);
    setAllocated(next);
    // Keep the reservation through the leave animation, until release().
  }, [show, base, layers]);
  useEffect(() => () => { layers?.delete(token.current); }, [layers]);
  const release = () => { 'background only'; layers?.delete(token.current); };
  return { layer: Math.max(base, allocated), nested: parent !== undefined, release };
}
