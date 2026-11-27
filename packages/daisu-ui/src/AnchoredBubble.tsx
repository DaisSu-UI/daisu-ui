import { useLocale } from './useLocale.js';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { RootPortal } from './RootPortal.js';
import { Transition } from './Transition.js';
import { bubblePosition } from './bubblePosition.js';
import type { BubbleOffset, BubblePlacement, BubblePosition, BubbleRect } from './bubblePosition.js';

export type BubbleRef = { open: () => void; close: () => void; updatePosition: () => void };
export type AnchoredBubbleProps = {
  show?: boolean;
  defaultShow?: boolean;
  onShowChange?: (show: boolean) => void;
  onChange?: (event: { show: boolean }) => void;
  onOpen?: () => void;
  onClose?: () => void;
  placement?: BubblePlacement;
  offset?: BubbleOffset;
  visibleArrow?: boolean;
  disabled?: boolean;
  showClose?: boolean;
  duration?: number;
  zIndex?: number;
  rootPortal?: boolean;
  className?: string;
  style?: CSSProperties;
  arrowClassName?: string;
  popClassName?: string;
  popStyle?: CSSProperties;
  children?: ReactNode;
  contentNode?: ReactNode;
  kind: 'tooltip' | 'popover';
};

function measure(node: NodesRef | null): Promise<BubbleRect | undefined> {
  'background only';
  return new Promise(resolve => {
    if (!node) { resolve(undefined); return; }
    node.invoke({ method: 'boundingClientRect', params: { androidEnableTransformProps: true, iosEnableTransformProps: true }, success: (value: unknown) => {
      'background only';
      const rect = value as BubbleRect | null;
      resolve(rect && [rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) ? rect : undefined);
    }, fail: () => resolve(undefined) }).exec();
  });
}

