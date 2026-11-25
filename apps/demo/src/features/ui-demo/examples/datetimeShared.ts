import type { DatetimeColumnType, DatetimeFilterParams } from '@daisu-ui/ui';
import { datetimePad } from '@daisu-ui/ui/utils';
export const datetimeUnits = (type: DatetimeColumnType, value: number) => `${datetimePad(value, type === 'year' ? 4 : 2)}${({ year: '年', month: '月', date: '日', hour: '时', minute: '分', second: '秒' })[type]}`;
export const fiveMinuteFilter = ({ type, values }: DatetimeFilterParams) => type === 'minute' ? values.filter(value => value % 5 === 0) : values;
