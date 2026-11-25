export type SegmentedValue = string | number;
export type SegmentedOption<T = unknown> = { value: SegmentedValue; disabled?: boolean; payload?: T };
export type SegmentedInput<T = unknown> = SegmentedValue | SegmentedOption<T>;

export function segmentedOptions<T>(options: readonly SegmentedInput<T>[]): SegmentedOption<T>[] {
  return options.map(option => typeof option === 'object' ? option : { value: option });
}

/** Invalid or absent values display the first option, without emitting a change. */
export function segmentedIndex(options: readonly SegmentedOption[], value: SegmentedValue | undefined): number {
  const index = options.findIndex(option => option.value === value);
  return index >= 0 ? index : options.length ? 0 : -1;
}
