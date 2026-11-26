# 平台兼容性总表

本表对应 @daisu-ui/ui@0.1.0-beta.5，由公开 API 文档清单生成。新增组件自动进入表格，特殊能力在 apps/docs/platforms.mjs 维护。可按名称、平台状态或宿主要求筛选。

## 如何理解状态

- “有浏览器示例”表示提供了实现和入口，不表示所有交互都已逐项自动化验收；浏览器回归的具体场景见 CI 报告。
- Android / iOS 默认标记“待目标设备验收”。类型检查、网页预览和插件依赖声明均不能代替真机验证，不将源码实现直接标为原生已支持。
- 当前组件 Bundle 编译目标为 Lynx 4.2，开发类型为 @lynx-js/types@4.2.1。lynx_view 的 Dart 插件版本不能单独证明实际内置引擎及 XElement 注册已匹配。
- 本轮未完成 Android / iOS 真机验收，所以没有填写虚构的设备型号、系统版本或测试日期。

## 组件与公开 API

| 组件 / 公开导出 | Web | Android | iOS | 宿主与资源要求 |
| --- | --- | --- | --- | --- |
| [Button 按钮](./button.md) · Button | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Icon 图标](./icon.md) · Icon | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Text 文本](./text.md) · Text | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Layout 布局](./layout.md) · Row、Col | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Card 卡片](./card.md) · Card | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Cell 单元格](./cell.md) · Cell、CellGroup | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Divider 分割线](./divider.md) · Divider | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Fab 悬浮按钮](./fab.md) · Fab | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Transition 动画](./transition.md) · Transition | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Resize 监听元素尺寸变化](./resize.md) · Resize | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [ConfigProvider 全局配置](./config-provider.md) · ConfigProvider | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Root Portal 根节点传送门](./root-portal.md) · RootPortal、RootPortalHost | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Router 路由](./router.md) · RouterView、RouterProvider、RouteScreen、useRouter、useRoute、useRouterSnapshot、useRouteMatch、createRouter、connectRouterHistory、parseRoutePath、routePath、parseRouterHistoryState、shouldFinishBack | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Navbar 导航栏](./navbar.md) · Navbar、NavbarCapsule | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Tabbar 标签栏](./tabbar.md) · Tabbar | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Tab 标签页](./tabs.md) · Tabs | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Segmented 分段器](./segmented.md) · Segmented | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Sidebar 侧边栏](./sidebar.md) · Sidebar | 有浏览器示例 | 导航与列表联动待设备验收 | 导航与列表联动待设备验收 | 锚点列表与页面切换分别验证 |
| [IndexBar 索引栏](./index-bar.md) · IndexBar、IndexAnchor | 有浏览器示例 | 列表/索引手势待设备验收 | 列表/索引手势待设备验收 | 固定行高、列表定位和拖动手势 |
| [Pagination 分页](./pagination.md) · Pagination | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Backtop 回到顶部](./backtop.md) · Backtop | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Tour 漫游](./tour.md) · Tour | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Form 表单](./form-detail.md) · Form、FormItem、zodAdapter | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Rate 评分](./rate.md) · Rate | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Switch 开关](./switch.md) · Switch | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Input 输入框](./input.md) · Input | 有浏览器示例 | 需原生 input 注册，待设备验收 | 需原生 input 注册，待设备验收 | 输入法、合成事件、聚焦、键盘避让 |
| [Textarea 文本域](./textarea.md) · Textarea | 有浏览器示例 | 需原生 textarea 注册，待设备验收 | 需原生 textarea 注册，待设备验收 | 多行高度、字数、输入法与键盘避让 |
| [InputNumber 计数器](./input-number.md) · InputNumber | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Search 搜索框](./search.md) · Search | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Checkbox 复选框](./checkbox.md) · Checkbox、CheckboxGroup | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Radio 单选](./radio.md) · Radio、RadioGroup | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Slider 滑块](./slider.md) · Slider | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Keyboard 虚拟键盘](./keyboard.md) · Keyboard | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [PasswordInput 密码输入框](./password-input.md) · PasswordInput | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Picker 选择器](./picker.md) · Picker | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [PickerView 选择器视图](./picker-view.md) · PickerView | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [SelectPicker 单复选选择器](./select-picker.md) · SelectPicker | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Cascader 级联选择](./cascader.md) · Cascader | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [DatetimePickerView 日期时间选择器视图](./datetime-picker-view.md) · DatetimePickerView | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [DatetimePicker 日期时间选择器](./datetime-picker.md) · DatetimePicker | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Calendar 日历选择器](./calendar.md) · Calendar | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [CalendarView 日历面板](./calendar-view.md) · CalendarView | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Upload 上传](./upload.md) · Upload | 需调用方 UploadAdapter | 需宿主 UploadAdapter，待设备验收 | 需宿主 UploadAdapter，待设备验收 | 选图、授权、上传、失败/取消均由宿主提供 |
| [ImgCropper 图片裁剪](./img-cropper.md) · ImgCropper | 需 browser 后端 | 裁剪/位图导出后端未接入 | 裁剪/位图导出后端未接入 | 文件选择、图片解码、CORS、Blob URL 生命周期 |
| [Signature 签名](./signature.md) · Signature | 有浏览器示例；PNG 编码 | 笔迹/触摸待设备验收 | 笔迹/触摸待设备验收 | 独立 PNG 编码；不提供通用 Canvas 解码能力 |
| [SlideVerify 滑动验证](./slide-verify.md) · SlideVerify | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [NoticeBar 通知栏](./notice-bar.md) · NoticeBar | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [SwipeAction 滑动操作](./swipe-action.md) · SwipeAction | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [FloatingPanel 浮动面板](./floating-panel.md) · FloatingPanel | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Popover 气泡](./popover.md) · Popover | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Toast 轻提示](./toast.md) · Toast | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Tooltip 文字提示](./tooltip.md) · Tooltip | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [DropMenu 下拉菜单](./drop-menu.md) · DropMenu、DropMenuItem | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Dialog 对话框](./dialog.md) · Dialog | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [ActionSheet 动作面板](./action-sheet.md) · ActionSheet | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Popup 弹出层](./popup.md) · Popup | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Overlay 遮罩层](./overlay.md) · Overlay | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [CountTo 数字滚动](./count-to.md) · CountTo | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [CountDown 倒计时](./count-down.md) · CountDown | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Notify 消息通知](./notify.md) · Notify | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Circle 环形进度条](./circle.md) · Circle | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Progress 进度条](./progress.md) · Progress | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Loading 加载指示器](./loading.md) · Loading | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Empty 缺省提示](./empty.md) · Empty | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [RichText 富文本](./rich-text.md) · RichText | 图文可预览；音视频需 browser 后端 | 图文待验收；音视频后端未接入 | 图文待验收；音视频后端未接入 | 注册媒体元素、CORS、自动播放策略 |
| [QRCode 二维码](./qr-code.md) · QrCode | SVG；PNG 需 browser 后端 | SVG 待验收；PNG 合成后端未接入 | SVG 待验收；PNG 合成后端未接入 | 外链 Logo/背景内嵌；跨域图像许可 |
| [BarCode 条形码](./bar-code.md) · BarCode | SVG 展示与导出 | SVG 待设备验收 | SVG 待设备验收 | 导出 SVG data URL，不是 PNG 临时文件 |
| [Table 表格](./table.md) · Table | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [ImagePreview 图片预览](./image-preview.md) · ImagePreview | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [VideoPreview 视频预览](./video-preview.md) · VideoPreview | 需 browser 后端 | 视频后端未接入 | 视频后端未接入 | HTML5 媒体；原生播放器生命周期协议 |
| [Swiper 轮播图](./swiper.md) · Swiper、SwiperNav | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Watermark 水印](./watermark.md) · Watermark | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Curtain 幕帘](./curtain.md) · Curtain | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Sticky 粘性布局](./sticky.md) · Sticky、StickyBox | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Steps 步骤条](./steps.md) · Steps、Step | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Skeleton 骨架屏](./skeleton.md) · Skeleton | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Img 图片](./img.md) · Img | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Grid 宫格](./grid.md) · Grid、GridItem | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [SortButton 排序按钮](./sort-button.md) · SortButton | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Collapse 折叠面板](./collapse.md) · Collapse、CollapseViewMore | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Avatar 头像](./avatar.md) · Avatar、AvatarGroup | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Badge 徽标](./badge.md) · Badge | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Gap 间隔槽](./gap.md) · Gap | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [loadmore 加载更多](./loadmore.md) · Loadmore | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [Tag 标签](./tag.md) · Tag | 有浏览器示例 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [表单行封装](./form-rows.md) · FormFieldRow、FormInputRow、FormNumberRow、FormRadioRow、FormSelectRow、FormTextareaRow | 组合示例与类型检查 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [同步输入封装](./synced-input.md) · SyncedInput、SyncedTextarea | 组合示例与类型检查 | 需原生输入及 setValue，待设备验收 | 需原生输入及 setValue，待设备验收 | 外部回填与宿主键盘策略 |
| [PagedList 分页列表](./paged-list.md) · PagedList | FeedList 组合示例 | 官方 FeedList 后端，待设备验收 | 官方 FeedList 后端，待设备验收 | 原生刷新、唯一 listId、固定高度；性能须真机验证 |
| [轻量控件](./compact-controls.md) · EmptyState、NumberStepper | 组合示例与类型检查 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [工具与按压反馈](./utilities.md) · usePressState、calendarValues、calendarWeekNumber、datetimeLabel、datetimePad、swiperIndex | 组合示例与类型检查 | 源码实现，待目标设备验收 | 源码实现，待目标设备验收 | Lynx 4.2+；实际宿主元素及渲染后端需匹配 |
| [浏览器能力注册](./web-registration.md) · registerDaisuWebComponents、registerRichTextMedia、registerImgCropper、registerQrCodeExport | 仅浏览器宿主入口 | 不适用；不注册原生元素 | 不适用；不注册原生元素 | 挂载 lynx-view 前注册，不能放入原生 Bundle |

## 真机验收记录

消费项目应记录 UI 精确版本、Bundle 哈希、Lynx 原生引擎版本、lynx_view 与平台插件锁定版本、设备/系统、场景、结果、日期及报告链接。按设备和场景分别记录；已通过的 Android 测试不能自动推广为 iOS 通过。

建议至少验证：中文输入与回填、系统键盘避让、RootPortal 弹层与返回键、侧滑及列表手势冲突、长列表与刷新、媒体关闭释放、图片权限与跨域导出、深色模式和大字体。

## 接入与排查

- [浏览器完整接入](./web-quickstart.md)
- [Flutter 接入](./flutter-quickstart.md)
- [平台适配](./platforms.md)
- [浏览器能力注册](./web-registration.md)
