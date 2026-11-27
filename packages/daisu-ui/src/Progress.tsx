import { useLocale } from './useLocale.js';
import { useEffect, useRef, useState } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { progressPercentage, progressSegments, progressStops } from './progressModel.js';
import type { ProgressColor } from './progressModel.js';
export type PercentPosition = { type?: 'inner' | 'outer'; align?: 'left' | 'center' | 'right' };
export type ProgressProps = { percentage?: number; hideText?: boolean; color?: ProgressColor; status?: 'success' | 'danger' | 'warning'; duration?: number; percentPosition?: PercentPosition; className?: string; style?: CSSProperties };
export function Progress({ percentage = 0, hideText = false, color, status, duration = 30, percentPosition, className = '', style }: ProgressProps) {
  const { t: localeText } = useLocale();
  const target = progressPercentage(percentage), milliseconds = Number.isFinite(duration) ? Math.max(0, duration) : 30;
  const [bar, setBar] = useState<{ value: number; duration: number; color?: string }>({ value: 0, duration: 0 });
  const [labelWidth, setLabelWidth] = useState(36);
  const motion = useRef({ from: 0, to: 0, started: 0, duration: 0 });
  // A stable key permits caller-owned arrays without restarting on unrelated renders.
  const stops = progressStops(color), stopsKey = JSON.stringify(stops);
  useEffect(() => {
    const previous = motion.current, elapsed = Date.now() - previous.started;
    const current = previous.duration > 0 ? previous.from + (previous.to - previous.from) * Math.min(1, Math.max(0, elapsed / previous.duration)) : previous.to;
    const segments = progressSegments(current, target, stops);
    let timer: ReturnType<typeof setTimeout> | undefined, cancelled = false, from = current;
    setBar(old => ({ ...old, value: current, duration: 0 }));
    motion.current = { from: current, to: current, started: Date.now(), duration: 0 };
    const advance = (index: number) => {
      if (cancelled) return;
      const segment = segments[index]; if (!segment) return;
      const time = Math.abs(segment.value - from) * milliseconds;
      motion.current = { from, to: segment.value, started: Date.now(), duration: time };
      setBar({ value: segment.value, duration: time, color: segment.color }); from = segment.value;
      if (index + 1 < segments.length) timer = setTimeout(() => advance(index + 1), time);
    };
    timer = setTimeout(() => advance(0), 32);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [target, milliseconds, stopsKey]);
  const inner = percentPosition?.type === 'inner', align = percentPosition?.align ?? 'right';
  const icon = status === 'success' ? 'check-circle-fill' : status === 'danger' ? 'close-circle-fill' : 'exclamation-circle-fill';
  const statusColor = status ? `var(--cso-ui-${status})` : 'var(--cso-ui-primary)';
  // SVG glyphs use separate theme variants rather than SVG CSS-variable fills.
  const iconColors = status === 'success' ? ['#12b886', '#20c997'] : status === 'warning' ? ['#f57f00', '#ffa94d'] : ['#f14646', '#ff6b6b'];
  const label = hideText ? status ? <view className={`ui-progress-icon ${inner ? 'ui-progress-icon-inner' : ''}`}><Icon name={icon} size={18} color={inner ? '#fff' : typeof color === 'string' ? color : iconColors[0]} className="ui-progress-light-icon" /><Icon name={icon} size={18} color={inner ? '#fff' : typeof color === 'string' ? color : iconColors[1]} className="ui-progress-dark-icon" /></view> : null : <text className="ui-progress-label" bindlayoutchange={event => { if (inner && Number.isFinite(event.detail.width) && event.detail.width > 0) setLabelWidth(event.detail.width); }}>{`${target}%`}</text>;
  return <view className={`ui-progress ${inner ? 'ui-progress-inner' : ''} ${target === 0 ? 'ui-progress-zero' : ''} ${className}`} style={style} accessibility-element accessibility-label={`${localeText('progress.label', { value: target })}${status ? ` ${status}` : ''}`}>
    <view className="ui-progress-track"><view className={`ui-progress-fill ui-progress-align-${align}`} style={{ width: `${bar.value}%`, transitionDuration: `${bar.duration}ms`, backgroundColor: inner && target === 0 ? undefined : bar.color ?? statusColor, minWidth: inner && label ? hideText ? '34px' : `${labelWidth}px` : undefined }}>{inner ? label : null}</view></view>
    {!inner ? label : null}
  </view>;
}
