# 交互状态维护清单

`@lynx-js/react-use@0.2.2` 已成为 UI 包的直接依赖。触摸与鼠标适配采用它的 `useTouchEmulation`，组件内部再共享手势生命周期、后台渲染合并和按压反馈。

| 范围 | 处理 | 状态边界 |
| --- | --- | --- |
| Slider、Signature、Fab、SlideVerify、SwipeAction、FloatingPanel、IndexBar | 内部 `useDragEvents` | 只有有效手势持有全局鼠标监听；触摸保持原始目标，释放/取消幂等，兼容鼠标启动去重，保留各处 bind/catch 语义 |
| Slider、Signature | 内部 `useFrameTask` | 约16ms合并重绘；使用最新回调；卸载取消。滑块结束值立即提交，签名保留全部采样点 |
| Button、Cell、Grid、LayerCloseButton、Icon Demo | 现有 `usePressState` | 稳定 start/end 回调，统一鼠标/触摸反馈，只有按下期间启用外部释放监听 |
| InputNumber | 当前长按方向 | 仅为正在按住的方向监听全局鼠标释放；600ms起按、250ms重复及最终 tap 语义保留 |
| Keyboard | 每个按键的按压、滑动取消与车牌语言 | 已有按下期间的释放监听，无常驻全局 move；保留按键业务判断 |
| Calendar、Picker、Notify、Dialog、Sticky 等 | 组件局部 state/ref/context | 选择、草稿、异步确认、滚动定位各有不同协议，继续由组件管理 |
| Swiper、List、FeedList | 官方 Lynx UI 内核 | 保留现有主线程手势与滚动后端，本轮不替换其状态内核 |
| 其他 Demo 页面 | 使用组件公共 API | 不额外增加页面全局手势或共享业务状态 |

`useDragEvents` 和 `useFrameTask` 为库内部模块，不新增公开 API。`usePressState` 保留现有 `utils` 导出和 start/end 接口，并增加统一事件属性供组件复用。

通用 Hook 仅负责输入适配和生命周期；数值边界、范围滑块不可交叉、签名压力/撤销、侧滑确认、浮动面板锚点与索引定位仍由对应组件负责。

验证包含：空闲实例没有全局移动监听、只有活动实例接收外部移动、重复释放不重复提交、禁用取消、触摸兼容鼠标去重、最新回调与卸载计时器清理，以及各组件既有交互回归。Android/iOS 的事件频率和帧耗时仍需目标设备验收。
