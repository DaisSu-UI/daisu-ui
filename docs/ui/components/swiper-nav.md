# SwiperNav 轮播指示器

从 `packages/daisu-ui/src/index.ts` 导入 `SwiperNav`。与公共 Swiper 共用三种指示器和导航按钮，用于 ImagePreview 的自定义插槽；无分页状态、计时器或手势内核。

```tsx
<SwiperNav current={1} total={5} type="dots-bar" style={{bottom:'64px'}}/>
```

参数：`current?:number=0`、`total?:number=0`、`type?:'dots'|'dots-bar'|'fraction'='dots'`、`indicatorPosition?:'left'|'top-left'|'top'|'top-right'|'bottom-left'|'bottom'|'bottom-right'|'right'='bottom'`、`minShowNum?:number=2`、`showControls?:boolean=false`、`hidePrev/hideNext?:boolean=false`、`className/style`。非法数字归零，索引限制到合法范围，空列表隐藏。需要放在有尺寸的定位容器中。

`onChange({dir:'prev'|'next'})` 发送导航意图，由父组件更新索引；`onSelect(index)` 可选，传入后圆点可以直接选择页。组件自身不修改 current。圆点/点条/分数与八种位置使用公共 Swiper 样式和 Token；示例见 `/ui-demo/swiper` 与 `/ui-demo/image-preview` 自定义插槽。

轮播指示器采用横向布局，不提供垂直方向或自动播放配置。
