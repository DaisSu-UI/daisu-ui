import { g, e } from "./shared.mjs";
export default {
  router: g(
    "路由用于组织页面导航、返回栈和页面转场，支持页面保活、导航守卫与侧滑返回。",
    "RouterView",
    e(
      "基础用法",
      "创建页面路由",
      'const rootRoute = createRootRoute(); const page = createRoute({ getParentRoute: () => rootRoute, path: "/example" }); const router = createRouter({ routeTree: rootRoute.addChildren([page]), initial: "/example", toPath: path => path, fromMatch: match => ({ path: match.pathname }), stringify: route => route.path }); return <RouterView router={router} renderRoute={route => <text>{route.path}</text>} />;',
      "页面通过 TanStack 路由树注册，RouterView 负责渲染与页面栈。",
    ),
  ),
  navbar: g(
    "导航栏用于展示页面标题、返回入口和右侧操作，支持固定布局、自定义内容与胶囊导航。",
    "Navbar NavbarCapsule",
    e(
      "组件类型",
      "标准导航栏",
      'return <Navbar variant="standard" title="页面标题" leftArrow onBack={() => { \'background only\'; console.log("返回"); }} />;',
      '设置 variant="standard" 使用组件展示中的标准样式。',
    ),
    e(
      "内容形态",
      "右侧操作",
      'return <Navbar variant="standard" title="编辑资料" rightText="保存" onRightTap={() => { \'background only\'; console.log("保存"); }} />;',
    ),
    e(
      "布局能力",
      "固定导航栏",
      'return <Navbar variant="standard" title="详情" fixed placeholder bordered />;',
      "fixed 配合 placeholder 为内容保留导航栏高度。",
    ),
  ),
  tabbar: g(
    "标签栏用于切换应用中的主要页面，支持图标、徽标、异步切换校验和底部安全区。",
    "Tabbar",
    e(
      "组件类型",
      "基础标签栏",
      'const [value, setValue] = useState<string | number>(0); return <Tabbar value={value} onChange={event => { \'background only\'; setValue(event.value); }} items={[{ name: 0, title: "首页", icon: "home" }, { name: 1, title: "我的", icon: "user" }]} />;',
    ),
    e(
      "布局能力",
      "固定底部",
      'return <Tabbar fixed placeholder safeAreaInsetBottom items={[{ name: "home", title: "首页", icon: "home" }, { name: "me", title: "我的", icon: "user" }]} />;',
    ),
  ),
  tabs: g(
    "标签页用于在同一页面内切换内容，支持滑动标签、下划线、内容切换和吸顶。",
    "Tabs",
    e(
      "组件类型",
      "标准标签页",
      'return <Tabs variant="standard" items={[{ title: "标签一", name: "one", children: <text>内容一</text> }, { title: "标签二", name: "two", children: <text>内容二</text> }]} />;',
    ),
    e(
      "交互用法",
      "受控切换",
      'const [value, setValue] = useState<string | number>("one"); return <Tabs variant="standard" value={value} onChange={next => { \'background only\'; setValue(next); }} items={[{ title: "标签一", name: "one" }, { title: "标签二", name: "two" }, { title: "禁用", name: "three", disabled: true }]} />;',
    ),
    e(
      "组件样式",
      "自定义颜色",
      'return <Tabs variant="standard" color="#f86100" lineWidth={24} items={[{ title: "精选" }, { title: "推荐" }]} />;',
    ),
  ),
  segmented: g(
    "分段器用于展示多个选项并允许用户选择其中单个选项。适合在同一区域切换少量互斥选项及其关联内容。",
    "Segmented",
    e(
      "组件类型",
      "基础用法",
      'const [value, setValue] = useState<string | number>("点赞"); return <Segmented options={["评论", "点赞", "贡献", "打赏"]} value={value} onChange={option => { \'background only\'; setValue(option.value); }} />;',
      "通过 `options` 设置选项列表，通过 `value` 和 `onChange` 管理当前选中项。非受控使用时可通过 `defaultValue` 设置初始选中项。",
    ),
    e(
      "组件状态",
      "禁用",
      'return <><Segmented disabled defaultValue="点赞" options={["评论", "点赞", "贡献", "打赏"]} /><Segmented options={[{ value: "评论" }, { value: "点赞", disabled: true }, { value: "贡献" }]} /></>;',
      "设置 `disabled` 禁用整个分段器，也可以为 `options` 中的单个选项设置 `disabled`。",
    ),
    e(
      "组件变体",
      "轮廓主题",
      'return <Segmented theme="outline" defaultValue="点赞" options={["评论", "点赞", "贡献", "打赏"]} />;',
      '通过 `theme="outline"` 切换为轮廓样式，默认使用 `card` 卡片主题。',
    ),
    e(
      "组件样式",
      "自定义渲染分段器标签",
      'return <Segmented options={[{ value: "李雷", payload: { role: "设计师" } }, { value: "韩梅梅", payload: { role: "开发者" } }]} renderLabel={({ option, active }) => <view><text>{active ? "✓ " : ""}{option.value}</text><text>{option.payload?.role}</text></view>} />;',
      "通过 `renderLabel` 自定义标签，回调提供 `option`、`active` 和 `disabled`。选项的额外数据可放入 `payload`。",
    ),
    e(
      "特殊样式",
      "在弹出框中使用",
      'const [show, setShow] = useState(false); const [value, setValue] = useState<string | number>("点赞"); return <><Button label="打开弹出框" onTap={() => { \'background only\'; setShow(true); }} /><Popup show={show} onChange={next => { \'background only\'; setShow(next); }} position="bottom" closable round rootPortal style={{ padding: "24px", minHeight: "180px" }}><Segmented value={value} options={["评论", "点赞", "贡献", "打赏"]} onChange={option => { \'background only\'; setValue(option.value); }} /></Popup></>;',
      "通过 `Popup` 的 `show` 控制弹出框，在其中放入分段器即可使用；选中项仍由 `value` 和 `onChange` 管理。",
    ),
  ),
  sidebar: g(
    "侧边栏用于纵向分类导航，可与内容区组合实现页面切换或锚点联动。",
    "Sidebar",
    e(
      "组件类型",
      "基础分类",
      'const [value, setValue] = useState<string | number>("hot"); return <Sidebar value={value} onChange={event => { \'background only\'; setValue(event.value); }} items={[{ value: "hot", label: "热门推荐" }, { value: "new", label: "新品上架" }]} />;',
    ),
    e(
      "交互用法",
      "切换前确认",
      'return <Sidebar items={[{ value: 0, label: "分类一" }, { value: 1, label: "分类二" }]} beforeChange={async value => { \'background only\'; console.log(value); return true; }} />;',
    ),
  ),
  "index-bar": g(
    "索引栏适合按字母或分类组织长列表，支持索引点击、拖动定位和分组标题。",
    "IndexBar IndexAnchor",
    e(
      "组件类型",
      "字母分组列表",
      'return <IndexBar listId="contact-list" sections={[{ index: "A", data: ["阿明", "安然"] }, { index: "B", data: ["白云"] }]} renderItem={({ item }) => <Cell title={item} />} />;',
      "每组包含 index 和 data，renderItem 定义列表项。",
    ),
    e(
      "组件样式",
      "自定义行高",
      'return <IndexBar listId="city-list" itemHeight={48} anchorHeight={32} sections={[{ index: "A", data: ["安庆"] }]} renderItem={({ item }) => <text>{item}</text>} />;',
    ),
  ),
  pagination: g(
    "分页器用于切换有明确页数的数据，支持总条数、页大小、图标和自定义文案。",
    "Pagination",
    e(
      "组件类型",
      "受控分页",
      "const [page, setPage] = useState(1); return <Pagination value={page} onChange={value => { 'background only'; setPage(value); }} total={100} pageSize={10} />;",
    ),
    e(
      "内容形态",
      "自定义翻页文案",
      'return <Pagination totalPage={5} prevText="上一页" nextText="下一页" showMessage />;',
    ),
    e(
      "组件状态",
      "单页时隐藏",
      "return <Pagination total={8} pageSize={10} hideIfOnePage />;",
    ),
  ),
  backtop: g(
    "回到顶部按钮根据滚动距离显示，点击后将滚动请求交给页面处理。",
    "Backtop",
    e(
      "基础用法",
      "与滚动容器组合",
      "const [scrollTop, setScrollTop] = useState(0); const [target, setTarget] = useState(0); return <><scroll-view scroll-y style={{ height: \"400px\" }} scroll-top={target} bindscroll={event => { 'background only'; setScrollTop(event.detail.scrollTop); }}><view style={{ height: \"1200px\" }}><text>滚动内容</text></view></scroll-view><Backtop scrollTop={scrollTop} onBacktop={() => { 'background only'; setTarget(target === 0 ? 0.01 : 0); }} /></>;",
    ),
    e(
      "组件样式",
      "方形与文案",
      'return <Backtop scrollTop={500} shape="square" text="顶部" onBacktop={request => { \'background only\'; console.log(request); }} />;',
    ),
  ),
  tour: g(
    "漫游引导通过高亮目标元素逐步介绍页面功能，支持步骤切换、自定义内容和目标定位。",
    "Tour",
    e(
      "基础用法",
      "开始引导",
      'const [show, setShow] = useState(false); return <><view id="tour-target"><Button label="开始引导" onTap={() => { \'background only\'; setShow(true); }} /></view><Tour show={show} onShowChange={setShow} steps={[{ element: "#tour-target", content: "点击这里开始操作" }]} /></>;',
    ),
    e(
      "组件样式",
      "高亮区域与按钮文案",
      'return <Tour show={false} steps={[{ element: "#tour-target", content: "完成设置" }]} padding={12} borderRadius={8} finishText="知道了" />;',
    ),
  ),
};
