import { useDemoLocale } from '../demoLocale.js';
import type { ReactNode } from '@lynx-js/react';

export function DemoGroup({ title, children }: { title: string; children?: ReactNode }) {
  const { t } = useDemoLocale();
  return <view className="demo-group">
    <text className="demo-group-title" data-demotitle={title}>{t(title)}</text>
    <view className="demo-group-content">{children}</view>
  </view>;
}

export function ExampleBlock({ title, description, children, noPadding = false }: { title: string; description?: string; children?: ReactNode; noPadding?: boolean }) {
  const { t } = useDemoLocale();
  return <view className="demo-example">
    <text className="demo-example-title" data-demotitle={title}>{t(title)}</text>
    {description ? <text className="demo-example-description">{t(description)}</text> : null}
    <view className={`demo-example-content ${noPadding ? 'demo-example-content-flush' : ''}`}>{children}</view>
  </view>;
}
