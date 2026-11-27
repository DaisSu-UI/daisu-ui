import { useDemoLocale } from '../demoLocale.js';
import { useMemo, useState } from '@lynx-js/react';
import { InputNumber, Pagination, Table } from '@daisu-ui/ui';
import type { TableColumn, TableSpanScope } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';
type Person = { name: string; grade: number; compare: string; hobby: string; school: string; major: string; gender: string; graduation: string };
const seeds = [
  ['关羽', 66, '48%', '颜良文丑，以吾观之，如土鸡瓦犬耳。', '绿豆'],
  ['刘备', 68, '21%', '我得空明，如鱼得水也', '编织'],
  ['赵云', 91, '12%', '子龙，子龙，世无双', '妇幼保健'],
  ['赵云', 91, '12%', '子龙，子龙，世无双', '妇幼保健'],
  ['孔明', 99, '18%', '兴汉讨贼，克复中原', '卧龙'],
];
const original: Person[] = [...seeds, [ ...seeds[2]!.slice(0, 1), 36, '48%', ...seeds[2]!.slice(3) ], ...seeds.slice(0, 3), seeds[4]!, [ ...seeds[2]!.slice(0, 1), 36, '48%', ...seeds[2]!.slice(3) ], ...seeds.slice(0, 3), seeds[4]!].map(row => ({ name: String(row[0]), grade: Number(row[1]), compare: String(row[2]), hobby: String(row[3]), school: `武汉市阳逻${row[4]}学院`, major: '计算机科学与技术专业', gender: '男', graduation: '2022年1月12日' }));
const basic: TableColumn<Person>[] = [{ prop: 'name', label: '姓名', width: '50%', align: 'center' }, { prop: 'grade', label: '分数', width: '50%', align: 'center' }];
const full: TableColumn<Person>[] = [{ prop: 'name', label: '姓名', align: 'center', sortable: true, fixed: true }, { prop: 'grade', label: '分数', align: 'center', sortable: true, fixed: true }, { prop: 'hobby', label: '一言以蔽之', width: 160, sortable: true }, { prop: 'school', label: '求学之所', width: 180 }, { prop: 'major', label: '专业' }, { prop: 'gender', label: '性别' }];
const narrow: TableColumn<Person>[] = [{ prop: 'name', label: '姓名', align: 'center' }, { prop: 'grade', label: '分数', align: 'center' }, { prop: 'school', label: '求学之所' }, { prop: 'major', label: '专业' }];
const grade: TableColumn<Person>['render'] = ({ row }) => <view className="demo-table-custom"><text className="ui-table-value">{row.grade}</text><text className="ui-table-value">{`同比${row.compare}`}</text></view>;
function spanBasic({ rowIndex: r, columnIndex: c }: TableSpanScope<Person>) { if (r === 0 && c === 0) return [1, 2]; if (r === 0 && c === 1 || r === 3 && c === 0) return [0, 0]; if (r === 2 && c === 0) return [2, 1]; }
function spanCustom({ rowIndex: r, columnIndex: c }: TableSpanScope<Person>) { if (r === 0 && c === 0) return [2, 1]; if (r === 1 && c === 0 || r === 3 && c === 3) return [0, 0]; if (r === 3 && c === 2) return [1, 2]; }
function spanFixed({ rowIndex: r, columnIndex: c }: TableSpanScope<Person>) { if (r === 1 && c === 1) return [2, 1]; if (r === 2 && c === 1 || r === 3 && c === 4) return [0, 0]; if (r === 3 && c === 3) return [1, 2]; }
function spanHeader({ rowIndex: r, columnIndex: c }: TableSpanScope<Person>) { if (r === 0 && c === 2 || r === 4 && c === 3) return [2, 1]; if (r === 1 && c === 2 || r === 5 && c === 3) return [0, 0]; }
const virtualColumns = [{ prop: 'index', label: '序号', width: 80, align: 'center' }, { prop: 'name', label: '姓名', width: 120, align: 'center' }, { prop: 'score', label: '分数', width: 100, align: 'center' }, { prop: 'remark', label: '备注', width: 200 }] as const;
export function TableExample() {
  const { text: demoText, copy: demoCopy } = useDemoLocale();
  const [data, setData] = useState(original), [page, setPage] = useState(1);
  const [quantities, setQuantities] = useState(() => Array.from({ length: 200 }, (_, i) => ({ id: i + 1, quantity: i % 10 })));
  const soldiers = useMemo(() => Array.from({ length: 10000 }, (_, i) => ({ index: i + 1, name: `蜀兵${i + 1}号`, score: (i * 37 + 6) % 100, remark: `这是蜀兵${i + 1}号的备注信息` })), []);
  const editable = useMemo<TableColumn<(typeof quantities)[number]>[]>(() => [{ prop: 'id', label: '姓名', width: 'calc(100% - 220px)', render: ({ row, index }) => <view><text className="ui-table-value">{demoText(`蜀兵${row.id}号`)}</text><text className="demo-table-position">{demoText(`第 ${index + 1} 行`)}</text></view> }, { prop: 'quantity', label: '数量', width: 160, align: 'center', render: ({ row }) => <InputNumber value={row.quantity} min={0} max={99} onChange={({ value }) => { 'background only'; setQuantities(previous => previous.map(item => item.id === row.id ? { ...item, quantity: Number(value) } : item)); }} /> }], [demoText]);
  const reverse = () => { 'background only'; setData(previous => [...previous].reverse()); };
  const first = data.slice(0, 5);
  return <view className="demo-table-page"><DemoGroup title="组件类型">
    <ExampleBlock title="基本用法"><Table data={data} columns={demoCopy(basic)} height={400} /></ExampleBlock>
    <ExampleBlock title="固定列"><Table data={data} columns={demoCopy(full)} height={400} onSortMethod={reverse} /></ExampleBlock>
    <ExampleBlock title="显示索引"><Table data={data} columns={demoCopy(full.map(col => ({ ...col, fixed: false })))} height={400} index={{ align: 'center' }} onSortMethod={reverse} /></ExampleBlock>
    <ExampleBlock title="自定义列模板"><Table data={data} columns={demoCopy<TableColumn<Person>[]>([...full.map(col => col.prop === 'grade' ? { ...col, render: grade } : col), { prop: 'graduation', label: '学成时间' }])} height={400} onSortMethod={reverse} /></ExampleBlock>
    <ExampleBlock title="合并单元格"><Table data={first} columns={demoCopy(narrow)} height={400} spanMethod={spanBasic} /></ExampleBlock>
    <ExampleBlock title="合并单元格与自定义列模板"><Table data={first} columns={demoCopy([full[0]!, { ...full[1]!, fixed: false, sortable: false, render: grade }, ...full.slice(2, 5).map(col => ({ ...col, sortable: false }))])} height={400} spanMethod={spanCustom} onSortMethod={reverse} /></ExampleBlock>
    <ExampleBlock title="固定列与合并单元格"><Table data={first} columns={demoCopy(full.map((col, i) => ({ ...col, sortable: false, fixed: i === 0 })))} height={400} spanMethod={spanFixed} /></ExampleBlock>
    <ExampleBlock title="固定表头与合并单元格"><Table data={data} columns={demoCopy(narrow)} height={300} spanMethod={spanHeader} /></ExampleBlock>
    <ExampleBlock title="虚拟滚动"><text className="demo-table-hint">{demoText("共 10000 行，可持续滚动至最后一行。")}</text><Table data={soldiers} columns={demoCopy(virtualColumns)} height={400} virtual rowHeight={50} rowKey="index" /></ExampleBlock>
    <ExampleBlock title="虚拟滚动与自定义列模板"><text className="demo-table-hint">{demoText("调整任意行数量，滚动后返回，数量仍保留在对应行。")}</text><Table data={quantities} columns={demoCopy(editable)} height={320} virtual rowHeight={64} index={{ fixed: true, width: 60, align: 'center' }} rowKey="id" /></ExampleBlock>
  </DemoGroup><DemoGroup title="组件状态">
    <ExampleBlock title="无边框"><Table data={data} columns={demoCopy(basic)} height={400} border={false} /></ExampleBlock>
    <ExampleBlock title="无斑马纹"><Table data={data} columns={demoCopy(basic)} height={400} stripe={false} /></ExampleBlock>
    <ExampleBlock title="不展示表头"><Table data={data} columns={demoCopy(basic)} height={400} showHeader={false} /></ExampleBlock>
  </DemoGroup><DemoGroup title="特殊样式"><ExampleBlock title="不固定表头结合分页器"><Table data={data.slice((page - 1) * 10, page * 10)} columns={demoCopy(full.map(col => ({ ...col, sortable: false })))} fixedHeader={false} /><Pagination value={page} total={data.length} onChange={setPage} /></ExampleBlock></DemoGroup></view>;
}
