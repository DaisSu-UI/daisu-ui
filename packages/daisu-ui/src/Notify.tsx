import { useEffect, useRef } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, TouchEvent } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { RootPortal } from './RootPortal.js';
import { Transition } from './Transition.js';
import { useConfigProvider } from './configContext.js';
export type NotifyType = 'primary' | 'success' | 'warning' | 'danger';
export type NotifyPosition = 'top' | 'bottom';
export type NotifyVariant = 'filled' | 'floating';
export type NotifyOptions = {
  type?: NotifyType; message?: string | number; duration?: number; position?: NotifyPosition;
  color?: string; background?: string; zIndex?: number; safeHeight?: number | string; safeAreaBottom?: number;
  rootPortal?: boolean; closable?: boolean; variant?: NotifyVariant; className?: string; style?: CSSProperties;
  onClick?: (event: TouchEvent) => void; onOpened?: () => void; onClosed?: () => void;
};
export type NotifyProps = NotifyOptions & {
  visible?: boolean; onChange?: (visible: boolean) => void; requestKey?: number; options?: NotifyOptions;
  children?: ReactNode; prefix?: ReactNode; renderClose?: (close: () => void) => ReactNode;
};
function safeLength(value: number | string): string {
  if (typeof value === 'number') return `${Number.isFinite(value) ? Math.max(0,value) : 0}px`;
  const text = value.trim(); if (/^-?\d+(\.\d+)?$/.test(text)) return `${Math.max(0,Number(text))}px`;
  const rpx = /^(-?\d+(\.\d+)?)rpx$/.exec(text); return rpx ? `${Math.max(0,Number(rpx[1])) / 7.5}vw` : text || '0px';
}
const icons = { primary:'info-circle-fill', success:'check-circle-fill', danger:'close-circle-fill', warning:'exclamation-circle-fill' };
const palette = { primary:['#1c64fd','#5b90ff'], success:['#12b886','#20c997'], danger:['#f14646','#ff6b6b'], warning:['#f57f00','#ffa94d'] };
export function Notify({ visible = false, onChange, requestKey = 0, options, children, prefix, renderClose, ...defaults }: NotifyProps) {
  const { type = 'danger', message = '', duration = 3000, position = 'top', color, background, zIndex = 99, safeHeight = 0, safeAreaBottom = 0, rootPortal = false, closable = false, variant = 'filled', className = '', style, onClick, onOpened, onClosed } = { ...defaults, ...options };
  const config = useConfigProvider(), callbacks = useRef({ onChange, onClick, onOpened, onClosed }), closing = useRef(false);
  callbacks.current = { onChange, onClick, onOpened, onClosed };
  const close = () => { 'background only'; if (!visible || closing.current) return; closing.current = true; callbacks.current.onChange?.(false); };
  useEffect(() => {
    closing.current = false;
    if (!visible || !Number.isFinite(duration) || duration <= 0) return;
    const timer = setTimeout(close,duration); return () => clearTimeout(timer);
  }, [visible,requestKey,duration]);
  const statusColor = config.tokens[`--cso-ui-${type}`] ?? palette[type][config.theme === 'dark' ? 1 : 0]!;
  const foreground = color ?? (variant === 'floating' ? config.tokens['--cso-ui-text'] ?? (config.theme === 'dark' ? '#f7f8fa' : '#1d1f29') : statusColor);
  const floating = variant === 'floating';
  const layer = <view className={`ui-notify-anchor ui-notify-anchor-${position} ${floating ? 'ui-notify-anchor-floating' : ''}`} style={{ zIndex, ...(position === 'top' ? { top:safeLength(safeHeight) } : { bottom:`${Number.isFinite(safeAreaBottom) ? Math.max(0,safeAreaBottom) : 0}px` }) }} event-through>
    <Transition show={visible} name={position === 'top' ? 'slide-down' : 'slide-up'} duration={300} lazyRender destroy={false} className={`ui-notify ui-notify-${type} ${floating ? 'ui-notify-floating' : ''} ${className}`} style={{ color, backgroundColor:background, ...style }} onAfterEnter={() => callbacks.current.onOpened?.()} onAfterLeave={() => callbacks.current.onClosed?.()}>
      <view className="ui-notify-body" bindtap={event => { 'background only'; if (visible && !closing.current) callbacks.current.onClick?.(event); }} accessibility-element={children === undefined || typeof children === 'string'} accessibility-label={children === undefined ? String(message) : typeof children === 'string' ? children : undefined}>
        {prefix === null ? null : <view className="ui-notify-prefix">{prefix ?? <Icon name={icons[type]} size={18} color={color ?? statusColor} />}</view>}
        <view className="ui-notify-content">{children ?? <text className="ui-notify-message" text-maxline="1" text-overflow="ellipsis">{String(message)}</text>}</view>
        {closable ? <view className="ui-notify-close" catchtap={close} accessibility-element accessibility-traits="button" accessibility-label="关闭通知">{renderClose ? renderClose(close) : <Icon name="close" size={18} color={foreground} />}</view> : null}
      </view>
    </Transition>
  </view>;
  return rootPortal ? <RootPortal>{layer}</RootPortal> : layer;
}
