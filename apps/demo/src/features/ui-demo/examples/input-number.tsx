import { useEffect, useRef, useState } from '@lynx-js/react';
import { InputNumber, Toast, useToast } from '@daisu-ui/ui';
import type { InputNumberProps, InputNumberValue } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
const themes = ['default', 'primary', 'outline-split', 'outline'] as const;
function Sample({ defaultValue = 1, ...props }: InputNumberProps) {
  const [value, setValue] = useState<InputNumberValue>(defaultValue);
  return <InputNumber {...props} value={value} onChange={event => { 'background only'; setValue(event.value); }} />;
}
export function InputNumberExample() {
  const [bounds, setBounds] = useState<InputNumberValue>(4), [quantity, setQuantity] = useState<InputNumberValue>(1), [temporary, setTemporary] = useState<InputNumberValue>(1);
  const [immediate, setImmediate] = useState<InputNumberValue>(1), [deferred, setDeferred] = useState<InputNumberValue>(1);
  const [corrected, setCorrected] = useState<InputNumberValue>(1), [unchanged, setUnchanged] = useState<InputNumberValue>(1);
  const toast = useToast(), timers = useRef(new Map<ReturnType<typeof setTimeout>, (allowed: boolean) => void>());
  useEffect(() => () => { for (const [timer, resolve] of timers.current) { clearTimeout(timer); resolve(false); } timers.current.clear(); }, []);
  const beforeChange = (next: InputNumberValue) => {
    'background only'; toast.loading({ msg: `正在更新到${next}...` });
    return new Promise<boolean>(resolve => { const timer = setTimeout(() => { timers.current.delete(timer); toast.close(); resolve(true); }, 500); timers.current.set(timer, resolve); });
  };
  return <view className="demo-input-number-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本使用"><view className="demo-input-number-grid">{themes.map(theme => <Sample key={theme} theme={theme} />)}</view></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态">
      <ExampleBlock title="禁用"><view className="demo-input-number-grid">{themes.map(theme => <Sample key={theme} theme={theme} disabled defaultValue={2} />)}</view></ExampleBlock>
      <ExampleBlock title="禁用输入框"><Sample disableInput /></ExampleBlock>
      <ExampleBlock title="禁用减号按钮"><view className="demo-input-number-grid"><Sample disableMinus /><Sample disableMinus theme="primary" /></view></ExampleBlock>
      <ExampleBlock title="禁用加号按钮"><view className="demo-input-number-grid"><Sample disablePlus /><Sample disablePlus theme="primary" /></view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock title="圆角样式"><view className="demo-input-number-grid">{themes.map(theme => <Sample key={theme} theme={theme} round />)}</view></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="设置步长"><Sample step={2} /></ExampleBlock>
      <ExampleBlock title="限制最大最小值"><Sample min={3} max={10} /></ExampleBlock>
      <ExampleBlock title="设置小数精度"><Sample defaultValue="1.2" precision={1} step={0.1} /></ExampleBlock>
      <ExampleBlock title="输入严格为步数的倍数"><Sample stepStrictly step={2} /></ExampleBlock>
      <ExampleBlock title="严格步进+边界限制"><text className="demo-input-number-label">值：{bounds}（步进值 2，最小值 3，最大值 15）</text><InputNumber value={bounds} onChange={event => { 'background only'; setBounds(event.value); }} stepStrictly step={2} min={3} max={15} /><view className="demo-input-number-tip demo-input-number-bounds-tip"><text>输入 1 → 4（≥3 的最小 2 的倍数）</text><text>输入 5 → 6（最接近的 2 的倍数）</text><text>输入 17 → 14（≤15 的最大 2 的倍数）</text></view></ExampleBlock>
      <ExampleBlock title="修改输入框宽度"><Sample defaultValue={2} inputWidth="70px" /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊用法">
      <ExampleBlock title="无输入框"><view className="demo-input-number-row"><text>数量：{quantity}</text><InputNumber withoutInput value={quantity} onChange={event => { 'background only'; setQuantity(event.value); }} /></view></ExampleBlock>
      <ExampleBlock title="允许空值，并设置 placeholder"><Sample defaultValue="" allowNull placeholder="不限" inputWidth="70px" /></ExampleBlock>
      <ExampleBlock title="非允许空值但可临时删除"><text className="demo-input-number-label">值：{temporary}（失焦时会自动修正为最小值）</text><InputNumber value={temporary} onChange={event => { 'background only'; setTemporary(event.value); }} /><text className="demo-input-number-tip demo-input-number-empty-tip">尝试删除输入框中的所有内容，然后点击其他地方失焦</text></ExampleBlock>
      <ExampleBlock title="键盘弹起不上推页面"><Sample avoidKeyboard={false} /></ExampleBlock>
      <ExampleBlock title="非立即更新模式"><text className="demo-input-number-label">立即更新模式（默认）- 值：{immediate}</text><InputNumber value={immediate} onChange={event => { 'background only'; setImmediate(event.value); }} /><text className="demo-input-number-label demo-input-number-label-next">非立即更新模式 - 值：{deferred}</text><InputNumber immediateChange={false} value={deferred} onChange={event => { 'background only'; setDeferred(event.value); }} /></ExampleBlock>
      <ExampleBlock title="初始化时自动修正"><text className="demo-input-number-label">自动修正初始值 - 值：{corrected}</text><InputNumber min={3} max={15} step={2} stepStrictly value={corrected} onChange={event => { 'background only'; setCorrected(event.value); }} /><text className="demo-input-number-label demo-input-number-label-next">不修正初始值 - 值：{unchanged}</text><InputNumber updateOnInit={false} min={3} max={15} step={2} stepStrictly value={unchanged} onChange={event => { 'background only'; setUnchanged(event.value); }} /><text className="demo-input-number-tip demo-input-number-init-tip">上方组件会在初始化时自动将值 1 修正为 4（≥3 的最小 2 的倍数）</text></ExampleBlock>
      <ExampleBlock title="异步变更"><Sample beforeChange={beforeChange} /></ExampleBlock>
      <ExampleBlock title="长按加减"><Sample longPress /></ExampleBlock>
    </DemoGroup>
    <Toast {...toast.props} rootPortal />
  </view>;
}
