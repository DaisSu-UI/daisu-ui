import { useEffect, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import { List } from '@lynx-js/lynx-ui';
import type { ListRef } from '@lynx-js/lynx-ui';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import { anchorKey, indexBarIndexAtPoint, indexBarLayout, indexBarSectionAtOffset, indexBarSize, indexBarStickyOffset } from './indexBarModel.js';
import type { AnchorIndex, IndexBarSection } from './indexBarModel.js';

export type IndexAnchorProps = { index: AnchorIndex; children?: ReactNode; className?: string; style?: CSSProperties };
export function IndexAnchor({ index, children, className = '', style }: IndexAnchorProps) {
  const content = children ?? index;
  return <view className={`ui-index-anchor ${className}`} style={style}>{typeof content === 'string' || typeof content === 'number' ? <text>{content}</text> : content}</view>;
}

export type IndexBarRenderItem<T> = { item: T; itemIndex: number; section: IndexBarSection<T>; sectionIndex: number };
export type IndexBarProps<T> = {
  listId: string;
  sections: readonly IndexBarSection<T>[];
  renderItem: (state: IndexBarRenderItem<T>) => ReactNode;
  renderAnchor?: (state: { section: IndexBarSection<T>; sectionIndex: number }) => ReactNode;
  getItemKey?: (state: IndexBarRenderItem<T>) => string | number;
  sticky?: boolean;
  itemHeight?: number;
  anchorHeight?: number;
  onChange?: (event: { index: AnchorIndex }) => void;
  className?: string;
  style?: CSSProperties;
};

/** Stable, predictable row sizes let the native List jump without mounting every city. */
export function IndexBar<T>(props: IndexBarProps<T>) {
  const identity = JSON.stringify([props.listId, props.sections.map(section => [section.index, section.data.length]), props.itemHeight, props.anchorHeight]);
  return <IndexBarContent key={identity} {...props} />;
}

type Point = { clientY?: number; pageY?: number; y?: number };
type Pointer = Point & { touches?: Point[]; changedTouches?: Point[]; detail?: Point };
type RailRect = { top: number; height: number };
type Drag = { sequence: number; pressed: boolean; ended: boolean; moved: boolean; point: number; rect?: RailRect };

function IndexBarContent<T>({ listId, sections, renderItem, renderAnchor, getItemKey, sticky = false, itemHeight = 44, anchorHeight = 36, onChange, className = '', style }: IndexBarProps<T>) {
  const list = useRef<ListRef>(null);
  const rail = useRef<NodesRef>(null);
  const [selected, setSelected] = useState(sections.length ? 0 : -1);
  const [touching, setTouching] = useState(false);
  const [stickyOffset, setStickyOffset] = useState(0);
  const active = useRef(selected);
  const lastTouch = useRef(0);
  const lastEnd = useRef(0);
  const drag = useRef<Drag>({ sequence: 0, pressed: false, ended: false, moved: false, point: 0 });
  const rowSize = indexBarSize(itemHeight, 44);
  const anchorSize = indexBarSize(anchorHeight, 36);
  const layout = indexBarLayout(sections, rowSize, anchorSize);
  useEffect(() => () => { drag.current.sequence++; drag.current.pressed = false; }, []);

  const activate = (sectionIndex: number, scroll: boolean) => {
    'background only';
    const section = sections[sectionIndex];
    if (!section) return;
    if (active.current !== sectionIndex) {
      active.current = sectionIndex;
      setSelected(sectionIndex);
      onChange?.({ index: section.index });
    }
    if (scroll) {
      setStickyOffset(0);
      list.current?.scrollTo(false, 'top', layout[sectionIndex]!.position, 0);
    }
  };
  const coordinate = (event: Pointer) => {
    'background only';
    const touch = event.touches?.[0] ?? event.changedTouches?.[0];
    return [touch?.clientY, touch?.pageY, event.clientY, event.pageY, event.detail?.clientY, event.detail?.pageY, touch?.y, event.y, event.detail?.y].find(point => typeof point === 'number' && Number.isFinite(point));
  };
  const applyPoint = () => {
    'background only';
    const current = drag.current;
    if (!current.rect || (!current.moved && !current.ended)) return;
    const index = indexBarIndexAtPoint(current.point, current.rect.top, current.rect.height, sections.length);
    if (index !== active.current || current.ended) activate(index, true);
    if (current.ended) { current.pressed = false; setTouching(false); }
  };
  const start = (event: Pointer, mouse = false) => {
    'background only';
    if (mouse && Date.now() - lastTouch.current < 500) return;
    if (!mouse) lastTouch.current = Date.now();
    const point = coordinate(event);
    if (point === undefined || !rail.current || !sections.length) return;
    const sequence = drag.current.sequence + 1;
    drag.current = { sequence, pressed: true, ended: false, moved: false, point };
    setTouching(true);
    rail.current.invoke({ method: 'boundingClientRect', params: { androidEnableTransformProps: true, iosEnableTransformProps: true }, success: (result: unknown) => {
      'background only';
      if (drag.current.sequence !== sequence) return;
      drag.current.rect = result as RailRect;
      applyPoint();
    }, fail: () => { 'background only'; if (drag.current.sequence === sequence) { drag.current.pressed = false; setTouching(false); } } }).exec();
  };
  const move = (event: Pointer) => {
    'background only';
    if (!drag.current.pressed) return;
    const point = coordinate(event);
    if (point === undefined) return;
    drag.current.point = point;
    drag.current.moved = true;
    applyPoint();
  };
  const end = (event: Pointer) => {
    'background only';
    if (!drag.current.pressed || drag.current.ended) return;
    const point = coordinate(event);
    if (point !== undefined) drag.current.point = point;
    drag.current.ended = true;
    lastEnd.current = Date.now();
    setTouching(false);
    applyPoint();
  };
  const cancel = () => {
    'background only';
    drag.current.sequence++;
    drag.current.pressed = false;
    setTouching(false);
  };

  return <view className={`ui-index-bar ${className}`} style={style}>
    <List ref={list} listId={listId} listType="single" spanCount={1} scrollOrientation="vertical" scrollEventThrottle={16} className="ui-index-bar-list" onScroll={event => {
      'background only';
      const section = indexBarSectionAtOffset(layout, event.detail.scrollTop);
      if (!drag.current.pressed) activate(section, false);
      if (sticky) setStickyOffset(indexBarStickyOffset(layout, section, event.detail.scrollTop, anchorSize));
    }}>
      {sections.flatMap((section, sectionIndex) => [
        <list-item key={`anchor:${anchorKey(section.index)}`} item-key={`anchor:${anchorKey(section.index)}`} estimated-main-axis-size-px={anchorSize} style={{ height: `${anchorSize}px` }}><IndexAnchor index={section.index} style={{ height: `${anchorSize}px` }}>{renderAnchor?.({ section, sectionIndex })}</IndexAnchor></list-item>,
        ...section.data.map((item, itemIndex) => {
          const state = { item, itemIndex, section, sectionIndex };
          const key = `item:${anchorKey(section.index)}:${getItemKey?.(state) ?? itemIndex}`;
          return <list-item key={key} item-key={key} estimated-main-axis-size-px={rowSize} style={{ height: `${rowSize}px` }}>{renderItem(state)}</list-item>;
        }),
      ])}
    </List>
    {sticky && sections[selected] ? <view className="ui-index-bar-sticky" user-interaction-enabled={false} style={{ transform: `translateY(${stickyOffset}px)` }}><IndexAnchor index={sections[selected]!.index} style={{ height: `${anchorSize}px` }}>{renderAnchor?.({ section: sections[selected]!, sectionIndex: selected })}</IndexAnchor></view> : null}
    {touching && sections[selected] ? <view className="ui-index-bar-current" user-interaction-enabled={false}><text>{sections[selected]!.index}</text></view> : null}
    {sections.length ? <view ref={rail} className="ui-index-bar-rail" consume-slide-event={[[-180, 180]]} catchtouchstart={event => { 'background only'; start(event); }} catchtouchmove={move} catchtouchend={end} catchtouchcancel={cancel} catchmousedown={event => { 'background only'; start(event, true); }} global-bindmousemove={move} global-bindmouseup={end} global-bindtouchmove={move} global-bindtouchend={end} global-bindtouchcancel={cancel}>
      {sections.map((section, index) => <view key={anchorKey(section.index)} className={`ui-index-bar-index ${selected === index ? 'ui-index-bar-index-active' : ''}`} accessibility-element accessibility-traits="button" accessibility-label={`索引 ${section.index}${selected === index ? '，已选中' : ''}`} bindtap={() => { 'background only'; if (Date.now() - lastEnd.current >= 400) activate(index, true); }}><text>{section.index}</text></view>)}
    </view> : null}
  </view>;
}
