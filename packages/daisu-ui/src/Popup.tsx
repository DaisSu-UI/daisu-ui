import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Overlay } from './Overlay.js';
import type { LayerLifecycle } from './Overlay.js';
import { Transition } from './Transition.js';
import type { TransitionName } from './Transition.js';
import { RootPortal } from './RootPortal.js';
import { LayerCloseButton } from './LayerCloseButton.js';

export type PopupPosition = 'center' | 'top' | 'right' | 'bottom' | 'left';
export type PopupCloseReason = 'modal' | 'close';
export type PopupProps = LayerLifecycle & {
  show?: boolean;
  onChange?: (show: boolean) => void;
  onClose?: (reason: PopupCloseReason) => void;
  onClickModal?: () => void;
  position?: PopupPosition;
  transition?: TransitionName | readonly TransitionName[];
  duration?: number | boolean;
  closable?: boolean;
  /** Optional heading, aligned left with space reserved for the close control. */
  title?: ReactNode;
  closeOnClickModal?: boolean;
  modal?: boolean;
  modalStyle?: CSSProperties;
  zIndex?: number;
  lazyRender?: boolean;
  lockScroll?: boolean;
  rootPortal?: boolean;
  round?: boolean;
  safeAreaInsetBottom?: boolean;
  safeAreaBottom?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const motions = { center: ['fade', 'zoom-in'], top: 'slide-down', right: 'slide-right', bottom: 'slide-up', left: 'slide-left' } as const;

export function Popup({ show = false, onChange, onClose, onClickModal, position = 'center', transition, duration = 300, closable = false, title, closeOnClickModal = true, modal = true, modalStyle, zIndex = 10, lazyRender = true, lockScroll = true, rootPortal = false, round = false, safeAreaInsetBottom = false, safeAreaBottom = 0, className = '', style, children, ...lifecycle }: PopupProps) {
  const close = (reason: PopupCloseReason) => {
    'background only';
    if (!show) return;
    onChange?.(false);
    onClose?.(reason);
  };
  const layer = <>
    {modal ? <Overlay show={show} duration={duration} lockScroll={lockScroll} zIndex={zIndex} style={modalStyle} onTap={() => { 'background only'; onClickModal?.(); if (closeOnClickModal) close('modal'); }} /> : null}
    <view className={`ui-popup-anchor ui-popup-anchor-${position}`} style={{ zIndex: zIndex + 1 }}>
      <Transition {...lifecycle} show={show} name={transition ?? motions[position]} duration={duration} lazyRender={lazyRender} destroy={false} interactiveDuringLeave className={`ui-popup ui-popup-${position} ${round ? 'ui-popup-round' : ''} ${className}`} style={style}>
        <view className="ui-popup-body" event-through={false} consume-slide-event={lockScroll ? [[-180, 180]] : undefined} catchtouchmove={lockScroll ? () => {} : undefined} catchtap={() => {}}>
          {title != null && title !== false ? <view className={`ui-popup-header ${closable ? 'ui-popup-header-closable' : ''}`}>
            {typeof title === 'string' || typeof title === 'number' ? <text className="ui-popup-title">{title}</text> : title}
          </view> : null}
          {children}
          {safeAreaInsetBottom && position === 'bottom' ? <view className="ui-popup-safe-area" style={{ height: `${Math.max(0, Number.isFinite(safeAreaBottom) ? safeAreaBottom : 0)}px` }} /> : null}
          {closable ? <LayerCloseButton show={show} className="ui-popup-close" label="关闭弹出层" onClose={() => { 'background only'; close('close'); }} /> : null}
        </view>
      </Transition>
    </view>
  </>;
  return rootPortal ? <RootPortal>{layer}</RootPortal> : layer;
}
