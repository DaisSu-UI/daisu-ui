import { FormFieldContext } from './formContext.js';
import { useContext, useEffect, useRef, useState } from '@lynx-js/react';
import type { NodesRef } from '@lynx-js/types';
import { moveSliderValue, normalizeSliderValue, sameSliderValue, sliderBounds } from './sliderModel.js';
import type { SliderValue } from './sliderModel.js';

export type SliderProps = {
  value?: SliderValue;
  defaultValue?: SliderValue;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  vertical?: boolean;
  height?: number;
  theme?: 'default' | 'capsule';
  showExtremes?: boolean;
  showValue?: boolean;
  marks?: readonly number[] | Readonly<Record<number, string>>;
  className?: string;
  accessibilityLabel?: string;
  onChange?: (value: SliderValue) => void;
  onChangeEnd?: (value: SliderValue) => void;
};

type PointerPoint = { x?: number; y?: number; clientX?: number; clientY?: number };
type PointerEvent = PointerPoint & { detail?: PointerPoint; touches?: PointerPoint[]; changedTouches?: PointerPoint[] };
type TrackRect = { left: number; top: number; width: number; height: number };

/** Shared Lynx slider. Values use the public min/max scale; range thumbs never cross. */
export function Slider({ value, defaultValue = 0, min: minProp = 0, max: maxProp = 100, step: stepProp = 1, disabled: disabledProp, vertical = false, height = 248, theme = 'default', showExtremes = false, showValue = true, marks, className = '', accessibilityLabel = '滑块', onChange, onChangeEnd }: SliderProps) {
  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const { min, max, step } = sliderBounds(minProp, maxProp, stepProp);
  const [inner, setInner] = useState<SliderValue>(defaultValue);
  const [active, setActive] = useState<number | null>(null);
  const current = normalizeSliderValue(value ?? inner, min, max, step);
  const latest = useRef(current);
  const trackRef = useRef<NodesRef>(null);
  const drag = useRef<{ sequence: number; pressed: boolean; pendingEnd: boolean; point: number; index: number | null; rect?: TrackRect }>({ sequence: 0, pressed: false, pendingEnd: false, point: 0, index: null });
  useEffect(() => { latest.current = current; }, [typeof current === 'number' ? current : current.join(',')]);
  useEffect(() => {
    if (disabled) { drag.current.pressed = false; drag.current.sequence++; setActive(null); }
  }, [disabled]);
  useEffect(() => () => { drag.current.sequence++; drag.current.pressed = false; }, []);
  const ratio = (item: number) => (item - min) / (max - min) * 100;
  const values = typeof current === 'number' ? [current] : [...current];
  const lower = typeof current === 'number' ? 0 : ratio(current[0]);
  const upper = ratio(typeof current === 'number' ? current : current[1]);
  const ticks = (Array.isArray(marks) ? marks.map(item => [item, String(item)] as const) : Object.entries(marks ?? {}).map(([item, label]) => [Number(item), String(label)] as const)).filter(([item]) => Number.isFinite(item) && item >= min && item <= max);
  const coordinate = (event: PointerEvent) => {
    'background only';
    const touch = event.touches?.[0] ?? event.changedTouches?.[0];
    const candidates = vertical ? [touch?.y, event.y, event.detail?.y, touch?.clientY, event.clientY] : [touch?.x, event.x, event.detail?.x, touch?.clientX, event.clientX];
    return candidates.find(item => typeof item === 'number' && Number.isFinite(item));
  };
  const finish = () => {
    'background only';
    drag.current.pressed = false;
    drag.current.pendingEnd = false;
    setActive(null);
    onChangeEnd?.(latest.current);
  };
  const applyPoint = () => {
    'background only';
    const state = drag.current;
    if (!state.rect || disabled) return;
    const length = vertical ? state.rect.height : state.rect.width;
    if (!(length > 0)) return;
    const candidate = min + (state.point - (vertical ? state.rect.top : state.rect.left)) / length * (max - min);
    if (state.index === null) {
      const previous = latest.current;
      state.index = typeof previous === 'number' ? 0 : previous[0] === previous[1] ? candidate < previous[0] ? 0 : 1 : Math.abs(candidate - previous[0]) < Math.abs(candidate - previous[1]) ? 0 : 1;
    }
    setActive(state.index);
    const next = moveSliderValue(latest.current, candidate, state.index, min, max, step);
    if (!sameSliderValue(next, latest.current)) {
      latest.current = next;
      if (value === undefined) setInner(next);
      onChange?.(next);
    }
    if (state.pendingEnd) finish();
  };
  const start = (event: PointerEvent) => {
    'background only';
    const point = coordinate(event);
    if (disabled || point === undefined || !trackRef.current) return;
    const sequence = drag.current.sequence + 1;
    drag.current = { sequence, pressed: true, pendingEnd: false, point, index: null };
    trackRef.current.invoke({ method: 'boundingClientRect', params: { androidEnableTransformProps: true, iosEnableTransformProps: true }, success: (result: unknown) => {
      'background only';
      if (drag.current.sequence !== sequence) return;
      drag.current.rect = result as TrackRect;
      applyPoint();
    }, fail: () => { 'background only'; if (drag.current.sequence === sequence) { drag.current.pressed = false; setActive(null); } } }).exec();
  };
  const move = (event: PointerEvent) => {
    'background only';
    if (!drag.current.pressed || disabled) return;
    const point = coordinate(event);
    if (point === undefined) return;
    drag.current.point = point;
    applyPoint();
  };
  const end = (event: PointerEvent) => {
    'background only';
    if (!drag.current.pressed) return;
    const point = coordinate(event);
    if (point !== undefined) drag.current.point = point;
    if (!drag.current.rect) { drag.current.pendingEnd = true; return; }
    applyPoint();
    finish();
  };
  const cancel = () => {
    'background only';
    drag.current.sequence++;
    drag.current.pressed = false;
    drag.current.pendingEnd = false;
    setActive(null);
  };
  return <view className={`ui-slider ui-slider-${vertical ? 'vertical' : 'horizontal'} ui-slider-${theme} ${disabled ? 'ui-slider-disabled' : ''} ${ticks.length ? 'ui-slider-marked' : ''} ${showExtremes ? 'ui-slider-extremes' : ''} ${className}`} style={vertical ? { height: `${height}px` } : undefined}>
    {showExtremes ? <text className="ui-slider-extreme">{min}</text> : null}
    <view className="ui-slider-rail" consume-slide-event={[[-180, 180]]} catchtouchstart={start} catchtouchmove={move} catchtouchend={end} catchtouchcancel={cancel} catchmousedown={start} catchmousemove={move} catchmouseup={end} global-bindmousemove={move} global-bindmouseup={end} global-bindtouchmove={move} global-bindtouchend={end} global-bindtouchcancel={cancel}>
      <view className="ui-slider-track" ref={trackRef}>
        <view className="ui-slider-fill" style={vertical ? { top: `${lower}%`, height: `${upper - lower}%` } : { left: `${lower}%`, width: `${upper - lower}%` }} />
        {ticks.map(([item, label], index) => <view key={item} className={`ui-slider-mark ${ratio(item) >= lower && ratio(item) <= upper ? 'ui-slider-mark-selected' : ''} ${index === 0 || index === ticks.length - 1 ? 'ui-slider-mark-edge' : ''}`} style={vertical ? { top: `${ratio(item)}%` } : { left: `${ratio(item)}%` }}><text className="ui-slider-mark-label">{label}</text></view>)}
        {values.map((item, index) => <view key={index} className={`ui-slider-thumb ${active === index ? 'ui-slider-thumb-active' : ''}`} style={vertical ? { top: `${ratio(item)}%` } : { left: `${ratio(item)}%` }} accessibility-element accessibility-traits="adjustable" accessibility-label={`${accessibilityLabel}${values.length === 2 ? index === 0 ? '下限' : '上限' : ''}：${item}`}>
          {showValue ? <view className="ui-slider-tooltip" user-interaction-enabled={false}><text>{item}</text><view className="ui-slider-tooltip-arrow" /></view> : null}
          <view className="ui-slider-handle"><view className="ui-slider-grip ui-slider-grip-left" /><view className="ui-slider-grip ui-slider-grip-right" /></view>
        </view>)}
      </view>
    </view>
    {showExtremes ? <text className="ui-slider-extreme">{max}</text> : null}
  </view>;
}
