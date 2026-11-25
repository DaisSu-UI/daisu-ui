import { forwardRef, useImperativeHandle, useRef } from '@lynx-js/react';
import { AnchoredBubble } from './AnchoredBubble.js';
import type { AnchoredBubbleProps, BubbleRef } from './AnchoredBubble.js';
import { Icon } from './Icon.js';

export type PopoverRef = BubbleRef;
export type PopoverMenuItem = { content: string; iconClass?: string; [key: string]: unknown };
export type PopoverProps = Omit<AnchoredBubbleProps, 'kind'> & {
  content?: string | readonly PopoverMenuItem[];
  mode?: 'normal' | 'menu';
  onMenuClick?: (event: { item: PopoverMenuItem; index: number }) => void;
};

export const Popover = forwardRef<PopoverRef, PopoverProps>(function Popover({ content = '', contentNode, mode = 'normal', onMenuClick, onOpen, onClose, disabled, ...props }, ref) {
  const bubble = useRef<BubbleRef>(null);
  const visible = useRef(false);
  useImperativeHandle(ref, () => ({ open: () => { 'background only'; bubble.current?.open(); }, close: () => { 'background only'; bubble.current?.close(); }, updatePosition: () => { 'background only'; bubble.current?.updatePosition(); } }), []);
  const items = Array.isArray(content) ? content as readonly PopoverMenuItem[] : [];
  const body = contentNode ?? (mode === 'menu' ? <view className="ui-popover-menu">{items.map((item, index) => <view key={index} className="ui-popover-menu-item" accessibility-element accessibility-traits="button" accessibility-label={item.content} catchtap={() => {
    'background only';
    if (disabled || !visible.current) return;
    visible.current = false;
    bubble.current?.close(); onMenuClick?.({ item, index });
  }}>{index ? <view className="ui-popover-menu-line" /> : null}{item.iconClass ? <view className="ui-popover-menu-icon"><Icon name={item.iconClass} size={14} /></view> : null}<text className="ui-popover-menu-text">{item.content}</text></view>)}</view> : <text className="ui-bubble-text">{typeof content === 'string' ? content : ''}</text>);
  return <AnchoredBubble {...props} disabled={disabled} ref={bubble} kind="popover" contentNode={body} onOpen={() => { 'background only'; visible.current = true; onOpen?.(); }} onClose={() => { 'background only'; visible.current = false; onClose?.(); }} />;
});
