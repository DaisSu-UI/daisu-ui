import { useState } from '@lynx-js/react';
import { Button, Overlay, Switch } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function OverlayExample() {
  const [basic, setBasic] = useState(false);
  const [content, setContent] = useState(false);
  const [locked, setLocked] = useState(true);
  return <view className="demo-overlay-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><view className="demo-layer-trigger"><Button label="显示遮罩层" onTap={() => setBasic(true)} /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="嵌入内容"><view className="demo-layer-trigger"><Button label="嵌入内容" onTap={() => setContent(true)} /></view></ExampleBlock></DemoGroup>
    <Overlay show={basic} rootPortal onTap={() => setBasic(false)} />
    <Overlay show={content} rootPortal lockScroll={locked} onTap={() => setContent(false)}>
      <view className="demo-overlay-wrapper"><view className="ui-demo-page demo-overlay-content" catchtap={() => {}}>
        <view className="demo-overlay-lock-row"><text className="demo-overlay-lock-label">是否锁定背景滚动，锁定时蒙层里的内容也将无法滚动</text><Switch value={locked} size={22} onChange={({ value }) => setLocked(value === true)} accessibilityLabel="切换滚动锁定" /></view>
        <scroll-view className="demo-overlay-scroll" scroll-orientation="vertical" scroll-y={!locked} enable-scroll={!locked}>{Array.from({ length: 10 }, (_, index) => <view className="demo-overlay-block" key={index}><text>{index + 1}</text></view>)}</scroll-view>
      </view></view>
    </Overlay>
  </view>;
}
