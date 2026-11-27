import { useLocale } from './useLocale.js';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode, Ref } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import { Badge } from './Badge.js';
import type { BadgeProps } from './Badge.js';
import { Icon } from './Icon.js';
import { Transition } from './Transition.js';
import { nextTab, tabsIndex } from './tabsModel.js';
import type { TabsValue } from './tabsModel.js';

export type TabOption = { label: string; value: string; disabled?: boolean };
export type TabsItem = { name?: TabsValue; title: string; disabled?: boolean; lazy?: boolean; badgeProps?: Omit<BadgeProps, 'children'>; children?: ReactNode; className?: string };
export type TabsEvent = { index: number; name: TabsValue };
export type TabsRef = { setActive: (value: TabsValue) => void; scrollIntoView: () => void; updateLineStyle: () => void };
export type TabsLineTheme = 'normal' | 'text' | 'underline' | 'dot';
export type StandardTabsProps = {
  items: readonly TabsItem[];
  variant?: 'standard';
  value?: TabsValue;
  defaultValue?: TabsValue;
  onChange?: (value: TabsValue, event: TabsEvent) => void;
  onClick?: (event: TabsEvent) => void;
  onDisabled?: (event: TabsEvent) => void;
  slidable?: 'auto' | 'always'; slidableNum?: number; mapNum?: number; mapTitle?: string;
  showScrollbar?: boolean; sticky?: boolean; offsetTop?: number;
  swipeable?: boolean; animated?: boolean; duration?: number;
  lineTheme?: TabsLineTheme; lineWidth?: number | string; lineHeight?: number | string;
  color?: string; inactiveColor?: string;
  className?: string; style?: CSSProperties; ref?: Ref<TabsRef>;
};
export type LegacyTabsProps = { options: readonly TabOption[]; value: string; onChange: (value: string) => void; className?: string };
export type TabsProps = StandardTabsProps | LegacyTabsProps;
const unit = (n: string | number) => typeof n === 'number' ? `${n}px` : n;

/** Existing options API deliberately retains its production appearance. */
export function Tabs(props: LegacyTabsProps): ReactNode;
export function Tabs(props: StandardTabsProps): ReactNode;
export function Tabs(props: TabsProps): ReactNode {
  if ('items' in props) return <StandardTabs {...props} />;
  return <view className={`ui-tabs ${props.className ?? ''}`}>{props.options.map(option => <view key={option.value} className={`ui-tab ${option.value === props.value ? 'ui-tab-active' : ''} ${option.disabled ? 'ui-tab-disabled' : ''}`} bindtap={() => { 'background only'; if (!option.disabled) props.onChange(option.value); }}><text>{option.label}</text></view>)}</view>;
}

