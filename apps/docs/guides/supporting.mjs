import { g, e } from "./shared.mjs";

export default {
  "form-rows": g(
    "用于已有业务表单的轻量行布局。新表单推荐使用 [Form / FormItem](form.md)，这些封装不注册 Form 字段、不执行校验，也不自动继承 Form 的禁用状态。required 仅显示星号，error 由调用方提供；last 隐藏末行分隔线。FormFieldRow.disabled 只添加外观类名，自定义 children 的交互需自行拦截。FormInputRow.disabled 也不阻止原生输入或清空；需要完整禁用时使用 Input 配合 FormItem。FormTextareaRow.disabled 仅拦截 onInput 回写，仍可聚焦，不能作为原生输入禁用保证。",
    "FormFieldRow FormInputRow FormNumberRow FormRadioRow FormSelectRow FormTextareaRow",
    e(
      "基础用法",
      "受控输入与错误展示",
      `const [name, setName] = useState(''); return <FormInputRow label="姓名" required value={name} onInput={value => { 'background only'; setName(value); }} maxlength={30} error={name ? undefined : '请输入姓名'} />;`,
      "value 必须是字符串；onInput 直接接收字符串，不是原生事件。required 不会自动验证，示例由调用方计算 error。",
    ),
    e(
      "基础用法",
      "数字、单选与多行输入",
      `const [count, setCount] = useState('1'); const [choice, setChoice] = useState('a'); const [note, setNote] = useState(''); return <><FormNumberRow label="数量" value={count} min={1} max={10} onChange={value => { 'background only'; setCount(value); }} /><FormRadioRow label="选项" value={choice} options={[{ value: 'a', label: '选项 A' }, { value: 'b', label: '选项 B' }]} onChange={value => { 'background only'; setChoice(value); }} /><FormTextareaRow label="备注" value={note} maxlength={200} maxlines={4} onInput={value => { 'background only'; setNote(value); }} last /></>;`,
      "数字行使用字符串状态；单选的 options 使用 value / label。多行输入默认 maxlength=2000、maxlines=6、显示字数。",
    ),
    e(
      "组合用法",
      "外部选择器与自定义内容",
      `const [city, setCity] = useState(''); return <><FormSelectRow label="城市" value={city} placeholder="请选择城市" onTap={() => { 'background only'; setCity('杭州'); }} onClear={() => { 'background only'; setCity(''); }} /><FormFieldRow label="说明" last><text>选择面板及其草稿由调用方管理</text></FormFieldRow></>;`,
      "FormSelectRow 只展示文本并发出点击、清空回调，不包含选择器。示例点击直接回填固定值，实际项目应打开公共 Picker 等组件并在确认时回填；onClear 为必填回调。",
    ),
  ),
  "synced-input": g(
    "SyncedInput 与 SyncedTextarea 是受控原生输入封装：首次使用 default-value，外部 value 改变后通过节点 setValue 同步，并记录原生输入值以减少重复写入。需要清空、密码、禁用、计数等完整 UI 时使用 [Input](input.md) / [Textarea](textarea.md)。它们不支持 disabled、readonly 或 Input 的其他参数；聚焦及程序回填效果仍需在目标宿主验证。",
    "SyncedInput SyncedTextarea",
    e(
      "基础用法",
      "输入和外部回填",
      `const [value, setValue] = useState('初始值'); return <><SyncedInput value={value} placeholder="请输入" maxlength={40} onInput={next => { 'background only'; setValue(next); }} /><Button label="回填" onTap={() => { 'background only'; setValue('回填内容'); }} /><Button label="清空" onTap={() => { 'background only'; setValue(''); }} /></>;`,
      "onInput 直接接收 string，调用方必须回写 value；onBlur 不带事件参数。外部回填在 useEffect 中同步到原生节点。",
    ),
    e(
      "基础用法",
      "多行输入与键盘策略",
      `const [value, setValue] = useState(''); return <SyncedTextarea value={value} maxlength={200} maxlines={4} placeholder="请输入备注" onInput={next => { 'background only'; setValue(next); }} />;`,
      'SyncedInput 默认 softInputMode="nothing"、avoidKeyboard=false，可显式调整；SyncedTextarea 固定采用这两项设置，没有对应的公开参数。键盘避让应由页面及宿主统一管理。',
    ),
  ),
  "paged-list": g(
    "PagedList 在官方 @lynx-js/lynx-ui FeedList 上提供原生下拉刷新和触底通知。它不负责请求、分页、错误、去重或结束状态。listId 必须在当前页面及保活场景中唯一，父容器须有明确高度；children 和 footer 应按 FeedList 约定提供带稳定 item-key 的 list-item，不要嵌套另一个纵向滚动容器。",
    "PagedList",
    e(
      "基础用法",
      "刷新、加载更多与底部状态",
      `const listRef = useRef<FeedListRef | null>(null); const [refreshing, setRefreshing] = useState(false); const [items, setItems] = useState([1, 2, 3]); const loading = useRef(false); const refresh = () => { 'background only'; if (loading.current) return; loading.current = true; setRefreshing(true); }; useEffect(() => { if (!refreshing) return; const timer = setTimeout(() => { setItems([1, 2, 3]); loading.current = false; setRefreshing(false); }, 200); return () => clearTimeout(timer); }, [refreshing]); const loadMore = () => { 'background only'; if (loading.current || items.length >= 9) return; setItems(previous => [...previous, previous.length + 1]); }; return <view style={{ height: '480px', display: 'flex', flexDirection: 'column' }}><PagedList listId="guide-paged-list" listRef={listRef} refreshing={refreshing} onRefresh={refresh} onLoadMore={loadMore} footer={<list-item item-key="footer"><Loadmore state={items.length >= 9 ? 'finished' : undefined} /></list-item>}>{items.map(item => <list-item key={item} item-key={String(item)}><text>{item}</text></list-item>)}</PagedList></view>;`,
      "示例用可清理的定时器模拟异步刷新，仅操作本地数据。业务请求由调用方在回调中执行，并以 loading / hasMore 防重和判断结束；刷新回调须设置 refreshing=true，在 finally 中恢复 false，否则原生刷新头不能正确结束。初次加载不等同于下拉刷新。footer 为必填，可传 null。listRef 类型从 @lynx-js/lynx-ui 导入。",
    ),
  ),
  "compact-controls": g(
    "EmptyState 和 NumberStepper 是保留给轻量业务界面的封装。新页面需要更多外观和交互配置时，优先使用 [Empty](empty.md) 和 [InputNumber](input-number.md)。",
    "EmptyState NumberStepper",
    e(
      "基础用法",
      "空状态与重试",
      `return <EmptyState title="暂无记录" description="请调整条件后重试" actionLabel="重试" onAction={() => { 'background only'; console.log('重试'); }} />;`,
      "默认标题为“暂无数据”。仅设置 actionLabel 时显示按钮，点击调用 onAction；它不会自动重新请求数据，也不支持 Empty 的图片和插槽属性。",
    ),
    e(
      "基础用法",
      "字符串数字步进",
      `const [value, setValue] = useState('1'); return <NumberStepper value={value} min={0} max={10} step={1} onChange={next => { 'background only'; setValue(next); }} />;`,
      "value / onChange 均为字符串；初始空值会回填 min，按钮和失焦时做范围归一化。默认 min=0、max=Number.MAX_SAFE_INTEGER、step=1。当前输入过滤不适合作为负数或小数录入方案，需要这些能力时使用 InputNumber。disabled 会阻止按钮和输入回调，但不会原生禁用或阻止失焦归一化。",
    ),
  ),
  utilities: g(
    "这些函数从 @daisu-ui/ui/utils 导入。日期工具按设备本地时区处理毫秒时间戳，不负责校验业务日期范围。CalendarValue 是 number | readonly (number | null)[] | null；DatetimePickerValue 是 number | string；DatetimePickerType 为 datetime / date / year-month / time / year。usePressState 是 Hook，必须在组件顶层调用；不要将返回函数用于 main-thread 事件。",
    "usePressState calendarValues calendarWeekNumber datetimeLabel datetimePad swiperIndex",
    e(
      "交互用法",
      "按压反馈",
      `const { pressed, start, end } = usePressState(true); return <view bindtouchstart={start} bindtouchend={end} bindtouchcancel={end} style={{ opacity: pressed ? 0.6 : 1 }}><text>按住查看反馈</text></view>;`,
      "传入 enabled:boolean，返回 pressed:boolean、start():void、end():void。start / end 已标记为后台函数；结束和取消都必须绑定 end，enabled=false 时取消反馈。",
    ),
    e(
      "纯函数",
      "日期与轮播索引",
      `const date = new Date(2026, 0, 5).getTime(); const values = calendarValues([date, null]); const week = calendarWeekNumber(date); const label = datetimeLabel(date, 'date'); const hour = datetimePad(9); const index = swiperIndex(-1, 3, true); return <text>{values.length} 个日期 / 第 {week} 周 / {label} / {hour} / 索引 {index}</text>;`,
      'calendarValues 过滤 null、undefined 和无效日期，保留顺序，不去重；calendarWeekNumber 返回 ISO 周数。datetimePad 默认补齐两位；datetimeLabel(type="time") 原样返回时间字符串，其余模式需有效时间戳。swiperIndex 将索引取整，loop=true 时取模，否则限制到 0..count-1；空列表返回 0。',
    ),
  ),
  "web-registration": {
    ...g(
      "浏览器扩展入口 @daisu-ui/ui/web 用于 H5 媒体、图片裁剪与二维码导出。注册代码运行在浏览器宿主入口，在创建 lynx-view 之前调用；不能放入 ReactLynx 页面或原生 Bundle。原生环境继续使用宿主能力，这些函数不会为 Flutter 自动安装原生组件。",
      "registerDaisuWebComponents registerRichTextMedia registerImgCropper registerQrCodeExport",
    ),
    details: `## 浏览器入口\n\n统一注册会依次注册富文本音视频、图片裁剪与二维码导出，也可以只调用需要的单项函数。注册函数无参数、无返回值；已有同名自定义元素时跳过注册，可重复调用。\n\n\x60\x60\x60ts\nimport { registerDaisuWebComponents } from '@daisu-ui/ui/web';\n\n// 在浏览器宿主挂载 lynx-view 前执行。\nregisterDaisuWebComponents();\n\x60\x60\x60\n\nregisterRichTextMedia 对应 [RichText 富文本](rich-text.md) 音视频；registerImgCropper 对应 [ImgCropper 图片裁剪](img-cropper.md)；registerQrCodeExport 对应 [QRCode 二维码](qr-code.md) 导出。图片跨域读取和媒体播放遵循浏览器权限与资源 CORS 设置，注册不代表目标资源一定可播放或导出。`,
  },
};
