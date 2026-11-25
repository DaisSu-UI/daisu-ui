import type { ReactNode } from '@lynx-js/react';
import { formatUiText } from './textModel.js';
import type { TextMode } from './textModel.js';

export type TextProps = {
  text: string | number;
  type?: 'primary' | 'error' | 'warning' | 'success' | 'default';
  mode?: TextMode;
  format?: boolean;
  color?: string;
  size?: string | number;
  bold?: boolean;
  lines?: number;
  lineHeight?: string | number;
  decoration?: 'none' | 'underline' | 'line-through';
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
  onTap?: () => void;
};

export function Text({ text, type = 'default', mode = 'text', format = false, color, size, bold = false, lines, lineHeight, decoration, prefix, suffix, className = '', onTap }: TextProps) {
  const unit = (value: string | number | undefined) => typeof value === 'number' ? `${value}px` : value;
  return <text className={`ui-text ui-text-${type} ${bold ? 'ui-text-bold' : ''} ${className}`} text-maxline={lines === undefined ? undefined : String(Math.max(1, Math.min(5, Math.floor(lines) || 1)))} style={{ color, fontSize: unit(size), lineHeight: unit(lineHeight), textDecoration: decoration }} bindtap={onTap}>
    {prefix}{formatUiText(text, mode, format)}{suffix}
  </text>;
}
