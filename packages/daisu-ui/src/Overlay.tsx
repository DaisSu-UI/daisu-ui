import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { RootPortal } from './RootPortal.js';
import { Transition } from './Transition.js';
import type { TransitionProps } from './Transition.js';

export type LayerLifecycle = Pick<TransitionProps, 'onBeforeEnter' | 'onEnter' | 'onAfterEnter' | 'onBeforeLeave' | 'onLeave' | 'onAfterLeave'>;
export type OverlayProps = LayerLifecycle & {
  show?: boolean;
  duration?: TransitionProps['duration'];
  lockScroll?: boolean;
  zIndex?: number;
  rootPortal?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onTap?: () => void;
};

export function Overlay({ show = false, duration = 300, lockScroll = true, zIndex = 10, rootPortal = false, children, className = '', style, onTap, ...lifecycle }: OverlayProps) {
  const layer = <Transition {...lifecycle} show={show} duration={duration} name="fade" lazyRender destroy={false} interactiveDuringLeave className={`ui-overlay ${className}`} style={{ zIndex, ...style }} onTap={() => { 'background only'; if (show) onTap?.(); }}>
    <view className="ui-overlay-content" event-through={false} consume-slide-event={lockScroll ? [[-180, 180]] : undefined} catchtouchmove={lockScroll ? () => {} : undefined}>{children}</view>
  </Transition>;
  return rootPortal ? <RootPortal>{layer}</RootPortal> : layer;
}
