import { useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import { Button } from './Button.js';
import { paginationState } from './paginationModel.js';

export type PaginationRenderState = { value: number; totalPage: number; total?: number; pageSize: number; prev: () => void; next: () => void };
export type PaginationProps = {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  total?: number;
  totalPage?: number;
  pageSize?: number;
  prevText?: string;
  nextText?: string;
  showIcon?: boolean;
  showMessage?: boolean;
  hideIfOnePage?: boolean;
  buttonVariant?: 'text' | 'plain' | 'dashed' | 'base';
  renderPrev?: (state: PaginationRenderState) => ReactNode;
  renderNext?: (state: PaginationRenderState) => ReactNode;
  renderSize?: (state: PaginationRenderState) => ReactNode;
  renderMessage?: (state: PaginationRenderState) => ReactNode;
  className?: string;
};

export function Pagination({ value, defaultValue = 1, onChange, total, totalPage, pageSize = 10, prevText = '上一页', nextText = '下一页', showIcon = false, showMessage = false, hideIfOnePage = true, buttonVariant = 'text', renderPrev, renderNext, renderSize, renderMessage, className = '' }: PaginationProps) {
  const [inner, setInner] = useState(defaultValue);
  const state = paginationState(value ?? inner, total, totalPage, pageSize);
  const change = (next: number) => { 'background only'; if (next < 1 || next > state.pages || next === state.page) return; if (value === undefined) setInner(next); onChange?.(next); };
  const renderState: PaginationRenderState = { value: state.page, totalPage: state.pages, total: state.total, pageSize: state.pageSize, prev: () => { 'background only'; change(state.page - 1); }, next: () => { 'background only'; change(state.page + 1); } };
  if (hideIfOnePage && state.pages === 1) return null;
  const variant = buttonVariant === 'base' ? 'solid' : buttonVariant;
  return <view className={`ui-pagination ${className}`}>
    <view className="ui-pagination-content">
      {renderPrev ? renderPrev(renderState) : <Button size="small" tone="info" variant={variant} className={`ui-pagination-nav ${showIcon ? 'ui-pagination-icon-nav' : ''}`} label={showIcon ? undefined : prevText} icon={showIcon ? <view className="ui-pagination-arrow ui-pagination-arrow-left"><view /></view> : undefined} accessibilityLabel={prevText} disabled={state.page <= 1} onTap={renderState.prev} />}
      <view className="ui-pagination-size">{renderSize ? renderSize(renderState) : <><text className="ui-pagination-current">{state.page}</text><text className="ui-pagination-separator">/</text><text className="ui-pagination-total">{state.pages}</text></>}</view>
      {renderNext ? renderNext(renderState) : <Button size="small" tone="primary" variant={variant} className={`ui-pagination-nav ${showIcon ? 'ui-pagination-icon-nav' : ''}`} label={showIcon ? undefined : nextText} icon={showIcon ? <view className="ui-pagination-arrow ui-pagination-arrow-right"><view /></view> : undefined} accessibilityLabel={nextText} disabled={state.page >= state.pages} onTap={renderState.next} />}
    </view>
    {showMessage ? renderMessage ? renderMessage(renderState) : <text className="ui-pagination-message">{`当前页：${state.page}，${state.total !== undefined ? `当前数据：${state.total}条，` : ''}分页大小：${state.pageSize}`}</text> : null}
  </view>;
}
