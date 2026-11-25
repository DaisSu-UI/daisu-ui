import { useEffect, useState } from '@lynx-js/react';
import { Resize } from 'daisu-ui';
import type { ResizeRect } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';

const fields = ['width', 'height', 'top', 'right', 'bottom', 'left'] as const;

export function ResizeExample() {
  const [size, setSize] = useState(0);
  const [geometry, setGeometry] = useState<{ previous: ResizeRect | null; current: ResizeRect | null }>({ previous: null, current: null });
  useEffect(() => { const timer = setTimeout(() => setSize(100), 1500); return () => clearTimeout(timer); }, []);
  const resize = (current: ResizeRect) => { 'background only'; setGeometry(value => ({ previous: value.current, current })); };
  return <view className="demo-resize-page"><DemoGroup title="组件类型"><ExampleBlock title="基础用法">
    <Resize onResize={resize}><view className="demo-resize-target" style={{ width: `${size}px`, height: `${size}px` }} /></Resize>
    {fields.map(field => <view key={field} className="demo-resize-tip"><text className="demo-resize-label">{field}:</text><text>{geometry.previous?.[field] ?? ''}</text><view className="demo-resize-separator" /><text className={`demo-resize-value demo-resize-${field}`}>{geometry.current?.[field] ?? ''}</text></view>)}
  </ExampleBlock></DemoGroup></view>;
}
