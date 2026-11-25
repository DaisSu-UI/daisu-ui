import { useEffect, useRef, useState } from '@lynx-js/react';
import { Cascader, Cell, CellGroup, Toast, useToast } from 'daisu-ui';
import type { CascaderOption, CascaderValue, CascaderLazyLoad } from 'daisu-ui';
import { getDemoAreaOptions } from '../areaOptions.js';
import { DemoGroup } from './shared.js';
const custom = [{ id: 1, name: '选项一', items: [{ id: 11, name: '选项一-一' }, { id: 12, name: '选项一-二' }] }, { id: 2, name: '选项二', items: [{ id: 21, name: '选项二-一' }, { id: 22, name: '选项二-二' }] }];
const remoteAreas: Record<string, [string, string][]> = {
  root: [['110000', '北京市'], ['130000', '河北省'], ['440000', '广东省']], '110000': [['110100', '北京市辖区']], '130000': [['130100', '石家庄市'], ['130200', '唐山市']], '440000': [['440100', '广州市'], ['440300', '深圳市']],
  '110100': [['110101', '东城区'], ['110102', '西城区']], '130100': [['130102', '长安区'], ['130104', '桥西区']], '130200': [['130202', '路南区'], ['130204', '古冶区']], '440100': [['440103', '荔湾区'], ['440104', '越秀区']], '440300': [['440303', '罗湖区'], ['440304', '福田区']],
};
const jobs: Record<string, [string, string][]> = {
  root: [['it', 'IT互联网'], ['finance', '金融'], ['healthcare', '医疗健康']], it: [['it-dev', '软件开发'], ['it-ops', '运维']], 'it-dev': [['fe', '前端开发'], ['be', '后端开发']], 'it-ops': [['devops', 'DevOps'], ['admin', '系统管理员']], finance: [['finance-bank', '银行'], ['finance-insurance', '保险']], 'finance-bank': [['teller', '柜员'], ['manager', '经理']], 'finance-insurance': [['agent', '代理人'], ['adjuster', '理赔员']], healthcare: [['health-hospital', '医院'], ['health-pharma', '制药']], 'health-hospital': [['doctor', '医生'], ['nurse', '护士']], 'health-pharma': [['researcher', '研究员'], ['production', '生产员']],
};
const initial: Record<string, CascaderValue> = { basic: '', initial: '150121', custom: 1, disabled: '', tip: '', validate: '', format: '130204', title: '', lazy: ['130000', '130200', '130204'], jobs: '', strict: '' };
const defaultLabels = { initial: '内蒙古自治区/呼和浩特市/土默特左旗', custom: '选项一/选项一-一', format: '唐山市-古冶区', lazy: '河北省/唐山市/古冶区' };
export function CascaderExample() {
  const [opened, setOpened] = useState(''), [values, setValues] = useState(initial), [labels, setLabels] = useState<Record<string, string>>(defaultLabels), [areas, setAreas] = useState<readonly CascaderOption[]>([]), [disabledAreas, setDisabledAreas] = useState<readonly CascaderOption[]>([]), [tipAreas, setTipAreas] = useState<readonly CascaderOption[]>([]);
  const toast = useToast(), timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);
  const loaders = useRef<Record<string, CascaderLazyLoad>>({});
  useEffect(() => {
    for (const [key, tree] of Object.entries({ lazy: remoteAreas, jobs })) loaders.current[key] = (option, _index, resolve) => {
      'background only'; const timer = setTimeout(() => { timers.current.delete(timer); resolve((tree[String(option?.value ?? 'root')] ?? []).map(([value, text]) => ({ value, text, isLeaf: !tree[value] }))); }, 300); timers.current.add(timer);
    };
  }, []);
  const open = (key: string) => {
    'background only'; if (!['custom', 'lazy', 'jobs'].includes(key)) {
      const all = getDemoAreaOptions(); setAreas(all);
      if (key === 'disabled') setDisabledAreas(all.map(item => item.value === '140000' ? { ...item, disabled: true } : item));
      if (key === 'tip') setTipAreas(all.map(item => item.value === '140000' ? { ...item, disabled: true, tip: '该地区无货，暂时无法选择' } : item.value === '150000' ? { ...item, tip: '该地区配送时间可能较长' } : item));
    } setOpened(key);
  };
  const row = (key: string, title: string) => <Cell key={key} title={title} value={labels[key] ?? ''} arrow onTap={() => open(key)} />;
  return <view className="demo-cascader-page">
    <DemoGroup title="组件类型"><CellGroup border>{row('basic', '基本用法')}{row('initial', '初始选项')}{row('custom', '自定义字段')}</CellGroup></DemoGroup>
    <DemoGroup title="组件状态"><CellGroup border>{row('disabled', '禁用选项')}{row('tip', '选项提示信息')}{row('validate', 'before-confirm')}</CellGroup></DemoGroup>
    <DemoGroup title="组件样式"><CellGroup border>{row('format', '展示格式化')}{row('title', '标题')}</CellGroup></DemoGroup>
    <DemoGroup title="特殊样式"><CellGroup border>{row('lazy', '异步加载')}{row('jobs', '异步加载（无初始值）')}{row('strict', '任意级可选')}</CellGroup></DemoGroup>
    {Object.keys(initial).map(key => <Cascader key={key} visible={opened === key} onVisibleChange={show => { 'background only'; if (!show) setOpened(''); }} value={values[key]} options={key === 'custom' ? custom : key === 'lazy' || key === 'jobs' ? undefined : key === 'disabled' ? disabledAreas : key === 'tip' ? tipAreas : areas} valueKey={key === 'custom' ? 'id' : undefined} textKey={key === 'custom' ? 'name' : undefined} childrenKey={key === 'custom' ? 'items' : undefined} lazyLoad={key === 'lazy' || key === 'jobs' ? loaders.current[key] : undefined} title={key === 'title' ? '选择地址' : '请选择'} checkStrictly={key === 'strict'} beforeConfirm={key === 'validate' ? value => { 'background only'; if (Number(value) > 120000) { toast.error({ msg: '该地区库存不足', zIndex: 110 }); return false; } return true; } : undefined} onConfirm={({ value, selectedOptions }) => { 'background only'; setValues(previous => ({ ...previous, [key]: value })); setLabels(previous => ({ ...previous, [key]: (key === 'format' ? selectedOptions.slice(-2) : selectedOptions).map(item => item.text).join(key === 'format' ? '-' : key === 'jobs' ? ' / ' : '/') })); }} />)}
    <Toast {...toast.props} />
  </view>;
}
