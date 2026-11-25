import { Slider } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

const marks = [0, 25, 50, 75, 100];

export function SliderExample() {
  return <view className="demo-slider-page">
    <DemoGroup title="组件类型">
      <ExampleBlock title="基础用法"><Slider defaultValue={30} /></ExampleBlock>
      <ExampleBlock title="双向滑块"><Slider defaultValue={[20, 60]} /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件状态"><ExampleBlock title="禁用状态"><Slider defaultValue={70} disabled /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="显示极值"><Slider defaultValue={25} showExtremes /></ExampleBlock>
      <ExampleBlock title="管道样式"><Slider defaultValue={65} theme="capsule" /></ExampleBlock>
      <ExampleBlock title="指定步长"><Slider defaultValue={30} step={10} /></ExampleBlock>
      <ExampleBlock title="指定选择范围"><Slider defaultValue={5} min={-10} max={10} showExtremes /></ExampleBlock>
      <ExampleBlock title="刻度标记"><Slider defaultValue={50} step={25} marks={marks} /></ExampleBlock>
      <ExampleBlock title="刻度标记（管道）"><Slider defaultValue={50} step={25} marks={marks} theme="capsule" /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="布局能力">
      <ExampleBlock title="垂直方向"><view className="demo-slider-vertical-row"><Slider defaultValue={30} vertical /><Slider defaultValue={25} vertical showExtremes /><Slider defaultValue={[20, 60]} vertical /><Slider defaultValue={50} step={25} marks={marks} vertical /></view></ExampleBlock>
      <ExampleBlock title="垂直 + 管道"><view className="demo-slider-vertical-row"><Slider defaultValue={65} vertical theme="capsule" /><Slider defaultValue={[20, 60]} vertical theme="capsule" showExtremes /><Slider defaultValue={50} vertical theme="capsule" step={25} marks={marks} /></view></ExampleBlock>
    </DemoGroup>
  </view>;
}
