import { useLocale } from './useLocale.js';
import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { ActionSheet } from './ActionSheet.js';
import { Tabs } from './Tabs.js';
import type { TabsLineTheme } from './Tabs.js';
import { Icon } from './Icon.js';
import { Loading } from './Loading.js';
import { FormFieldContext } from './formContext.js';
import { cascaderPath, normalizeCascader } from './cascaderModel.js';
import type { CascaderFields, CascaderInput, CascaderOption, CascaderScalar, CascaderValue } from './cascaderModel.js';
export type { CascaderOption, CascaderValue } from './cascaderModel.js';
export type CascaderSelection = { value: CascaderValue; selectedOptions: CascaderOption[] };
export type CascaderLazyLoad = (option: CascaderOption | null, tabIndex: number, resolve: (options: readonly CascaderInput[]) => void) => void | Promise<void>;
export type CascaderRef = { open: () => void; close: () => void };
export type CascaderProps = CascaderFields & {
  value?: CascaderValue; options?: readonly CascaderInput[]; visible?: boolean; onVisibleChange?: (visible: boolean) => void;
  title?: string; placeholder?: string; checkStrictly?: boolean; confirmText?: string; lazyLoad?: CascaderLazyLoad;
  beforeConfirm?: (value: CascaderScalar, options: CascaderOption[]) => boolean | Promise<boolean>;
  onChange?: (event: CascaderSelection) => void; onConfirm?: (event: CascaderSelection) => void; onClose?: () => void; onCancel?: () => void; onOpen?: () => void;
  onLoadError?: (error: unknown) => void; disabled?: boolean; loading?: boolean; loadingColor?: string;
  lineTheme?: TabsLineTheme; lineWidth?: number | string; lineHeight?: number | string;
  closeOnClickModal?: boolean; rootPortal?: boolean; safeAreaInsetBottom?: boolean; safeAreaBottom?: number; zIndex?: number; className?: string; style?: CSSProperties;
};
const empty: readonly CascaderInput[] = [];
export const Cascader = forwardRef<CascaderRef, CascaderProps>(function Cascader({ value, options = empty, visible, onVisibleChange, title, placeholder, checkStrictly = false, confirmText, lazyLoad, valueKey, textKey, childrenKey, tipKey, isLeafKey, beforeConfirm, onChange, onConfirm, onClose, onCancel, onOpen, onLoadError, disabled: disabledProp, loading = false, loadingColor = '#4D80F0', lineTheme, lineWidth, lineHeight, closeOnClickModal = true, rootPortal = false, safeAreaInsetBottom = true, safeAreaBottom = 0, zIndex = 100, className = '', style }, ref) {
  const { t: localeText } = useLocale();
  title ??= localeText('common.select');
  placeholder ??= localeText('common.select');
  confirmText ??= localeText('common.confirmAction');

  const field = useContext(FormFieldContext), disabled = disabledProp ?? field?.disabled ?? false;
  const [innerVisible, setInnerVisible] = useState(false), show = visible ?? innerVisible;
  const fields = useMemo(() => ({ valueKey, textKey, childrenKey, tipKey, isLeafKey }), [valueKey, textKey, childrenKey, tipKey, isLeafKey]);
  const data = useMemo(() => normalizeCascader(options, fields), [options, fields]);
  const source = useMemo(() => ({ value, data, lazyLoad, show, disabled }), [value, data, lazyLoad, show, disabled]);
  const latestSource = useRef(source); latestSource.current = source;
  const [path, setPath] = useState<CascaderOption[]>([]), [levels, setLevels] = useState<readonly (readonly CascaderOption[])[]>([data]), [tab, setTab] = useState(0), [busy, setBusy] = useState(false), [fetching, setFetching] = useState(false);
  const generation = useRef(0), operation = useRef(0), pending = useRef(false), selection = useRef(path), callbacks = useRef({ onOpen, onLoadError }); callbacks.current = { onOpen, onLoadError };
  const cancelLoad = useRef<(() => void) | undefined>();
  const invalidate = () => { 'background only'; generation.current++; operation.current++; pending.current = false; cancelLoad.current?.(); cancelLoad.current = undefined; setBusy(false); setFetching(false); };
  const changeVisible = (next: boolean) => { 'background only'; if (visible === undefined) setInnerVisible(next); onVisibleChange?.(next); };
  const close = () => { 'background only'; invalidate(); if (show) { changeVisible(false); onClose?.(); } };
  const cancel = () => { 'background only'; if (show) { onCancel?.(); close(); } };
  useImperativeHandle(ref, () => ({ open: () => { 'background only'; if (!show && !disabled) changeVisible(true); }, close }), [show, disabled, visible, onVisibleChange, onClose]);
  const load = (option: CascaderOption | null, index: number, owner: typeof source, ticket: number) => {
    'background only';
    return new Promise<CascaderOption[] | undefined>(resolve => {
      let settled = false;
      const finish = (items?: readonly CascaderInput[], error?: unknown) => {
        'background only'; if (settled) return; settled = true; cancelLoad.current = undefined;
        if (ticket !== operation.current || owner !== latestSource.current) { resolve(undefined); return; }
        setFetching(false); if (error !== undefined) { callbacks.current.onLoadError?.(error); resolve(undefined); } else resolve(items === undefined ? undefined : normalizeCascader(items, fields));
      };
      cancelLoad.current?.(); cancelLoad.current = () => { 'background only'; if (!settled) { settled = true; resolve(undefined); } };
      setFetching(true);
      try { const result = lazyLoad?.(option, index, items => finish(items)); if (result) void result.catch(error => finish(undefined, error)); }
      catch (error) { finish(undefined, error); }
    });
  };
  useEffect(() => {
    invalidate(); const ticket = operation.current;
    if (!show) return;
    if (!lazyLoad) {
      const next = cascaderPath(data, value), nextLevels: (readonly CascaderOption[])[] = [data];
      next.forEach(item => { if (!item.isLeaf && item.children?.length) nextLevels.push(item.children); });
      selection.current = next; setPath(next); setLevels(nextLevels); setTab(Math.max(0, nextLevels.length - 1)); return;
    }
    selection.current = []; setPath([]); setLevels([data]); setTab(0);
    void (async () => {
      let items: readonly CascaderOption[] | undefined = data.length ? data : await load(null, 0, source, ticket);
      if (!items || ticket !== operation.current || source !== latestSource.current) return;
      const next: CascaderOption[] = [], nextLevels: (readonly CascaderOption[])[] = [items];
      const keys = Array.isArray(value) ? value : value === undefined || value === '' ? [] : [value];
      for (const key of keys) {
        const option: CascaderOption | undefined = items.find(item => item.value === key); if (!option) break;
        next.push(option); if (option.isLeaf) break;
        items = option.children ?? await load(option, next.length - 1, source, ticket);
        if (!items || ticket !== operation.current || source !== latestSource.current) return;
        if (!items.length) break; nextLevels.push(items);
      }
      selection.current = next; setPath(next); setLevels(nextLevels); setTab(nextLevels.length - 1);
    })();
  }, [source]);
  useEffect(() => { if (show) callbacks.current.onOpen?.(); }, [show]);
  useEffect(() => () => { generation.current++; operation.current++; cancelLoad.current?.(); }, []);
  const confirm = async (next = selection.current) => {
    'background only'; const last = next[next.length - 1]; if (!show || !last || disabled || loading || fetching || pending.current) return;
    pending.current = true; setBusy(true); const ticket = ++generation.current, owner = latestSource.current;
    try {
      if (!await (beforeConfirm?.(last.value, next) ?? true) || ticket !== generation.current || owner !== latestSource.current) return;
      const event: CascaderSelection = { value: lazyLoad ? next.map(item => item.value) : last.value, selectedOptions: next };
      onChange?.(event); onConfirm?.(event); close();
    } catch { /* A rejection preserves the draft. */ }
    finally { if (ticket === generation.current) { pending.current = false; setBusy(false); } }
  };
  const choose = async (option: CascaderOption, index: number) => {
    'background only'; if (!show || disabled || option.disabled || busy || loading || fetching) return;
    const ticket = ++operation.current, owner = latestSource.current;
    if (checkStrictly && path[index]?.value === option.value) { const next = path.slice(0, index); selection.current = next; setPath(next); setLevels(levels.slice(0, index + 1)); return; }
    const next = [...path.slice(0, index), option]; selection.current = next; setPath(next);
    const children = option.isLeaf ? [] : option.children ?? (lazyLoad ? await load(option, index, owner, ticket) : []);
    if (!children || ticket !== operation.current || owner !== latestSource.current) return;
    if (children.length) { setLevels([...levels.slice(0, index + 1), children]); setTab(index + 1); }
    else { setLevels(levels.slice(0, index + 1)); void confirm(next); }
  };
  return <ActionSheet show={show} onClose={cancel} title={title || localeText('common.select')} titleClassName={`ui-cascader-header ${checkStrictly ? 'ui-cascader-header-confirm' : ''}`} className={`ui-cascader ${className}`} style={style} closeOnClickModal={closeOnClickModal} rootPortal={rootPortal} safeAreaInsetBottom={safeAreaInsetBottom} safeAreaBottom={safeAreaBottom} zIndex={zIndex}
    renderClose={checkStrictly ? () => <view className={`ui-cascader-confirm ${!path.length || disabled ? 'ui-cascader-confirm-disabled' : ''}`} catchtap={() => { 'background only'; void confirm(); }} accessibility-element accessibility-traits="button" accessibility-label={confirmText}>{busy ? <Loading size={20} /> : <text>{confirmText}</text>}</view> : undefined}>
    <view className="ui-cascader-content"><Tabs value={tab} onChange={value => { 'background only'; if (!busy && !fetching) setTab(Number(value)); }} slidable="always" animated lineTheme={lineTheme} lineWidth={lineWidth} lineHeight={lineHeight} items={levels.map((items, index) => ({ title: path[index]?.text ?? placeholder, name: index, children: <scroll-view style={{ zIndex: 0 }} className={`ui-cascader-scroll ${loading || fetching ? 'ui-cascader-is-loading' : ''}`} scroll-orientation="vertical" scroll-bar-enable={false} enable-scroll={!loading && !fetching}>
      {items.map(option => <view key={`${typeof option.value}:${option.value}`} className={`ui-cascader-option ${path[index]?.value === option.value ? 'ui-cascader-option-active' : ''} ${option.disabled ? 'ui-cascader-option-disabled' : ''}`} bindtap={() => { 'background only'; void choose(option, index); }} accessibility-element accessibility-traits="button" accessibility-label={`${option.text}${option.disabled ? localeText('common.disabled') : ''}`}><view className="ui-cascader-option-content"><text className="ui-cascader-option-label">{option.text}</text>{option.tip ? <text className="ui-cascader-tip">{option.tip}</text> : null}</view>{path[index]?.value === option.value ? <Icon name="check" size={20} color="#4D80F0" /> : null}</view>)}
    </scroll-view> }))} />{loading || fetching ? <view className="ui-cascader-loading"><Loading size={48} color={loadingColor} /></view> : null}</view>
  </ActionSheet>;
});
