import type { ReactNode } from '@lynx-js/react';

export function DemoGroup({ title, children }: { title: string; children?: ReactNode }) {
  return <view className="demo-group">
    <text className="demo-group-title">{title}</text>
    <view className="demo-group-content">{children}</view>
  </view>;
}

export function ExampleBlock({ title, description, children, noPadding = false }: { title: string; description?: string; children?: ReactNode; noPadding?: boolean }) {
  return <view className="demo-example">
    <text className="demo-example-title">{title}</text>
    {description ? <text className="demo-example-description">{description}</text> : null}
    <view className={`demo-example-content ${noPadding ? 'demo-example-content-flush' : ''}`}>{children}</view>
  </view>;
}
