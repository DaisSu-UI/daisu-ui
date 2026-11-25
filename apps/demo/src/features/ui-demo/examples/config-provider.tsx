import { useState } from '@lynx-js/react';
import { Button, Cell, CellGroup, ConfigProvider, Popup, Radio, RadioGroup, Switch, Tag } from '@daisu-ui/ui';
import type { ConfigButtonDefaults, ConfigTagDefaults } from '@daisu-ui/ui';
import type { HostClient } from '../../../lib/host.js';
import { ComplexFormExample } from './form-complex.js';
import { DemoGroup } from './shared.js';

const options = {
  buttonSize:['unset','mini','small','medium','large'], buttonVariant:['unset','base','plain','dashed','soft','text'], buttonType:['unset','primary','success','info','warning','danger'],
  tagSize:['unset','small','medium','large','extra-large','default'], tagVariant:['unset','light','dark','plain','dashed','text'],
} as const;
export function ConfigProviderExample({ host }: { host?: HostClient | null }) {
  const [settings,setSettings] = useState<Record<keyof typeof options,string>>({buttonSize:'unset',buttonVariant:'unset',buttonType:'unset',tagSize:'unset',tagVariant:'unset'});
  const [buttonRound,setButtonRound] = useState(false), [tagRound,setTagRound] = useState(false), [show,setShow] = useState(false);
  const button: ConfigButtonDefaults = { ...(settings.buttonSize==='unset'?{}:{size:settings.buttonSize as ConfigButtonDefaults['size']}), ...(settings.buttonVariant==='unset'?{}:{variant:settings.buttonVariant as ConfigButtonDefaults['variant']}), ...(settings.buttonType==='unset'?{}:{type:settings.buttonType as ConfigButtonDefaults['type']}), ...(buttonRound?{round:true}:{}) };
  const tag: ConfigTagDefaults = { ...(settings.tagSize==='unset'?{}:{size:settings.tagSize as ConfigTagDefaults['size']}), ...(settings.tagVariant==='unset'?{}:{variant:settings.tagVariant as ConfigTagDefaults['variant']}), ...(tagRound?{round:true}:{}) };
  const config = { ...(Object.keys(button).length?{button}:{}), ...(Object.keys(tag).length?{tag}:{}) };
  const control = (name: keyof typeof options, title: string) => <Cell key={name} title={title} titleWidth="18.666667vw" center>
    <RadioGroup<string> type="button" direction="horizontal" className="demo-config-choices" value={settings[name]} onChange={value => { 'background only'; if(value) setSettings(previous=>({...previous,[name]:value})); }}>
      {options[name].map(value=><Radio key={value} value={value}>{value}</Radio>)}
    </RadioGroup>
  </Cell>;
  return <view className="demo-config-provider-page">
    <DemoGroup title="全局配置 Playground">
      <CellGroup title="控制面板" border>
        {control('buttonSize','Button.size')}{control('buttonVariant','Button.variant')}{control('buttonType','Button.type')}
        <Cell title="Button.round" titleWidth="18.666667vw" center><Switch className="demo-config-switch" size={20} value={buttonRound} onChange={({value})=>setButtonRound(!!value)} /></Cell>
        {control('tagSize','Tag.size')}{control('tagVariant','Tag.variant')}
        <Cell title="Tag.round" titleWidth="18.666667vw" center><Switch className="demo-config-switch" size={20} value={tagRound} onChange={({value})=>setTagRound(!!value)} /></Cell>
      </CellGroup>
      <ConfigProvider {...config}>
        <CellGroup title="实时预览" border>
          <Cell title="按钮" titleWidth="18.666667vw" center><view className="demo-config-preview-items"><Button tone="primary" label="primary"/><Button tone="success" label="success"/><Button tone="info" label="info"/></view></Cell>
          <Cell title="标签" titleWidth="18.666667vw" center><view className="demo-config-preview-items"><Tag>default</Tag><Tag type="primary">primary</Tag><Tag type="success">success</Tag></view></Cell>
          <Cell title="root-portal 穿透测试" titleWidth="18.666667vw" center><view className="demo-config-preview-items"><Button tone="primary" label="打开 popup" onTap={()=>setShow(true)}/></view></Cell>
        </CellGroup>
        <Popup show={show} onChange={setShow} position="bottom" rootPortal closable className="ui-demo-page"><view className="demo-config-popup-content"><text className="demo-config-preview-label">popup 内</text><view className="demo-config-preview-items"><Button tone="primary" label="button"/><Tag type="primary">tag</Tag></view><Button tone="info" variant="plain" block label="关闭" onTap={()=>setShow(false)}/></view></Popup>
      </ConfigProvider>
      <CellGroup title="当前生效配置" border><text className="demo-config-json">{JSON.stringify(config,null,2)}</text></CellGroup>
    </DemoGroup>
    <DemoGroup title="表单示例"><ComplexFormExample host={host}/></DemoGroup>
  </view>;
}
