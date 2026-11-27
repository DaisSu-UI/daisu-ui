export default {
  icon: {
    内置图标: "通过 `name` 指定内置图标名称。",
    颜色与尺寸: "通过 `color` 设置图标颜色，`size` 设置图标尺寸，单位为 px。",
    点击图标:
      "通过 `onTap` 响应点击，为可操作图标设置 `accessibilityLabel` 说明用途。",
  },
  text: {
    普通文本与语义颜色:
      "通过 `text` 设置文字，使用 `type` 区分普通、成功和错误等语义状态。",
    格式化与脱敏:
      "设置 `mode` 选择格式化方式，配合 `format` 对手机号等信息脱敏。",
    字号与行数:
      "通过 `size` 和 `lineHeight` 设置字号与行高，`lines` 限制显示行数，`bold` 设置粗体。",
  },
  layout: {
    基础分栏: "栅格将一行分为 24 份，通过 `Col.span` 设置每列占用的份数。",
    间隔与偏移:
      "通过 `Row.gutter` 设置列间距，通过 `Col.offset` 设置左侧偏移份数。",
    水平与垂直对齐:
      "通过 `justify` 设置水平排列方式，通过 `align` 设置垂直对齐方式。",
  },
  card: {
    标准卡片: '设置 `variant="standard"` 使用标准卡片，通过 `title` 设置标题。',
    矩形卡片: '设置 `type="rectangle"` 使用矩形卡片，适合连续排列的内容区域。',
    自定义标题与操作:
      "通过 `title` 自定义标题节点，通过 `footer` 设置底部操作，子节点作为正文内容。",
  },
  cell: {
    基础单元格:
      "通过 `title`、`value` 和 `description` 展示信息，配合 `CellGroup` 组织一组单元格。",
    链接入口:
      "设置 `arrow` 展示箭头，`clickable` 展示点击状态，通过 `onTap` 处理点击。",
    组合输入框:
      "子节点中可放置输入框，使用 `titleWidth` 设置标题宽度，`center` 让内容垂直居中。",
  },
  divider: {
    基础分割线:
      "默认展示 0.5px 水平细线，设置 `dashed` 使用虚线，子节点用于展示分隔文字；文字或图标与两侧线条各保留 16px 间距。设置 `hairline={false}` 使用 1px 线条。",
    颜色与位置:
      "通过 `color` 设置颜色，通过 `contentPosition` 设置内容的位置。",
    垂直分割线: "设置 `vertical` 使用垂直分割线，适合横向排列的操作项。",
  },
  fab: {
    基础用法: "通过 `onTap` 响应悬浮按钮点击。",
    展开操作: "设置 `expandable` 支持展开操作项，子节点作为展开后的内容。菜单在触发器和操作内容均完成测量后显示，按明确的宽高和坐标定位；内容尺寸变化时重新定位，自定义触发器与四种展开方向均保持对齐。",
    禁用与拖动: "设置 `disabled` 禁用按钮，设置 `draggable` 允许拖动位置。",
  },
  transition: {
    淡入淡出: '通过 `show` 控制显示状态，设置 `name="fade"` 使用淡入淡出。',
    组合动画:
      "`name` 支持动画名称数组，可组合淡入与缩放；通过 `duration` 设置时长。",
    动画结束回调: "通过 `onAfterEnter` 处理进入动画结束后的操作。",
  },
  resize: {
    监听布局变化: "通过 `onResize` 获取内容布局变化后的宽高信息。",
    包裹动态内容:
      "将动态内容放入 `Resize`，内容尺寸变化后通过 `onResize` 获取新的矩形信息。",
  },
  "config-provider": {
    明暗切换:
      "通过 `theme` 在 `light` 与 `dark` 之间切换，内部组件跟随当前主题。",
    颜色与组件默认值:
      "通过 `themeVars` 覆盖主题变量，通过 `button` 设置按钮默认属性；`locale` 支持 zh-CN、en-US、zh-TW 或自定义语言包，嵌套配置与 Portal 继承当前语言。",
  },
  "root-portal": {
    配置挂载宿主:
      "在页面根部放置 `RootPortalHost`，使用 `RootPortal` 将浮层挂载到该宿主。",
    与主题配合:
      "将 `RootPortalHost` 放在 `ConfigProvider` 内，使根节点浮层获得相同主题配置。",
  },
  router: {
    创建页面路由:
      "通过 `createRouter` 创建路由实例，使用 `RouterView.router` 绑定路由，`renderRoute` 定义页面内容。",
  },
  navbar: {
    标准导航栏:
      '设置 `variant="standard"` 使用标准样式，通过 `title` 设置标题，`leftArrow` 显示返回箭头。',
    右侧操作: "通过 `rightText` 设置右侧文字，通过 `onRightTap` 响应点击。",
    固定导航栏:
      "设置 `fixed` 固定在顶部，配合 `placeholder` 为页面内容保留高度。",
  },
  tabbar: {
    基础标签栏:
      "通过 `items` 配置标签项，`value` 指定当前项，`onChange` 返回新的选中值。",
    固定底部:
      "设置 `fixed` 固定在底部，配合 `placeholder` 和 `safeAreaInsetBottom` 预留内容与安全区空间。",
  },
  tabs: {
    标准标签页:
      '设置 `variant="standard"`，通过 `items` 的 `title`、`name` 和 `children` 配置标签与内容。',
    受控切换:
      "通过 `value` 和 `onChange` 管理当前标签，选项设置 `disabled` 后不可选择。",
    自定义颜色: "通过 `color` 设置选中颜色，通过 `lineWidth` 设置指示线宽度。",
  },
  segmented: {
    基础用法: "通过 `options` 设置选项列表，通过 `value` 和 `onChange` 管理当前选中项。非受控使用时可通过 `defaultValue` 设置初始选中项。",
  },
  sidebar: {
    基础分类:
      "通过 `items` 配置分类，`value` 指定当前分类，`onChange` 返回选中的值与文案。",
    切换前确认:
      "通过 `beforeChange` 在切换前执行校验，返回 `true` 允许切换，返回 `false` 阻止切换。",
  },
  "index-bar": {
    字母分组列表:
      "通过 `sections` 配置索引和分组数据，`listId` 标识列表，`renderItem` 定义每行内容。",
    自定义行高:
      "通过 `itemHeight` 设置列表行高，通过 `anchorHeight` 设置分组标题高度。",
  },
  pagination: {
    受控分页:
      "通过 `value` 和 `onChange` 管理页码，`total` 设置总条数，`pageSize` 设置每页条数。",
    自定义翻页文案:
      "通过 `prevText` 和 `nextText` 设置翻页文案，`showMessage` 控制页码信息的显示。",
    单页时隐藏: "设置 `hideIfOnePage`，只有一页数据时隐藏分页器。",
  },
  backtop: {
    与滚动容器组合:
      "将滚动距离传入 `scrollTop`，通过 `onBacktop` 处理回到顶部的滚动请求。",
    方形与文案: '设置 `shape="square"` 使用方形按钮，通过 `text` 设置文字。',
  },
  tour: {
    开始引导:
      "通过 `show` 控制引导显示，`steps` 中的 `element` 指定目标元素，`content` 指定提示内容。",
    高亮区域与按钮文案:
      "通过 `padding` 和 `borderRadius` 调整高亮区域，通过 `finishText` 设置完成按钮文案。",
  },
  "form-detail": {
    受控表单:
      "通过 `model` 绑定表单数据，`FormItem.prop` 对应字段路径，输入控件通过 `onChange` 更新数据。标题统一预留必填标记列，有无星号保持文字对齐。",
    提交时校验:
      "通过 `schema` 配置校验，在提交时调用 `ref.validate()`，检查结果中的 `valid` 后再处理数据。",
    整体禁用: "设置 `Form.disabled`，表单中的关联控件统一进入禁用状态。",
  },
  rate: {
    受控评分:
      "通过 `value` 和 `onChange` 管理评分，事件中的 `value` 为选中的分值。",
    只读与禁用: "设置 `readonly` 展示只读评分，设置 `disabled` 展示禁用状态。",
    数量与尺寸:
      "通过 `num` 设置评分图标数量，`size` 设置尺寸，`color` 设置未选中图标颜色。",
  },
  switch: {
    受控开关:
      "通过 `value` 和 `onChange` 控制开关，事件中的 `value` 为切换后的值。",
    加载与禁用: "设置 `loading` 展示加载状态，设置 `disabled` 禁止切换。",
    异步校验:
      "通过 `beforeChange` 在切换前执行异步校验，返回 `true` 后才更新状态。",
  },
  textarea: {
    多行输入:
      "通过 `value` 和 `onChange` 管理多行文本，`placeholder` 设置占位提示。",
    禁用与只读: "设置 `readonly` 使内容只读，设置 `disabled` 禁用文本域。",
    自适应高度与字数:
      "设置 `autoHeight` 让高度随内容变化，通过 `minHeight` 和 `maxHeight` 限定范围；配合 `maxlength` 与 `showWordLimit` 显示字数。",
  },
  "input-number": {
    基础计数器:
      "通过 `value` 和 `onChange` 管理数值，使用 `min` 和 `max` 限定范围。",
    步长与精度:
      "通过 `step` 设置每次增减的数值，通过 `precision` 设置小数位数。",
    禁用与禁止输入:
      "设置 `disabled` 禁用整个计数器，设置 `disableInput` 仅禁止手动输入。",
  },
  search: {
    受控搜索:
      "通过 `value` 和 `onChange` 管理关键词，事件中的 `value` 为当前输入内容。",
    禁用搜索: "设置 `disabled` 禁止编辑搜索内容。",
    输入提示: "通过 `placeholder` 设置搜索框的占位提示。",
  },
  checkbox: {
    独立复选框:
      "通过 `value` 表示选中状态，`onChange` 返回变化后的值，子节点用于显示选项文案。",
    复选框组:
      "在 `CheckboxGroup` 中组合多个选项，`defaultValue` 设置默认选中的值列表。",
    禁用与按钮样式:
      '设置 `disabled` 禁用选项，设置分组的 `type="button"` 使用按钮外观。',
  },
  radio: {
    单选框组:
      "通过 `RadioGroup.value` 与 `onChange` 管理当前选项，每个 `Radio.value` 指定选项值。",
    禁用选项: "在选项上设置 `disabled`，该选项不能被选中。",
    按钮单选框: '设置 `RadioGroup.type="button"` 使用按钮外观。',
  },
  slider: {
    基础滑块:
      "通过 `value` 和 `onChange` 管理滑块值，`min` 和 `max` 指定可选范围。",
    步长与刻度:
      "通过 `step` 设置步长，`marks` 设置刻度，`showValue` 显示当前值。",
    禁用: "设置 `disabled` 禁止拖动滑块。",
  },
  keyboard: {
    数字键盘:
      "通过 `visible` 和 `onVisibleChange` 控制键盘显示，通过 `value` 和 `onChange` 管理输入内容。",
    确认按钮: "通过 `title` 设置键盘顶部提示，使用 `visible` 控制显示状态。",
  },
  "password-input": {
    密码格: "通过 `value` 设置已输入内容，字符按格显示。",
    配合虚拟键盘:
      "通过 `onFocus` 打开虚拟键盘，键盘的 `value` 和 `onChange` 与密码格共享输入内容。",
  },
  picker: {
    打开选择器:
      "通过 `columns` 配置选项，`visible` 控制显示，`onConfirm` 返回确认后的选择。",
    自定义标题:
      "通过 `title` 设置标题，通过 `confirmButtonText` 设置确认按钮文案。",
  },
  "picker-view": {
    单列选择: "通过 `columns` 配置选项，通过 `onChange` 获取滚轮选择结果。",
    滚轮高度: "通过 `visibleItemCount` 设置可见选项的行数。",
  },
  "select-picker": {
    单选列表:
      '设置 `type="radio"` 使用单选模式，`columns` 配置选项，`visible` 控制面板显示。',
    多选列表: '设置 `type="checkbox"` 使用多选模式。',
  },
  cascader: {
    层级选择:
      "通过 `options` 配置层级数据，子级放在 `children` 中，`visible` 控制面板显示。",
    自定义标题: "通过 `title` 设置级联面板标题。",
  },
  "datetime-picker-view": {
    日期时间:
      '设置 `type="datetime"` 选择日期与时间，通过 `value` 设置当前值，`onChange` 获取选择结果。',
    日期选择: '设置 `type="date"` 仅选择日期。',
  },
  "datetime-picker": {
    选择日期时间:
      '设置 `type="datetime"`，通过 `visible` 控制弹层，`onConfirm` 获取确认后的时间值。',
    选择日期: '设置 `type="date"` 仅展示日期选项。',
  },
  "calendar-view": {
    单日选择:
      '设置 `type="date"` 使用单日模式，`value` 指定日期，`onChange` 获取选择结果。日期只挂载附近行，细小滚动不重复生成日期；Demo 面板接近视口后分批加载；原生观察回调缺失时在延迟后逐个补齐，避免只有首个面板显示。',
    日期范围: '设置 `type="daterange"` 选择开始日期和结束日期。',
  },
  calendar: {
    弹层日历:
      '通过 `visible` 控制日历弹层，`type="date"` 使用单日模式，`onConfirm` 返回选择的日期。自定义“选择今天”按钮可调用 `CalendarRef.setValue(value)` 更新草稿并定位，点击确定后再提交。',
    日期范围:
      '设置 `type="daterange"` 选择日期范围，通过 `title` 设置面板标题。',
  },
  upload: {
    展示文件:
      "通过 `fileList` 展示文件，每项的 `url` 为文件地址，`status` 表示上传状态。",
    禁用与数量限制:
      "设置 `disabled` 禁止操作，通过 `limit` 限制文件数量；实际文件选择和上传通过 `adapter` 接入。",
  },
  "img-cropper": {
    打开裁剪器:
      '设置 `mode="browser"` 使用浏览器裁剪能力，通过 `show` 控制显示，`imgSrc` 指定图片，`onConfirm` 返回裁剪结果。',
    裁剪尺寸: "通过 `imgWidth` 和 `imgHeight` 指定图片初始显示尺寸；裁剪框比例由 `aspectRatio` 控制。",
  },
  signature: {
    手写签名: "通过 `onConfirm` 接收确认后的签名结果。",
    画笔颜色: "通过 `penColor` 设置画笔颜色。",
  },
  "slide-verify": {
    滑动确认: "滑块到达确认位置后触发 `onSuccess`。",
    禁用与自定义文案:
      "设置 `disabled` 禁止拖动，通过 `text` 和 `successText` 设置验证前后的文案。",
  },
  "notice-bar": {
    基础通知: "通过 `text` 设置通知内容。",
    自定义内容颜色: "通过 `color` 设置通知文字颜色。",
  },
  "swipe-action": {
    右侧操作: "通过 `right` 设置向左滑动后展示的操作区，子节点作为列表内容。",
    禁用滑动: "设置 `disabled` 禁止展开滑动操作区。",
  },
  "floating-panel": {
    多档高度: "通过 `anchors` 设置可停留的高度，`defaultHeight` 指定初始高度。",
    监听高度变化: "通过 `onHeightChange` 获取面板变化后的高度。",
  },
  popover: {
    文字气泡: "通过 `content` 设置气泡文字，子节点作为触发元素。",
    指定方向: "通过 `placement` 设置气泡相对触发元素的位置。",
    自定义内容: "通过 `contentNode` 传入自定义内容节点。",
  },
  toast: {
    绑定提示实例:
      "调用 `useToast()`，将返回的 `props` 绑定到 `Toast`，通过 `show()` 显示文字提示。",
    成功与加载:
      "通过 `success()` 显示成功提示，通过 `loading()` 显示持续加载，通过 `close()` 手动关闭。",
  },
  tooltip: {
    点击查看说明: "通过 `content` 设置说明文字，子节点作为提示的触发元素。",
    方向与关闭按钮:
      "通过 `placement` 指定提示方向，设置 `showClose` 显示关闭按钮。",
  },
  "drop-menu": {
    单项筛选:
      "在 `DropMenu` 中放置 `DropMenuItem`，通过 `options` 配置选项，`value` 和 `onChange` 管理选中值。",
    自定义筛选内容: "通过 `title` 设置菜单标题，子节点中放置自定义筛选内容。",
  },
  dialog: {
    消息提醒:
      "将 `useDialog()` 返回的 `props` 绑定到 `Dialog`，调用 `alert()` 显示提醒，通过 `title` 和 `msg` 设置内容。",
    确认操作:
      "调用 `confirm()` 显示确认对话框，用户确认时 Promise 完成，取消时进入拒绝分支。",
    按钮主题: '设置 `theme="button"` 使用按钮样式的操作区。',
  },
  "action-sheet": {
    操作列表:
      "通过 `actions` 设置操作项，`show` 控制面板显示，`onSelect` 获取选中的操作。",
    面板标题: "通过 `title` 设置标题，通过 `cancelText` 设置取消按钮文案。",
  },
  popup: {
    基础弹层:
      "通过 `show` 和 `onChange` 控制显示状态；`title` 显示左对齐标题，`closable` 显示右上角 40px 圆形关闭按钮，标题会为按钮预留空间。同一 RootPortalHost 内按打开顺序分配弹层层级，zIndex 是最低层级；嵌套层自动高于父层，遮罩位于父面板与子面板之间。",
    底部弹出:
      '设置 `position="bottom"` 从底部弹出，配合 `round` 和 `safeAreaInsetBottom` 使用圆角及底部安全区。',
  },
  overlay: {
    点击关闭遮罩:
      "通过 `show` 控制遮罩显示，在 `onTap` 中更新显示状态即可关闭。",
    自定义内容: "将需要展示的前景内容放在遮罩子节点中。",
  },
  "count-to": {
    数字动画: "通过 `startVal` 和 `endVal` 设置数字动画的开始值与结束值。",
    金额格式: "通过 `decimals` 设置小数位数，通过 `prefix` 设置金额前缀。",
  },
  "count-down": {
    显示剩余时间: "通过 `time` 设置倒计时时长，单位为 ms。",
    自定义格式: "通过 `format` 指定显示格式，例如 `mm:ss` 展示分钟和秒。",
  },
  notify: {
    绑定通知实例:
      "将 `useNotify()` 返回的 `props` 绑定到 `Notify`，通过 `showNotify()` 显示通知。退出动画结束后移除原生浮层；Demo 的普通文案与自定义内容复用同一实例。",
    成功通知:
      '调用 `showNotify()` 时设置 `type="success"`，通过 `message` 指定通知文案。',
  },
  circle: {
    显示进度: "通过 `value` 设置当前完成比例。",
    自定义颜色与内容:
      "通过 `color` 设置进度颜色，子节点用于自定义环形中央的内容。",
  },
  progress: {
    显示进度: "通过 `percentage` 设置完成百分比。",
    自定义颜色: "通过 `color` 设置进度条颜色。",
  },
  loading: {
    加载动画:
      "通过 `type` 设置动画，支持 `circular`、`spinner`、`dots` 和 `wave`。",
    颜色与尺寸: "通过 `color` 设置颜色，通过 `size` 设置尺寸。",
    加载文案:
      '通过 `text` 设置加载文案，设置 `direction="horizontal"` 使用横向排列。',
  },
  empty: {
    缺省状态: "通过 `icon` 设置缺省图标，通过 `tip` 设置提示文案。",
    自定义图片和操作:
      "通过 `image` 自定义图片内容，通过 `bottom` 设置底部操作。",
    图标尺寸: "通过 `iconSize` 设置缺省图标尺寸。",
  },
  "rich-text": {
    "展示 HTML":
      "通过 `content` 传入 HTML 字符串，组件展示其中的段落、标题等内容。",
    表格与列表: "`content` 支持表格和列表标签，可在同一段富文本中组合展示。",
    链接点击: "通过 `onLinkClick` 响应链接点击，事件中的 `href` 为链接地址。",
  },
  "qr-code": {
    文本与链接: "通过 `text` 设置二维码内容，可以传入普通文字或链接。",
    颜色与尺寸:
      "通过 `size` 设置二维码尺寸，通过 `colorDark` 设置深色模块颜色。",
  },
  "bar-code": {
    生成条形码: "通过 `value` 设置要编码的内容。",
    尺寸与颜色: "通过 `height` 设置条码高度，通过 `lineColor` 设置条纹颜色。",
  },
  table: {
    基础表格:
      "通过 `data` 设置行数据，通过 `columns` 的 `prop` 和 `label` 配置列字段与表头。",
    边框与表头:
      "设置 `border` 和 `stripe` 展示边框与斑马纹，`height` 限定可见高度，列设置 `fixed` 固定在左侧。",
    监听排序:
      "在列上设置 `sortable`，通过 `onSortMethod` 获取排序字段与方向，再由调用方更新数据顺序。",
  },
  "image-preview": {
    打开预览:
      "将 `useImagePreview()` 返回的 `props` 绑定到 `ImagePreview`，调用 `previewImage()` 并传入 `images` 打开预览。",
    多张图片:
      "通过 `images` 设置图片组，通过 `startPosition` 指定初始显示的图片索引。",
  },
  "video-preview": {
    预览视频:
      "将 `useVideoPreview()` 返回的 `props` 绑定到 `VideoPreview`，在浏览器模式下通过 `previewVideo()` 传入视频 `url`。",
    全屏预览: "调用 `previewVideo()` 时设置 `fullScreen` 使用全屏预览。",
  },
  swiper: {
    图片轮播: "通过 `list` 设置图片地址列表，通过 `height` 设置轮播区域高度。卡片与双滑块保持分页项和图片尺寸固定，只在主线程改变独立裁剪窗口的可见高度，恢复原有大小变化曲线并避免图片被纵向压缩；首帧、自动轮播和手动滑动共用计算。",
    关闭自动播放:
      "设置 `autoplay={false}` 关闭自动播放，通过 `onChange` 获取切换结果。",
    自定义轮播项: "通过 `renderItem` 自定义每一项的内容。",
  },
  watermark: {
    文字水印: "通过 `content` 设置水印文字，将水印层和页面内容放在同一容器中。",
    自定义文字: "通过 `size` 设置水印字号。",
  },
  curtain: {
    展示活动:
      "通过 `value` 和 `onChange` 控制幕帘显示，通过 `src` 指定活动图片。",
    关闭按钮位置:
      "通过 `closePosition` 设置关闭按钮位置，例如 `top-right` 表示右上方。",
  },
  sticky: {
    吸顶内容: "使用 `StickyBox` 包裹内容区域，`Sticky` 中放置需要吸顶的内容。容器默认占满父级宽度；空内容可随后动态插入，滚回后恢复自然布局。将所属滚动容器的 `scrollTop` 传入，可校正原生观察回调遗漏造成的位置残留。测量按帧合并，容器使用独立尺寸探针，吸顶时锁定内容宽度，避免后代布局和底部边界引起反复更新。",
    顶部偏移:
      "通过 `offsetTop` 设置吸顶时与顶部的距离，为导航栏等内容保留空间。",
  },
  steps: {
    水平步骤条: "在 `Steps` 中组合 `Step`，通过 `active` 指定当前步骤索引。",
    垂直步骤条:
      "设置 `vertical` 使用垂直排列，通过 `description` 设置步骤补充说明。",
  },
  skeleton: {
    基础占位: "在数据加载期间展示 `Skeleton`，为即将出现的内容提供结构占位。",
    动画与主题: '设置 `animation="gradient"` 使用渐变占位动画。',
  },
  img: {
    显示图片:
      "通过 `src` 指定图片地址，通过 `width` 和 `height` 设置显示尺寸。",
    圆形图片: "设置 `round` 展示圆形图片，配合相同的宽高使用。",
    加载失败处理: "通过 `onError` 接收图片加载失败事件。",
  },
  grid: {
    图标入口:
      "通过 `Grid.column` 设置每行列数，通过 `GridItem.icon` 和 `text` 设置每个入口。",
    四列宫格: "设置 `column={4}` 每行展示四项，设置 `border` 显示边框。",
  },
  "sort-button": {
    受控排序: "通过 `title` 设置文案，`value` 和 `onChange` 管理当前排序状态。",
    默认降序: "设置 `descFirst`，第一次切换时优先使用降序。",
  },
  collapse: {
    多项展开:
      "通过 `items` 配置面板，每项的 `name` 标识面板，`title` 设置标题，`content` 设置内容。面板分隔线为 0.5px，右侧使用 24px 箭头图标，展开时旋转。",
    手风琴:
      "设置 `accordion` 后每次只展开一项，`defaultValue` 指定默认展开项。",
    禁用选项: "在面板项上设置 `disabled`，该项不能展开。",
    查看更多: "通过 `text` 设置长文案，通过 `lineCount` 指定折叠时显示的行数。",
  },
  avatar: {
    "图片、文字和图标":
      "通过 `src`、`text` 或 `icon` 设置头像内容，`alt` 用于图片说明及失败替代文字。",
    尺寸与形状:
      "通过 `size` 设置头像尺寸，通过 `shape` 设置形状，`bgColor` 设置背景色。",
    头像组:
      "通过 `AvatarGroup.items` 配置头像组，`maxCount` 限制展示数量，超出部分折叠显示。",
  },
  badge: {
    数字与圆点:
      "通过 `value` 设置数字，设置 `isDot` 仅显示圆点；子节点为徽标依附的内容。",
    封顶与状态颜色: "通过 `max` 设置显示上限，通过 `type` 设置语义颜色。",
    显示零值: "设置 `showZero`，数值为 0 时仍显示徽标。",
  },
  gap: {
    内容间隔: "通过 `height` 设置内容块之间的间隔高度。",
    背景颜色: "通过 `bgColor` 设置间隔槽背景色。",
  },
  loadmore: {
    分页状态:
      "通过 `state` 在 `loading`、`finished` 和 `error` 之间切换，`onReload` 响应失败重试。",
    自定义文案: "通过 `finishedText` 设置全部加载完成后的文案。",
  },
  tag: {
    语义标签: "通过 `type` 设置标签的语义颜色，通过 `label` 设置文字。",
    圆角与镂空: "设置 `round` 使用圆角，设置 `plain` 使用镂空样式。",
    关闭标签:
      "设置 `closable` 显示关闭入口，通过 `onClose` 更新标签的显示状态。",
  },
};
