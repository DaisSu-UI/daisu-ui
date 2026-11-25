export type InputNumberValue = number | string;
export type NumberRules = { min?: number; max?: number; step?: number; precision?: number | string; stepStrictly?: boolean; allowNull?: boolean };
export function numberRules({ min = 1, max = Number.MAX_SAFE_INTEGER, step = 1, precision = 0, stepStrictly = false, allowNull = false }: NumberRules) {
  const lower = Number.isFinite(min) ? min : 1;
  return { min: lower, max: Number.isFinite(max) ? Math.max(lower, max) : Number.MAX_SAFE_INTEGER, step: Number.isFinite(step) && step > 0 ? step : 1, precision: Number.isFinite(Number(precision)) ? Math.min(20, Math.max(0, Math.trunc(Number(precision)))) : 0, stepStrictly, allowNull };
}
export type ResolvedNumberRules = ReturnType<typeof numberRules>;
export function normalizeNumber(value: InputNumberValue | undefined, rules: ResolvedNumberRules): number | '' {
  if (rules.allowNull && (value === undefined || value === '')) return '';
  const parsed = value === undefined || value === '' ? rules.min : Number(value);
  let next = Number.isFinite(parsed) ? parsed : rules.min;
  if (rules.stepStrictly) {
    const first = Math.ceil(Number((rules.min / rules.step).toPrecision(15)));
    const last = Math.floor(Number((rules.max / rules.step).toPrecision(15)));
    // An interval without a step multiple prioritizes the explicit bounds.
    next = first <= last ? Math.min(last, Math.max(first, Math.round(next / rules.step))) * rules.step : rules.min;
  }
  next = Number(Math.min(rules.max, Math.max(rules.min, next)).toFixed(rules.precision));
  return Math.min(rules.max, Math.max(rules.min, next));
}
export function numberDisplay(value: InputNumberValue | undefined, rules: ResolvedNumberRules, normalize = true) {
  const next = normalize ? normalizeNumber(value, rules) : value;
  if (next === '' || next === undefined) return rules.allowNull ? '' : rules.min.toFixed(rules.precision);
  const parsed = Number(next);
  return (Number.isFinite(parsed) ? parsed : rules.min).toFixed(rules.precision);
}
export function numberDraft(value: string, precision: number) {
  const negative = value.startsWith('-');
  let clean = value.replace(/[^\d.]/g, '');
  const parts = clean.split('.');
  clean = precision > 0 ? parts[0] + (parts.length > 1 ? `.${parts.slice(1).join('')}` : '') : parts[0];
  if (clean.startsWith('.')) clean = `0${clean}`;
  return `${negative ? '-' : ''}${clean}`;
}
export function sameNumber(a: InputNumberValue | undefined, b: InputNumberValue | undefined) {
  if (a === '' || b === '' || a === undefined || b === undefined) return a === b;
  return Number(a) === Number(b);
}
export function addNumber(value: number, step: number) { return Number((value + step).toPrecision(15)); }
