# AI 使用指南

本指南参考 Wot UI 的 AI 文档结构，提供面向本项目的 LLM 文档、MCP 与 Agent Skills 使用方式。

## 选择接入方式

| 场景 | 推荐能力 | 本项目入口 |
| --- | --- | --- |
| 让 AI 读取基础约束 | LLM 文档 | `AGENTS.md`、`docs/ui/llms.txt` |
| 让 AI 理解完整组件约束 | 完整文档 | `docs/ui/llms-full.txt`、`packages/daisu-ui/src/index.ts` |
| 查询权威 API | MCP / 官方资料 | 已配置的 MCP 工具、`https://lynxjs.org/next/llms.txt` |
| 让 Agent 按工程约束完成任务 | Skills | `.agents/skills` 中的 Lynx skills |

## LLM 文档

先将 `docs/ui/llms.txt` 作为简明入口，再按需读取 `docs/ui/llms-full.txt`。两份文件描述的是独立库的真实 API，不取代官方 Lynx 文档。

## MCP

MCP 适合按需检索组件 API、Lynx 运行时资料和项目资源。应使用客户端已经配置且可实际调用的 MCP Server。当前仓库没有独立发布的 UI MCP Server，因此不能假设存在 `cso-ui mcp` 之类的安装命令或工具。

## Agent Skills

- `lynx-ui`：选择和核对官方 Lynx UI 组件、主题与组合方式。
- `reactlynx-best-practices`：审查双线程、生命周期和背景线程调用。
- `lynx-api-docs`：查询原生元素、布局与样式 API。
- `lynx-check-css-support`：按 Android/iOS 运行时版本确认 CSS 支持度。

## 提交前检查

按 `docs/ui/IMPLEMENTATION_PLAN.md` 分批推进 Wot Demo 组件。每完成一个组件，同步 `docs/ui/components/<组件>.md` 的真实 API、Wot 参数映射、平台缺口及独立示例，再更新 `llms-full.txt`。每个组件验证后单独提交并推送 `origin/developer`，不得把未完成组件标为可用。

示例通过 `daisu-ui` 公开入口使用共享控件，不能内置 Token 或依赖主业务工程。业务网络与 Flutter 协议由消费项目注入，库仅声明通用能力接口。完成后运行 npm test、npm run test:types、npm run build、npm run ui:check；原生宿主能力需在消费项目的真机验证。

## Form示例生成

使用公共Form/FormItem与受控model，以FormSchema或zodAdapter校验，不把旧版Wot rules参数直接复制过来。动态表单每行使用稳定key、索引prop，reset仅清除校验；复杂表单复用已导出的公共选择器、Checkbox/Radio、Upload和SlideVerify。参考 `docs/ui/components/form.md` 与实际独立路由 `form-dynamic`、`form-complex`、`form-errors`、`form-trigger`、`form-disabled`。复选框文字内的彩色协议需使用足够明确的局部选择器，检查真实计算颜色和浅深主题，不只核对class名。

Keyboard 使用 `value/onChange` 和 `visible/onVisibleChange` 分别控制内容与显隐；车牌受控语言通过 `carLang/onCarLangChange` 更新。它是应用内虚拟键盘，不会打开系统输入法。参数及完整示例见 `components/keyboard.md`。

PasswordInput 仅展示值，使用 `value`，没有 `onChange`；请将Keyboard的 `value/onChange` 连接同一状态，并同步 `length/maxlength`，通过 `focused` 与 `visible` 联动光标。默认遮蔽，真实密码不得输出到日志。参数及独立示例见 `components/password-input.md`。

ConfigProvider 已接入 App 根节点主题。通过 theme/themeVars 与 button/tag 配置作用域；组件显式属性优先，嵌套按字段合并。useConfigProvider 读取配置；RootPortal 自动携带显式 Token 与组件默认值。不要通过全局模块变量或DOM实现主题注入。实际参数见 `components/config-provider.md`。

