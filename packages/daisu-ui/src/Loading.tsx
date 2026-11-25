import { useMemo } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { circularLoadingSvg, loadingDimension } from './loadingModel.js';

export type LoadingSize = 'small' | 'medium' | 'large' | (string & {}) | number;
export type LoadingType = 'circular' | 'spinner' | 'dots' | 'wave';
export type LoadingProps = {
  type?: LoadingType;
  color?: string;
  size?: LoadingSize;
  text?: string;
  /** Legacy label keeps its horizontal layout unless direction is specified. */
  label?: string;
  children?: ReactNode;
  direction?: 'vertical' | 'horizontal';
  className?: string;
  spinnerClassName?: string;
  style?: CSSProperties;
};

export function Loading({ type = 'circular', color = '#1c64fd', size = 28, text, label, children, direction = label !== undefined ? 'horizontal' : 'vertical', className = '', spinnerClassName = '', style }: LoadingProps) {
  const dimension = loadingDimension(size);
  const content = children ?? text ?? label;
  const svg = useMemo(() => type === 'circular' ? circularLoadingSvg(color) : '', [type, color]);
  return <view className={`ui-loading ui-loading-${direction} ${label !== undefined ? 'ui-loading-legacy-label' : ''} ${className}`} style={{ color, ...style }} accessibility-element accessibility-label={typeof content === 'string' ? content : '加载中'}>
    <view className={`ui-loading-spinner ui-loading-spinner-${type} ${spinnerClassName}`} style={{ width: dimension, height: dimension }}>
      {type === 'circular' ? <svg className="ui-loading-circle" content={svg} /> : <view className={`ui-loading-inner ui-loading-inner-${type}`}>
        {type === 'spinner' ? Array.from({ length: 12 }, (_, index) => <view key={index} className="ui-loading-spoke" style={{ transform: `rotate(${60 - index * 30}deg)`, opacity: 1 - index / 16 }}><view className="ui-loading-spoke-tip" style={{ backgroundColor: color }} /></view>) : type === 'dots' ? Array.from({ length: 3 }, (_, index) => <view key={index} className="ui-loading-dot" style={{ backgroundColor: color, transform: `rotate(${60 - index * 30}deg)`, animationDelay: `${800 * index / 3}ms` }} />) : Array.from({ length: 4 }, (_, index) => <view key={index} className={`ui-loading-wave-bar ui-loading-wave-bar-${index + 1}`}><view className="ui-loading-wave-inner" style={{ backgroundColor: color }} /></view>)}
      </view>}
    </view>
    {content !== undefined && content !== null && content !== '' && content !== false ? typeof content === 'string' || typeof content === 'number' ? <text className="ui-loading-label">{content}</text> : <view className="ui-loading-label ui-loading-custom-text">{content}</view> : null}
  </view>;
}
