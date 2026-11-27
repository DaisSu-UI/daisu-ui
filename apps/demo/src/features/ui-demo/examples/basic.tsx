import { useDemoLocale } from '../demoLocale.js';
import { Button, Card } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function CardExample() {
  const { text: demoText } = useDemoLocale();
  return <DemoGroup title="基本用法">
    <ExampleBlock title="带标题与底部操作"><Card title={demoText("医疗机构备案")} description={demoText("待补充材料后可重新提交")} footer={<Button label={demoText("查看详情")} variant="text" />}><text className="catalog-card-copy">{demoText("备案状态会根据审批流程实时更新。")}</text></Card></ExampleBlock>
    <ExampleBlock title="无标题内容卡"><Card><text className="catalog-card-copy">{demoText("卡片可只承载一段紧凑的信息内容。")}</text></Card></ExampleBlock>
  </DemoGroup>;
}
