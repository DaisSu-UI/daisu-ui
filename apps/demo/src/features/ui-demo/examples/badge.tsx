import { useDemoLocale } from '../demoLocale.js';
import { Badge, Button } from '@daisu-ui/ui';
import type { BadgeProps, ButtonTone } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

function ButtonBadge({ label = '评论', tone = 'info', ...props }: Omit<BadgeProps, 'children'> & { label?: string; tone?: ButtonTone }) {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  return <Badge className="demo-badge-item" {...demoCopy(props)}><Button label={demoText(label)} tone={tone} size="small" /></Badge>;
}

export function BadgeExample() {
  const { text: demoText } = useDemoLocale();
  return <view className="demo-badge-page">
    <DemoGroup title="组件类型"><ExampleBlock title="展示消息数量"><view className="demo-badge-row">
      <ButtonBadge value={12} /><ButtonBadge label={demoText("回复")} value={3} bgColor="green" /><ButtonBadge value={1} type="primary" /><ButtonBadge label={demoText("回复")} value={2} type="warning" /><ButtonBadge value={1} type="success" /><ButtonBadge label={demoText("回复")} value={2} type="info" tone="danger" />
    </view></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态">
      <ExampleBlock title="点状类型"><view className="demo-badge-row"><Badge className="demo-badge-item" isDot><text className="demo-badge-copy">{demoText("数据查询")}</text></Badge><ButtonBadge label={demoText("回复")} isDot /></view></ExampleBlock>
      <ExampleBlock title="显示0值"><view className="demo-badge-row"><ButtonBadge value={0} showZero /><ButtonBadge label={demoText("回复")} value={0} /><ButtonBadge label={demoText("回复")} value={0} isDot /></view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock title="徽标形状"><view className="demo-badge-row"><ButtonBadge label={demoText("方形")} value={12} shape="square" /><ButtonBadge label={demoText("气泡")} value={12} shape="bubble" /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="可定义消息最大值"><view className="demo-badge-row"><ButtonBadge value={200} max={99} /><ButtonBadge label={demoText("回复")} value={200} max={10} /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="描边徽标"><view className="demo-badge-row"><ButtonBadge label={demoText("描边")} value={12} border tone="primary" /><ButtonBadge label={demoText("描边")} value={1} border type="primary" tone="danger" /><ButtonBadge label={demoText("描边")} value={999} border type="warning" tone="success" /></view></ExampleBlock></DemoGroup>
    <DemoGroup title="内容形态"><ExampleBlock title="自定义内容"><view className="demo-badge-row"><ButtonBadge value="new" /><ButtonBadge label={demoText("回复")} value="hot" /></view></ExampleBlock></DemoGroup>
  </view>;
}
