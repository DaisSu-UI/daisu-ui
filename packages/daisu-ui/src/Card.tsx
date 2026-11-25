import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
export type CardProps = {
  title?: ReactNode; description?: string; children?: ReactNode; footer?: ReactNode;
  variant?: 'business' | 'standard'; type?: 'rectangle';
  customTitleClass?: string; customContentClass?: string; customFooterClass?: string;
  className?: string; style?: CSSProperties;
};
function content(value:ReactNode) { return typeof value === 'string' || typeof value === 'number' ? <text className="ui-card-copy">{value}</text> : value; }
export function Card({ title, description, children, footer, variant, type, customTitleClass='', customContentClass='', customFooterClass='', className='', style }:CardProps) {
  const standard=(variant ?? (type ? 'standard' : 'business')) === 'standard';
  const hasTitle=title !== undefined && title !== null && title !== false && title !== '';
  const hasFooter=footer !== undefined && footer !== null && footer !== false;
  return <view className={`ui-card ${standard ? 'ui-card-standard' : 'ui-card-business'} ${standard && type === 'rectangle' ? 'ui-card-rectangle' : ''} ${className}`} style={style}>
    {hasTitle || description ? <view className={`ui-card-header ${customTitleClass}`}>
      {hasTitle ? typeof title === 'string' || typeof title === 'number' ? <text className="ui-card-title" text-maxline={standard ? '1' : undefined} text-overflow="ellipsis">{title}</text> : title : null}
      {description ? <text className="ui-card-description">{description}</text> : null}
    </view> : null}
    {standard || children !== undefined && children !== null && children !== false ? <view className={`ui-card-body ${customContentClass}`}>{standard && type === 'rectangle' ? <view className="ui-card-content-line"/> : null}{content(children)}</view> : null}
    {hasFooter ? <view className={`ui-card-footer ${customFooterClass}`}>{standard ? <view className="ui-card-footer-line"/> : null}{content(footer)}</view> : null}
  </view>;
}

export function SectionTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <view className="ui-section-title">
    {eyebrow ? <text className="ui-section-eyebrow">{eyebrow}</text> : null}
    <text className="ui-section-heading">{title}</text>
    {description ? <text className="ui-section-description">{description}</text> : null}
  </view>;
}
