import { useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { Badge } from './Badge.js';
import type { BadgeProps } from './Badge.js';
import { createSidebarGuard, sidebarBadge } from './sidebarModel.js';
import type { SidebarBeforeChange, SidebarValue } from './sidebarModel.js';

export type SidebarBadgeProps = Omit<BadgeProps, 'children'>;
export type SidebarItem = {
  value: SidebarValue;
  label: string;
  disabled?: boolean;
  icon?: string;
  renderIcon?: (state: { active: boolean; disabled: boolean }) => ReactNode;
  badge?: string | number;
  isDot?: boolean;
  max?: number;
  badgeProps?: SidebarBadgeProps;
  className?: string;
  style?: CSSProperties;
};
export type SidebarProps = {
  items: readonly SidebarItem[];
  value?: SidebarValue;
  defaultValue?: SidebarValue;
  beforeChange?: SidebarBeforeChange;
  onChange?: (event: { value: SidebarValue; label: string }) => void;
  className?: string;
  style?: CSSProperties;
};

export function Sidebar({ items, value, defaultValue = 0, beforeChange, onChange, className = '', style }: SidebarProps) {
  const [inner, setInner] = useState(defaultValue);
  const selected = value ?? inner;
  const activeIndex = items.findIndex(item => item.value === selected);
  const guard = useRef(createSidebarGuard());
  const identity = JSON.stringify(items.map(item => [item.value, item.label, !!item.disabled]));
  useEffect(() => { guard.current.cancel(); }, [selected, identity, value]);
  useEffect(() => () => guard.current.cancel(), []);
  const change = (item: SidebarItem) => {
    'background only';
    if (item.disabled) return;
    if (item.value === selected) { guard.current.cancel(); return; }
    void guard.current.request(item.value, beforeChange, () => {
      'background only';
      if (value === undefined) setInner(item.value);
      onChange?.({ value: item.value, label: item.label });
    });
  };
  return <view className={`ui-sidebar ${className}`} style={style}>
    {items.map((item, index) => {
      const active = index === activeIndex;
      const disabled = !!item.disabled;
      const badge = sidebarBadge(item.badge, item.badgeProps?.max ?? item.max);
      return <view key={`${typeof item.value}:${item.value}`} className={`ui-sidebar-item ${active ? 'ui-sidebar-active' : ''} ${disabled ? 'ui-sidebar-disabled' : ''} ${activeIndex >= 0 && index === activeIndex - 1 ? 'ui-sidebar-prefix' : ''} ${activeIndex >= 0 && index === activeIndex + 1 ? 'ui-sidebar-suffix' : ''} ${item.className ?? ''}`} style={item.style} accessibility-element accessibility-traits={disabled ? 'disabled' : 'button'} accessibility-label={`${item.label}${active ? '，已选中' : ''}${disabled ? '，已禁用' : ''}`} bindtap={() => { 'background only'; change(item); }}>
        {active ? <view className="ui-sidebar-indicator" /> : null}
        {item.renderIcon || item.icon ? <view className="ui-sidebar-icon">{item.renderIcon ? item.renderIcon({ active, disabled }) : <><Icon className="ui-sidebar-icon-light" name={item.icon!} size={18} color={disabled ? 'var(--cso-ui-disabled-text)' : active ? 'var(--cso-ui-primary)' : 'var(--cso-ui-text-regular)'} /><Icon className="ui-sidebar-icon-dark" name={item.icon!} size={18} color={disabled ? 'var(--cso-ui-disabled-text)' : active ? 'var(--cso-ui-primary)' : 'var(--cso-ui-text-regular)'} /></>}</view> : null}
        <Badge value={badge} max={item.max ?? 99} isDot={item.isDot} showZero {...item.badgeProps} className={`ui-sidebar-label-wrap ${item.badgeProps?.className ?? ''}`}><text className="ui-sidebar-label">{item.label}</text></Badge>
      </view>;
    })}
  </view>;
}
