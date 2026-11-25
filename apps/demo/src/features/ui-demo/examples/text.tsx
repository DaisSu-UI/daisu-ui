import { Text } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

const poem = '芦叶满汀洲，寒沙带浅流。二十年重过南楼。柳下系船犹未稳，能几日，又中秋。黄鹤断矶头，故人曾到否？旧江山浑是新愁。欲买桂花同载酒，终不似，少年游。';

export function TextExample() {
  return <view className="demo-text-page">
    <DemoGroup title="组件类型">
      <ExampleBlock title="基本用法"><Text text={poem} /></ExampleBlock>
      <ExampleBlock title="设置主题"><view className="demo-text-row">{([{ type: 'primary', text: '主色' }, { type: 'error', text: '错误' }, { type: 'success', text: '成功' }, { type: 'warning', text: '警告' }, { type: 'default', text: '默认' }] as const).map(item => <Text key={item.type} {...item} />)}</view></ExampleBlock>
      <ExampleBlock title="模式"><view><Text text="18888888888" mode="phone" /><Text text="王三" mode="name" /><Text text="1719976636911" mode="date" /></view></ExampleBlock>
      <ExampleBlock title="金额"><Text text="16354.156" mode="price" type="success" decoration="line-through" prefix="￥" /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="自定义字体颜色"><Text text={poem} color="var(--cso-ui-primary)" /></ExampleBlock>
      <ExampleBlock title="是否粗体"><Text text={poem} bold /></ExampleBlock>
      <ExampleBlock title="字体大小"><Text text={poem} size={16} /></ExampleBlock>
      <ExampleBlock title="lines"><Text text={poem} lines={2} size={16} /></ExampleBlock>
      <ExampleBlock title="lineHeight"><Text text={poem} lines={2} lineHeight={24} /></ExampleBlock>
      <ExampleBlock title="文字装饰"><Text text={poem} type="warning" decoration="underline" /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="脱敏"><view className="demo-text-row"><Text text="张长三" mode="name" format /><Text text="18888888888" mode="phone" format /></view></ExampleBlock>
      <ExampleBlock title="前后插槽"><view><Text text="12345678901" mode="phone" format type="primary" prefix="Prefix" suffix="Suffix" /><Text text="12345678901" mode="phone" format type="primary" prefix={<text>Prefix</text>} suffix={<text>Suffix</text>} /></view></ExampleBlock>
    </DemoGroup>
  </view>;
}
