import { useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import { Button, Cell, Dialog, Rate, useDialog } from 'daisu-ui';
import type { DialogOptions, ButtonTone } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';
import banner from '../../../assets/demo-capybara.jpg';

type Sample = { label: string; options: DialogOptions; tone?: ButtonTone; content?: 'rating' | 'custom'; header?: boolean; customTitle?: boolean; customActions?: boolean };
const base: DialogOptions = { title: '提示', msg: '这是一条消息提示' };
const confirm: DialogOptions = { title: '提示', msg: '确认执行此操作吗？', type: 'confirm' };
const prompt: DialogOptions = { title: '请输入内容', type: 'prompt', inputProps: { placeholder: '请输入' } };
const sample = (label: string, options: DialogOptions, extra?: Omit<Sample, 'label' | 'options'>): Sample => ({ label, options, ...extra });
const groups: { title: string; blocks: { title: string; samples: Sample[] }[] }[] = [
  { title: '组件类型', blocks: [
    { title: '基础用法', samples: [sample('Alert 弹窗', base), sample('Confirm 弹窗', confirm), sample('Prompt 输入框', prompt), sample('标题 + 内容', { title: '操作提示', msg: '您的请求已经提交，我们会尽快处理。' })] },
    { title: '弹窗类型', samples: [sample('Alert 类型', base, { tone: 'success' }), sample('Confirm 类型', confirm), sample('Prompt 类型', prompt, { tone: 'warning' })] },
  ] },
  { title: '组件状态', blocks: [
    { title: '输入配置（Prompt）', samples: [sample('带占位符', { ...prompt, inputProps: { placeholder: '请输入内容' } }), sample('带默认值', { ...prompt, inputValue: '默认内容' }), sample('多行文本输入', { ...prompt, inputProps: { multiline: true, placeholder: '请输入详细内容' } }), sample('限制输入长度', { ...prompt, inputProps: { maxlength: 10, placeholder: '最多输入10个字' } }), sample('正则校验', { ...prompt, title: '请输入邮箱', inputPattern: /.+@.+\..+/i, inputError: '邮箱格式不正确' }), sample('函数校验', { ...prompt, title: '请输入手机号', inputValidate: value => /^1[3-9]\d{9}$/.test(value), inputError: '手机号格式不正确' }), sample('数字输入', { ...prompt, inputProps: { type: 'number' } }), sample('密码输入', { ...prompt, inputProps: { type: 'password' } })] },
    { title: '交互功能', samples: [sample('显示关闭按钮', { ...base, showClose: true }), sample('点击遮罩关闭', { ...base, closeOnClickModal: true }), sample('确认前钩子', { ...prompt, inputProps: { placeholder: '输入 confirm 以确认' }, beforeConfirm: value => value === 'confirm' }), sample('异步确认前钩子', { ...confirm, beforeConfirm: () => new Promise(resolve => setTimeout(() => resolve(true), 1500)) }), sample('自定义层级', { ...base, zIndex: 200 })] },
    { title: '按钮状态', samples: [sample('按钮加载状态', { ...base, showClose: true, confirmButtonProps: { loading: true } }), sample('禁用按钮', { ...confirm, confirmButtonProps: { disabled: true } })] },
  ] },
  { title: '组件变体', blocks: [
    { title: '弹窗风格', samples: [sample('Button 风格（默认）', confirm), sample('Text 风格（iOS 风格）', { ...confirm, theme: 'text' }), sample('Text 风格 + 垂直布局', { ...confirm, theme: 'text', actionLayout: 'vertical' })] },
    { title: '操作按钮配置', samples: [sample('自定义按钮文本', { ...confirm, confirmButtonText: '立即前往', cancelButtonText: '再想想' }), sample('自定义按钮样式', { ...confirm, confirmButtonProps: { tone: 'success' }, cancelButtonProps: { tone: 'danger' } }), sample('垂直排列按钮', { ...confirm, actionLayout: 'vertical' }), sample('单个按钮', { ...confirm, cancelButtonProps: null }), sample('多个按钮（Actions）', { title: '选择支付方式', actionLayout: 'vertical', actions: [{ text: '微信支付', tone: 'success' }, { text: '支付宝', tone: 'primary' }, { text: '取消', tone: 'neutral', action: 'cancel' }] })] },
  ] },
  { title: '组件样式', blocks: [{ title: '图标与头图', samples: [
    sample('成功图标', { ...base, icon: 'success', iconColor: '#12b886' }), sample('危险图标', { ...base, icon: 'danger', iconColor: '#f14646' }), sample('警告图标', { ...base, icon: 'warning', iconColor: '#f57f00' }), sample('信息图标', { ...base, icon: 'info', iconColor: '#1c64fd' }), sample('自定义图标', { ...base, icon: 'star-fill', iconColor: '#f57f00' }), sample('顶部图片（完整）', { ...base, headerImage: banner }), sample('顶部图片 + 标题', { title: '活动通知', headerImage: banner }), sample('顶部图片 + 内容', { msg: '恭喜您获得专属权益', headerImage: banner }), sample('顶部图片（纯图片）', { headerImage: banner, showClose: true, confirmButtonProps: null }), sample('自定义按钮配色', { ...base, confirmButtonProps: { tone: 'success' } }),
  ] }] },
  { title: '特殊样式', blocks: [
    { title: '插槽能力', samples: [sample('默认插槽：自定义内容', { title: '请为我们评分', type: 'confirm' }, { content: 'rating' }), sample('Header 插槽：顶部图片', base, { header: true }), sample('Title 插槽：自定义标题', base, { customTitle: true }), sample('Actions 插槽：多支付方式', { title: '请选择支付方式' }, { customActions: true })] },
    { title: '业务场景示例', samples: [sample('删除确认', { title: '删除确认', msg: '删除后无法恢复，确定删除吗？', type: 'confirm', confirmButtonProps: { text: '删除', tone: 'danger' } }), sample('支付确认', { title: '支付确认', msg: '确认支付 ¥99.00？', type: 'confirm' }), sample('表单提交', { title: '提交成功', msg: '您的信息已提交成功', icon: 'success' }), sample('用户反馈选择', { title: '反馈类型', actionLayout: 'vertical', actions: [{ text: '功能建议' }, { text: '问题反馈' }, { text: '取消', action: 'cancel', tone: 'neutral' }] }), sample('版本更新', { title: '版本更新', msg: '发现新版本，是否立即更新？', type: 'confirm' }), sample('拨打电话', { title: '拨打电话', msg: '10086', type: 'confirm', confirmButtonText: '确定' }), sample('地址录入', { ...prompt, title: '请输入地址', inputProps: { multiline: true, placeholder: '请输入详细地址' } }), sample('领取优惠券', { title: '优惠券', msg: '恭喜您获得满100减20优惠券', confirmButtonText: '立即领取' })] },
  ] },
];

export function DialogExample() {
  const dialog = useDialog();
  const [current, setCurrent] = useState<Sample | null>(null);
  const [rating, setRating] = useState(3);
  const [result, setResult] = useState('');
  const open = (entry: Sample) => {
    'background only'; setCurrent(entry); setResult('');
    void dialog.show(entry.options).then(value => setResult(value.value ? `输入内容：${value.value}` : '点击了确认')).catch(() => {});
  };
  const title: ReactNode = current?.customTitle ? <view className="demo-dialog-title"><text>自定义标题</text><text>温馨提示</text></view> : dialog.props.title;
  return <view>{groups.map(group => <DemoGroup key={group.title} title={group.title}>{group.blocks.map(block => <ExampleBlock key={block.title} title={block.title}><view className="demo-dialog-buttons">{block.samples.map(entry => <Button key={entry.label} block label={entry.label} tone={entry.tone} onTap={() => open(entry)} />)}</view></ExampleBlock>)}</DemoGroup>)}
    <Dialog {...dialog.props} title={title} rootPortal className="ui-demo-page" header={current?.header ? <image className="ui-dialog-header-image" src={banner} mode="aspectFill" /> : undefined} renderActions={current?.customActions ? ({ confirm, cancel }) => <view className="demo-dialog-custom-actions"><Button label="微信支付" tone="success" block onTap={confirm} /><Button label="支付宝" block onTap={confirm} /><Button label="取消" tone="neutral" variant="plain" block onTap={cancel} /></view> : undefined}>
      {current?.content === 'rating' ? <view className="demo-dialog-rating"><Rate value={rating} onChange={({ value }) => setRating(value)} /><text>{rating} 分</text></view> : undefined}
    </Dialog>
    {result ? <view className="demo-action-sheet-notice" bindtap={() => setResult('')}><text>{result}</text></view> : null}
  </view>;
}
