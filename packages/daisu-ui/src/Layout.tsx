import { createContext, useContext } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';

const GutterContext = createContext(0);
const justifyValues = { start: 'flex-start', center: 'center', end: 'flex-end', 'space-between': 'space-between', 'space-around': 'space-around', 'space-evenly': 'space-evenly' } as const;
const alignValues = { top: 'flex-start', middle: 'center', bottom: 'flex-end' } as const;

export type RowProps = {
  gutter?: number;
  justify?: keyof typeof justifyValues;
  align?: keyof typeof alignValues;
  className?: string;
  children?: ReactNode;
};
export type ColProps = { span?: number; offset?: number; className?: string; children?: ReactNode };

/** A 24-column layout. Each nested Row owns its gutter independently. */
export function Row({ gutter = 0, justify = 'start', align = 'top', className = '', children }: RowProps) {
  const spacing = Number.isFinite(gutter) ? Math.max(0, gutter) : 0;
  return <GutterContext.Provider value={spacing}><view className={`ui-row ${className}`} style={{ marginLeft: `${-spacing / 2}px`, marginRight: `${-spacing / 2}px`, justifyContent: justifyValues[justify], alignItems: alignValues[align] }}>{children}</view></GutterContext.Provider>;
}

export function Col({ span = 24, offset = 0, className = '', children }: ColProps) {
  const gutter = useContext(GutterContext);
  const columns = (value: number, fallback: number) => Number.isFinite(value) ? Math.max(0, Math.min(24, value)) : fallback;
  return <view className={`ui-col ${className}`} style={{ width: `${columns(span, 24) / 24 * 100}%`, marginLeft: `${columns(offset, 0) / 24 * 100}%`, paddingLeft: `${gutter / 2}px`, paddingRight: `${gutter / 2}px` }}>{children}</view>;
}
