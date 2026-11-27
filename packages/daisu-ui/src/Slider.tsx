import { useDragEvents } from './useDragEvents.js';
import { useFrameTask } from './useFrameTask.js';
import { useLocale } from './useLocale.js';
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

type PointerPoint = { x?: number; y?: number; clientX?: number; clientY?: number; pageX?: number; pageY?: number };
type PointerEvent = PointerPoint & { detail?: PointerPoint; touches?: PointerPoint[]; changedTouches?: PointerPoint[]; target?: { dataset?: Record<string, unknown> } };
type TrackRect = { left: number; top: number; width: number; height: number };

/** Shared Lynx slider. Values use the public min/max scale; range thumbs never cross. */
export function Slider({ value, defaultValue = 0, min: minProp = 0, max: maxProp = 100, step: stepProp = 1, disabled: disabledProp, vertical = false, height = 248, theme = 'default', showExtremes = false, showValue = true, marks, className = '', accessibilityLabel, onChange, onChangeEnd }: SliderProps) {
  const { t: localeText } = useLocale();
  accessibilityLabel ??= localeText('slider.label');

  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const { min, max, step } = sliderBounds(minProp, maxProp, stepProp);
  const [inner, setInner] = useState<SliderValue>(defaultValue);
  const [active, setActive] = useState<number | null>(null);
  const current = normalizeSliderValue(value ?? inner, min, max, step);
  const latest = useRef(current);
  const trackRef = useRef<NodesRef>(null);
  const drag = useRef<{ sequence: number; pressed: boolean; pendingEnd: boolean; point: number; index: number | null; grabOffset: number; rect?: TrackRect }>({ sequence: 0, pressed: false, pendingEnd: false, point: 0, index: null, grabOffset: 0 });
  useEffect(() => { latest.current = current; }, [typeof current === 'number' ? current : current.join(',')]);
  useEffect(() => {
    if (disabled) { drag.current.pressed = false; drag.current.sequence++; frame.cancel(); setActive(null); }
  }, [disabled]);
  useEffect(() => () => { frame.cancel(); drag.current.sequence++; drag.current.pressed = false; }, []);
  const ratio = (item: number) => (item - min) / (max - min) * 100;
  const values = typeof current === 'number' ? [current] : [...current];
  const lower = typeof current === 'number' ? 0 : ratio(current[0]);
  const upper = ratio(typeof current === 'number' ? current : current[1]);
  const ticks = (Array.isArray(marks) ? marks.map(item => [item, String(item)] as const) : Object.entries(marks ?? {}).map(([item, label]) => [Number(item), String(label)] as const)).filter(([item]) => Number.isFinite(item) && item >= min && item <= max);
  const coordinate = (event: PointerEvent) => {
    'background only';
    const touch = event.touches?.[0] ?? event.changedTouches?.[0];
    // Native touch.x/y are local to the hit element (which may itself move).
    // boundingClientRect uses viewport coordinates, so prefer client/page data.
    const candidates = vertical ? [touch?.clientY, event.clientY, touch?.pageY, event.pageY, event.detail?.y, touch?.y, event.y] : [touch?.clientX, event.clientX, touch?.pageX, event.pageX, event.detail?.x, touch?.x, event.x];
    return candidates.find(item => typeof item === 'number' && Number.isFinite(item));
  };
  const finish = () => {
    'background only';
    frame.cancel();
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
    const candidate = min + (state.point - state.grabOffset - (vertical ? state.rect.top : state.rect.left)) / length * (max - min);
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
  const frame = useFrameTask(() => { 'background only'; if (drag.current.pressed) applyPoint(); });
  const start = (event: PointerEvent) => {
    'background only';
    const point = coordinate(event);
    if (disabled || point === undefined || !trackRef.current) return;
    if (drag.current.pressed) return;
    frame.cancel();
    const sequence = drag.current.sequence + 1;
    const target = event.target?.dataset?.thumbindex;
    const index = target === undefined ? null : Number(target);
    drag.current = { sequence, pressed: true, pendingEnd: false, point, index: index === 0 || (index === 1 && Array.isArray(latest.current)) ? index : null, grabOffset: 0 };
    trackRef.current.invoke({ method: 'boundingClientRect', params: { androidEnableTransformProps: true, iosEnableTransformProps: true }, success: (result: unknown) => {
      'background only';
      if (drag.current.sequence !== sequence) return;
      drag.current.rect = result as TrackRect;
      if (drag.current.index !== null) {
        const rect = drag.current.rect, length = vertical ? rect.height : rect.width;
        const selected = typeof latest.current === 'number' ? latest.current : latest.current[drag.current.index];
        drag.current.grabOffset = point - (vertical ? rect.top : rect.left) - (selected - min) / (max - min) * length;
      }
      applyPoint();
    }, fail: () => { 'background only'; if (drag.current.sequence === sequence) { drag.current.pressed = false; setActive(null); } } }).exec();
  };
  const move = (event: PointerEvent) => {
    'background only';
    if (!drag.current.pressed || disabled) return;
    const point = coordinate(event);
    if (point === undefined) return;
    drag.current.point = point;
    frame.schedule();
  };
  const end = (event: PointerEvent) => {
    'background only';
    if (!drag.current.pressed) return;
    frame.cancel();
    const point = coordinate(event);
    if (point !== undefined) drag.current.point = point;
    if (!drag.current.rect) { drag.current.pendingEnd = true; return; }
    applyPoint();
    finish();
  };
  const cancel = () => {
    'background only';
    drag.current.sequence++;
    frame.cancel();
    drag.current.pressed = false;
    drag.current.pendingEnd = false;
    setActive(null);
  };
  const gestures = useDragEvents({ disabled, onStart: event => { 'background only'; start(event); return drag.current.pressed; }, onMove: move, onEnd: end, onCancel: cancel });
  return <view className={`ui-slider ui-slider-${vertical ? 'vertical' : 'horizontal'} ui-slider-${theme} ${disabled ? 'ui-slider-disabled' : ''} ${ticks.length ? 'ui-slider-marked' : ''} ${showExtremes ? 'ui-slider-extremes' : ''} ${className}`} style={vertical ? { height: `${height}px` } : undefined}>
    {showExtremes ? <text className="ui-slider-extreme">{min}</text> : null}
    <view className="ui-slider-rail" consume-slide-event={[[-180, 180]]} {...gestures}>
      <view className="ui-slider-track" ref={trackRef} flatten={false}>
        <view className="ui-slider-fill" style={vertical ? { top: `${lower}%`, height: `${upper - lower}%` } : { left: `${lower}%`, width: `${upper - lower}%` }} />
        {ticks.map(([item, label], index) => <view key={item} className={`ui-slider-mark ${ratio(item) >= lower && ratio(item) <= upper ? 'ui-slider-mark-selected' : ''} ${index === 0 || index === ticks.length - 1 ? 'ui-slider-mark-edge' : ''}`} style={vertical ? { top: `${ratio(item)}%` } : { left: `${ratio(item)}%` }}><text className="ui-slider-mark-label">{label}</text></view>)}
        {values.map((item, index) => <view key={index} data-thumbindex={index} flatten={false} className={`ui-slider-thumb ${active === index ? 'ui-slider-thumb-active' : ''}`} style={vertical ? { top: `${ratio(item)}%` } : { left: `${ratio(item)}%` }} accessibility-element accessibility-traits="adjustable" accessibility-label={`${accessibilityLabel}${values.length === 2 ? index === 0 ? localeText('slider.lower') : localeText('slider.upper') : ''}：${item}`}>
          {showValue && active === index ? <view className="ui-slider-tooltip" flatten={false} user-interaction-enabled={false}><text>{item}</text><view className="ui-slider-tooltip-arrow" /></view> : null}
          <view className="ui-slider-handle" data-thumbindex={index}><view className="ui-slider-grip ui-slider-grip-left" data-thumbindex={index} /><view className="ui-slider-grip ui-slider-grip-right" data-thumbindex={index} /></view>
        </view>)}
      </view>
    </view>
    {showExtremes ? <text className="ui-slider-extreme">{max}</text> : null}
  </view>;
}
