import { useState } from '@lynx-js/react';
import { Cell, CellGroup, ConfigProvider, Icon, Notify, useConfigProvider, useNotify } from '@daisu-ui/ui';
import type { NotifyType } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
const types: { type:NotifyType; title:string }[] = [{ type:'primary',title:'主要通知' },{ type:'success',title:'成功通知' },{ type:'danger',title:'危险通知' },{ type:'warning',title:'警告通知' }];
export function NotifyExample() {
  const notify = useNotify(), [visible,setVisible] = useState(false), [requestKey,setRequestKey] = useState(0), config = useConfigProvider();
  const dark = config.theme === 'dark';
  const themeVars = { primary:dark ? '#5b90ff' : '#1c64fd', success:dark ? '#20c997' : '#12b886', warning:dark ? '#ffa94d' : '#f57f00', danger:dark ? '#ff6b6b' : '#f14646', surface:dark ? '#000' : '#fff', text:dark ? '#f7f8fa' : '#1d1f29', '--cso-ui-primary-soft':dark ? '#0d2a77' : '#f5f8ff', '--cso-ui-success-soft':dark ? '#053c2c' : '#f3fbf9', '--cso-ui-warning-soft':dark ? '#542905' : '#fff6eb', '--cso-ui-danger-soft':dark ? '#571111' : '#fff5f5' };
  return <view className="demo-notify-page">
    <DemoGroup title="组件状态"><ExampleBlock title="基础用法" noPadding><CellGroup><Cell title="基础用法" arrow onTap={() => { 'background only'; notify.showNotify('测试'); }} /></CellGroup></ExampleBlock><ExampleBlock title="自定义配置" noPadding><CellGroup><Cell title="自定义颜色" arrow onTap={() => { 'background only'; notify.showNotify({ message:'自定义颜色',color:config.theme === 'dark' ? '#ff6b6b' : '#f14646',background:'var(--cso-ui-danger-soft)' }); }} /><Cell title="自定义位置" arrow onTap={() => { 'background only'; notify.showNotify({ message:'自定义位置',position:'bottom' }); }} /><Cell title="自定义时长" arrow onTap={() => { 'background only'; notify.showNotify({ message:'自定义时长',duration:1000 }); }} /><Cell title="显示关闭按钮" arrow onTap={() => { 'background only'; notify.showNotify({ message:'通知内容',closable:true,duration:0 }); }} /></CellGroup></ExampleBlock></DemoGroup>
    <DemoGroup title="组件类型"><ExampleBlock title="通知类型" noPadding><CellGroup>{types.map(({type,title}) => <Cell key={type} title={title} arrow onTap={() => { 'background only'; notify.showNotify({ message:'通知内容',type }); }} />)}</CellGroup></ExampleBlock></DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="悬浮通知" noPadding><CellGroup>{types.map(({type,title}) => <Cell key={type} title={title} arrow onTap={() => { 'background only'; notify.showNotify({ message:'通知内容',type,variant:'floating',closable:true }); }} />)}</CellGroup></ExampleBlock></DemoGroup>
    <DemoGroup title="内容形态"><ExampleBlock title="使用 Notify 组件" noPadding><CellGroup><Cell title="使用 Notify 组件" arrow onTap={() => { 'background only'; setRequestKey(value => value+1); setVisible(true); }} /></CellGroup></ExampleBlock></DemoGroup>
    <ConfigProvider themeVars={themeVars}><Notify {...notify.props} safeHeight={44} rootPortal /><Notify visible={visible} onChange={setVisible} requestKey={requestKey} type="success" duration={2000} safeHeight={44} rootPortal><view className="demo-notify-custom-content"><Icon name="check-outline" size={15} color={config.theme === 'dark' ? '#20c997' : '#12b886'} /><text>成功通知</text></view></Notify></ConfigProvider>
  </view>;
}
