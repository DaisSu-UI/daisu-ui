import { useLocale } from './useLocale.js';
import { useEffect, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { LayoutChangeEvent } from '@lynx-js/types';
import { Icon } from './Icon.js';

export type CollapseItemData = {
  name: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  beforeExpand?: (name: string) => boolean | Promise<boolean>;
};

export type CollapseProps = {
  items: CollapseItemData[];
  value?: string[];
  defaultValue?: string[];
  accordion?: boolean;
  className?: string;
  onChange?: (value: string[]) => void;
};

export function CollapseItem({ title, content, icon, expanded, disabled = false, last = false, onToggle }: CollapseItemData & { expanded: boolean; last?: boolean; onToggle: () => void }) {
  const [contentHeight, setContentHeight] = useState<number>();
  const measureContent = (event: LayoutChangeEvent) => {
    'background only';
    const height = event.detail.height;
    if (Number.isFinite(height) && height >= 0) {
      setContentHeight(previous => previous !== undefined && Math.abs(previous - height) < 0.5 ? previous : height);
    }
  };
  const toggle = () => {
    'background only';
    if (!disabled) onToggle();
  };
  return <view className={`ui-collapse-item ${expanded ? 'ui-collapse-item-expanded' : ''} ${disabled ? 'ui-collapse-item-disabled' : ''} ${last ? 'ui-collapse-item-last' : ''}`}>
    <view className="ui-collapse-header" bindtap={toggle}>
      {icon ? typeof icon === 'string' ? <text className="ui-collapse-icon">{icon}</text> : <view className="ui-collapse-icon">{icon}</view> : null}
      <text className="ui-collapse-title">{title}</text>
      <view className="ui-collapse-chevron"><Icon name="down" size={24} color="var(--cso-ui-text-muted)" /></view>
    </view>
    <view className="ui-collapse-region" style={{ height: expanded ? contentHeight === undefined ? 'auto' : `${contentHeight}px` : '0px' }} user-interaction-enabled={expanded}>
      <view className="ui-collapse-body" bindlayoutchange={measureContent}>{content}</view>
    </view>
  </view>;
}

/** Controlled or uncontrolled multi-panel collapse with optional accordion mode. */
export function Collapse({ items, value, defaultValue = [], accordion = false, className = '', onChange }: CollapseProps) {
  const [innerValue, setInnerValue] = useState<string[]>(defaultValue);
  const expanded = value ?? innerValue;
  useEffect(() => { if (value !== undefined) setInnerValue(value); }, [value?.join('|')]);
  const toggle = async (item: CollapseItemData) => {
    'background only';
    const open = !expanded.includes(item.name);
    if (open && item.beforeExpand && !(await item.beforeExpand(item.name))) return;
    const next = open ? (accordion ? [item.name] : [...expanded, item.name]) : expanded.filter(name => name !== item.name);
    if (value === undefined) setInnerValue(next);
    onChange?.(next);
  };
  return <view className={`ui-collapse ${className}`}>{items.map((item, index) => <CollapseItem key={item.name} {...item} last={index === items.length - 1} expanded={expanded.includes(item.name)} onToggle={() => { 'background only'; void toggle(item); }} />)}</view>;
}

export function CollapseViewMore({ text, value, defaultValue = false, lineCount = 2, onChange }: { text: string; value?: boolean; defaultValue?: boolean; lineCount?: number; onChange?: (value: boolean) => void }) {
  const { t: localeText } = useLocale();

  const [innerValue, setInnerValue] = useState(defaultValue);
  const expanded = value ?? innerValue;
  useEffect(() => { if (value !== undefined) setInnerValue(value); }, [value]);
  const toggle = () => {
    'background only';
    const next = !expanded;
    if (value === undefined) setInnerValue(next);
    onChange?.(next);
  };
  return <view className="ui-collapse-view-more"><text className="ui-collapse-view-more-text" text-maxline={expanded ? undefined : String(lineCount)} text-overflow={expanded ? undefined : 'ellipsis'}>{text}</text><view className="ui-collapse-view-more-action" bindtap={toggle}><text>{expanded ? localeText('collapse.collapse') : localeText('collapse.more')} {expanded ? '⌃' : '⌄'}</text></view></view>;
}
