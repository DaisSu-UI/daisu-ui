import { useLocale } from './useLocale.js';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { Transition } from './Transition.js';

export type BacktopRequest = { duration: number };
export type BacktopProps = {
  scrollTop: number;
  onBacktop: (request: BacktopRequest) => void;
  top?: number;
  duration?: number;
  zIndex?: number;
  bottom?: number;
  right?: number;
  shape?: 'circle' | 'square';
  text?: string;
  iconStyle?: CSSProperties;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Scrolling belongs to the caller's scroll-view/List/host, never the global page. */
export function Backtop({ scrollTop, onBacktop, top = 300, duration = 100, zIndex = 10, bottom = 100, right = 20, shape = 'circle', text, iconStyle, children, className = '', style }: BacktopProps) {
  const { t: localeText } = useLocale();

  const visible = Number.isFinite(scrollTop) && scrollTop > top;
  const activate = () => {
    'background only';
    if (visible) onBacktop({ duration: Number.isFinite(duration) ? Math.max(0, duration) : 100 });
  };
  return <view className="ui-backtop-position" style={{ bottom: `${bottom}px`, right: `${right}px`, zIndex }}>
    <Transition show={visible} name="fade" lazyRender>
      <view className={`ui-backtop ui-backtop-${shape} ${className}`} style={style} bindtap={activate} accessibility-element accessibility-traits="button" accessibility-label={text || localeText('backtop.label')}>
        {children ?? <view className="ui-backtop-content"><view style={iconStyle}><Icon name="to-top" size={20} color={typeof iconStyle?.color === 'string' ? iconStyle.color : undefined} /></view>{text ? <text className="ui-backtop-text" style={{ color: style?.color }}>{text}</text> : null}</view>}
      </view>
    </Transition>
  </view>;
}
