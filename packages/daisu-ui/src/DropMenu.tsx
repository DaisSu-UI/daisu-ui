import { useLocale } from './useLocale.js';
import { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { Overlay } from './Overlay.js';
import { RootPortal } from './RootPortal.js';
import { Transition } from './Transition.js';

type MenuId = object;
type MenuRect = { top: number; bottom: number };
type ActiveMenu = { id: MenuId; portal: boolean; close: () => void };
type MenuContextValue = {
  active: MenuId | undefined;
  rect: MenuRect | undefined;
  direction: 'down' | 'up';
  topOffset: number;
  duration: number;
  zIndex: number;
  claim: () => number;
  isCurrent: (ticket: number) => boolean;
  measure: () => Promise<MenuRect | undefined>;
  activate: (item: ActiveMenu, rect: MenuRect) => void;
  close: (id: MenuId) => void;
};
const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export type DropMenuProps = {
  zIndex?: number;
  direction?: 'down' | 'up';
  topOffset?: number;
  modal?: boolean;
  closeOnClickModal?: boolean;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};
export type DropMenuValue = string | number;
export type DropMenuOption = Record<string, unknown>;
export type DropMenuItemRef = {
  getShowPop: () => boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};
export type DropMenuItemProps = {
  value?: DropMenuValue;
  defaultValue?: DropMenuValue;
  onChange?: (event: { value: DropMenuValue; selectedItem: DropMenuOption }) => void;
  options?: readonly DropMenuOption[];
  disabled?: boolean;
  title?: string;
  icon?: string;
  iconSize?: number;
  iconName?: string;
  activeColor?: string;
  beforeToggle?: (event: { status: boolean }) => boolean | Promise<boolean>;
  valueKey?: string;
  labelKey?: string;
  tipKey?: string;
  popupClassName?: string;
  popupStyle?: CSSProperties;
  popupHeight?: string | number;
  rootPortal?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onOpen?: () => void;
  onOpened?: () => void;
  onClose?: () => void;
  onClosed?: () => void;
};

function anchorStyle(rect: MenuRect | undefined, direction: 'down' | 'up', topOffset = 0): CSSProperties {
  return direction === 'down' ? { top: `${Math.max(0, rect?.bottom ?? 0)}px`, bottom: 0 } : { top: `${Math.max(0, topOffset)}px`, bottom: `calc(100% - ${Math.max(0, rect?.top ?? 0)}px)` };
}

export function DropMenu({ zIndex = 12, direction = 'down', topOffset = 0, modal = true, closeOnClickModal = true, duration = 200, className = '', style, children }: DropMenuProps) {
  const node = useRef<NodesRef | null>(null);
  const [active, setActive] = useState<ActiveMenu>();
  const [rect, setRect] = useState<MenuRect>();
  const activeRef = useRef<ActiveMenu>();
  const lastPortal = useRef(false);
  const generation = useRef(0);
  const measure = () => {
    'background only';
    return new Promise<MenuRect | undefined>(resolve => {
      if (!node.current) { resolve(undefined); return; }
      node.current.invoke({ method: 'boundingClientRect', params: { androidEnableTransformProps: true, iosEnableTransformProps: true }, success: (result: unknown) => {
        'background only';
        const value = result as Partial<MenuRect> | null;
        resolve(value && typeof value.top === 'number' && typeof value.bottom === 'number' && Number.isFinite(value.top) && Number.isFinite(value.bottom) ? { top: value.top, bottom: value.bottom } : undefined);
      }, fail: () => resolve(undefined) }).exec();
    });
  };
  const close = (id: MenuId) => { 'background only'; if (activeRef.current?.id === id) { activeRef.current = undefined; setActive(undefined); } };
  useEffect(() => () => { generation.current++; activeRef.current = undefined; }, []);
  const context: MenuContextValue = {
    active: active?.id, rect, direction, topOffset, duration, zIndex,
    claim: () => { 'background only'; return ++generation.current; },
    isCurrent: ticket => { 'background only'; return ticket === generation.current; },
    measure,
    activate: (item, nextRect) => { 'background only'; lastPortal.current = item.portal; activeRef.current = item; setRect(nextRect); setActive(item); },
    close,
  };
  return <MenuContext.Provider value={context}>
    <view ref={node} flatten={false} className={`ui-drop-menu ${className}`} style={style} bindlayoutchange={() => {
      'background only';
      const current = activeRef.current;
      if (current) void measure().then(next => { 'background only'; if (next && current === activeRef.current) setRect(next); });
    }}>{children}</view>
    {modal ? <Overlay show={!!active} rootPortal={lastPortal.current} zIndex={zIndex} duration={duration} style={anchorStyle(rect, direction, topOffset)} onTap={() => { 'background only'; if (closeOnClickModal) activeRef.current?.close(); }} /> : null}
  </MenuContext.Provider>;
}

function SelectedIcon({ name, size, color }: { name: string; size: number; color?: string }) {
  return color ? <Icon name={name} size={size} color={color} /> : <><Icon name={name} size={size} color="#f86100" className="ui-drop-menu-primary-light" /><Icon name={name} size={size} color="#ff812e" className="ui-drop-menu-primary-dark" /></>;
}

export const DropMenuItem = forwardRef<DropMenuItemRef, DropMenuItemProps>(function DropMenuItem({ value, defaultValue, onChange, options = [], disabled = false, title, icon = 'caret-down', iconSize = 16, iconName = 'check', activeColor, beforeToggle, valueKey = 'value', labelKey = 'label', tipKey = 'tip', popupClassName = '', popupStyle, popupHeight, rootPortal = false, className = '', style, children, onOpen, onOpened, onClose, onClosed }, ref) {
  const { t: localeText } = useLocale();

  const menu = useContext(MenuContext);
  if (!menu) throw new Error('DropMenuItem requires a DropMenu parent.');
  const id = useRef<MenuId>({}).current;
  const [inner, setInner] = useState(defaultValue);
  const [present, setPresent] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [height, setHeight] = useState(0);
  const show = menu.active === id;
  const current = value === undefined ? inner : value;
  const selected = options.find(item => item[valueKey] === current);
  const label = title ?? String(selected?.[labelKey] ?? '');
  const requestId = useRef(0);
  const pending = useRef<boolean | undefined>(undefined);
  const latest = useRef({ menu, disabled, show, beforeToggle, rootPortal });
  latest.current = { menu, disabled, show, beforeToggle, rootPortal };
  const requestRef = useRef<(status: boolean) => void>(() => {});
  const request = (status: boolean) => {
    'background only';
    const state = latest.current;
    if (state.disabled || pending.current === status) return;
    if (state.show === status) { requestId.current++; pending.current = undefined; return; }
    const sequence = ++requestId.current;
    pending.current = status;
    const ticket = status ? state.menu.claim() : undefined;
    const valid = () => sequence === requestId.current && !latest.current.disabled && (ticket === undefined || latest.current.menu.isCurrent(ticket));
    void (async () => {
      try {
        if (state.beforeToggle && !await state.beforeToggle({ status })) return;
        if (!valid()) return;
        if (status) {
          const nextRect = await latest.current.menu.measure();
          if (!nextRect || !valid()) return;
          setPresent(true);
          setHidden(false);
          latest.current.menu.activate({ id, portal: latest.current.rootPortal, close: () => { 'background only'; requestRef.current(false); } }, nextRect);
        } else latest.current.menu.close(id);
      } catch { /* A rejected guard cancels only this item's request. */ }
      finally { if (sequence === requestId.current) pending.current = undefined; }
    })();
  };
  requestRef.current = request;
  useEffect(() => {
    if (disabled) { requestId.current++; pending.current = undefined; menu.close(id); }
  }, [disabled]);
  useEffect(() => () => { requestId.current++; latest.current.menu.close(id); }, []);
  useImperativeHandle(ref, () => ({
    getShowPop: () => { 'background only'; return latest.current.show; },
    open: () => { 'background only'; requestRef.current(true); },
    close: () => { 'background only'; requestRef.current(false); },
    toggle: () => { 'background only'; requestRef.current(!(pending.current ?? latest.current.show)); },
  }), []);
  const select = (option: DropMenuOption) => {
    'background only';
    const next = option[valueKey];
    if (!latest.current.show || disabled || typeof next !== 'string' && typeof next !== 'number') return;
    if (next !== current) { if (value === undefined) setInner(next); onChange?.({ value: next, selectedItem: option }); }
    request(false);
  };
  const layer = present ? <view className={`ui-drop-menu-layer ui-drop-menu-layer-${menu.direction}`} style={{ ...anchorStyle(menu.rect, menu.direction, menu.topOffset), zIndex: menu.zIndex + 1, display: hidden ? 'none' : 'flex' }} event-through>
    <Transition show={show} name={menu.direction === 'down' ? 'slide-down' : 'slide-up'} duration={menu.duration} lazyRender destroy={false} interactiveDuringLeave className={`ui-drop-menu-popup ${popupClassName}`} style={popupStyle} onBeforeEnter={onOpen} onAfterEnter={onOpened} onBeforeLeave={onClose} onAfterLeave={() => { 'background only'; setHidden(true); onClosed?.(); }}>
      <scroll-view className="ui-drop-menu-scroll" scroll-orientation="vertical" scroll-y scroll-bar-enable={false} style={{ zIndex: 0, height: popupHeight === undefined ? `${height}px` : typeof popupHeight === 'number' ? `${Math.max(0, popupHeight)}px` : popupHeight }}>
        <view className="ui-drop-menu-content" flatten={false} bindlayoutchange={event => { 'background only'; const next = event.detail.height; if (Number.isFinite(next) && next !== height) setHeight(next); }} catchtap={() => {}}>
          {children ?? <view className="ui-drop-menu-options">
            {options.map((option, index) => {
              const active = option[valueKey] === current;
              return <view key={`${typeof option[valueKey]}:${String(option[valueKey])}:${index}`} className={`ui-drop-menu-option ${active ? 'ui-drop-menu-option-selected' : ''}`} bindtap={() => select(option)} accessibility-element accessibility-traits="button" accessibility-label={`${String(option[labelKey] ?? '')}${active ? localeText('common.selected') : ''}`}>
                <view className="ui-drop-menu-option-copy"><text className="ui-drop-menu-option-label" style={active ? { color: activeColor } : undefined} text-maxline="1" text-overflow="ellipsis">{String(option[labelKey] ?? '')}</text>{option[tipKey] ? <text className="ui-drop-menu-option-tip" style={active ? { color: activeColor } : undefined} text-maxline="1" text-overflow="ellipsis">{String(option[tipKey])}</text> : null}</view>
                {active && iconName ? <SelectedIcon name={iconName} size={20} color={activeColor} /> : null}
              </view>;
            })}
          </view>}
        </view>
      </scroll-view>
    </Transition>
  </view> : null;
  return <>
    <view className={`ui-drop-menu-item ${show ? 'ui-drop-menu-item-open' : ''} ${disabled ? 'ui-drop-menu-item-disabled' : ''} ${className}`} style={style} catchtap={() => request(!(pending.current ?? show))} accessibility-element accessibility-traits="button" accessibility-label={`${label}${disabled ? localeText('common.isDisabled') : show ? localeText('common.expanded') : localeText('common.collapsed')}`}>
      <view className="ui-drop-menu-title"><text className="ui-drop-menu-title-text" style={show ? { color: activeColor } : undefined} text-maxline="1" text-overflow="ellipsis">{label}</text>{icon ? <view className="ui-drop-menu-arrow" style={{ transform: `rotate(${show ? 180 : 0}deg)`, transitionDuration: `${menu.duration}ms` }}>{show ? <SelectedIcon name={icon} size={iconSize} color={activeColor} /> : <><Icon name={icon} size={iconSize} color="var(--cso-ui-disclosure)" className="ui-drop-menu-primary-light" /><Icon name={icon} size={iconSize} color="var(--cso-ui-disclosure)" className="ui-drop-menu-primary-dark" /></>}</view> : null}</view>
    </view>
    {rootPortal ? <RootPortal>{layer}</RootPortal> : layer}
  </>;
});
