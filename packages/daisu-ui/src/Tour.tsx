import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, NodesRef } from '@lynx-js/types';
import { Button } from './Button.js';
import { RootPortal } from './RootPortal.js';
import { Transition } from './Transition.js';
import { bubblePosition } from './bubblePosition.js';
import type { BubbleRect } from './bubblePosition.js';

export type TourStep = { element: string; content: string; padding?: number; offset?: number; placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right' };
export type TourStepEvent = { prevCurrent: number; current: number; total: number; isElementInTop: boolean };
export type TourEndEvent = { current: number; total: number };
export type TourRenderState = { current: number; total: number; step: TourStep; elementInfo: BubbleRect; prev: () => void; next: () => void; skip: () => void; finish: () => void };
export type TourRef = { handlePrev: () => void; handleNext: () => void; handleSkip: () => void; handleFinish: () => void; updatePosition: () => void };
export type TourProps = {
  show?: boolean; onShowChange?: (show: boolean) => void; steps: readonly TourStep[];
  current?: number; defaultCurrent?: number; onCurrentChange?: (current: number) => void; onChange?: (event: { current: number }) => void;
  mask?: boolean; maskColor?: string; offset?: number; duration?: number; borderRadius?: number; padding?: number;
  prevText?: string; nextText?: string; skipText?: string; finishText?: string;
  highlightStyle?: CSSProperties; clickMaskNext?: boolean; zIndex?: number; showTourButtons?: boolean; rootPortal?: boolean;
  missingStrategy?: 'skip' | 'stop' | 'hide';
  /** Await host/scroll-view positioning before native target measurement. */
  scrollToTarget?: (step: TourStep, index: number) => void | Promise<void>;
  /** Optional scoped native measurement, e.g. a NodesRef from the caller. */
  getTargetRect?: (step: TourStep, index: number) => BubbleRect | null | Promise<BubbleRect | null>;
  onPrev?: (event: TourStepEvent) => void; onNext?: (event: TourStepEvent) => void;
  onFinish?: (event: TourEndEvent) => void; onSkip?: (event: TourEndEvent) => void;
  onError?: (event: { message: string; element: string }) => void;
  renderContent?: (state: TourRenderState) => ReactNode; renderHighlight?: (state: TourRenderState) => ReactNode;
  renderPrev?: (state: TourRenderState) => ReactNode; renderNext?: (state: TourRenderState) => ReactNode; renderSkip?: (state: TourRenderState) => ReactNode; renderFinish?: (state: TourRenderState) => ReactNode;
  className?: string; style?: CSSProperties;
};
const validRect = (r: BubbleRect | null) => r && [r.left, r.top, r.width, r.height].every(Number.isFinite) && r.width > 0 && r.height > 0;
const positive = (n: number) => Number.isFinite(n) ? Math.max(0, n) : 0;
export const Tour = forwardRef<TourRef, TourProps>(function Tour({ show = false, onShowChange, steps, current, defaultCurrent = 0, onCurrentChange, onChange, mask = true, maskColor = 'rgba(0,0,0,.55)', offset = 20, duration = 300, borderRadius = 4, padding = 8, prevText = '上一步', nextText = '下一步', skipText = '跳过', finishText = '完成', highlightStyle, clickMaskNext = false, zIndex = 999, showTourButtons = true, rootPortal = false, missingStrategy = 'stop', scrollToTarget, getTargetRect, onPrev, onNext, onFinish, onSkip, onError, renderContent, renderHighlight, renderPrev, renderNext, renderSkip, renderFinish, className = '', style }, ref) {
  const [inner, setInner] = useState(defaultCurrent), [revision, setRevision] = useState(0);
  const [geometry, setGeometry] = useState<{ index: number; target: BubbleRect; viewport: BubbleRect } | null>(null);
  const [panelSize, setPanelSize] = useState({ width: 224, height: 100 });
  const [actionsWidth, setActionsWidth] = useState(0);
  const viewport = useRef<NodesRef | null>(null), generation = useRef(0), ended = useRef(false);
  const callbacks = useRef({ scrollToTarget, getTargetRect, onError, onCurrentChange, onChange, onShowChange });
  useEffect(() => { callbacks.current = { scrollToTarget, getTargetRect, onError, onCurrentChange, onChange, onShowChange }; });
  const selected = Math.max(0, Math.min(Math.max(0, steps.length - 1), Number.isFinite(current ?? inner) ? Math.trunc(current ?? inner) : 0));
  const step = steps[selected];
  const identity = JSON.stringify(steps.map(s => [s.element, s.padding, s.offset, s.placement]));
  const setIndex = (index: number) => { 'background only'; if (current === undefined) setInner(index); onCurrentChange?.(index); onChange?.({ current: index }); };
  const close = (reason: 'finish' | 'skip') => { 'background only'; if (!show || ended.current) return; ended.current = true; generation.current++; setGeometry(null); onShowChange?.(false); (reason === 'finish' ? onFinish : onSkip)?.({ current: selected, total: steps.length }); };
  const navigate = (direction: -1 | 1) => { 'background only'; if (!show || ended.current || !step) return; const next = selected + direction; if (next >= steps.length) { close('finish'); return; } if (next < 0) return; const event = { prevCurrent: selected, current: next, total: steps.length, isElementInTop: !!geometry && geometry.target.top < geometry.viewport.top + geometry.viewport.height / 2 }; setIndex(next); (direction < 0 ? onPrev : onNext)?.(event); };
  const updatePosition = () => { 'background only'; setRevision(n => n + 1); };
  useImperativeHandle(ref, () => ({ handlePrev: () => navigate(-1), handleNext: () => navigate(1), handleSkip: () => close('skip'), handleFinish: () => close('finish'), updatePosition }), [show, selected, steps, geometry, onShowChange, onCurrentChange, onChange, onPrev, onNext, onSkip, onFinish]);
  useEffect(() => { if (show) ended.current = false; }, [show]);
  useEffect(() => {
    const token = ++generation.current; let cancelled = false;
    if (!show || !step || ended.current) { setGeometry(null); return; }
    const read = (node: NodesRef | null) => new Promise<BubbleRect | null>(resolve => { 'background only'; if (!node) { resolve(null); return; } node.invoke({ method: 'boundingClientRect', params: { androidEnableTransformProps: true, iosEnableTransformProps: true }, success: value => resolve(value as BubbleRect), fail: () => resolve(null) }).exec(); });
    const measure = async () => {
      'background only';
      try {
        await callbacks.current.scrollToTarget?.(step, selected);
        if (cancelled || token !== generation.current) return;
        const [target, bounds] = await Promise.all([callbacks.current.getTargetRect ? callbacks.current.getTargetRect(step, selected) : read(lynx.createSelectorQuery().select(step.element)), read(viewport.current)]);
        if (cancelled || token !== generation.current) return;
        if (!validRect(target) || !validRect(bounds)) {
          setGeometry(null); callbacks.current.onError?.({ message: `无法定位引导元素：${step.element}`, element: step.element });
          if (missingStrategy === 'skip' && selected < steps.length - 1) { if (current === undefined) setInner(selected + 1); callbacks.current.onCurrentChange?.(selected + 1); callbacks.current.onChange?.({ current: selected + 1 }); }
          else if (missingStrategy === 'hide' || missingStrategy === 'skip') { ended.current = true; callbacks.current.onShowChange?.(false); }
          return;
        }
        setGeometry({ index: selected, target: target!, viewport: bounds! });
      } catch (error) { if (!cancelled && token === generation.current) { setGeometry(null); callbacks.current.onError?.({ message: String(error), element: step.element }); } }
    };
    const frame = setTimeout(() => { void measure(); }, 32);
    return () => { cancelled = true; generation.current++; clearTimeout(frame); };
  }, [show, selected, identity, revision, missingStrategy]);
  const ready = show && !!step && !!geometry ;
  const target = geometry?.target ?? { left: 0, top: 0, width: 0, height: 0 };
  const bounds = geometry?.viewport ?? { left: 0, top: 0, width: 0, height: 0 };
  const pad = positive(step?.padding ?? padding);
  const hole = { left: target.left - pad, top: target.top - pad, width: target.width + pad * 2, height: target.height + pad * 2 };
  const placement = step?.placement === 'auto' || !step?.placement ? hole.top + hole.height / 2 < bounds.top + bounds.height / 2 ? 'bottom' : 'top' : step.placement;
  // The gap is measured from the original target; padding expands the highlight.
  const position = bubblePosition(target, { left: 0, top: 0, ...panelSize }, { left: bounds.left + 12, top: bounds.top + 12, width: Math.max(0, bounds.width - 24), height: Math.max(0, bounds.height - 24) }, placement, positive(step?.offset ?? offset) - 6, false);
  const state: TourRenderState = { current: selected, total: steps.length, step: step!, elementInfo: hole, prev: () => navigate(-1), next: () => navigate(1), skip: () => close('skip'), finish: () => close('finish') };
  const layer = <>
    <view ref={viewport} className="ui-tour-viewport" flatten={false} user-interaction-enabled={false} bindlayoutchange={() => { 'background only'; if (show) updatePosition(); }} />
    <Transition show={ready} lazyRender destroy={false} duration={positive(duration)} name="fade" className={`ui-tour ${className}`} style={{ zIndex, ...style }} onTap={() => { 'background only'; if (clickMaskNext) navigate(1); }}>
      <view className="ui-tour-blocker" consume-slide-event={[[-180, 180]]} catchtouchmove={() => {}} />
      <view className="ui-tour-highlight" catchtap={() => {}} style={{ left: `${hole.left}px`, top: `${hole.top}px`, width: `${hole.width}px`, height: `${hole.height}px`, borderRadius: `${positive(borderRadius)}px`, boxShadow: mask ? `0 0 0 ${Math.max(bounds.width, bounds.height) * 2}px ${maskColor}` : undefined, transitionDuration: `${positive(duration)}ms`, ...highlightStyle }}>{ready && renderHighlight ? renderHighlight(state) : null}</view>
      <view className="ui-tour-popover" flatten={false} catchtap={() => {}} style={{ left: `${position.x}px`, top: `${position.y}px`, width: `${Math.min(Math.max(224, actionsWidth + 24), Math.max(0, bounds.width - 24))}px` }} bindlayoutchange={e => { 'background only'; const { width, height } = e.detail; setPanelSize(old => old.width === width && old.height === height ? old : { width, height }); }}>
        {ready ? <>{renderContent ? renderContent(state) : <text className="ui-tour-info">{step.content}</text>}
          {showTourButtons ? <view className="ui-tour-buttons" bindlayoutchange={e => { 'background only'; setActionsWidth(e.detail.width); }}>
            {selected > 0 ? renderPrev ? renderPrev(state) : <Button size="mini" variant="text" label={prevText} onTap={state.prev} /> : null}
            {renderSkip ? renderSkip(state) : <Button size="mini" variant="text" label={skipText} onTap={state.skip} />}
            {selected === steps.length - 1 ? renderFinish ? renderFinish(state) : <Button size="mini" label={finishText} onTap={state.finish} /> : renderNext ? renderNext(state) : <Button size="mini" label={`${nextText}(${selected + 1}/${steps.length})`} onTap={state.next} />}
          </view> : null}
        </> : null}
      </view>
    </Transition>
  </>;
  return rootPortal ? <RootPortal>{layer}</RootPortal> : layer;
});
