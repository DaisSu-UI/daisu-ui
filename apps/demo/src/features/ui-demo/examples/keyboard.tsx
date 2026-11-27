import { useDemoLocale } from '../demoLocale.js';
import { useState } from '@lynx-js/react';
import { Cell, CellGroup, Keyboard, Toast, useToast } from '@daisu-ui/ui';
import type { CarKeyboardLang } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function KeyboardExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [active, setActive] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [lang, setLang] = useState<CarKeyboardLang>('zh');
  const toast = useToast();
  const row = (id: string, title: string, arrow = true, bound = false) => <Cell key={id} title={demoText(title)} arrow={arrow} clickable value={bound ? values[id] ?? '' : undefined} onTap={() => { 'background only'; setActive(id); }} />;
  const car = active === 'car' || active === 'controlled-car';
  return <view className="demo-keyboard-page">
    <DemoGroup title="组件类型"><ExampleBlock title="键盘类型" noPadding><CellGroup border>
      {row('default', '默认键盘')}{row('custom', '带右侧栏的键盘')}{row('id', '身份证键盘')}{row('car', '车牌号键盘(非受控)', true, true)}{row('controlled-car', '车牌号键盘(受控)', true, true)}
    </CellGroup></ExampleBlock></DemoGroup>
    <DemoGroup title="组件变体"><ExampleBlock title="标题与额外按键" noPadding><CellGroup border>
      {row('title', '带标题的键盘')}{row('slot', 'slot自定义标题')}{row('extras', '多个额外按键')}{row('random', '随机数字键盘')}
    </CellGroup></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊用法"><ExampleBlock title="绑定与弹层" noPadding><CellGroup border>
      {row('binding', '双向绑定', false, true)}{row('modal', '展示蒙层', false)}
    </CellGroup></ExampleBlock></DemoGroup>
    <Keyboard visible={!!active} onVisibleChange={visible => { 'background only'; if (!visible) setActive(''); }}
      value={values[active] ?? ''} onChange={value => { 'background only'; setValues(previous => ({ ...previous, [active]: value })); }}
      mode={car ? 'car' : active === 'custom' || active === 'extras' ? 'custom' : 'default'}
      extraKey={active === 'id' ? 'X' : active === 'extras' ? ['00', '.'] : ['custom', 'title', 'slot', 'binding'].includes(active) ? '.' : undefined}
      title={demoText(active === 'title' ? '输入密码' : active === 'slot' ? <text className="demo-keyboard-custom-title">自定义标题</text> : active === 'binding' ? '键盘标题' : undefined)}
      closeText={['custom', 'id', 'title', 'slot', 'extras', 'binding'].includes(active) ? '完成' : ''}
      maxlength={active === 'binding' ? 6 : Infinity} randomKeyOrder={active === 'random'} modal={active === 'modal'}
      autoSwitchLang={active === 'car'} carLang={active === 'controlled-car' ? lang : undefined} onCarLangChange={next => { 'background only'; if (active === 'controlled-car') setLang(next); }}
      onInput={key => toast.show(key)} onDelete={() => toast.show('删除')} />
    <Toast {...demoCopy(toast.props)} />
  </view>;
}
