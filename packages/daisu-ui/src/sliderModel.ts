export type SliderValue = number | readonly [number, number];

export function sliderBounds(min: number, max: number, step: number) {
  const lower = Number.isFinite(min) ? min : 0;
  return { min: lower, max: Number.isFinite(max) && max > lower ? max : lower + 100, step: Number.isFinite(step) && step > 0 ? step : 1 };
}

export function snapSliderValue(value: number, min: number, max: number, step: number) {
  if (!Number.isFinite(value) || value <= min) return min;
  if (value >= max) return max;
  return Math.min(max, Math.max(min, Number((min + Math.round((value - min) / step) * step).toFixed(10))));
}

export function normalizeSliderValue(value: SliderValue, min: number, max: number, step: number): SliderValue {
  const snap = (item: number) => snapSliderValue(item, min, max, step);
  if (typeof value === 'number') return snap(value);
  const first = snap(value[0]), second = snap(value[1]);
  return first <= second ? [first, second] : [second, first];
}

export function moveSliderValue(value: SliderValue, candidate: number, index: number, min: number, max: number, step: number): SliderValue {
  const next = snapSliderValue(candidate, min, max, step);
  if (typeof value === 'number') return next;
  return index === 0 ? [Math.min(next, value[1]), value[1]] : [value[0], Math.max(next, value[0])];
}

export function sameSliderValue(first: SliderValue, second: SliderValue) {
  return typeof first === 'number' || typeof second === 'number' ? first === second : first[0] === second[0] && first[1] === second[1];
}
