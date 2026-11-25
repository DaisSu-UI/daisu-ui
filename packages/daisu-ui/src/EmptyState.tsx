import { Button } from './Button.js';

export function EmptyState({ title = '暂无数据', description, actionLabel, onAction }: { title?: string; description?: string; actionLabel?: string; onAction?: () => void }) {
  return <view className="ui-empty-state">
    <view className="ui-empty-mark"><view className="ui-empty-mark-line" /></view>
    <text className="ui-empty-title">{title}</text>
    {description ? <text className="ui-empty-description">{description}</text> : null}
    {actionLabel ? <view className="ui-empty-action"><Button label={actionLabel} variant="plain" size="small" onTap={onAction} /></view> : null}
  </view>;
}
