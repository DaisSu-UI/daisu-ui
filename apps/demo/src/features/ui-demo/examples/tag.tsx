import { useDemoLocale } from '../demoLocale.js';
import { useState } from '@lynx-js/react';
import { Icon, Tag } from '@daisu-ui/ui';
import type { TagProps, TagType } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

const types: readonly TagType[] = ['default', 'primary', 'danger', 'warning', 'success'];
const labels = ['标签', '常用标签', '危险标签', '警告标签', '成功标签'];
function Tags({ named = false, ...props }: TagProps & { named?: boolean }) {
  const { copy: demoCopy } = useDemoLocale();
  return <>{types.map((type, index) => <Tag key={type} type={type} {...demoCopy(props)}>{named ? labels[index] : '标签'}</Tag>)}</>;
}

export function TagExample() {
  const { text: demoText } = useDemoLocale();
  const [closed, setClosed] = useState<readonly TagType[]>([]);
  const [tags, setTags] = useState([{ id: 1, value: '标签一' }, { id: 2, value: '标签二' }]);
  const [nextId, setNextId] = useState(3);
  const confirm = ({ value }: { value: string }) => {
    'background only';
    if (!value) return;
    setTags(current => [...current, { id: nextId, value }]);
    setNextId(current => current + 1);
  };
  return <view className="demo-tag-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><view className="demo-tag-row"><Tags />{(['volcano', 'lightblue', 'cyan', 'pink', 'purple'] as const).map((type, i) => <Tag key={type} type={type}>{['火山', '亮蓝', '青色', '粉色', '紫色'][i]}</Tag>)}</view></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体">
      <ExampleBlock title="标签尺寸"><view className="demo-tag-row demo-tag-sizes">{(['small', 'medium', 'default', 'large', 'extra-large'] as const).map((size, i) => <Tag key={size} type="primary" size={size}>{['小标签', '中标签', '默认标签', '较大标签', '特大标签'][i]}</Tag>)}</view></ExampleBlock>
      <ExampleBlock title="浅色标签"><view className="demo-tag-row"><Tags named variant="light" /><Tag type="volcano" variant="light">{demoText("火山")}</Tag><Tag type="lightblue" variant="light">{demoText("亮蓝")}</Tag><Tag type="cyan" variant="light">{demoText("青色")}</Tag></view></ExampleBlock>
      <ExampleBlock title="镂空变体"><view className="demo-tag-row"><Tags variant="plain" /><Tag type="pink" variant="plain">{demoText("粉色")}</Tag><Tag type="purple" variant="plain">{demoText("紫色")}</Tag></view></ExampleBlock>
      <ExampleBlock title="虚线标签"><view className="demo-tag-row"><Tags named variant="dashed" /></view></ExampleBlock>
      <ExampleBlock title="纯文本标签"><view className="demo-tag-row"><Tags named variant="text" /></view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="标记标签"><view className="demo-tag-row"><Tags mark /></view></ExampleBlock>
      <ExampleBlock title="幽灵标记标签"><view className="demo-tag-row"><Tags mark variant="plain" /></view></ExampleBlock>
      <ExampleBlock title="圆角标签"><view className="demo-tag-row"><Tags round /></view></ExampleBlock>
      <ExampleBlock title="设置图标"><view className="demo-tag-row"><Tag type="primary" mark icon="clock-circle">{demoText("标签")}</Tag><Tag type="primary" mark iconSlot={<Icon name="thunderbolt" size={12} color="#fff" />}>{demoText("插槽")}</Tag></view></ExampleBlock>
      <ExampleBlock title="自定义颜色"><view className="demo-tag-row"><Tag color="#1c64fd" bgColor="#f5f8ff">{demoText("标签")}</Tag><Tag color="#f57f00" bgColor="#f57f00" variant="plain">{demoText("标签")}</Tag><Tag color="#22b8cf" bgColor="#22b8cf" variant="dashed">{demoText("标签")}</Tag></view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="可关闭"><view className="demo-tag-row">{types.filter(type => !closed.includes(type)).map(type => <Tag key={type} type={type} closable onClose={() => { 'background only'; setClosed(current => [...current, type]); }}>{['标签', '常用', '危险', '警告', '成功'][types.indexOf(type)]}</Tag>)}</view></ExampleBlock>
      <ExampleBlock title="新增标签"><view className="demo-tag-row">{tags.map(tag => <Tag key={tag.id} type="primary" closable onClose={() => { 'background only'; setTags(current => current.filter(item => item.id !== tag.id)); }}>{tag.value}</Tag>)}<Tag type="primary" dynamic onConfirm={confirm} /><Tag type="primary" dynamic onConfirm={confirm} add={<><Icon name="pushpin" color="#fff" size={12} /><text className="demo-tag-add-label">{demoText("自定义")}</text></>} /></view></ExampleBlock>
    </DemoGroup>
  </view>;
}
