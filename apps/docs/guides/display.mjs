import { g, e } from "./shared.mjs";
export default {
  "rich-text": g(
    "富文本用于展示 HTML 内容，支持段落、图片、表格和媒体内容，并提供点击、加载与预览事件。",
    "RichText",
    e(
      "组件类型",
      "展示 HTML",
      'return <RichText content="<h2>文章标题</h2><p>这里是文章正文。</p>" />;',
    ),
    e(
      "内容形态",
      "表格与列表",
      'return <RichText content="<ul><li>项目一</li><li>项目二</li></ul><table><tr><td>名称</td><td>数值</td></tr><tr><td>完成率</td><td>80%</td></tr></table>" />;',
    ),
    e(
      "交互用法",
      "链接点击",
      "return <RichText content='<p><a href=\"https://example.com\">查看详情</a></p>' onLinkClick={event => { 'background only'; console.log(event); }} />;",
    ),
  ),
  "qr-code": g(
    "二维码用于将文本或链接编码为可扫描图案，支持尺寸、颜色与导出。",
    "QrCode",
    e(
      "基础用法",
      "文本与链接",
      'return <QrCode text="https://example.com" />;',
    ),
    e(
      "组件样式",
      "颜色与尺寸",
      'return <QrCode text="Daisu UI" size={180} colorDark="#1c64fd" />;',
    ),
  ),
  "bar-code": g(
    "条形码用于展示可扫描的商品或业务编码，支持不同编码格式及文字展示。",
    "BarCode",
    e("基础用法", "生成条形码", 'return <BarCode value="123456789012" />;'),
    e(
      "组件样式",
      "尺寸与颜色",
      'return <BarCode value="123456789012" height={80} lineColor="#1c64fd" />;',
    ),
  ),
  table: g(
    "表格用于展示结构化数据，支持列配置、固定列、排序、合并单元格和固定行高的虚拟窗口。",
    "Table",
    e(
      "组件类型",
      "基础表格",
      'return <Table data={[{ name: "张三", score: 88 }, { name: "李四", score: 95 }]} columns={[{ prop: "name", label: "姓名" }, { prop: "score", label: "分数" }]} />;',
    ),
    e(
      "组件样式",
      "边框与表头",
      'return <Table border stripe height={240} data={[{ name: "商品一", price: 99 }]} columns={[{ prop: "name", label: "商品", fixed: true }, { prop: "price", label: "价格" }]} />;',
    ),
    e(
      "交互用法",
      "监听排序",
      'return <Table data={[{ name: "张三", score: 88 }]} columns={[{ prop: "name", label: "姓名" }, { prop: "score", label: "分数", sortable: true }]} onSortMethod={column => { \'background only\'; console.log(column.prop, column.sortDirection); }} />;',
      "排序事件报告当前列与方向，数据排序由调用方处理。",
    ),
  ),
  "image-preview": g(
    "图片预览用于全屏查看图片组，支持切换、缩放、长按事件与自定义内容。",
    "ImagePreview",
    e(
      "基础用法",
      "打开预览",
      'const preview = useImagePreview(); return <><Button label="预览图片" onTap={() => { \'background only\'; preview.previewImage({ images: ["https://example.com/photo.jpg"] }); }} /><ImagePreview {...preview.props} /></>;',
    ),
    e(
      "内容形态",
      "多张图片",
      'const preview = useImagePreview(); return <><Button label="查看相册" onTap={() => { \'background only\'; preview.previewImage({ images: ["https://example.com/a.jpg", "https://example.com/b.jpg"], startPosition: 1 }); }} /><ImagePreview {...preview.props} /></>;',
    ),
  ),
  "video-preview": g(
    "视频预览用于展示可播放的视频内容，支持独立预览实例、全屏选项和打开、关闭、错误事件；当前提供浏览器后端。",
    "VideoPreview",
    e(
      "基础用法",
      "预览视频",
      'const preview = useVideoPreview(); return <><Button label="播放视频" onTap={() => { \'background only\'; preview.previewVideo({ url: "https://example.com/movie.mp4" }); }} /><VideoPreview {...preview.props} mediaMode="browser" /></>;',
    ),
    e(
      "组件样式",
      "全屏预览",
      'const preview = useVideoPreview(); return <><Button label="全屏播放" onTap={() => { \'background only\'; preview.previewVideo({ url: "https://example.com/movie.mp4", fullScreen: true }); }} /><VideoPreview {...preview.props} mediaMode="browser" /></>;',
    ),
  ),
  swiper: g(
    "轮播图用于在固定区域切换图片或自定义内容，支持自动播放、指示器和滑动控制。",
    "Swiper SwiperNav",
    e(
      "组件类型",
      "图片轮播",
      'return <Swiper list={["https://example.com/a.jpg", "https://example.com/b.jpg"]} height={192} />;',
    ),
    e(
      "交互用法",
      "关闭自动播放",
      'return <Swiper list={["https://example.com/a.jpg", "https://example.com/b.jpg"]} autoplay={false} onChange={event => { \'background only\'; console.log(event); }} />;',
    ),
    e(
      "内容形态",
      "自定义轮播项",
      'return <Swiper list={[{ value: "one", text: "内容一" }, { value: "two", text: "内容二" }]} renderItem={({ item }) => <text>{String(item)}</text>} />;',
    ),
  ),
  watermark: g(
    "水印用于在内容区域重复展示文字或图片标记，支持颜色、旋转和间距配置。",
    "Watermark",
    e(
      "基础用法",
      "文字水印",
      'return <view style={{ height: "200px" }}><text>内容区域</text><Watermark content="Daisu UI" /></view>;',
    ),
    e(
      "组件样式",
      "自定义文字",
      'return <view style={{ height: "200px" }}><Watermark content="内部资料" size={16} /></view>;',
    ),
  ),
  curtain: g(
    "幕帘用于展示活动图片或重要公告，支持关闭按钮、自定义位置和背景遮罩。",
    "Curtain",
    e(
      "基础用法",
      "展示活动",
      'const [show, setShow] = useState(false); return <><Button label="打开活动" onTap={() => { \'background only\'; setShow(true); }} /><Curtain value={show} onChange={setShow} src="https://example.com/banner.jpg" /></>;',
    ),
    e(
      "组件样式",
      "关闭按钮位置",
      'return <Curtain value={false} src="https://example.com/banner.jpg" closePosition="top-right" />;',
    ),
  ),
  sticky: g(
    "吸顶组件在滚动时将内容固定在容器顶部，适合分类标题、筛选栏和操作区。",
    "Sticky StickyBox",
    e(
      "基础用法",
      "吸顶内容",
      'return <StickyBox><Sticky><view style={{ height: "48px" }}><text>吸顶标题</text></view></Sticky><view style={{ height: "800px" }}><text>滚动内容</text></view></StickyBox>;',
    ),
    e(
      "组件样式",
      "顶部偏移",
      "return <Sticky offsetTop={44}><text>为导航栏预留位置</text></Sticky>;",
    ),
  ),
  steps: g(
    "步骤条用于展示任务流程和当前进度，支持方向、状态与自定义图标内容。",
    "Steps Step",
    e(
      "组件类型",
      "水平步骤条",
      'return <Steps active={1}><Step title="已下单" /><Step title="运输中" /><Step title="已完成" /></Steps>;',
    ),
    e(
      "布局能力",
      "垂直步骤条",
      'return <Steps active={1} vertical><Step title="提交申请" description="资料已提交" /><Step title="审核中" description="请耐心等待" /></Steps>;',
    ),
  ),
  skeleton: g(
    "骨架屏用于在数据加载期间展示页面结构占位，支持预设内容和自定义行。",
    "Skeleton",
    e("组件类型", "基础占位", "return <Skeleton />;"),
    e("组件样式", "动画与主题", 'return <Skeleton animation="gradient" />;'),
  ),
  img: g(
    "图片组件提供加载、失败、圆角和预览处理，支持不同填充方式与自定义占位内容。",
    "Img",
    e(
      "基础用法",
      "显示图片",
      'return <Img src="https://example.com/photo.jpg" width={120} height={120} />;',
    ),
    e(
      "组件样式",
      "圆形图片",
      'return <Img src="https://example.com/avatar.jpg" width={80} height={80} round />;',
    ),
    e(
      "内容形态",
      "加载失败处理",
      "return <Img src=\"https://example.com/photo.jpg\" width={120} height={120} onError={event => { 'background only'; console.log(event); }} />;",
    ),
  ),
  grid: g(
    "宫格用于展示一组并列入口，支持列数、边框、自定义内容和点击导航。",
    "Grid GridItem",
    e(
      "基础用法",
      "图标入口",
      'return <Grid column={3}><GridItem icon="home" text="首页" /><GridItem icon="image" text="相册" /><GridItem icon="user" text="我的" /></Grid>;',
    ),
    e(
      "布局能力",
      "四列宫格",
      'return <Grid column={4} border><GridItem text="入口一" /><GridItem text="入口二" /><GridItem text="入口三" /><GridItem text="入口四" /></Grid>;',
    ),
  ),
  "sort-button": g(
    "排序按钮循环切换默认、升序和降序状态，适合列表与表格的排序入口。",
    "SortButton",
    e(
      "基础用法",
      "受控排序",
      "const [value, setValue] = useState<SortButtonValue>(0); return <SortButton title=\"价格\" value={value} onChange={event => { 'background only'; setValue(event.value); }} />;",
    ),
    e("组件样式", "默认降序", 'return <SortButton title="销量" descFirst />;'),
  ),
  collapse: g(
    "折叠面板用于展开或收起分组内容，支持多项展开、手风琴和异步展开校验。",
    "Collapse CollapseViewMore",
    e(
      "基础用法",
      "多项展开",
      'return <Collapse items={[{ name: "one", title: "标题一", content: <text>内容一</text> }, { name: "two", title: "标题二", content: <text>内容二</text> }]} />;',
    ),
    e(
      "交互模式",
      "手风琴",
      'return <Collapse accordion defaultValue={["one"]} items={[{ name: "one", title: "标题一", content: <text>内容一</text> }, { name: "two", title: "标题二", content: <text>内容二</text> }]} />;',
    ),
    e(
      "组件状态",
      "禁用选项",
      'return <Collapse items={[{ name: "one", title: "禁用面板", disabled: true, content: <text>内容</text> }]} />;',
    ),
    e(
      "内容形态",
      "查看更多",
      'return <CollapseViewMore text="这是一段较长的说明文字，可以在折叠状态下展示摘要，并通过查看更多展开全部内容。" lineCount={2} />;',
    ),
  ),
  avatar: g(
    "头像用于展示用户或对象的图片、文字和图标，头像组可组合多个头像并折叠超出部分。",
    "Avatar AvatarGroup",
    e(
      "组件类型",
      "图片、文字和图标",
      'return <><Avatar src="https://example.com/avatar.jpg" alt="用户头像" /><Avatar text="张" /><Avatar icon="user" /></>;',
    ),
    e(
      "组件样式",
      "尺寸与形状",
      'return <><Avatar text="A" size="large" /><Avatar text="B" shape="square" bgColor="#1c64fd" /></>;',
    ),
    e(
      "组合用法",
      "头像组",
      'return <AvatarGroup items={[{ key: "a", text: "A" }, { key: "b", text: "B" }, { key: "c", text: "C" }]} maxCount={2} />;',
    ),
  ),
  badge: g(
    "徽标用于标记数量、未读或状态，可附着在图标和其他内容旁边。",
    "Badge",
    e(
      "组件类型",
      "数字与圆点",
      'return <><Badge value={5}><Icon name="notification" size={24} /></Badge><Badge isDot><Icon name="message" size={24} /></Badge></>;',
    ),
    e(
      "组件样式",
      "封顶与状态颜色",
      'return <Badge value={120} max={99} type="danger"><text>消息</text></Badge>;',
    ),
    e(
      "组件状态",
      "显示零值",
      "return <Badge value={0} showZero><text>待办</text></Badge>;",
    ),
  ),
  gap: g(
    "间隔槽用于在内容块之间保留指定高度，也可为底部安全区提供占位。",
    "Gap",
    e(
      "基础用法",
      "内容间隔",
      "return <><text>上方内容</text><Gap height={20} /><text>下方内容</text></>;",
    ),
    e("组件样式", "背景颜色", 'return <Gap height={12} bgColor="#f7f8fa" />;'),
  ),
  loadmore: g(
    "加载更多用于展示分页列表的加载中、全部加载和失败重试状态。",
    "Loadmore",
    e(
      "组件状态",
      "分页状态",
      'return <><Loadmore state="loading" /><Loadmore state="finished" /><Loadmore state="error" onReload={() => { \'background only\'; console.log("重试加载"); }} /></>;',
    ),
    e(
      "内容形态",
      "自定义文案",
      'return <Loadmore state="finished" finishedText="已经到底啦" />;',
    ),
  ),
  tag: g(
    "标签用于展示分类和状态，支持语义颜色、外观、图标、关闭和动态输入。",
    "Tag",
    e(
      "组件类型",
      "语义标签",
      'return <><Tag type="primary" label="主要标签" /><Tag type="success" label="已完成" /><Tag type="danger" label="待处理" /></>;',
    ),
    e(
      "组件样式",
      "圆角与镂空",
      'return <><Tag type="primary" round label="圆角标签" /><Tag type="primary" plain label="镂空标签" /></>;',
    ),
    e(
      "交互用法",
      "关闭标签",
      "const [show, setShow] = useState(true); return show ? <Tag closable label=\"可关闭\" onClose={() => { 'background only'; setShow(false); }} /> : null;",
    ),
  ),
};
