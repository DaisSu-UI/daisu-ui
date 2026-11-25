import { useState } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';

export type SortButtonValue = -1 | 0 | 1;
export type SortButtonProps = {
  value?: SortButtonValue;
  defaultValue?: SortButtonValue;
  title?: string;
  allowReset?: boolean;
  descFirst?: boolean;
  line?: boolean;
  onChange?: (event: { value: SortButtonValue }) => void;
  className?: string;
  style?: CSSProperties;
};

export function SortButton({ value, defaultValue = 0, title = '', allowReset = false, descFirst = false, line = false, onChange, className = '', style }: SortButtonProps) {
  const [inner, setInner] = useState<SortButtonValue>(defaultValue);
  const current = value ?? inner;
  const toggle = () => {
    'background only';
    const first = descFirst ? -1 : 1;
    const next: SortButtonValue = current === 0 ? first : current === first ? (first === 1 ? -1 : 1) : allowReset ? 0 : first;
    if (value === undefined) setInner(next);
    onChange?.({ value: next });
  };
  const arrow = (name: string, active: boolean) => <view className={`ui-sort-button-arrow ${active ? 'ui-sort-button-arrow-active' : ''}`}><view className={`ui-sort-button-caret ui-sort-button-${name}`} /></view>;
  return <view className={`ui-sort-button ${current ? 'ui-sort-button-active' : ''} ${line ? 'ui-sort-button-line' : ''} ${className}`} style={style} bindtap={toggle} accessibility-element accessibility-traits="button" accessibility-label={`${title}，${current === 1 ? '升序' : current === -1 ? '降序' : '未排序'}`}>
    <text className="ui-sort-button-title">{title}</text>
    <view className="ui-sort-button-arrows">{arrow('caret-up', current === 1)}{arrow('caret-down', current === -1)}</view>
    {line && current ? <view className="ui-sort-button-indicator" /> : null}
  </view>;
}
