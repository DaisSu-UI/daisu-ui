import { useContext, useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, TouchEvent } from '@lynx-js/types';
import { Popup } from './Popup.js';
import { Icon } from './Icon.js';
import { Loading } from './Loading.js';
import { FormFieldContext } from './formContext.js';
import { keyboardAppend, keyboardDigits, keyboardKeys, shuffleKeyboardDigits } from './keyboardModel.js';
import type { CarKeyboardLang, KeyboardKey, KeyboardMode } from './keyboardModel.js';
export type { CarKeyboardLang, KeyboardMode } from './keyboardModel.js';

export type KeyboardProps = {
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  mode?: KeyboardMode;
  title?: ReactNode;
  extraKey?: string | readonly string[];
  maxlength?: number;
  showDeleteKey?: boolean;
  deleteText?: string;
  closeText?: string;
  closeButtonLoading?: boolean;
  randomKeyOrder?: boolean;
  carLang?: CarKeyboardLang;
  onCarLangChange?: (lang: CarKeyboardLang) => void;
  autoSwitchLang?: boolean;
  modal?: boolean;
  hideOnClickOutside?: boolean;
  lockScroll?: boolean;
  safeAreaInsetBottom?: boolean;
  safeAreaBottom?: number;
  zIndex?: number;
  rootPortal?: boolean;
  disabled?: boolean;
  onInput?: (key: string) => void;
  onDelete?: () => void;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
};

function Key({ item, car = false, large = false, loading = false, disabled, onPress }: { item: KeyboardKey; car?: boolean; large?: boolean; loading?: boolean; disabled: boolean; onPress: (item: KeyboardKey) => void }) {
  const [pressed, setPressed] = useState(false);
  const touch = useRef<{ x: number; y: number }>(), cancelled = useRef(false);
  useEffect(() => { if (disabled) { setPressed(false); touch.current = undefined; } }, [disabled]);
  const release = () => { 'background only'; setPressed(false); touch.current = undefined; };
  return <view className={`ui-keyboard-key-wrap ${item.wider ? 'ui-keyboard-key-wider' : ''} ${car ? 'ui-keyboard-key-car-wrap' : ''} ${large ? 'ui-keyboard-key-large-wrap' : ''}`}>
    <view className={`ui-keyboard-key ui-keyboard-key-${item.type ?? 'input'} ${car ? 'ui-keyboard-key-car' : ''} ${large ? 'ui-keyboard-key-large' : ''} ${pressed ? 'ui-keyboard-key-pressed' : ''}`} accessibility-element={item.type !== 'blank'} accessibility-traits="button" accessibility-label={item.type === 'delete' ? item.text || '删除' : item.type === 'extra' && !item.text ? '收起键盘' : item.text}
      bindtouchstart={(event: TouchEvent) => { 'background only'; cancelled.current = false; const point = event.touches[0]; if (!disabled && point) { touch.current = { x: point.clientX, y: point.clientY }; setPressed(true); } }}
      bindtouchmove={(event: TouchEvent) => { 'background only'; const start = touch.current, point = event.touches[0]; if (start && point && Math.max(Math.abs(point.clientX - start.x), Math.abs(point.clientY - start.y)) > 6) { cancelled.current = true; release(); } }}
      bindtouchend={release} bindtouchcancel={() => { 'background only'; cancelled.current = true; release(); }}
      bindmousedown={() => { 'background only'; cancelled.current = false; if (!disabled) setPressed(true); }} bindmouseleave={release} global-bindmouseup={pressed ? release : undefined}
      catchtap={() => { 'background only'; release(); if (!disabled && !cancelled.current && item.type !== 'blank') onPress(item); }}>
      {loading ? <Loading size={20} color="#fff" /> : item.type === 'delete' && !item.text ? <Icon name="del" size={22} /> : item.type === 'extra' && !item.text ? <Icon name="keyboard" size={22} /> : <text>{item.text}</text>}
    </view>
  </view>;
}

