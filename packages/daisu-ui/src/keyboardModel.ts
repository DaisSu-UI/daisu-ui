export type KeyboardMode = 'default' | 'custom' | 'car';
export type CarKeyboardLang = 'zh' | 'en';
export type KeyboardKey = { text: string; type?: 'input' | 'extra' | 'delete' | 'close' | 'blank'; wider?: boolean };
const provinces = ['京','沪','粤','津','冀','豫','云','辽','黑','湘','皖','鲁','苏','浙','赣','鄂','桂','甘','晋','陕','蒙','吉','闽','贵','渝','川','青','琼','宁','挂','藏','港','澳','新','使','学'];
const letters = ['1','2','3','4','5','6','7','8','9','0','Q','W','E','R','T','Y','U','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'];
export const keyboardDigits = ['1','2','3','4','5','6','7','8','9'];
export function shuffleKeyboardDigits(random: () => number = Math.random): string[] {
  const result = [...keyboardDigits];
  for (let index = result.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target]!, result[index]!];
  }
  return result;
}
export function keyboardKeys(mode: KeyboardMode, digits: readonly string[], extraKey: string | readonly string[] | undefined, showDeleteKey: boolean, deleteText: string, lang: CarKeyboardLang): KeyboardKey[] {
  if (mode === 'car') {
    const keys: KeyboardKey[] = (lang === 'zh' ? provinces : letters).map(text => ({ text }));
    keys.splice(30, 0, { text: lang === 'zh' ? 'ABC' : '省份', type: 'extra', wider: true });
    keys.push({ text: deleteText, type: 'delete', wider: true });
    return keys;
  }
  const keys: KeyboardKey[] = digits.map(text => ({ text }));
  const extras: readonly string[] = Array.isArray(extraKey) ? extraKey.slice(0, 2) : [extraKey ?? ''];
  if (mode === 'custom') {
    if (extras.length > 1) keys.push({ text: extras[0]!, type: 'extra' }, { text: '0' }, { text: extras[1]!, type: 'extra' });
    else keys.push({ text: '0', wider: true }, { text: extras[0] ?? '', type: 'extra' });
  } else keys.push({ text: extras[0] ?? '', type: 'extra' }, { text: '0' }, { text: showDeleteKey ? deleteText : '', type: showDeleteKey ? 'delete' : 'blank' });
  return keys;
}
export function keyboardAppend(value: string, key: string, maxlength: number): string {
  const remaining = Number.isFinite(maxlength) ? Math.max(0, Math.trunc(maxlength) - Array.from(value).length) : maxlength === Infinity ? Infinity : 0;
  return value + Array.from(key).slice(0, remaining).join('');
}
