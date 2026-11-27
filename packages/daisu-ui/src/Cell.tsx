import type { ReactNode } from '@lynx-js/react';
import { usePressState } from './usePressState.js';

export type CellProps = {
  title?: ReactNode;
  description?: string;
  value?: string;
  placeholder?: string;
  icon?: ReactNode;
  clickable?: boolean;
  arrow?: boolean;
  arrowDirection?: 'right' | 'left' | 'up' | 'down';
  valueAlign?: 'left' | 'center' | 'right';
  size?: 'medium' | 'large';
  center?: boolean;
  required?: boolean;
  markerSide?: 'before' | 'after';
  vertical?: boolean;
  titleWidth?: string;
  ellipsis?: boolean;
  border?: boolean;
  last?: boolean;
  className?: string;
  children?: ReactNode;
  onTap?: () => void;
};

export function Cell({ title, description, value, placeholder, icon, clickable = false, arrow = false, arrowDirection = 'right', valueAlign = 'right', size = 'medium', center = false, required = false, markerSide = 'before', vertical = false, titleWidth, ellipsis = false, border, last = false, className = '', children, onTap }: CellProps) {
  const interactive = clickable || arrow;
  const press = usePressState(interactive);
  const hasRight = value !== undefined || placeholder !== undefined || children !== undefined || arrow;
  const handleTap = () => {
    'background only';
    if (interactive) onTap?.();
  };
  return <view className={`ui-cell ui-cell-${size} ${interactive ? 'ui-cell-clickable' : ''} ${press.pressed ? 'ui-cell-pressed' : ''} ${last ? 'ui-cell-last' : ''} ${center ? 'ui-cell-center' : ''} ${vertical ? 'ui-cell-vertical' : ''} ${className}`} bindtap={handleTap} {...press.events} bindtouchmove={press.end}>
    <view className={`ui-cell-border ${border === true ? 'ui-cell-border-enabled' : border === undefined ? 'ui-cell-border-inherit' : ''}`} />
    <view className="ui-cell-wrapper">
      <view className="ui-cell-main" style={!vertical && titleWidth ? { width: titleWidth, flex: 'none' } : undefined}>
        {icon ? <view className="ui-cell-icon">{typeof icon === 'string' ? <text>{icon}</text> : icon}</view> : null}
        <view className="ui-cell-copy">
          <view className="ui-cell-title-row">
            {required && markerSide === 'before' ? <text className="ui-cell-required ui-cell-required-before">*</text> : null}
            {typeof title === 'string' || typeof title === 'number' ? <text className="ui-cell-title">{title}</text> : title}
            {required && markerSide === 'after' ? <text className="ui-cell-required">*</text> : null}
          </view>
          {description ? <text className="ui-cell-description">{description}</text> : null}
        </view>
      </view>
      {hasRight ? <view className={`ui-cell-right ui-cell-value-align-${vertical ? 'left' : valueAlign}`}>
        <view className="ui-cell-value-wrap">{children ?? <text className={`ui-cell-value ${!value && placeholder ? 'ui-cell-placeholder' : ''}`} text-maxline={ellipsis ? '1' : undefined} text-overflow={ellipsis ? 'ellipsis' : undefined}>{value || placeholder || ''}</text>}</view>
        {arrow ? <view className={`ui-cell-arrow ui-cell-arrow-${arrowDirection}`}><view className="ui-cell-arrow-mark" /></view> : null}
      </view> : null}
    </view>
  </view>;
}

export type CellGroupProps = { title?: string; value?: string; border?: boolean; insert?: boolean; className?: string; children?: ReactNode };

export function CellGroup({ title, value, border = false, insert = false, className = '', children }: CellGroupProps) {
  return <view className={`ui-cell-group ${border ? 'ui-cell-group-bordered' : ''} ${insert ? 'ui-cell-group-insert' : ''} ${className}`}>
    {title || value ? <view className="ui-cell-group-title"><text className="ui-cell-group-heading">{title}</text>{value ? <text className="ui-cell-group-value">{value}</text> : null}<view className="ui-cell-group-title-line" /></view> : null}
    <view className="ui-cell-group-body">{children}</view>
  </view>;
}
