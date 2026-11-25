import { useState } from '@lynx-js/react';
import { ActionSheet, Button } from 'daisu-ui';
import type { ActionSheetAction, ActionSheetPanel, ActionSheetSelection } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';

const actions: ActionSheetAction[] = [{ name: '选项1' }, { name: '选项2' }, { name: '选项3', description: '描述信息' }];
const panels: ActionSheetPanel[] = [{ icon: 'user', title: '微信好友' }, { icon: 'share-internal', title: '朋友圈' }, { icon: 'message', title: 'QQ 好友' }, { icon: 'star-fill', title: '收藏' }, { icon: 'share-internal', title: '更多分享' }, { icon: 'user-add', title: '邀请好友' }];
const multiple: ActionSheetPanel[][] = [[...panels.slice(0, 4), { icon: 'user-add', title: '邀请' }, { icon: 'share-external', title: '外部分享' }, { icon: 'qrcode', title: '生成二维码' }, { icon: 'save', title: '保存图片' }], [{ icon: 'file-image', title: '图片' }, { icon: 'download', title: '下载' }, { icon: 'copy', title: '复制链接' }]];
const statuses: ActionSheetAction[] = [{ name: '颜色', color: '#0083ff' }, { name: '禁用', disabled: true }, { loading: true }];

export function ActionSheetExample() {
  const [variant, setVariant] = useState(0);
  const [show, setShow] = useState(false);
  const [notice, setNotice] = useState('');
  const open = (index: number) => { 'background only'; setVariant(index); setShow(true); setNotice(''); };
  const selected = (event: ActionSheetSelection) => {
    'background only';
    const name = 'name' in event.item ? event.item.name : 'title' in event.item ? event.item.title : '';
    setNotice('rowIndex' in event ? `当前选中项: ${name}, 行下标: ${event.rowIndex}, 列下标: ${event.colIndex}` : `当前选中项: ${name}, 下标: ${event.index}`);
  };
  const block = (title: string, index: number) => <ExampleBlock title={title}><view className="demo-layer-trigger"><Button label="弹出菜单" onTap={() => open(index)} /></view></ExampleBlock>;
  return <view>
    <DemoGroup title="组件类型">{block('基本用法', 0)}{block('自定义面板单行', 1)}{block('自定义面板多行', 2)}</DemoGroup>
    <DemoGroup title="组件状态">{block('选项状态', 3)}</DemoGroup>
    <DemoGroup title="组件变体">{block('取消按钮', 4)}{block('标题', 5)}</DemoGroup>
    <ActionSheet show={show} onChange={setShow} rootPortal className="ui-demo-page" actions={variant === 3 ? statuses : actions} panels={variant === 1 ? panels : variant === 2 ? multiple : []} cancelText={[1, 2, 4].includes(variant) ? '取消' : undefined} title={variant === 5 ? '标题' : undefined} onSelect={selected}>
      {variant === 5 ? <view className="demo-action-sheet-custom"><text>内容</text></view> : undefined}
    </ActionSheet>
    {notice ? <view className="demo-action-sheet-notice" bindtap={() => setNotice('')}><text>{notice}</text></view> : null}
  </view>;
}