export function Keyboard({ visible = false, onVisibleChange, value, defaultValue = '', onChange, mode = 'default', title, extraKey, maxlength = Infinity, showDeleteKey = true, deleteText = '', closeText = '', closeButtonLoading = false, randomKeyOrder = false, carLang, onCarLangChange, autoSwitchLang = false, modal = false, hideOnClickOutside = true, lockScroll = true, safeAreaInsetBottom = true, safeAreaBottom = 0, zIndex = 100, rootPortal = false, disabled: disabledProp, onInput, onDelete, onClose, className = '', style }: KeyboardProps) {
  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const [inner, setInner] = useState(defaultValue), [language, setLanguage] = useState<CarKeyboardLang>('zh'), [digits, setDigits] = useState<readonly string[]>(keyboardDigits);
  const current = value ?? inner, lang = carLang ?? language, latest = useRef(current);
  latest.current = current;
  // Randomness belongs on the background thread, once per opening/configuration.
  useEffect(() => { if (visible) setDigits(randomKeyOrder ? shuffleKeyboardDigits() : keyboardDigits); }, [visible, randomKeyOrder]);
  const changeLanguage = (next: CarKeyboardLang) => { 'background only'; if (carLang === undefined) setLanguage(next); onCarLangChange?.(next); };
  const close = () => { 'background only'; if (!visible) return; onVisibleChange?.(false); onClose?.(); };
  const commit = (next: string) => { 'background only'; if (value === undefined) { latest.current = next; setInner(next); } onChange?.(next); };
  const press = (item: KeyboardKey) => {
    'background only';
    if (!visible || disabled) return;
    if (item.type === 'close') { if (!closeButtonLoading) close(); return; }
    if (item.type === 'extra') {
      if (!item.text) { close(); return; }
      if (mode === 'car' && (item.text === 'ABC' || item.text === '省份')) { changeLanguage(lang === 'zh' ? 'en' : 'zh'); return; }
    }
    if (item.type === 'delete') {
      const next = Array.from(latest.current).slice(0, -1).join('');
      onDelete?.(); commit(next);
      if (mode === 'car' && carLang === undefined && autoSwitchLang && !next) changeLanguage('zh');
      return;
    }
    const next = keyboardAppend(latest.current, item.text, maxlength);
    if (next === latest.current) return;
    onInput?.(item.text); commit(next);
    if (mode === 'car' && carLang === undefined && autoSwitchLang && Array.from(next).length === 1) changeLanguage('en');
  };
  const headerClose = !!closeText && mode !== 'custom', header = title !== undefined && title !== '' || headerClose;
  const safe = safeAreaInsetBottom && Number.isFinite(safeAreaBottom) ? Math.max(0, safeAreaBottom) : 0;
  const keys = keyboardKeys(mode, digits, extraKey, showDeleteKey, deleteText, lang);
  return <Popup show={visible} onChange={onVisibleChange} onClose={onClose} position="bottom" zIndex={zIndex} modal={hideOnClickOutside} modalStyle={modal ? undefined : { backgroundColor: 'transparent' }} lockScroll={lockScroll} rootPortal={rootPortal} className="ui-keyboard-popup">
    <view className={`ui-keyboard ${disabled ? 'ui-keyboard-disabled' : ''} ${className}`} style={{ paddingBottom: `${safe}px`, ...style }}>
      {header ? <view className="ui-keyboard-header"><view className="ui-keyboard-title">{typeof title === 'string' ? <text>{title}</text> : title}</view>{headerClose ? <view className="ui-keyboard-close" catchtap={close}><text>{closeText}</text></view> : null}</view> : null}
      <view className={`ui-keyboard-body ${header ? 'ui-keyboard-body-with-header' : ''}`}>
        <view className={`ui-keyboard-keys ${mode === 'car' ? 'ui-keyboard-car-keys' : ''}`}>{keys.map((item, index) => <Key key={`${item.type ?? 'input'}-${item.text}-${index}`} item={item} car={mode === 'car'} disabled={disabled || !visible} onPress={press} />)}</view>
        {mode === 'custom' ? <view className="ui-keyboard-sidebar">{showDeleteKey ? <Key item={{ text: deleteText, type: 'delete' }} large disabled={disabled || !visible} onPress={press} /> : null}<Key item={{ text: closeText, type: 'close' }} large loading={closeButtonLoading} disabled={disabled || !visible || closeButtonLoading} onPress={press} /></view> : null}
      </view>
    </view>
  </Popup>;
}
