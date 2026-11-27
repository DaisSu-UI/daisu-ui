export const formExamplePages = [
  { id: 'form-dynamic', label: '动态表单' },
  { id: 'form-complex', label: '复杂表单' },
  { id: 'form-errors', label: '校验提示方式' },
  { id: 'form-disabled', label: '禁用表单' },
  { id: 'form-trigger', label: '校验触发时机' },
] as const;
export const sidebarExamplePages = [
  { id: 'sidebar-anchor', label: 'Sidebar 锚点用法' },
  { id: 'sidebar-page', label: 'Sidebar 切换页面' },
  { id: 'sidebar-icons', label: 'Sidebar 自定义图标' },
] as const;

export const componentGroups = [
  { id: 'basic', label: '基础', icon: '◇', items: [{ id: 'button', label: 'Button 按钮' }, { id: 'icon', label: 'Icon 图标' }, { id: 'text', label: 'Text 文本' }, { id: 'layout', label: 'Layout 布局' }, { id: 'card', label: 'Card 卡片' }, { id: 'cell', label: 'Cell 单元格' }, { id: 'divider', label: 'Divider 分割线' }, { id: 'fab', label: 'Fab 悬浮按钮' }, { id: 'transition', label: 'Transition 动画' }, { id: 'resize', label: 'Resize 监听元素尺寸变化' }, { id: 'config-provider', label: 'ConfigProvider 全局配置' }, { id: 'root-portal', label: 'Root Portal 根节点传送门' }] },
  { id: 'navigation', label: '导航', icon: '☰', items: [{ id: 'router', label: 'Router 路由' }, { id: 'navbar', label: 'Navbar 导航栏' }, { id: 'tabbar', label: 'Tabbar 标签栏' }, { id: 'tabs', label: 'Tab 标签页' }, { id: 'segmented', label: 'Segmented 分段器' }, { id: 'sidebar', label: 'Sidebar 侧边栏' }, { id: 'index-bar', label: 'IndexBar 索引栏' }, { id: 'pagination', label: 'Pagination 分页' }, { id: 'backtop', label: 'Backtop 回到顶部' }, { id: 'tour', label: 'Tour 漫游' }] },
  { id: 'form', label: '录入', icon: '≡', items: [{ id: 'form-detail', label: 'Form 表单' }, { id: 'rate', label: 'Rate 评分' }, { id: 'switch', label: 'Switch 开关' }, { id: 'input', label: 'Input 输入框' }, { id: 'textarea', label: 'Textarea 文本域' }, { id: 'input-number', label: 'InputNumber 计数器' }, { id: 'search', label: 'Search 搜索框' }, { id: 'checkbox', label: 'Checkbox 复选框' }, { id: 'radio', label: 'Radio 单选' }, { id: 'slider', label: 'Slider 滑块' }, { id: 'keyboard', label: 'Keyboard 虚拟键盘' }, { id: 'password-input', label: 'PasswordInput 密码输入框' }, { id: 'picker', label: 'Picker 选择器' }, { id: 'picker-view', label: 'PickerView 选择器视图' }, { id: 'select-picker', label: 'SelectPicker 单复选选择器' }, { id: 'cascader', label: 'Cascader 级联选择' }, { id: 'datetime-picker-view', label: 'DatetimePickerView 日期时间选择器视图' }, { id: 'datetime-picker', label: 'DatetimePicker 日期时间选择器' }, { id: 'calendar', label: 'Calendar 日历选择器' }, { id: 'calendar-view', label: 'CalendarView 日历面板' }, { id: 'upload', label: 'Upload 上传' }, { id: 'img-cropper', label: 'ImgCropper 图片裁剪' }, { id: 'signature', label: 'Signature 签名' }, { id: 'slide-verify', label: 'SlideVerify 滑动验证' }] },
  { id: 'feedback', label: '反馈', icon: '◌', items: [{ id: 'notice-bar', label: 'NoticeBar 通知栏' }, { id: 'swipe-action', label: 'SwipeAction 滑动操作' }, { id: 'floating-panel', label: 'FloatingPanel 浮动面板' }, { id: 'popover', label: 'Popover 气泡' }, { id: 'toast', label: 'Toast 轻提示' }, { id: 'tooltip', label: 'Tooltip 文字提示' }, { id: 'drop-menu', label: 'DropMenu 下拉菜单' }, { id: 'dialog', label: 'Dialog 对话框' }, { id: 'action-sheet', label: 'ActionSheet 动作面板' }, { id: 'popup', label: 'Popup 弹出层' }, { id: 'overlay', label: 'Overlay 遮罩层' }, { id: 'count-to', label: 'CountTo 数字滚动' }, { id: 'count-down', label: 'CountDown 倒计时' }, { id: 'notify', label: 'Notify 消息通知' }, { id: 'circle', label: 'Circle 环形进度条' }, { id: 'progress', label: 'Progress 进度条' }, { id: 'loading', label: 'Loading 加载指示器' }, { id: 'empty', label: 'Empty 缺省提示' }] },
  { id: 'display', label: '数据展示', icon: '▣', items: [{ id: 'rich-text', label: 'RichText 富文本' }, { id: 'qr-code', label: 'QRCode 二维码' }, { id: 'bar-code', label: 'BarCode 条形码' }, { id: 'table', label: 'Table 表格' }, { id: 'image-preview', label: 'ImagePreview 图片预览' }, { id: 'video-preview', label: 'VideoPreview 视频预览' }, { id: 'swiper', label: 'Swiper 轮播图' }, { id: 'watermark', label: 'Watermark 水印' }, { id: 'curtain', label: 'Curtain 幕帘' }, { id: 'sticky', label: 'Sticky 粘性布局' }, { id: 'steps', label: 'Steps 步骤条' }, { id: 'skeleton', label: 'Skeleton 骨架屏' }, { id: 'img', label: 'Img 图片' }, { id: 'grid', label: 'Grid 宫格' }, { id: 'sort-button', label: 'SortButton 排序按钮' }, { id: 'collapse', label: 'Collapse 折叠面板' }, { id: 'avatar', label: 'Avatar 头像' }, { id: 'badge', label: 'Badge 徽标' }, { id: 'gap', label: 'Gap 间隔槽' }, { id: 'loadmore', label: 'loadmore 加载更多' }, { id: 'tag', label: 'Tag 标签' }, { id: 'ai-guide', label: 'AI 使用指南' }] },
] as const;

