import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { badgeLabel, badgeOffset } from './badgeModel.js';

export type BadgeProps = {
  value?: string | number;
  max?: number;
  top?: string | number;
  right?: string | number;
  isDot?: boolean;
  hidden?: boolean;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  bgColor?: string;
  showZero?: boolean;
  shape?: 'circle' | 'square' | 'bubble';
  border?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Badge({ value, max, top, right, isDot = false, hidden = false, type = 'danger', bgColor, showZero = false, shape = 'circle', border = false, children, className = '', style }: BadgeProps) {
  const label = badgeLabel(value, max, showZero);
  const fixed = children !== undefined && children !== null && children !== false;
  return <view className={`ui-badge ${className}`} style={style}>
    {typeof children === 'string' || typeof children === 'number' ? <text>{children}</text> : children}
    {!hidden && (isDot || label !== null) ? <view className={`ui-badge-content ui-badge-${type} ui-badge-${shape} ${fixed ? 'ui-badge-fixed' : ''} ${isDot ? 'ui-badge-dot' : ''} ${border ? 'ui-badge-bordered' : ''}`} style={{ top: badgeOffset(top), right: badgeOffset(right), backgroundColor: bgColor }}>
      {isDot ? null : <text className="ui-badge-label">{label}</text>}
    </view> : null}
  </view>;
}
