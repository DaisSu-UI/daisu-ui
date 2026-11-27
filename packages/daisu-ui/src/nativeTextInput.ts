// Android forwards maxlength directly to InputFilter.LengthFilter. A negative
// limit rejects every edit instead of meaning "unlimited" as our public API does.
export function nativeTextMaxLength(value?: number): number {
  return value === undefined || !Number.isFinite(value) || value < 0
    ? 2147483647 : Math.min(2147483647, Math.trunc(value));
}
