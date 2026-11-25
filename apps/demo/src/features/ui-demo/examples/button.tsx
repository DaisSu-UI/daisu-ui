import { Button } from '@daisu-ui/ui';
import type { ButtonProps, ButtonSize, ButtonTone, ButtonVariant } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

const types = [
  { tone: 'primary', label: '主要按钮' },
  { tone: 'success', label: '成功按钮' },
  { tone: 'info', label: '信息按钮' },
  { tone: 'warning', label: '警告按钮' },
  { tone: 'danger', label: '危险按钮' },
] as const;

const glyphPaths = {
  delete: '<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  settings: '<path d="m9 3-1 3-3 1-2 3 2 2-1 3 3 2 1 3h4l1-3 3-1 2-3-2-2 1-3-3-2-1-3H9Z"/><circle cx="10" cy="11" r="3"/>',
  recycle: '<path d="m8 6 4-4 5 8M3 14l3-5 4 1M7 21H2l2-8m17-1 1 6h-9m5-8 4 2-1 5M7 18l-1 3 7 1"/>',
};
const colors: Record<string, [string, string]> = {
  primary: ['#1c64fd', '#5b90ff'], success: ['#12b886', '#20c997'], info: ['#1d1f29', '#f7f8fa'],
  warning: ['#f57f00', '#ffa94d'], danger: ['#f14646', '#ff6b6b'],
};

function ButtonGlyph({ name, tone = 'primary', variant = 'solid' }: { name: keyof typeof glyphPaths; tone?: ButtonTone; variant?: ButtonVariant }) {
  const [light, dark] = variant === 'solid' && tone !== 'info' ? ['#ffffff', '#ffffff'] : colors[tone] ?? colors.primary!;
  const markup = (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${glyphPaths[name]}</svg>`;
  return <view className="demo-button-glyph"><svg className="ui-demo-icon-light" content={markup(light!)} /><svg className="ui-demo-icon-dark" content={markup(dark!)} /></view>;
}

function TypeRow({ variant = 'solid', loading = false, ...props }: Omit<ButtonProps, 'tone' | 'label'>) {
  return <view className="demo-button-row">{types.map(item => <Button key={item.tone} {...item} {...props} variant={variant} loading={loading} label={loading ? '加载中' : variant === 'text' ? '按钮' : item.label} />)}</view>;
}

export function ButtonExample() {
  return <view className="demo-button-page">
    <DemoGroup title="组件类型"><ExampleBlock title="类型"><TypeRow /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态">
      <ExampleBlock title="禁用"><TypeRow disabled /></ExampleBlock>
      <ExampleBlock title="加载">
        <view className="demo-button-subrow"><TypeRow loading /></view>
        <view className="demo-button-subrow"><view className="demo-button-row">{(['success', 'warning', 'danger', 'info'] as const).map(tone => <Button key={tone} tone={tone} variant="plain" loading label="加载中" />)}</view></view>
      </ExampleBlock>
      <ExampleBlock title="变体禁用"><view className="demo-button-row">{types.map((item, index) => <Button key={item.tone} {...item} variant={index < 2 ? 'plain' : index < 4 ? 'dashed' : 'text'} disabled />)}</view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件变体">
      {([{ title: '镂空', variant: 'plain' }, { title: '虚线', variant: 'dashed' }, { title: '柔和', variant: 'soft' }, { title: '柔和描边', variant: 'subtle' }, { title: '文字', variant: 'text' }] as const).map(item => <ExampleBlock key={item.variant} title={item.title}><TypeRow variant={item.variant} /></ExampleBlock>)}
    </DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="尺寸"><view className="demo-button-row">{([{ size: 'mini', label: '迷你按钮' }, { size: 'small', label: '小型按钮' }, { size: 'medium', label: '普通按钮' }, { size: 'large', label: '大型按钮' }] as const).map(item => <Button key={item.size} {...item} />)}</view></ExampleBlock>
      <ExampleBlock title="细边框与圆角"><view className="demo-button-subrow"><TypeRow variant="plain" hairline /></view><view className="demo-button-subrow"><TypeRow variant="plain" hairline round /></view></ExampleBlock>
      <ExampleBlock title="圆角对比"><view className="demo-button-subrow"><TypeRow variant="plain" round /></view><view className="demo-button-subrow"><TypeRow variant="dashed" round /></view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式"><ExampleBlock title="custom-class 阴影"><TypeRow className="demo-button-shadow" /></ExampleBlock></DemoGroup>
    <DemoGroup title="内容形态">
      <ExampleBlock title="文本按钮"><view className="demo-button-row"><Button label="默认按钮" /><Button label="成功按钮" tone="success" /></view></ExampleBlock>
      <ExampleBlock title="纯图标按钮">{(['solid', 'plain', 'plain', 'solid'] as const).map((variant, row) => <view key={row} className="demo-button-subrow"><view className="demo-button-row">{types.map((item, index) => <Button key={item.tone} tone={item.tone} variant={variant} round={row > 1} size={row === 3 ? (['large', 'medium', 'small', 'mini', 'small'] as ButtonSize[])[index] : 'medium'} icon={<ButtonGlyph name="delete" tone={item.tone} variant={variant} />} accessibilityLabel={`删除（${item.label}）`} />)}</view></view>)}</ExampleBlock>
      <ExampleBlock title="图文按钮"><view className="demo-button-row">{([{ name: 'download', label: '下载', size: 'medium' }, { name: 'settings', label: '设置', size: 'medium' }, { name: 'recycle', label: '可回收', size: 'medium' }, { name: 'download', label: '下载', size: 'small' }, { name: 'settings', label: '设置', size: 'small' }, { name: 'download', label: '下载', size: 'large' }, { name: 'settings', label: '设置', size: 'large' }] as const).map((item, index) => <Button key={index} label={item.label} size={item.size} icon={<ButtonGlyph name={item.name} />} />)}</view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="布局能力">
      <ExampleBlock title="块级按钮"><view className="demo-button-blocks">{types.map(item => <Button key={item.tone} {...item} block size="large" />)}</view></ExampleBlock>
      <ExampleBlock title="块级圆角组合"><view className="demo-button-blocks"><Button label="主要按钮" block size="large" round disabled /><Button label="主要按钮" block size="large" round /><Button label="主要按钮" block size="large" round loading /><Button label="信息按钮" tone="info" block size="large" round disabled /><Button label="信息按钮" tone="info" block size="large" round /></view></ExampleBlock>
    </DemoGroup>
  </view>;
}
