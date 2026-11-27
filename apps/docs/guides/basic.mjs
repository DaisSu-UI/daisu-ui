import { g, e } from "./shared.mjs";
export default {
  icon: g(
    "图标用于表示操作、状态和导航。支持305个内置 SVG 图标名称、图片地址、自定义颜色与尺寸，内置图形基于 Tabler Icons 3.53.0（MIT）。",
    "Icon",
    e(
      "组件类型",
      "内置图标",
      'return <><Icon name="home" /><Icon name="search-line" /><Icon name="settings" /></>;',
      "通过 name 选择内置图标。",
    ),
    e(
      "组件样式",
      "颜色与尺寸",
      'return <Icon name="heart-fill" size={32} color="#f14646" />;',
      "size 的单位为 px，color 控制 SVG 图标颜色。",
    ),
    e(
      "交互用法",
      "点击图标",
      'return <Icon name="download" accessibilityLabel="下载文件" onTap={() => { \'background only\'; console.log("下载"); }} />;',
      "可操作的图标应设置 accessibilityLabel 说明用途。",
    ),
  ),
  text: g(
    "文本用于展示普通文字、语义状态、格式化金额和脱敏信息，支持多行截断与前后内容。",
    "Text",
    e(
      "组件类型",
      "普通文本与语义颜色",
      'return <><Text text="这是一段正文" /><Text text="操作成功" type="success" /><Text text="请检查输入" type="error" /></>;',
    ),
    e(
      "内容形态",
      "格式化与脱敏",
      'return <><Text text="18888888888" mode="phone" format /><Text text="12345.67" mode="price" prefix="￥" /></>;',
      "phone 配合 format 展示脱敏号码，price 按金额格式展示。",
    ),
    e(
      "组件样式",
      "字号与行数",
      'return <Text text="长文本会根据设置的行数截断展示。" size={16} lineHeight={24} lines={2} bold />;',
    ),
  ),
  layout: g(
    "栅格布局将一行划分为 24 份，通过 Row 与 Col 组合控制宽度、间隔、偏移和对齐。",
    "Row Col",
    e(
      "布局能力",
      "基础分栏",
      "return <Row><Col span={8}><text>左侧</text></Col><Col span={16}><text>右侧</text></Col></Row>;",
      "Col 的 span 表示占用的栅格份数。",
    ),
    e(
      "布局能力",
      "间隔与偏移",
      "return <Row gutter={20}><Col span={8}><text>内容一</text></Col><Col span={8} offset={4}><text>内容二</text></Col></Row>;",
      "gutter 设置列间隔，offset 设置左侧偏移。",
    ),
    e(
      "布局能力",
      "水平与垂直对齐",
      'return <Row justify="space-between" align="middle"><Col span={6}><text>左侧</text></Col><Col span={6}><text>右侧</text></Col></Row>;',
    ),
  ),
  card: g(
    "卡片用于聚合标题、正文与底部操作。标准卡片适合独立内容块，矩形卡片适合连续列表。",
    "Card",
    e(
      "组件类型",
      "标准卡片",
      'return <Card variant="standard" title="生活记录"><text>今天也是值得记录的一天。</text></Card>;',
      '设置 variant="standard" 使用标准卡片样式。',
    ),
    e(
      "组件类型",
      "矩形卡片",
      'return <Card type="rectangle" title="项目动态"><text>项目已更新。</text></Card>;',
    ),
    e(
      "内容形态",
      "自定义标题与操作",
      'return <Card variant="standard" title={<text>订单详情</text>} footer={<Button label="查看" size="small" />}><text>订单编号：20260001</text></Card>;',
      "title、children 和 footer 接收 React 节点。",
    ),
  ),
  cell: g(
    "单元格用于展示一项信息或提供操作入口。配合 CellGroup 可组织设置列表、详情和表单布局。",
    "Cell CellGroup",
    e(
      "组件类型",
      "基础单元格",
      'return <CellGroup border><Cell title="单元格" value="内容" /><Cell title="带描述" description="补充说明" value="内容" /></CellGroup>;',
    ),
    e(
      "交互用法",
      "链接入口",
      'return <Cell title="个人资料" arrow clickable onTap={() => { \'background only\'; console.log("打开资料"); }} />;',
    ),
    e(
      "内容形态",
      "组合输入框",
      'return <Cell title="姓名" titleWidth="98px" required center><Input compact placeholder="请输入姓名" /></Cell>;',
      "使用 children 放置自定义控件，center 让标题与内容垂直居中。",
    ),
  ),
  divider: g(
    "分割线用于分隔内容区域，支持水平、垂直、虚线以及带文字或图标的分隔形式。",
    "Divider",
    e(
      "组件类型",
      "基础分割线",
      "return <><Divider /><Divider dashed /><Divider>内容分隔</Divider></>;",
    ),
    e(
      "组件样式",
      "颜色与位置",
      'return <Divider color="#1c64fd" contentPosition="left">左侧标题</Divider>;',
    ),
    e(
      "布局能力",
      "垂直分割线",
      'return <view style={{ display: "flex", flexDirection: "row", alignItems: "center" }}><text>编辑</text><Divider vertical /><text>删除</text></view>;',
    ),
  ),
  fab: g(
    "悬浮按钮用于放置页面的主要操作。支持展开操作项、自定义触发器、位置和拖动。",
    "Fab",
    e(
      "组件类型",
      "基础用法",
      "return <Fab onTap={() => { 'background only'; console.log(\"新建\"); }} />;",
    ),
    e(
      "交互用法",
      "展开操作",
      'return <Fab expandable><Button label="拍照" size="small" /><Button label="相册" size="small" /></Fab>;',
      "子内容用于展示展开后的操作项。",
    ),
    e(
      "组件状态",
      "禁用与拖动",
      "return <><Fab disabled /><Fab draggable /></>;",
    ),
  ),
  transition: g(
    "动画组件通过 show 控制内容的进入与离开，支持淡入、缩放、滑动和自定义过渡类名。",
    "Transition",
    e(
      "组件类型",
      "淡入淡出",
      'const [show, setShow] = useState(true); return <><Button label="切换" onTap={() => { \'background only\'; setShow(!show); }} /><Transition show={show} name="fade"><text>动画内容</text></Transition></>;',
    ),
    e(
      "组件变体",
      "组合动画",
      'return <Transition show name={["fade", "zoom-in"]} duration={300}><text>淡入并缩放</text></Transition>;',
    ),
    e(
      "生命周期",
      "动画结束回调",
      'return <Transition show name="slide-up" onAfterEnter={() => { \'background only\'; console.log("进入完成"); }}><text>内容</text></Transition>;',
    ),
  ),
  resize: g(
    "尺寸监听器在子内容布局变化时报告矩形信息，适合自适应布局和组件尺寸计算。",
    "Resize",
    e(
      "组件类型",
      "监听布局变化",
      'const [width, setWidth] = useState(0); return <><Resize onResize={rect => { \'background only\'; setWidth(rect.width); }}><view style={{ width: "100%", height: "80px" }} /></Resize><text>{width}px</text></>;',
    ),
    e(
      "内容形态",
      "包裹动态内容",
      'const [expanded, setExpanded] = useState(false); return <><Button label="展开" onTap={() => { \'background only\'; setExpanded(!expanded); }} /><Resize onResize={rect => { \'background only\'; console.log(rect); }}><text>{expanded ? "展开后显示更多内容" : "摘要"}</text></Resize></>;',
    ),
  ),
  "config-provider": g(
    "全局配置用于统一组件的主题、语言、颜色变量和默认属性，也可以在局部嵌套覆盖。",
    "ConfigProvider useLocale",
    e(
      "主题模式",
      "明暗切换",
      'const [dark, setDark] = useState(false); return <ConfigProvider theme={dark ? "dark" : "light"}><Button label="切换主题" onTap={() => { \'background only\'; setDark(!dark); }} /></ConfigProvider>;',
    ),
    e(
      "组件样式",
      "颜色与组件默认值",
      'return <ConfigProvider themeVars={{ primary: "#7c3aed", buttonRadius: 8 }} button={{ round: true, size: "large" }}><Button label="主题按钮" /></ConfigProvider>;',
    ),
    e(
      "国际化",
      "语言配置",
      'return <ConfigProvider locale="en-US"><Search /><Loadmore state="finished" /></ConfigProvider>;',
      "locale 支持 zh-CN、en-US、zh-TW 或语言包对象，默认简体中文。useLocale() 返回当前语言与类型安全的 t(key, params)；Provider 动态切换会更新默认文案，显式传入的业务内容优先。",
    ),
  ),
  "root-portal": g(
    "根节点传送门将弹层内容挂载到页面根部，帮助浮层脱离局部裁剪和变换容器。",
    "RootPortal RootPortalHost",
    e(
      "基础用法",
      "配置挂载宿主",
      'return <RootPortalHost><text>页面内容</text><RootPortal><view style={{ position: "fixed", top: "80px", right: "16px" }}><text>根节点浮层</text></view></RootPortal></RootPortalHost>;',
      "RootPortalHost 放在应用根部，RootPortal 负责挂载浮层内容。",
    ),
    e(
      "组合用法",
      "与主题配合",
      'return <ConfigProvider theme="dark"><RootPortalHost><Button label="页面操作" /></RootPortalHost></ConfigProvider>;',
    ),
  ),
};