export type UiDemoCategory = typeof componentGroups[number]['id'];
export type UiDemoComponent = typeof componentGroups[number]['items'][number]['id'] | typeof formExamplePages[number]['id'] | typeof sidebarExamplePages[number]['id'] | 'stepper' | 'signature-landscape' | 'about';
export type UiDemoPage = 'overview' | UiDemoCategory | UiDemoComponent;

const categoryIds = componentGroups.map(group => group.id);
const componentIds = [...componentGroups.flatMap(group => group.items.map(item => item.id)), ...sidebarExamplePages.map(item => item.id), ...formExamplePages.map(item => item.id), 'stepper', 'signature-landscape', 'about'];

export function isUiDemoCategory(value: string): value is UiDemoCategory {
  return (categoryIds as readonly string[]).includes(value);
}

export function isUiDemoComponent(value: string): value is UiDemoComponent {
  return (componentIds as readonly string[]).includes(value);
}

export function categoryForComponent(component: UiDemoComponent): UiDemoCategory {
  if (component === 'about') return 'basic';
  if (formExamplePages.some(item => item.id === component)) return 'form';
  if (component === 'signature-landscape') return 'form';
  if (component === 'stepper') return 'form';
  if (sidebarExamplePages.some(item => item.id === component)) return 'navigation';
  return componentGroups.find(group => group.items.some(item => item.id === component))!.id;
}
