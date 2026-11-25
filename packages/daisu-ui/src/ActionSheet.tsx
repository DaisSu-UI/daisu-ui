import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Popup } from './Popup.js';
import type { PopupProps } from './Popup.js';
import { Icon } from './Icon.js';
import type { IconName } from './icons/paths.js';
import { Loading } from './Loading.js';

export type ActionSheetAction = { name?: string; description?: string; color?: string; disabled?: boolean; loading?: boolean };
export type ActionSheetPanel = { icon?: IconName | ReactNode; image?: string; title: string; color?: string; disabled?: boolean };
export type ActionSheetSelection = { item: ActionSheetAction; index: number } | { item: ActionSheetPanel; index: number } | { item: ActionSheetPanel; rowIndex: number; colIndex: number };
export type ActionSheetProps = Pick<PopupProps, 'show' | 'onChange' | 'closeOnClickModal' | 'onClickModal' | 'duration' | 'zIndex' | 'lazyRender' | 'safeAreaInsetBottom' | 'safeAreaBottom' | 'rootPortal' | 'onEnter' | 'onAfterEnter' | 'onLeave' | 'onAfterLeave'> & {
  actions?: readonly ActionSheetAction[];
  panels?: readonly ActionSheetPanel[] | readonly (readonly ActionSheetPanel[])[];
  title?: string;
  cancelText?: string;
  closeOnClickAction?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onSelect?: (selection: ActionSheetSelection) => void;
  children?: ReactNode;
  renderClose?: (close: () => void) => ReactNode;
  titleClassName?: string;
  className?: string;
  style?: CSSProperties;
};

export function ActionSheet({ actions = [], panels = [], title, cancelText, closeOnClickAction = true, onClose, onCancel, onSelect, children, renderClose, titleClassName = '', className = '', style, duration = 200, safeAreaInsetBottom = true, onChange, show = false, ...popup }: ActionSheetProps) {
  const close = () => { 'background only'; if (!show) return; onChange?.(false); onClose?.(); };
  const select = (selection: ActionSheetSelection) => {
    'background only';
    if (!show || selection.item.disabled || ('loading' in selection.item && selection.item.loading)) return;
    onSelect?.(selection);
    if (closeOnClickAction) close();
  };
  const multiple = panels.length > 0 && Array.isArray(panels[0]);
  const rows = (multiple ? panels : [panels]) as readonly (readonly ActionSheetPanel[])[];
  return <Popup {...popup} show={show} duration={duration} position="bottom" round lockScroll={false} onChange={close} safeAreaInsetBottom={safeAreaInsetBottom} className={`ui-action-sheet ${className}`} style={style}>
    {title ? <view className={`ui-action-sheet-header ${titleClassName}`}><text className="ui-action-sheet-title">{title}</text><view className="ui-action-sheet-close" catchtap={close} accessibility-element accessibility-traits="button" accessibility-label="关闭动作面板">{renderClose ? renderClose(close) : <Icon name="close" size={24} />}</view></view> : null}
    {children ?? (panels.length ? <view className="ui-action-sheet-panels">{rows.map((row, rowIndex) => <scroll-view key={rowIndex} className="ui-action-sheet-panel-scroll" scroll-orientation="horizontal" scroll-x><view className="ui-action-sheet-panel-row">{row.map((item, colIndex) => <view key={colIndex} className={`ui-action-sheet-panel ${item.disabled ? 'ui-action-sheet-disabled' : ''}`} bindtap={() => select(multiple ? { item, rowIndex, colIndex } : { item, index: colIndex })} accessibility-element accessibility-traits="button" accessibility-label={item.title}>
      <view className="ui-action-sheet-panel-icon">{item.image ? <image src={item.image} mode="aspectFit" className="ui-action-sheet-panel-image" /> : typeof item.icon === 'string' ? <Icon name={item.icon as IconName} size={24} color={item.color} /> : item.icon}</view><text className="ui-action-sheet-panel-title">{item.title}</text>
    </view>)}</view></scroll-view>)}</view> : <view>{actions.map((item, index) => <view key={index} className={`ui-action-sheet-action ${item.disabled ? 'ui-action-sheet-disabled' : ''}`} bindtap={() => select({ item, index })} accessibility-element accessibility-traits="button" accessibility-label={item.name ?? '加载中'}>
      {index ? <view className="ui-action-sheet-line" /> : null}{item.loading ? <Loading size={28} /> : <><text className="ui-action-sheet-name" style={item.color ? { color: item.color } : undefined}>{item.name}</text>{item.description ? <text className="ui-action-sheet-description">{item.description}</text> : null}</>}
    </view>)}</view>)}
    {cancelText ? <view className="ui-action-sheet-cancel-wrap"><view className="ui-action-sheet-cancel" bindtap={() => { 'background only'; if (!show) return; onCancel?.(); close(); }}><text>{cancelText}</text></view></view> : null}
  </Popup>;
}
