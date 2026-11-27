import { useLocale } from './useLocale.js';
import { useEffect, useMemo, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { circleSvg } from './circleModel.js';
import type { CircleColor } from './circleModel.js';
import { progressPercentage } from './progressModel.js';
export type CircleProps = { value?: number; size?: number; color?: CircleColor; layerColor?: string; fill?: string; speed?: number; text?: string; strokeWidth?: number; strokeLinecap?: 'round' | 'butt' | 'square'; clockwise?: boolean; children?: ReactNode; className?: string; style?: CSSProperties };
export function Circle({ value = 0, size = 120, color = '#1c64fd', layerColor = '#f2f3f5', fill, speed = 50, text, strokeWidth = 18, strokeLinecap = 'round', clockwise = true, children, className = '', style }: CircleProps) {
  const { t: localeText } = useLocale();
  const target = progressPercentage(value), [current, setCurrent] = useState(target), animated = useRef(target);
  const diameter = Number.isFinite(size) ? Math.max(0,size) : 120;
  useEffect(() => {
    const from = animated.current, rate = Number.isFinite(speed) ? speed : 50;
    if (rate <= 0 || rate > 1000 || from === target) { animated.current = target; setCurrent(target); return; }
    const started = Date.now(), duration = Math.abs(target - from) / rate * 1000;
    let cancelled = false, timer: ReturnType<typeof setTimeout> | undefined;
    const frame = () => {
      if (cancelled) return;
      const fraction = Math.min(1, (Date.now() - started) / duration);
      const next = from + (target - from) * fraction; animated.current = next; setCurrent(next);
      if (fraction < 1) timer = setTimeout(frame,16);
    };
    timer = setTimeout(frame,16);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [target,speed]);
  const colorKey = JSON.stringify(color);
  const svg = useMemo(() => circleSvg({ value: current, size: diameter, color, layerColor, fill, strokeWidth, strokeLinecap, clockwise }), [current,diameter,colorKey,layerColor,fill,strokeWidth,strokeLinecap,clockwise]);
  return <view className={`ui-circle ${className}`} style={{ width: `${diameter}px`, height: `${diameter}px`, ...style }} accessibility-element accessibility-label={text || localeText('progress.label', { value: target })}>
    <svg className="ui-circle-svg" content={svg} />
    <view className="ui-circle-content" style={{ color: typeof color === 'string' ? color : undefined }}>{text ? <text className="ui-circle-text">{text}</text> : children}</view>
  </view>;
}