const StandardTabs = forwardRef<TabsRef, StandardTabsProps>(function StandardTabs({ items, value, defaultValue = 0, onChange, onClick, onDisabled, slidable = 'auto', slidableNum = 6, mapNum = 10, mapTitle = '', showScrollbar = false, sticky = false, offsetTop = 0, swipeable = false, animated = false, duration = 300, lineTheme = 'normal', lineWidth, lineHeight, color, inactiveColor, className = '', style }, ref) {
  const { t: localeText } = useLocale();

  const [inner, setInner] = useState(defaultValue), [map, setMap] = useState(false);
  const [widths, setWidths] = useState<Record<number, number>>({}), [labels, setLabels] = useState<Record<number, number>>({});
  const [heights, setHeights] = useState<Record<number, number>>({}), [viewport, setViewport] = useState(0), [drag, setDrag] = useState(0);
  const selected = tabsIndex(items, value ?? inner);
  const visited = useRef(new Set<number>()); // Written in effects, never during render.
  const [loaded, setLoaded] = useState<readonly number[]>([]);
  const scroll = useRef<NodesRef | null>(null);
  const touch = useRef<{ x: number; y: number; axis?: 'x' | 'y' } | null>(null);
  const scrolling = slidable === 'always' || items.length >= slidableNum;
  const withMap = items.length >= mapNum;
  const headerWidth = Math.max(0, viewport - (withMap ? 44 : 0));
  const itemWidth = (i: number) => widths[i] ?? headerWidth / Math.max(items.length, 1);
  const left = items.slice(0, Math.max(0, selected)).reduce((sum, _, i) => sum + itemWidth(i), 0);
  const activeWidth = itemWidth(selected);
  const totalWidth = items.reduce((sum, _, i) => sum + itemWidth(i), 0);
  const scrollActive = () => {
    'background only';
    if (scrolling && selected >= 0) scroll.current?.invoke({ method: 'scrollTo', params: { index: 0, offset: Math.max(0, Math.min(totalWidth - headerWidth, left + activeWidth / 2 - headerWidth / 2)), smooth: true } }).exec();
  };
  useEffect(() => { if (selected >= 0 && !visited.current.has(selected)) { visited.current.add(selected); setLoaded([...visited.current]); } }, [selected]);
  useEffect(scrollActive, [selected, scrolling, headerWidth, left, activeWidth, totalWidth]);
  const select = (index: number, click = false) => {
    'background only';
    const item = items[index]; if (!item) return;
    const event = { index, name: item.name ?? index };
    if (item.disabled) { if (click) onDisabled?.(event); return; }
    setMap(false);
    if (index !== selected) { if (value === undefined) setInner(event.name); onChange?.(event.name, event); }
    if (click) onClick?.(event);
  };
  useImperativeHandle(ref, () => ({ setActive: next => { 'background only'; select(tabsIndex(items, next)); }, scrollIntoView: scrollActive, updateLineStyle: scrollActive }), [items, selected, scrolling, left, activeWidth, headerWidth, totalWidth, onChange]);
  const size = (setter: typeof setWidths, index: number, n: number) => { 'background only'; setter(previous => previous[index] === n ? previous : { ...previous, [index]: n }); };
  const lineW = lineWidth ?? (lineTheme === 'text' ? labels[selected] ?? 24 : lineTheme === 'underline' ? activeWidth : lineTheme === 'dot' ? 6 : 24);
  const lineH = lineHeight ?? (lineTheme === 'underline' ? 2 : lineTheme === 'dot' ? 6 : 4);
  const milliseconds = Number.isFinite(duration) ? Math.max(0, duration) : 300;
  const header = <view className={`ui-tabs-standard-header ${sticky ? 'ui-tabs-sticky' : ''}`} style={{ position: sticky ? 'sticky' : 'relative', top: sticky ? `${offsetTop}px` : 'auto', zIndex: sticky ? 3 : 2 }}>
    <scroll-view ref={scroll} className="ui-tabs-nav-scroll" scroll-orientation="horizontal" scroll-x={scrolling} enable-scroll={scrolling} scroll-bar-enable={showScrollbar} style={{ zIndex: 0, marginRight: withMap ? '44px' : undefined }}>
      <view className={`ui-tabs-nav-track ${scrolling ? 'ui-tabs-nav-slidable' : ''}`}>
        {items.map((item, index) => <view key={`${typeof item.name}:${item.name ?? index}`} className={`ui-tabs-nav-item ${selected === index ? 'ui-tabs-nav-active' : ''} ${item.disabled ? 'ui-tabs-nav-disabled' : ''}`} style={{ color: item.disabled ? undefined : selected === index ? color : inactiveColor }} flatten={false} bindlayoutchange={e => size(setWidths, index, e.detail.width)} bindtap={() => select(index, true)} accessibility-element accessibility-traits="button" accessibility-label={`${item.title}${selected === index ? localeText('common.selected') : ''}${item.disabled ? localeText('common.disabled') : ''}`}>
          <Badge {...item.badgeProps}><text className="ui-tabs-nav-label" style={{ color: item.disabled ? undefined : selected === index ? color : inactiveColor }} bindlayoutchange={e => size(setLabels, index, e.detail.width)}>{item.title}</text></Badge>
        </view>)}
        {selected >= 0 ? <view className={`ui-tabs-line ui-tabs-line-${lineTheme}`} user-interaction-enabled={false} style={{ left: `${left + activeWidth / 2}px`, width: unit(lineW), height: unit(lineH), backgroundColor: color, transitionDuration: `${milliseconds}ms` }} /> : null}
      </view>
    </scroll-view>
    {withMap ? <view className="ui-tabs-map-toggle" bindtap={() => { 'background only'; setMap(!map); }} accessibility-element accessibility-traits="button" accessibility-label={localeText('tabs.map')}><view style={{ transform: map ? 'rotate(180deg)' : undefined }}><Icon name="down" size={16} /></view></view> : null}
    <Transition show={map} name="fade-down" duration={milliseconds} lazyRender className="ui-tabs-map">
      {mapTitle ? <text className="ui-tabs-map-title">{mapTitle}</text> : null}
      <view className="ui-tabs-map-items">{items.map((item, i) => <view key={i} className={`ui-tabs-map-item ${i === selected ? 'ui-tabs-map-active' : ''} ${item.disabled ? 'ui-tabs-map-disabled' : ''}`} bindtap={() => select(i, true)}><text>{item.title}</text></view>)}</view>
    </Transition>
  </view>;
  const hasContent = items.some(item => item.children !== undefined);
  return <view className={`ui-tabs-standard ${className}`} style={style} bindlayoutchange={e => { 'background only'; setViewport(e.detail.width); }}>
    {header}
    {hasContent ? <view className={`ui-tabs-content ${swipeable ? 'ui-tabs-swipeable' : ''}`} style={{ height: animated && heights[selected] !== undefined ? `${heights[selected]}px` : undefined }} consume-slide-event={swipeable ? [[-30, 30], [150, 180], [-180, -150]] : undefined}
      bindtouchstart={e => { 'background only'; const t = e.touches[0]; touch.current = swipeable && t ? { x: t.clientX, y: t.clientY } : null; }}
      bindtouchmove={e => { 'background only'; const t = e.touches[0], start = touch.current; if (!t || !start || e.touches.length !== 1) return; const dx = t.clientX - start.x, dy = t.clientY - start.y; if (!start.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 5) start.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; if (start.axis === 'x' && animated) setDrag(nextTab(items, selected, dx > 0 ? -1 : 1) === selected ? dx / 3 : dx); }}
      bindtouchend={e => { 'background only'; const start = touch.current, t = e.changedTouches[0]; touch.current = null; setDrag(0); if (t && start && Math.abs(t.clientX - start.x) > Math.max(40, viewport / 5) && Math.abs(t.clientX - start.x) > Math.abs(t.clientY - start.y)) select(nextTab(items, selected, t.clientX < start.x ? 1 : -1)); }}
      bindtouchcancel={() => { 'background only'; touch.current = null; setDrag(0); }}>
      <view className={`ui-tabs-panels ${animated ? 'ui-tabs-panels-animated' : ''}`} style={animated ? { transform: `translateX(${-Math.max(0, selected) * viewport + drag}px)`, transitionDuration: `${drag ? 0 : milliseconds}ms` } : undefined}>
        {items.map((item, index) => <view key={`${typeof item.name}:${item.name ?? index}`} className={`ui-tabs-pane ${!animated && selected !== index ? 'ui-tabs-pane-hidden' : ''} ${item.className ?? ''}`} style={animated ? { width: `${viewport}px` } : undefined} user-interaction-enabled={selected === index} accessibility-elements-hidden={selected !== index} bindlayoutchange={e => size(setHeights, index, e.detail.height)}>{animated || item.lazy === false || selected === index || loaded.includes(index) ? item.children : null}</view>)}
      </view>
    </view> : null}
    {map && hasContent ? <view className="ui-tabs-map-mask" bindtap={() => { 'background only'; setMap(false); }} /> : null}
  </view>;
});
