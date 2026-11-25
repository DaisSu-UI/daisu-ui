export function rateCount(num: number) { return Number.isFinite(num) ? Math.max(0, Math.floor(num)) : 5; }
export function rateScore(value: number | null | undefined, num: number) { return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(num, value)) : 0; }
export function nextRateValue(current: number, next: number, allowHalf: boolean, clearable: boolean) { return clearable && next === current && next === (allowHalf ? .5 : 1) ? 0 : next; }
const escapeXml = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export function rateSvg(path: string, color: string) {
  let paint = escapeXml(color); let defs = '';
  const gradient = /^linear-gradient\((.*)\)$/i.exec(color);
  if (gradient) {
    const parts: string[] = []; let depth = 0; let start = 0;
    for (let i = 0; i < gradient[1]!.length; i++) { const ch = gradient[1]![i]; if (ch === '(') depth++; else if (ch === ')') depth--; else if (ch === ',' && depth === 0) { parts.push(gradient[1]!.slice(start, i).trim()); start = i + 1; } }
    parts.push(gradient[1]!.slice(start).trim());
    const direction = /^(-?[\d.]+)deg$/.exec(parts[0] ?? ''); const angle = direction ? Number(direction[1]) : 180; if (direction) parts.shift();
    const radians = angle * Math.PI / 180; const dx = Math.sin(radians) * 50; const dy = -Math.cos(radians) * 50;
    const stops = parts.map((part, index) => { const match = /^(.*?)(?:\s+([\d.]+)%)?$/.exec(part)!; return `<stop offset="${match[2] ?? index / Math.max(1, parts.length - 1) * 100}%" stop-color="${escapeXml(match[1]!)}"/>`; }).join('');
    defs = `<defs><linearGradient id="rate" x1="${50 - dx}%" y1="${50 + dy}%" x2="${50 + dx}%" y2="${50 - dy}%">${stops}</linearGradient></defs>`; paint = 'url(#rate)';
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${defs}<path transform="translate(0 896) scale(1 -1)" fill="${paint}" d="${path}"/></svg>`;
}