PickerView、Picker、SelectPicker 已有独立完整示例和 API 文档。Picker/SelectPicker 的取消不回填；SelectPicker.onChange 为草稿变化通知，业务持久数据在 onConfirm 中更新。RootPortal 组合使用公共 SelectPicker，不再复制私有选择器。

Cascader 已有11例独立详情。静态树使用节点标量，lazyLoad 回显传完整路径数组；字段映射与异步请求生命周期见 `components/cascader.md`，全国地址数据按入口点击惰性构建。

DatetimePickerView 和 DatetimePicker 分别有9例及14个入口。滚轮依赖公共 PickerView，默认数字文案，年月日列名为 date；过滤用 `{type,values}`。DatetimePicker 数组 value 启用区间；`onChange/onConfirm` 是成功提交通知，`onPickChange` 才是草稿变化，取消不回填。参数与真实事件语义见 `components/datetime-picker-view.md`、`components/datetime-picker.md`，不要直接套用 Wot 的 change 语义。

CalendarView 已有9个面板示例，支持九种日期/周/月/时间模式；范围未完成值含 null，不能只检查数组长度。maxRange 超限会截断终点并提示。长日期范围使用 switchMode，参数与可视月份策略见 `components/calendar-view.md`。

Calendar 独立16入口已完成。保留 `onChange/onConfirm` 成功提交语义，使用 `onPickChange` 订阅草稿；取消不回填。支持 showTypeSwitch、shortcuts/onShortcutsClick、innerDisplayFormat、confirmLeft/confirmRight 和 Ref，详见 `components/calendar.md`。

SlideVerify 已有8例独立详情，支持width/height、ReactNode文案和图标插槽；拖动使用视口坐标、实际高度计算终点，取消与尺寸变化重置。它不替代服务端验证，参见 `components/slide-verify.md`。

Upload 独立11例已补齐，继续使用 createHostUploadAdapter，禁止组件直接上传。beforeChoose 只能拦截宿主原子操作之前，不能模拟 beforeUpload；多选/视频/手动上传未支持。普通预览走宿主，H5 已接通图片预览；现有 Form 默认 aspectFill 保留。详见 `components/upload.md`。

Progress 支持内外百分比、三种状态、字符串/阈值颜色数组及按百分比变化计时的原生过渡。数组按当前 Wot 的阶段规则动画，不能当作渐变色；0% 内置文本使用原生布局测量。详见 `components/progress.md`。

Circle 使用原生SVG，不需要Canvas或DOM。value为目标，speed控制动画；当前Wot的strokeWidth实际描边按半宽绘制，默认120/18，详见 `components/circle.md`，不要套用旧skill的100/10默认值。

Notify 使用 `useNotify()` 与 `<Notify {...notify.props} />` 配对；默认值和计时按实例隔离，没有 selector 或全局注册。受控模式必须回写 visible/onChange，连续调用由 requestKey 续期；rootPortal 依赖 RootPortalHost，safeHeight/safeAreaBottom 由宿主传入。当前 Wot 为浅色填充并自带前缀，参数与14例详情见 `components/notify.md`。

Signature 已有独立七画板、弹窗和横屏子页。通过Ref或renderFooter操作，onConfirm成功返回PNG dataUrl，不能当作宿主tempFilePath；无Canvas/DOM依赖，仅导出PNG，不提供无效quality/fileType。默认150px高度与当前Wot示例一致，笔锋为速度模拟，见 `components/signature.md`。

Grid/GridItem已实现，可用于CountDown/CountTo等控制区。默认不传column为单行，iconSize默认32；clickable门控点击和导航，url通过onNavigate显式接业务路由。完整Badge参数与ReactNode插槽可用，见 `components/grid.md`。

CountDown使用毫秒time，autoStart默认true；useCountDown本身不自动开始。Ref的pause保留剩余时间、reset按autoStart恢复；children(current)定制展示，TimeData.hours为分解值而格式HH可累计天数。参见 `components/count-down.md`。

CountTo默认主数字18px、前后缀12px，自动播放用autoStart，不是旧skill的autoplay。复用useCountDown，暂停保存剩余时间；起止值或duration更新会重置，children(value,formatted)可定制数字。十例与API见 `components/count-to.md`。

