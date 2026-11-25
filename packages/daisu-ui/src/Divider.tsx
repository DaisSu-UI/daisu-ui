import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';

export type DividerAlign = 'left' | 'center' | 'right';
export type DividerProps = {
  children?: ReactNode;
  label?: string;
  align?: DividerAlign;
  contentPosition?: DividerAlign;
  color?: string;
  hairline?: boolean;
  dashed?: boolean;
  vertical?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Divider({ children, label, align = 'center', contentPosition = align, color, hairline = true, dashed = false, vertical = false, className = '', style }: DividerProps) {
  const content = children ?? label;
  const hasContent = !vertical && content !== undefined && content !== null && content !== false && content !== '';
  const line = <view className="ui-divider-line" />;
  return <view className={`ui-divider ui-divider-${contentPosition} ${hasContent ? 'ui-divider-with-content' : ''} ${hairline ? 'ui-divider-hairline' : ''} ${dashed ? 'ui-divider-dashed' : ''} ${vertical ? 'ui-divider-vertical' : ''} ${className}`} style={style}>
    {line}
    {hasContent ? <><view className="ui-divider-content">{typeof content === 'string' || typeof content === 'number' ? <text className="ui-divider-label" style={{ color }}>{content}</text> : content}</view><view className="ui-divider-line" /></> : null}
  </view>;
}
