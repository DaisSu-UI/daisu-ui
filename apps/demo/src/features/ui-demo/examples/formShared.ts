export const platforms = ['京东', '开普勒', '手Q', '微信', '1号店', '十元街', '京东极速版']
  .map((label, i) => ({ value: String(i + 1), label }));
export const promotions = [{ value: '1', label: '满减' }, { value: '2', label: '无门槛' }];

export function formatDate(value: number | string | null, withTime = false) {
  if (!value) return '';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  const two = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}${withTime ? ` ${two(date.getHours())}:${two(date.getMinutes())}` : ''}`;
}
