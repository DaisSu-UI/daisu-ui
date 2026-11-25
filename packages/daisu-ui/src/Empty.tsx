import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { imgDimension } from './imgModel.js';

export type EmptyProps = {
  icon?: string; iconSize?: number | string; iconColor?: string;
  tip?: ReactNode; image?: ReactNode; bottom?: ReactNode;
  className?: string; style?: CSSProperties;
};
/** Empty uses SVG glyphs; the business EmptyState remains independent. */
export function Empty({ icon = 'empty', iconSize = 98, iconColor, tip, image, bottom, className = '', style }: EmptyProps) {
  const dimension = imgDimension(iconSize, 98);
  const customImage = image !== undefined && image !== null;
  return <view className={`ui-empty ${className}`} style={style}>
    {customImage ? typeof image === 'string' || typeof image === 'number' ? <text>{image}</text> : image : <view className="ui-empty-icon" style={{ width: dimension, height: dimension }}>
      {iconColor ? <Icon name={icon} size={1} color={iconColor} className="ui-empty-glyph"/> : <><Icon name={icon} size={1} color="#c9cbd4" className="ui-empty-glyph ui-empty-glyph-light"/><Icon name={icon} size={1} color="#4e5369" className="ui-empty-glyph ui-empty-glyph-dark"/></>}
    </view>}
    {tip !== undefined && tip !== null && tip !== false && tip !== '' ? typeof tip === 'string' || typeof tip === 'number' ? <text className="ui-empty-tip">{tip}</text> : <view className="ui-empty-tip">{tip}</view> : null}
    {bottom !== undefined && bottom !== null && bottom !== false ? typeof bottom === 'string' || typeof bottom === 'number' ? <text>{bottom}</text> : bottom : null}
  </view>;
}