/** Shared geometry and interaction for the public Tooltip and Popover. */
export const AnchoredBubble = forwardRef<BubbleRef, AnchoredBubbleProps>(function AnchoredBubble({ show, defaultShow = false, onShowChange, onChange, onOpen, onClose, placement = 'bottom', offset = 0, visibleArrow = true, disabled = false, showClose = false, duration = 200, zIndex = 20, rootPortal = false, className = '', style, arrowClassName = '', popClassName = '', popStyle, children, contentNode, kind }, ref) {
  const { t: localeText } = useLocale();

  const [inner, setInner] = useState(defaultShow);
  const requested = (show ?? inner) && !disabled;
  const [position, setPosition] = useState<BubblePosition>();
  const [targetRect, setTargetRect] = useState<BubbleRect>();
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const repositionTimer = useRef<ReturnType<typeof setTimeout>>();
  const target = useRef<NodesRef | null>(null);
  const content = useRef<NodesRef | null>(null);
  const viewport = useRef<NodesRef | null>(null);
  const sequence = useRef(0);
  const live = useRef({ requested, disabled, placement, offset, visibleArrow, rootPortal });
  live.current = { requested, disabled, placement, offset, visibleArrow, rootPortal };
  const callbacks = useRef({ onOpen, onClose });
  callbacks.current = { onOpen, onClose };
  const previous = useRef(false);
  const size = useRef({ width: 0, height: 0 });
  const calculatePosition = () => {
    'background only';
    if (!live.current.requested) return;
    const token = ++sequence.current;
    void Promise.all([measure(target.current), measure(content.current), measure(viewport.current)]).then(([trigger, box, bounds]) => {
      'background only';
      if (token !== sequence.current || !live.current.requested || !trigger || !box || !bounds || box.width <= 0 || box.height <= 0 || bounds.width <= 0 || bounds.height <= 0) return;
      const state = live.current;
      setTargetRect(trigger); setContentSize(previous => previous.width === box.width && previous.height === box.height ? previous : { width: box.width, height: box.height });
      setPosition(bubblePosition(trigger, box, bounds, state.placement, state.offset, state.visibleArrow));
    });
  };
  const calculateRef = useRef(calculatePosition); calculateRef.current = calculatePosition;
  const updatePosition = () => {
    'background only';
    if (!live.current.requested) return;
    setPosition(undefined);
    setContentSize(previous => previous.width || previous.height ? { width: 0, height: 0 } : previous);
    clearTimeout(repositionTimer.current);
    repositionTimer.current = setTimeout(() => calculateRef.current(), 32);
  };
  const updateRef = useRef(updatePosition); updateRef.current = updatePosition;
  useEffect(() => {
    if (requested) {
      setPosition(undefined);
      setContentSize(previous => previous.width || previous.height ? { width: 0, height: 0 } : previous);
      const timer = setTimeout(() => calculateRef.current(), 40);
      if (!previous.current) callbacks.current.onOpen?.();
      previous.current = true;
      return () => { clearTimeout(timer); sequence.current++; };
    }
    sequence.current++;
    if (previous.current) callbacks.current.onClose?.();
    previous.current = false;
  }, [requested]);
  const offsetKey = JSON.stringify(offset);
  useEffect(() => { if (requested) updatePosition(); }, [placement, offsetKey, visibleArrow, rootPortal]);
  useEffect(() => () => { sequence.current++; clearTimeout(repositionTimer.current); }, []);
  const request = (next: boolean) => {
    'background only';
    if (next && disabled || next === requested) return;
    if (show === undefined) setInner(next);
    onShowChange?.(next); onChange?.({ show: next });
  };
  useImperativeHandle(ref, () => ({ open: () => { 'background only'; request(true); }, close: () => { 'background only'; request(false); }, updatePosition }), [show, requested, disabled, onShowChange, onChange]);
  const layer = <view className={`ui-bubble-anchor ui-${kind}-anchor`} flatten={false} style={{ position: rootPortal || !position ? 'fixed' : 'absolute', width: position ? `${contentSize.width}px` : 'auto', height: position ? `${contentSize.height}px` : 'auto', left: `${position ? position.x - (rootPortal ? 0 : targetRect?.left ?? 0) : 0}px`, top: `${position ? position.y - (rootPortal ? 0 : targetRect?.top ?? 0) : 0}px`, zIndex, visibility: position ? 'visible' : 'hidden' }}>
    <Transition show={requested} name="fade" duration={duration} destroy={false} interactiveDuringLeave className={`ui-bubble-panel ui-${kind}-panel ${popClassName}`} style={{ width: contentSize.width > 0 ? `${contentSize.width}px` : 'auto', height: contentSize.height > 0 ? `${contentSize.height}px` : 'auto', ...popStyle }}>
      <view ref={content} className={`ui-bubble-body ${showClose ? 'ui-bubble-closable' : ''}`} flatten={false} catchtap={() => {}} bindlayoutchange={event => {
        'background only';
        const { width, height } = event.detail;
        if (width === size.current.width && height === size.current.height) return;
        size.current = { width, height }; calculateRef.current();
      }}>
        {visibleArrow && position ? <view className={`ui-bubble-arrow ui-bubble-arrow-${position.side} ${arrowClassName}`} style={position.side === 'top' || position.side === 'bottom' ? { left: `${position.arrow - 8}px` } : { top: `${position.arrow - 8}px` }} /> : null}
        {contentNode}
        {showClose ? <view className="ui-bubble-close" catchtap={() => request(false)} accessibility-element accessibility-traits="button" accessibility-label={localeText('close.bubble')}><Icon name="close" size={12} /></view> : null}
      </view>
    </Transition>
  </view>;
  return <view className={`ui-bubble ui-${kind} ${className}`} style={style}>
    <view ref={viewport} className="ui-bubble-viewport" flatten={false} bindlayoutchange={() => updateRef.current()} />
    <view ref={target} className={`ui-bubble-target ui-${kind}-target`} flatten={false} catchtap={() => request(!requested)} bindlayoutchange={() => updateRef.current()}>{children}</view>
    {rootPortal ? <RootPortal>{layer}</RootPortal> : layer}
  </view>;
});
