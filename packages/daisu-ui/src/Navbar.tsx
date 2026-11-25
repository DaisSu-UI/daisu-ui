import type { ReactNode } from '@lynx-js/react';
import { Icon } from './Icon.js';

export type NavbarProps = {
  title?: ReactNode;
  variant?: 'business' | 'standard';
  onBack?: () => void;
  rightLabel?: string;
  onRight?: () => void;
  rightDisabled?: boolean;
  rightContent?: ReactNode;
  statusBarHeight?: number;
  leftText?: string;
  rightText?: string;
  leftArrow?: boolean;
  bordered?: boolean;
  fixed?: boolean;
  placeholder?: boolean;
  zIndex?: number;
  safeAreaInsetTop?: boolean;
  leftDisabled?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  capsule?: ReactNode;
  className?: string;
  onLeftTap?: () => void;
  onRightTap?: () => void;
};

/** Existing callers retain the original business appearance and callbacks. */
export function Navbar({ title = '', variant = 'business', onBack, rightLabel, onRight, rightDisabled = false, rightContent, statusBarHeight = 0, leftText = '', rightText, leftArrow, bordered = false, fixed = false, placeholder = false, zIndex = 10, safeAreaInsetTop, leftDisabled = false, left, right, capsule, className = '', onLeftTap, onRightTap }: NavbarProps) {
  const standard = variant === 'standard';
  const topInset = (safeAreaInsetTop ?? !standard) && Number.isFinite(statusBarHeight) ? Math.max(0, statusBarHeight) : 0;
  const height = (standard ? 44 : 56) + topInset;
  const label = rightText ?? rightLabel;
  const rightNode = right ?? rightContent;
  const handleLeft = () => { 'background only'; if (!leftDisabled) (onLeftTap ?? onBack)?.(); };
  const handleRight = () => { 'background only'; if (!rightDisabled) (onRightTap ?? onRight)?.(); };
  return <>
    {fixed && placeholder ? <view className="ui-navbar-placeholder" style={{ height: `${height}px` }} /> : null}
    <view className={`${standard ? 'ui-navbar' : 'navbar'} ${bordered ? 'ui-navbar-bordered' : ''} ${className}`} flatten={false} style={{ height: `${height}px`, ...(standard ? { paddingTop: `${topInset}px`, zIndex } : {}), ...(fixed ? { position: 'fixed', top: '0px', left: '0px', width: '100%', zIndex } : {}) }}>
      <view className={standard ? 'ui-navbar-content' : 'navbar-content'} style={standard ? undefined : { top: `${topInset}px` }}>
        <view className={standard ? 'ui-navbar-title' : 'nav-center'}>{typeof title === 'string' || typeof title === 'number' ? <text className={standard ? '' : 'nav-title'} text-maxline="1" text-overflow="ellipsis">{title}</text> : title}</view>
        {capsule != null ? <view className={standard ? 'ui-navbar-capsule-slot' : 'nav-action nav-left'}>{capsule}</view> : <view className={`${standard ? 'ui-navbar-action ui-navbar-left' : 'nav-action nav-left'} ${leftDisabled ? 'ui-navbar-disabled' : ''}`} bindtap={handleLeft} accessibility-element accessibility-traits="button" accessibility-label={leftText || '返回'}>
          {left ?? <>{(leftArrow ?? !standard) ? standard ? <Icon name="left" size={24} /> : <view className="nav-back-circle nav-circle-button"><view className="nav-back-icon" /></view> : null}{leftText ? <text>{leftText}</text> : null}</>}
        </view>}
        {standard ? rightNode != null || label ? <view className={`ui-navbar-action ui-navbar-right ${rightDisabled ? 'ui-navbar-disabled' : ''}`} bindtap={handleRight} accessibility-element accessibility-traits="button" accessibility-label={label || '右侧操作'}>{rightNode ?? <text>{label}</text>}</view> : null : <view className="nav-action nav-right">
          {rightNode ?? (label ? <view className={`nav-right-button ${rightDisabled ? 'nav-right-button-disabled' : ''}`} bindtap={handleRight}><text className={`nav-right-button-label ${rightDisabled ? 'nav-right-button-label-disabled' : ''}`}>{label}</text></view> : null)}
        </view>}
      </view>
    </view>
  </>;
}

export type NavbarCapsuleProps = { onBack?: () => void; onBackHome?: () => void; disabled?: boolean; className?: string };
export function NavbarCapsule({ onBack, onBackHome, disabled = false, className = '' }: NavbarCapsuleProps) {
  return <view className={`ui-navbar-capsule ${disabled ? 'ui-navbar-disabled' : ''} ${className}`} catchtap={() => { 'background only'; }}>
    <view className="ui-navbar-capsule-button" accessibility-element accessibility-traits="button" accessibility-label="返回上级" bindtap={() => { 'background only'; if (!disabled) onBack?.(); }}><Icon name="left" size={18} /></view>
    <view className="ui-navbar-capsule-divider" />
    <view className="ui-navbar-capsule-button" accessibility-element accessibility-traits="button" accessibility-label="返回首页" bindtap={() => { 'background only'; if (!disabled) onBackHome?.(); }}><Icon name="home" size={18} /></view>
  </view>;
}
