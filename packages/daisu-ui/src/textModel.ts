export type TextMode = 'text' | 'date' | 'phone' | 'name' | 'price';

/** Display formatting without browser locale dependencies. */
export function formatUiText(value: string | number, mode: TextMode, masked = false): string {
  const text = String(value);
  if (mode === 'price') {
    const number = Number(value);
    if (!Number.isFinite(number)) return text;
    const [integer, decimal] = number.toFixed(2).split('.');
    return `${integer!.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimal}`;
  }
  if (mode === 'date') {
    const date = new Date(Number(value));
    if (!Number.isFinite(date.getTime())) return text;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  if (masked && mode === 'phone') return text.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
  if (masked && mode === 'name') {
    const letters = Array.from(text);
    return letters.length > 1 ? `${letters[0]}**${letters[letters.length - 1]}` : text;
  }
  return text;
}