Img 图片：49图独立详情、14种原生模式/裁剪、加载失败插槽、等比自适应及显式宿主预览；参数和平台边界见 components/img.md。

Empty 缺省提示：新版98px图标方案、11例独立详情、大小/图片/插槽和底部操作；保留业务EmptyState，参见 components/empty.md。

NoticeBar 通知栏：12条独立详情、原生水平/垂直轮播、速度/停留、关闭/多行/插槽与Ref重置；生命周期及参数见 components/notice-bar.md。

Card 卡片：business默认兼容、standard/rectangle官网样式、完整插槽与七卡片详情，见 components/card.md。

Skeleton 骨架屏：四预设、真实行列配置、原生扫光/闪烁、loading独占插槽及15实例详情，见 components/skeleton.md。

Steps 步骤条：横向/竖向、点状、显式状态和自定义内容；十组独立详情，见 components/steps.md。

Sticky 粘性布局：原生观察/测量、顶部偏移、容器末尾约束、动态插入与五组详情，见 components/sticky.md。

Curtain 幕帘：原生等比图片、七关闭位置、公共缩放过渡与九入口详情，见 components/curtain.md。

Watermark 水印：原生文字/SVG/图片重复、局部/全屏与错位布局、触摸穿透和公共控件详情，见 components/watermark.md。

Swiper 轮播图：复用官方主线程横向分页；受控/非受控、自动播放、卡片/多项、指示器与插槽。当前不支持垂直和视频项，见 components/swiper.md。

Swiper 卡片使用 neighborHeight（示例 168px）启用主线程进度动画；不要再叠加 customPrevClass/customNextClass 的 height 过渡。轮播尺寸须通过独立测量节点读取，避免子布局事件导致分页重置。

ImagePreview 图片预览：原生等比图片、主线程分页、独立hook/受控/ref、事件与11入口详情，见 components/image-preview.md。

SwiperNav 轮播指示器：公共三指示器/八位置/导航按钮；Swiper与ImagePreview复用，见 components/swiper-nav.md。

Table 表格：14组独立详情、排序/固定列/合并单元格/分页和虚拟窗口；columns配置替代wd-table-column，排序与编辑由调用方保存，见 components/table.md。

BarCode 条形码：18种真实编码、原生SVG条纹与text排版、完整详情；仅导入JsBarcode纯编码模块，exportImage返回SVG data URL而非PNG临时路径，见 components/bar-code.md。

QrCode 二维码：UTF-8真实编码、四纠错级别、四码点/渐变、原生背景与Logo。默认SVG导出拒绝未内嵌的外部图片；浏览器宿主注册 daisu-ui/web 并设置 exportMode="browser" 后，exportImage 返回包含Logo与背景的完整PNG data URL，直接交给Img展示；跨域图片须允许CORS。详见 components/qr-code.md。

RichText 富文本：packages/daisu-ui 中的原生 HTML 解析、图文/链接、公共Table合并布局与ImagePreview、编辑器样例和长文目录；不执行HTML；浏览器通过 daisu-ui/web 注册播放器并设置 mediaMode="browser"，支持音视频、播放/暂停/seek；Flutter 音视频与 lazyLoad 尚未接入。见 components/rich-text.md。

VideoPreview / useVideoPreview 与 ImgCropper 已提供浏览器后端：宿主入口调用 daisu-ui/web 的 registerDaisuWebComponents；组件分别设置 mediaMode="browser"、mode="browser"。视频预览默认248px或全屏，hook按实例隔离；裁剪为真实Canvas PNG/JPEG，tempFilePath是Blob URL，须按生命周期回收。Flutter仍缺对应后端。见 components/video-preview.md、components/img-cropper.md。

浏览器自定义元素通过 NodesRef.invoke 暴露的方法必须同步返回可结构化克隆的值，不能直接返回 Promise。异步操作在方法内部启动，再通过携带请求标识的自定义事件发送结果；QrCode 的浏览器导出采用此方式，组件 ref 层仍可提供 Promise API。
