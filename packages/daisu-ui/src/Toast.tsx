import { useEffect, useRef } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { Loading } from './Loading.js';
import { Overlay } from './Overlay.js';
import { RootPortal } from './RootPortal.js';
import { Transition } from './Transition.js';

export type ToastIconType = 'success' | 'error' | 'warning' | 'loading' | 'info';
export type ToastDirection = 'horizontal' | 'vertical';
export type ToastPosition = 'top' | 'middle-top' | 'middle' | 'bottom';
export type ToastLoadingType = 'circular' | 'spinner' | 'dots';
export type ToastOptions = {
  msg?: string;
  duration?: number;
  direction?: ToastDirection;
  iconName?: ToastIconType;
  iconSize?: number;
  loadingType?: ToastLoadingType;
  loadingColor?: string;
  loadingSize?: number;
  iconColor?: string;
  position?: ToastPosition;
  zIndex?: number;
  cover?: boolean;
  /** A public Icon name or image URL, rather than an iconfont class. */
  iconClass?: string;
  iconNode?: ReactNode;
  opened?: () => void;
  closed?: () => void;
};
export type ToastProps = ToastOptions & {
  show?: boolean;
  onChange?: (show: boolean) => void;
  /** Call options override the defaults provided directly as component props. */
  options?: ToastOptions;
  requestKey?: number;
  rootPortal?: boolean;
  className?: string;
  style?: CSSProperties;
};

const icons: Record<Exclude<ToastIconType, 'loading'>, string> = { success: 'check-circle', error: 'close-circle', warning: 'exclamation-circle', info: 'info-circle' };

export function Toast({ show = false, onChange, options, requestKey = 0, rootPortal = false, className = '', style, ...defaults }: ToastProps) {
  const settings = { ...defaults, ...options };
  const { msg = '', duration = 2000, direction = 'horizontal', iconName, iconClass, iconNode, iconSize = 24, loadingType = 'circular', loadingColor = '#ffffff', loadingSize = 24, iconColor = '#ffffff', position = 'middle', zIndex = 100, cover = false, opened, closed } = settings;
  const callbacks = useRef({ onChange, opened, closed });
  callbacks.current = { onChange, opened, closed };
  useEffect(() => {
    if (!show || !Number.isFinite(duration) || duration <= 0) return;
    const timer = setTimeout(() => callbacks.current.onChange?.(false), duration);
    return () => clearTimeout(timer);
  }, [show, requestKey, duration]);
  const icon = iconNode ?? (iconClass ? <Icon name={iconClass} size={iconSize} color={iconColor} /> : iconName === 'loading' ? <Loading size={loadingSize} type={loadingType} color={loadingColor} /> : iconName ? <Icon name={icons[iconName]} size={iconSize} color={iconColor} /> : null);
  const layer = <>
    {cover ? <Overlay show={show} duration={200} zIndex={zIndex} style={{ backgroundColor: 'transparent' }} /> : null}
    <view className={`ui-toast-position ui-toast-position-${position}`} style={{ zIndex: zIndex + 1 }} event-through>
      <Transition show={show} name="fade" duration={200} lazyRender destroy={false} className={`ui-toast ui-toast-${direction} ${icon ? 'ui-toast-with-icon' : ''} ${className}`} style={style} onAfterEnter={() => callbacks.current.opened?.()} onAfterLeave={() => callbacks.current.closed?.()}>
        {icon ? <view className="ui-toast-icon">{icon}</view> : null}
        {msg ? <text className="ui-toast-msg" accessibility-element accessibility-label={msg}>{msg}</text> : null}
      </Transition>
    </view>
  </>;
  return rootPortal ? <RootPortal>{layer}</RootPortal> : layer;
}
