import { forwardRef } from '@lynx-js/react';
import { AnchoredBubble } from './AnchoredBubble.js';
import type { AnchoredBubbleProps, BubbleRef } from './AnchoredBubble.js';

export type TooltipRef = BubbleRef;
export type TooltipProps = Omit<AnchoredBubbleProps, 'kind'> & { content?: string };

export const Tooltip = forwardRef<TooltipRef, TooltipProps>(function Tooltip({ content = '', contentNode, ...props }, ref) {
  return <AnchoredBubble {...props} ref={ref} kind="tooltip" contentNode={contentNode ?? <text className="ui-bubble-text">{content}</text>} />;
});
