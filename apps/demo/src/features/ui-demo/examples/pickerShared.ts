import type { PickerOption } from 'daisu-ui';
export const pickerOptions = Array.from({ length: 7 }, (_, i) => ({ value: `选项${i + 1}`, label: `选项${i + 1}` }));
export const pickerDisabledOptions = pickerOptions.map((item, i) => ({ ...item, disabled: i === 2 }));
export const pickerUniversity = [
  ['中山大学', '中南大学', '华南理工大学'],
  ['计算机科学与技术', '软件工程', '通信工程', '法学', '经济学'],
];
export const pickerAreas: PickerOption[] = [
  { label: '北京', value: '110000', children: [{ label: '北京', value: '110100', children: [
    { label: '东城区', value: '110101' }, { label: '西城区', value: '110102' }, { label: '朝阳区', value: '110105' }, { label: '丰台区', value: '110106' }, { label: '石景山区', value: '110107' },
  ] }] },
  { label: '广东省', value: '440000', children: [
    { label: '广州市', value: '440100', children: [{ label: '荔湾区', value: '440103' }, { label: '越秀区', value: '440104' }, { label: '海珠区', value: '440105' }] },
    { label: '韶关市', value: '440200', children: [{ label: '武江区', value: '440203' }] },
    { label: '深圳市', value: '440300', children: [{ label: '罗湖区', value: '440303' }, { label: '福田区', value: '440304' }] },
    { label: '珠海市', value: '440400', children: [{ label: '香洲区', value: '440402' }, { label: '斗门区', value: '440403' }, { label: '金湾区', value: '440404' }] },
    { label: '汕头市', value: '440500', children: [{ label: '龙湖区', value: '440507' }, { label: '金平区', value: '440511' }] },
  ] },
];
