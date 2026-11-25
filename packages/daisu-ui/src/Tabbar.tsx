import { useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import { Icon } from './Icon.js';
import { Badge } from './Badge.js';
import type { BadgeProps } from './Badge.js';
import { createTabbarGuard, tabbarBadge } from './tabbarModel.js';
import type { TabbarBeforeChange, TabbarValue } from './tabbarModel.js';

export type TabbarItem = {
  name?: TabbarValue;
  title?: string;
  icon?: string;
  value?: string | number;
  isDot?: boolean;
  max?: number;
  badgeProps?: Omit<BadgeProps, 'children'>;
  renderIcon?: (state: { active: boolean }) => ReactNode;
  children?: ReactNode;
  className?: string;
};
export type TabbarProps = {
  items: readonly TabbarItem[];
  value?: TabbarValue;
  defaultValue?: TabbarValue;
  onChange?: (event: { value: TabbarValue }) => void;
  beforeChange?: TabbarBeforeChange;
  fixed?: boolean;
  placeholder?: boolean;
  bordered?: boolean;
  safeAreaInsetBottom?: boolean;
  bottomSafeAreaHeight?: number;
  shape?: 'default' | 'round';
  activeColor?: string;
  inactiveColor?: string;
  zIndex?: number;
  className?: string;
};

export function Tabbar({ items, value, defaultValue = 0, onChange, beforeChange, fixed = false, placeholder = false, bordered = false, safeAreaInsetBottom = false, bottomSafeAreaHeight = 0, shape = 'default', activeColor, inactiveColor, zIndex = 10, className = '' }: TabbarProps) {
  const [inner, setInner] = useState(defaultValue);
  const selected = value ?? inner;
  const guard = useRef(createTabbarGuard());
  const names = JSON.stringify(items.map((item, index) => item.name ?? index));
  useEffect(() => { guard.current.cancel(); }, [selected, names]);
  useEffect(() => () => guard.current.cancel(), []);
  const change = (next: TabbarValue) => {
    'background only';
    if (next === selected) { guard.current.cancel(); return; }
    void guard.current.request(next, beforeChange, () => {
      'background only';
      if (value === undefined) setInner(next);
      onChange?.({ value: next });
    });
  };
  const safe = safeAreaInsetBottom && Number.isFinite(bottomSafeAreaHeight) ? Math.max(0, bottomSafeAreaHeight) : 0;
  const bar = <view className={`ui-tabbar ${shape === 'round' ? 'ui-tabbar-round' : bordered ? 'ui-tabbar-bordered' : ''} ${fixed ? 'ui-tabbar-fixed' : ''} ${className}`} style={{ height: `${50 + (fixed && shape === 'default' ? safe : 0)}px`, paddingBottom: `${fixed && shape === 'default' ? safe : 0}px`, ...(fixed ? { bottom: `${shape === 'round' ? safe : 0}px`, zIndex } : {}) }}>
    {items.map((item, index) => {
      const name = item.name ?? index;
      const active = name === selected;
      const color = active ? activeColor : inactiveColor;
      const badge = tabbarBadge(item.value, item.badgeProps?.max ?? item.max);
      return <view key={`${typeof name}:${name}`} className={`ui-tabbar-item ${active ? 'ui-tabbar-item-active' : ''} ${item.className ?? ''}`} accessibility-element accessibility-traits="button" accessibility-label={`${item.title ?? '标签'}${active ? '，已选中' : ''}`} bindtap={() => { 'background only'; change(name); }}>
        {item.children ?? <view className="ui-tabbar-item-body">
          <Badge value={badge} max={item.max ?? 99} isDot={item.isDot} showZero {...item.badgeProps} className={`ui-tabbar-item-icon ${item.badgeProps?.className ?? ''}`}>
            {item.renderIcon ? item.renderIcon({ active }) : item.icon ? color ? <Icon name={item.icon} size={24} color={color} /> : active ? <><Icon className="ui-tabbar-icon-light" name={item.icon} size={24} color="#f86100" /><Icon className="ui-tabbar-icon-dark" name={item.icon} size={24} color="#ff812e" /></> : <Icon name={item.icon} size={24} /> : null}
          </Badge>
          {item.title ? <text className="ui-tabbar-item-title" style={color ? { color } : undefined}>{item.title}</text> : null}
        </view>}
      </view>;
    })}
  </view>;
  return <>{fixed && placeholder ? <view className="ui-tabbar-placeholder" style={{ height: `${50 + safe}px` }} /> : null}{bar}</>;
}
