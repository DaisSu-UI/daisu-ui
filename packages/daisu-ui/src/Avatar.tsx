import { useLocale } from './useLocale.js';
import { useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { BaseEvent, CSSProperties, ImageErrorEvent } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { avatarMetrics, avatarVisibleCount } from './avatarModel.js';
import type { AvatarSize } from './avatarModel.js';

export type AvatarProps = {
  src?: string;
  text?: string;
  icon?: string;
  size?: AvatarSize;
  shape?: 'round' | 'square';
  bgColor?: string;
  color?: string;
  alt?: string;
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'center';
  onTap?: () => void;
  onError?: (event: BaseEvent<'error', ImageErrorEvent>) => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

function AvatarImage({ src, mode, fallback, onError }: { src: string; mode: AvatarProps['mode']; fallback: ReactNode; onError: AvatarProps['onError'] }) {
  const [failed, setFailed] = useState(false);
  return failed ? fallback : <image className="ui-avatar-image" src={src} mode={mode} binderror={event => { 'background only'; setFailed(true); onError?.(event); }} />;
}

export function Avatar({ src = '', text = '', icon = '', size = 'normal', shape = 'round', bgColor, color, alt = '', mode = 'aspectFill', onTap, onError, children, className = '', style }: AvatarProps) {
  const { t: localeText } = useLocale();

  const metrics = avatarMetrics(size);
  const foreground = color || (bgColor ? '#fff' : undefined);
  const fallback = alt || text ? <text className="ui-avatar-text" style={{ fontSize: metrics.font, lineHeight: metrics.line, color: foreground }} text-maxline="1" text-overflow="ellipsis">{alt || text}</text> : icon ? <view className="ui-avatar-icon" style={{ width: metrics.font, height: metrics.font }}>{foreground ? <Icon name={icon} color={foreground} /> : <><Icon name={icon} color="var(--cso-ui-text-muted)" className="ui-avatar-icon-light" /><Icon name={icon} color="var(--cso-ui-text-muted)" className="ui-avatar-icon-dark" /></>}</view> : null;
  const content = text ? <text className="ui-avatar-text" style={{ fontSize: metrics.font, lineHeight: metrics.line, color: foreground }} text-maxline="1" text-overflow="ellipsis">{text}</text> : fallback;
  return <view className={`ui-avatar ui-avatar-${shape} ${className}`} style={{ width: metrics.dimension, height: metrics.dimension, backgroundColor: bgColor, ...style }} bindtap={onTap} accessibility-element={!!onTap || !!alt} accessibility-traits={onTap ? 'button' : 'image'} accessibility-label={alt || text || localeText('avatar.label')}>
    {children !== undefined && children !== null && children !== false ? typeof children === 'string' || typeof children === 'number' ? <text className="ui-avatar-text" style={{ fontSize: metrics.font, lineHeight: metrics.line, color: foreground }}>{children}</text> : children : src ? <AvatarImage key={src} src={src} mode={mode} fallback={fallback} onError={onError} /> : content}
  </view>;
}

export type AvatarGroupItem = AvatarProps & { key?: string | number };
export type AvatarGroupProps = {
  items: readonly AvatarGroupItem[];
  maxCount?: number;
  cascading?: 'left-up' | 'right-up';
  size?: AvatarSize;
  shape?: 'round' | 'square';
  collapseAvatar?: string;
  vertical?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function AvatarGroup({ items, maxCount, cascading = 'left-up', size = 'normal', shape = 'round', collapseAvatar, vertical = false, className = '', style }: AvatarGroupProps) {
  const count = avatarVisibleCount(items.length, maxCount);
  const overflow = items.length - count;
  const metrics = avatarMetrics(size);
  const visible: AvatarGroupItem[] = [...items.slice(0, count), ...(overflow ? [{ key: '__collapse__', text: collapseAvatar || `+${overflow}`, className: 'ui-avatar-collapse' }] : [])];
  return <view className={`ui-avatar-group ${vertical ? 'ui-avatar-group-vertical' : ''} ${className}`} style={style}>
    {visible.map(({ key, style: itemStyle, className: itemClass = '', ...item }, index) => <Avatar key={index === count ? 'collapse' : `avatar:${typeof key}:${key ?? index}`}  {...item} size={size} shape={shape} className={`ui-avatar-group-item ${itemClass}`} style={{ ...itemStyle, ...(index ? vertical ? { marginTop: metrics.overlap } : { marginLeft: metrics.overlap } : {}), zIndex: cascading === 'left-up' ? index + 1 : count - index }} />)}
  </view>;
}
