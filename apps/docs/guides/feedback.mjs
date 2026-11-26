import { g, e } from "./shared.mjs";
export default {
  "notice-bar": g(
    "通知栏用于展示公告与提示信息，支持滚动、图标、关闭和点击反馈。",
    "NoticeBar",
    e(
      "组件类型",
      "基础通知",
      'return <NoticeBar text="温馨提示：请及时完善个人信息。" />;',
    ),
    e(
      "组件样式",
      "自定义内容颜色",
      'return <NoticeBar text="系统将在今晚进行维护" color="#f57f00" />;',
    ),
  ),
  "swipe-action": g(
    "滑动操作通过左右滑动展示快捷操作，适合列表中的删除、收藏等操作入口。",
    "SwipeAction",
    e(
      "基础用法",
      "右侧操作",
      'return <SwipeAction right={<Button label="删除" tone="danger" />}><Cell title="向左滑动" value="展示操作" /></SwipeAction>;',
    ),
    e(
      "组件状态",
      "禁用滑动",
      'return <SwipeAction disabled right={<Button label="删除" />}><Cell title="禁用滑动" /></SwipeAction>;',
    ),
  ),
  "floating-panel": g(
    "浮动面板在页面底部提供可拖动的内容区域，支持多档高度和内容拖拽。",
    "FloatingPanel",
    e(
      "基础用法",
      "多档高度",
      "return <FloatingPanel anchors={[100, 300, 500]} defaultHeight={100}><text>向上拖动查看更多内容</text></FloatingPanel>;",
    ),
    e(
      "交互用法",
      "监听高度变化",
      "return <FloatingPanel anchors={[120, 360]} onHeightChange={event => { 'background only'; console.log(event.height); }}><text>面板内容</text></FloatingPanel>;",
    ),
  ),
  popover: g(
    "气泡用于在触发元素附近展示辅助内容或菜单，支持方向、箭头和自定义内容。",
    "Popover",
    e(
      "组件类型",
      "文字气泡",
      'return <Popover content="这里是提示内容"><Button label="显示气泡" /></Popover>;',
    ),
    e(
      "组件样式",
      "指定方向",
      'return <Popover content="显示在上方" placement="top"><Button label="上方气泡" /></Popover>;',
    ),
    e(
      "内容形态",
      "自定义内容",
      'return <Popover contentNode={<text>自定义气泡内容</text>}><Button label="查看内容" /></Popover>;',
    ),
  ),
  toast: g(
    "轻提示用于短暂反馈操作结果，支持文字、成功、失败和持续加载等状态。",
    "Toast",
    e(
      "基础用法",
      "绑定提示实例",
      'const toast = useToast(); return <><Button label="显示提示" onTap={() => { \'background only\'; toast.show("这是一条提示"); }} /><Toast {...toast.props} /></>;',
      "useToast 返回控制方法与 props，需把 props 绑定到 Toast 实例。",
    ),
    e(
      "组件状态",
      "成功与加载",
      'const toast = useToast(); return <><Button label="成功" onTap={() => { \'background only\'; toast.success("保存成功"); }} /><Button label="加载" onTap={() => { \'background only\'; toast.loading("加载中"); }} /><Button label="关闭" onTap={() => { \'background only\'; toast.close(); }} /><Toast {...toast.props} /></>;',
    ),
  ),
  tooltip: g(
    "文字提示用于解释图标或控件含义，在触发元素附近展示简短说明。",
    "Tooltip",
    e(
      "基础用法",
      "点击查看说明",
      'return <Tooltip content="这里是帮助信息"><Button label="帮助" /></Tooltip>;',
    ),
    e(
      "组件样式",
      "方向与关闭按钮",
      'return <Tooltip content="点击关闭按钮隐藏" placement="top" showClose><Button label="顶部提示" /></Tooltip>;',
    ),
  ),
  "drop-menu": g(
    "下拉菜单适合筛选和排序，由 DropMenu 容器与多个 DropMenuItem 组成。",
    "DropMenu DropMenuItem",
    e(
      "基础用法",
      "单项筛选",
      'const [value, setValue] = useState<string | number>(0); return <DropMenu><DropMenuItem value={value} onChange={event => { \'background only\'; setValue(event.value); }} options={[{ value: 0, label: "全部商品" }, { value: 1, label: "新款商品" }]} /></DropMenu>;',
    ),
    e(
      "内容形态",
      "自定义筛选内容",
      'return <DropMenu><DropMenuItem title="筛选"><text>自定义筛选内容</text></DropMenuItem></DropMenu>;',
    ),
  ),
  dialog: g(
    "对话框用于确认操作、展示提醒或收集简单输入，支持异步确认与自定义内容。",
    "Dialog",
    e(
      "组件类型",
      "消息提醒",
      'const dialog = useDialog(); return <><Button label="显示提醒" onTap={() => { \'background only\'; void dialog.alert({ title: "提示", msg: "操作已完成" }); }} /><Dialog {...dialog.props} /></>;',
    ),
    e(
      "组件类型",
      "确认操作",
      'const dialog = useDialog(); return <><Button label="删除" onTap={async () => { \'background only\'; try { await dialog.confirm({ title: "删除确认", msg: "确定删除这条记录吗？" }); console.log("已确认"); } catch { console.log("已取消"); } }} /><Dialog {...dialog.props} /></>;',
    ),
    e(
      "组件样式",
      "按钮主题",
      'return <Dialog show={false} title="操作确认" msg="请选择操作" theme="button" />;',
    ),
  ),
  "action-sheet": g(
    "动作面板从底部展示操作选项，支持列表、宫格面板、取消和自定义内容。",
    "ActionSheet",
    e(
      "组件类型",
      "操作列表",
      'const [show, setShow] = useState(false); return <><Button label="更多操作" onTap={() => { \'background only\'; setShow(true); }} /><ActionSheet show={show} onChange={setShow} title="请选择操作" actions={[{ name: "收藏" }, { name: "分享" }]} cancelText="取消" onSelect={selection => { \'background only\'; console.log(selection); }} /></>;',
    ),
    e(
      "组件样式",
      "面板标题",
      'return <ActionSheet show={false} title="更多操作" cancelText="取消" actions={[{ name: "查看详情" }]} />;',
    ),
  ),
  popup: g(
    "弹出层用于展示临时操作或内容，支持多个弹出方向、遮罩、圆角、左侧标题和右上角圆形关闭按钮。",
    "Popup",
    e(
      "组件类型",
      "基础弹层",
      "const [show, setShow] = useState(false); return <><Button label=\"打开弹层\" onTap={() => { 'background only'; setShow(true); }} /><Popup show={show} onChange={setShow} title=\"等级权益\" closable><text>弹层内容</text></Popup></>;",
    ),
    e(
      "布局能力",
      "底部弹出",
      'return <Popup show={false} title="等级权益" position="bottom" round closable safeAreaInsetBottom><text>底部内容</text></Popup>;',
    ),
  ),
  overlay: g(
    "遮罩层用于突出前景内容并阻隔背景交互，支持显示控制、过渡和自定义层级。",
    "Overlay",
    e(
      "基础用法",
      "点击关闭遮罩",
      "const [show, setShow] = useState(false); return <><Button label=\"显示遮罩\" onTap={() => { 'background only'; setShow(true); }} /><Overlay show={show} onTap={() => { 'background only'; setShow(false); }} /></>;",
    ),
    e(
      "内容形态",
      "自定义内容",
      'return <Overlay show={false}><view style={{ marginTop: "120px", padding: "20px" }}><text>前景内容</text></view></Overlay>;',
    ),
  ),
  "count-to": g(
    "数字滚动通过补间动画展示数值变化，可用于统计数据、金额和指标。",
    "CountTo",
    e("基础用法", "数字动画", "return <CountTo startVal={0} endVal={2026} />;"),
    e(
      "组件样式",
      "金额格式",
      'return <CountTo startVal={0} endVal={12345.67} decimals={2} prefix="￥" />;',
    ),
  ),
  "count-down": g(
    "倒计时用于显示剩余时间，支持格式化、毫秒显示和命令式控制。",
    "CountDown",
    e("基础用法", "显示剩余时间", "return <CountDown time={3600000} />;"),
    e(
      "组件样式",
      "自定义格式",
      'return <CountDown time={90000} format="mm:ss" />;',
    ),
  ),
  notify: g(
    "消息通知用于展示页面级状态，支持成功、警告、失败以及不同位置和外观。",
    "Notify",
    e(
      "基础用法",
      "绑定通知实例",
      'const notify = useNotify(); return <><Button label="显示通知" onTap={() => { \'background only\'; notify.showNotify("这是一条通知"); }} /><Notify {...notify.props} /></>;',
    ),
    e(
      "组件状态",
      "成功通知",
      'const notify = useNotify(); return <><Button label="保存成功" onTap={() => { \'background only\'; notify.showNotify({ type: "success", message: "信息保存成功" }); }} /><Notify {...notify.props} /></>;',
    ),
  ),
  circle: g(
    "环形进度条用于展示完成比例，支持颜色、线宽、动画和自定义中间内容。",
    "Circle",
    e("基础用法", "显示进度", "return <Circle value={60} />;"),
    e(
      "组件样式",
      "自定义颜色与内容",
      'return <Circle value={75} color="#12b886"><text>75%</text></Circle>;',
    ),
  ),
  progress: g(
    "进度条用于展示任务完成情况，支持文字位置、状态颜色和自定义进度样式。",
    "Progress",
    e("基础用法", "显示进度", "return <Progress percentage={60} />;"),
    e(
      "组件样式",
      "自定义颜色",
      'return <Progress percentage={80} color="#12b886" />;',
    ),
  ),
  loading: g(
    "加载指示器用于告知用户正在处理任务，支持圆环、旋转线条、圆点和波浪样式。",
    "Loading",
    e(
      "组件类型",
      "加载动画",
      'return <><Loading type="circular" /><Loading type="spinner" /><Loading type="dots" /><Loading type="wave" /></>;',
    ),
    e(
      "组件样式",
      "颜色与尺寸",
      'return <Loading color="#12b886" size={32} />;',
    ),
    e(
      "内容形态",
      "加载文案",
      'return <><Loading text="加载中" /><Loading text="加载中" direction="horizontal" /></>;',
    ),
  ),
  empty: g(
    "缺省提示用于展示无数据、网络异常或搜索无结果等状态，可组合图片、文案与底部操作。",
    "Empty",
    e(
      "组件类型",
      "缺省状态",
      'return <Empty icon="no-content" tip="暂无内容" />;',
    ),
    e(
      "内容形态",
      "自定义图片和操作",
      'return <Empty image={<Icon name="no-result" size={100} />} tip="未找到相关内容" bottom={<Button label="重新搜索" />} />;',
    ),
    e(
      "组件样式",
      "图标尺寸",
      'return <Empty icon="no-message" tip="暂无消息" iconSize={140} />;',
    ),
  ),
};
