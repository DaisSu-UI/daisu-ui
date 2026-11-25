# Swiper 轮播图

轮播图用于在固定区域切换图片或自定义内容，支持自动播放、指示器和滑动控制。

```tsx
import { Swiper, SwiperNav } from '@daisu-ui/ui';
```

## 组件类型

### 图片轮播

通过 `list` 设置图片地址列表，通过 `height` 设置轮播区域高度。

```tsx
<Swiper
  list={['https://example.com/a.jpg', 'https://example.com/b.jpg']}
  height={192}
/>
```

## 交互用法

### 关闭自动播放

设置 `autoplay={false}` 关闭自动播放，通过 `onChange` 获取切换结果。

```tsx
<Swiper
  list={['https://example.com/a.jpg', 'https://example.com/b.jpg']}
  autoplay={false}
  onChange={(event) => {
    'background only';
    console.log(event);
  }}
/>
```

## 内容形态

### 自定义轮播项

通过 `renderItem` 自定义每一项的内容。

```tsx
<Swiper
  list={[
    { value: 'one', text: '内容一' },
    { value: 'two', text: '内容二' },
  ]}
  renderItem={({ item }) => <text>{String(item)}</text>}
/>
```

## Attributes 属性

### Swiper

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| list | 图片地址或对象列表；空列表不创建分页内核 | `readonly SwiperItem[]` | 必填 |
| current | current 为受控值；未传时使用内部状态 | `number` | — |
| defaultCurrent | current 为受控值；未传时使用内部状态 | `number` | `0` |
| autoplay | 自动播放与间隔，单位 ms；拖动或动画期间暂停计时，结束后重新计时 | `boolean` | `true` |
| interval | 自动播放与间隔，单位 ms；拖动或动画期间暂停计时，结束后重新计时 | `number` | `5000` |
| duration | 原生动画时长 ms；非循环到末项后停止自动播放 | `number` | `300` |
| loop | 原生动画时长 ms；非循环到末项后停止自动播放 | `boolean` | `true` |
| height | 数字为 px；字符串按 Img 尺寸规则处理 | `number\|string` | `192` |
| displayMultipleItems | 同时显示数量，归一为 1 到列表长度间的整数 | `number` | `1` |
| previousMargin | 两侧留白，单位 px；不接受 CSS 字符串或 rpx | `number` | `0` |
| nextMargin | 两侧留白，单位 px；不接受 CSS 字符串或 rpx | `number` | `0` |
| neighborHeight | 邻项高度 px；启用原生进度卡片动画，限制在 0 到当前轮播高度间，不再叠加图片 height 过渡 | `number` | — |
| indicator | false 隐藏；对象包含 type、minShowNum、showControls | `boolean\|SwiperIndicator` | `true` |
| indicatorPosition | left、top-left、top、top-right、bottom-left、bottom、bottom-right、right | `'left'\|'top-left'\|'top'\|'top-right'\|'bottom-left'\|'bottom'\|'bottom-right'\|'right'` | `'bottom'` |
| valueKey | 对象中的图片地址和右上角标题字段 | `string` | `'value'` |
| textKey | 对象中的图片地址和右上角标题字段 | `string` | `'text'` |
| imageMode | 使用公共 Img 支持的模式 | `ImgMode` | `'aspectFill'` |
| customIndicatorClass | 指示器与所有项目的样式类 | `string` | `''` |
| customItemClass | 指示器与所有项目的样式类 | `string` | `''` |
| customPrevClass | 前一项、后一项的样式类，可实现卡片效果 | `string` | `''` |
| customNextClass | 前一项、后一项的样式类，可实现卡片效果 | `string` | `''` |
| customTextClass | 标题样式 | `string` | `''` |
| customTextStyle | 标题样式 | `CSSProperties` | — |
| className | 外层样式 | `string` | `''` |
| style | 外层样式 | `CSSProperties` | — |

### SwiperNav

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| current | current 为受控值；未传时使用内部状态 | `number` | `0` |
| total | 数据总条数 | `number` | `0` |
| type | 类型 | `'dots'\|'dots-bar'\|'fraction'` | `'dots'` |
| indicatorPosition | left、top-left、top、top-right、bottom-left、bottom、bottom-right、right | `'left'\|'top-left'\|'top'\|'top-right'\|'bottom-left'\|'bottom'\|'bottom-right'\|'right'` | `'bottom'` |
| minShowNum | minShowNum 配置 | `number` | `2` |
| showControls | showControls 配置 | `boolean` | `false` |
| hidePrev | hidePrev 配置 | `boolean` | `false` |
| hideNext | hideNext 配置 | `boolean` | `false` |
| className | 外层样式 | `string` | `''` |
| style | 外层样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| Swiper.onChange | 值发生变化时触发 | (current:number,source:SwiperChangeSource)=>void |
| Swiper.onClick | 点击时触发 | (index:number,item:SwiperItem)=>void |
| SwiperNav.onChange | 值发生变化时触发 | (event:{dir:'prev'\|'next'})=>void |
| SwiperNav.onSelect | 对应操作发生时触发 | (index:number)=>void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| Swiper.renderItem | 自定义每项内容；字符串/数字会包裹原生 text | (options:{item:SwiperItem;index:number})=>ReactNode |
| Swiper.renderIndicator | 自定义指示器，优先于内置指示器 | (options:{current:number;total:number})=>ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| swipeTo | 调用实例方法 | (index:number)=>void |
| swipeNext | 调用实例方法 | ()=>void |
| swipePrev | 调用实例方法 | ()=>void |

## 数据类型

```tsx
export type SwiperItem = string | Record<string, unknown>;

export type SwiperChangeSource = 'autoplay' | 'touch' | 'nav';

export type SwiperIndicator = {
  type?: 'dots' | 'dots-bar' | 'fraction';
  minShowNum?: number;
  showControls?: boolean;
};

export type ImgMode =
  | 'scaleToFill'
  | 'aspectFit'
  | 'aspectFill'
  | 'widthFix'
  | 'heightFix'
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right';
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

### CSS 变量

以下变量可通过 ConfigProvider 的 themeVars 覆盖，未设置时使用当前主题与组件的默认样式。

| 变量 | 作用范围 |
| --- | --- |
| `--cso-ui-swiper-dot-active-color` | 当前组件 |
| `--cso-ui-swiper-dot-color` | 当前组件 |

## 源代码

[Swiper 组件源码](./sources/swiper/Swiper.tsx.txt) · [SwiperNav 组件源码](./sources/swiper/SwiperNav.tsx.txt) · [示例源码](./sources/swiper/demo.tsx.txt) · [文档源码](./sources/swiper/docs.md.txt)
