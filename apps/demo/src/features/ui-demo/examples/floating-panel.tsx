import { useState } from '@lynx-js/react';
import { Cell, CellGroup, FloatingPanel, Resize, Tabs } from '@daisu-ui/ui';

const options = [{ label: '基础用法', value: 'basic' }, { label: '自定义锚点', value: 'custom' }, { label: '仅头部拖拽', value: 'header' }];
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function FloatingPanelExample() {
  const [tab, setTab] = useState('basic');
  const [viewportHeight, setViewportHeight] = useState(0);
  const [customHeight, setCustomHeight] = useState<number>();
  const anchors = [100, Math.round(viewportHeight * .4), Math.round(viewportHeight * .7)];
  const current = customHeight ?? anchors[1]!;
  return <view className="demo-floating-page">
    <Resize className="demo-floating-viewport" onResize={({ height }) => setViewportHeight(height)} />
    <view className="demo-floating-tabs"><Tabs value={tab} options={options} onChange={setTab} /><view className="demo-floating-tabs-line" style={{ left: `${(options.findIndex(option => option.value === tab) + .5) / 3 * 100}%` }} /></view>
    {viewportHeight > 0 ? tab === 'custom' ? <FloatingPanel key="custom" anchors={anchors} height={current} onHeightChange={({ height }) => setCustomHeight(height)}><view className="demo-floating-inner"><text>{`"zi-ding-yi-mao-dian" [ "100px", "${anchors[1]}px", "${anchors[2]}px" ] - ${Math.round(current)}px`}</text></view></FloatingPanel> : tab === 'header' ? <FloatingPanel key="header" anchors={[100, Math.round(viewportHeight * .6)]} contentDraggable={false}><view className="demo-floating-inner"><text>内容区不可以拖拽</text></view></FloatingPanel> : <FloatingPanel key="basic" anchors={[100, Math.round(viewportHeight * .6)]}><CellGroup border>{letters.map((letter, index) => <Cell key={letter} title={letter} last={index === letters.length - 1} />)}</CellGroup></FloatingPanel> : null}
  </view>;
}
