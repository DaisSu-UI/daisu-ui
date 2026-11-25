import { useEffect, useRef, useState } from '@lynx-js/react';
import type { NodesRef } from '@lynx-js/types';
import { Backtop, Icon } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

function Option({ label, checked, onChange, last = false }: { label: string; checked: boolean; onChange: () => void; last?: boolean }) {
  return <view className={`demo-backtop-option ${last ? 'demo-backtop-option-last' : ''}`} bindtap={onChange} accessibility-element accessibility-traits="button" accessibility-label={`${label}，${checked ? '已选中' : '未选中'}`}><Icon name={checked ? 'check-circle-fill' : 'uncheck-circle'} color={checked ? '#1c64fd' : '#e5e6eb'} size={22} /><text>{label}</text></view>;
}

export function BacktopExample() {
  const scroll = useRef<NodesRef>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const currentTop = useRef(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [square, setSquare] = useState(false);
  const [text, setText] = useState(false);
  const [customIcon, setCustomIcon] = useState(false);
  const [distance, setDistance] = useState(false);
  const [customStyle, setCustomStyle] = useState(false);
  const [slow, setSlow] = useState(false);
  const cancel = () => { 'background only'; clearTimeout(timer.current); timer.current = undefined; };
  useEffect(() => cancel, []);
  const backtop = ({ duration }: { duration: number }) => {
    'background only';
    cancel();
    const start = currentTop.current;
    const started = Date.now();
    const step = () => {
      'background only';
      const progress = duration ? Math.min(1, (Date.now() - started) / duration) : 1;
      const offset = start * (1 - progress) ** 3;
      scroll.current?.invoke({ method: 'scrollTo', params: { offset, index: 0, smooth: false } }).exec();
      if (progress < 1) timer.current = setTimeout(step, 16);
      else timer.current = undefined;
    };
    step();
  };
  return <view className="demo-backtop-shell">
    <scroll-view ref={scroll} className="ui-demo-component-scroll" scroll-orientation="vertical" bindtouchstart={cancel} bindscroll={event => { 'background only'; currentTop.current = event.detail.scrollTop; setScrollTop(event.detail.scrollTop); }}>
      <view className="demo-backtop-page">
        <DemoGroup title="组件变体">
          <ExampleBlock title="形状与文字"><Option label="显示方形" checked={square} onChange={() => { 'background only'; setSquare(!square); }} /><Option label="显示文字" checked={text} onChange={() => { 'background only'; setText(!text); }} last /></ExampleBlock>
          <ExampleBlock title="自定义图标"><Option label="自定义图标" checked={customIcon} onChange={() => { 'background only'; setCustomIcon(!customIcon); }} last /></ExampleBlock>
        </DemoGroup>
        <DemoGroup title="组件样式">
          <ExampleBlock title="自定义距离"><Option label="自定义距离" checked={distance} onChange={() => { 'background only'; setDistance(!distance); }} last /></ExampleBlock>
          <ExampleBlock title="自定义样式"><Option label="自定义样式" checked={customStyle} onChange={() => { 'background only'; setCustomStyle(!customStyle); }} last /></ExampleBlock>
          <ExampleBlock title="自定义返回顶部滚动时间"><Option label="自定义返回顶部滚动时间" checked={slow} onChange={() => { 'background only'; setSlow(!slow); }} last /></ExampleBlock>
        </DemoGroup>
        <view className="demo-backtop-spacer" />
      </view>
    </scroll-view>
    <Backtop scrollTop={scrollTop} onBacktop={backtop} shape={square ? 'square' : 'circle'} text={text ? '顶部' : undefined} top={distance ? 600 : 300} bottom={distance ? 50 : 100} right={distance ? 40 : 20} duration={slow ? 1000 : 100} style={customStyle ? { backgroundColor: '#1c64fd', color: '#fff' } : undefined} iconStyle={customStyle ? { color: '#fff' } : undefined}>{customIcon ? <text className="demo-backtop-custom-icon">TOP</text> : undefined}</Backtop>
  </view>;
}
