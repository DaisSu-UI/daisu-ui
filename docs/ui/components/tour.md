# Tour 漫游

漫游引导通过高亮目标元素逐步介绍页面功能，支持步骤切换、自定义内容和目标定位。

```tsx
import { Tour } from 'daisu-ui';
```

## 基础用法

### 开始引导

通过 `show` 控制引导显示，`steps` 中的 `element` 指定目标元素，`content` 指定提示内容。

```tsx
import { useState } from '@lynx-js/react';

import { Button } from 'daisu-ui';

const [show, setShow] = useState(false);

<view id="tour-target">
  <Button
    label="开始引导"
    onTap={() => {
      'background only';
      setShow(true);
    }}
  />
</view>
<Tour
  show={show}
  onShowChange={setShow}
  steps={[{ element: '#tour-target', content: '点击这里开始操作' }]}
/>
```

## 组件样式

### 高亮区域与按钮文案

通过 `padding` 和 `borderRadius` 调整高亮区域，通过 `finishText` 设置完成按钮文案。

```tsx
<Tour
  show={false}
  steps={[{ element: '#tour-target', content: '完成设置' }]}
  padding={12}
  borderRadius={8}
  finishText="知道了"
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示 | `boolean` | `false` |
| steps | 引导步骤列表 | `readonly TourStep[]` | 必填 |
| current | 当前索引或位置 | `number` | — |
| defaultCurrent | 非受控模式的初始索引 | `number` | `0` |
| mask | 是否显示遮罩 | `boolean` | `true` |
| maskColor | 遮罩颜色 | `string` | `'rgba(0,0,0,.55)'` |
| offset | 相对目标元素的偏移 | `number` | `20` |
| duration | 动画或显示时长，单位 ms | `number` | `300` |
| borderRadius | 圆角半径 | `number` | `4` |
| padding | 内边距或高亮区域留白 | `number` | `8` |
| prevText | 上一步按钮文案 | `string` | `'上一步'` |
| nextText | 下一步按钮文案 | `string` | `'下一步'` |
| skipText | 跳过按钮文案 | `string` | `'跳过'` |
| finishText | 完成按钮文案 | `string` | `'完成'` |
| highlightStyle | 高亮区域样式 | `CSSProperties` | — |
| clickMaskNext | 点击遮罩时是否前进到下一步 | `boolean` | `false` |
| zIndex | 浮层层级 | `number` | `999` |
| showTourButtons | 是否显示引导操作按钮 | `boolean` | `true` |
| rootPortal | 挂载到 RootPortalHost；使用前需配置宿主 | `boolean` | `false` |
| missingStrategy | 目标元素缺失时的处理方式 | `'skip' \| 'stop' \| 'hide'` | `'stop'` |
| scrollToTarget | Await host/scroll-view positioning before native target measurement. | `(step: TourStep, index: number) => void \| Promise<void>` | — |
| getTargetRect | Optional scoped native measurement, e.g. a NodesRef from the caller. | `(step: TourStep, index: number) => BubbleRect \| null \| Promise<BubbleRect \| null>` | — |
| className | 根节点自定义类名 | `string` | `''` |
| style | 根节点样式 | `CSSProperties` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onShowChange | 显示状态变化时触发 | (show: boolean) => void |
| onCurrentChange | 对应操作发生时触发 | (current: number) => void |
| onChange | 值发生变化时触发 | (event: { current: number }) => void |
| onPrev | 对应操作发生时触发 | (event: TourStepEvent) => void |
| onNext | 对应操作发生时触发 | (event: TourStepEvent) => void |
| onFinish | 对应操作发生时触发 | (event: TourEndEvent) => void |
| onSkip | 对应操作发生时触发 | (event: TourEndEvent) => void |
| onError | 发生错误时触发 | (event: { message: string; element: string }) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| renderContent | 自定义内容 | (state: TourRenderState) => ReactNode |
| renderHighlight | 自定义区域内容 | (state: TourRenderState) => ReactNode |
| renderPrev | 自定义区域内容 | (state: TourRenderState) => ReactNode |
| renderNext | 自定义区域内容 | (state: TourRenderState) => ReactNode |
| renderSkip | 自定义区域内容 | (state: TourRenderState) => ReactNode |
| renderFinish | 自定义区域内容 | (state: TourRenderState) => ReactNode |

## Methods 方法

通过 ref 获取组件实例。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| handlePrev | 调用实例方法 | () => void |
| handleNext | 调用实例方法 | () => void |
| handleSkip | 调用实例方法 | () => void |
| handleFinish | 调用实例方法 | () => void |
| updatePosition | 重新计算位置 | () => void |

## 数据类型

```tsx
export type TourStep = {
  element: string;
  content: string;
  padding?: number;
  offset?: number;
  placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
};

export type TourStepEvent = {
  prevCurrent: number;
  current: number;
  total: number;
  isElementInTop: boolean;
};

export type TourEndEvent = { current: number; total: number };

export type TourRenderState = {
  current: number;
  total: number;
  step: TourStep;
  elementInfo: BubbleRect;
  prev: () => void;
  next: () => void;
  skip: () => void;
  finish: () => void;
};
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from 'daisu-ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

### CSS 变量

以下变量可通过 ConfigProvider 的 themeVars 覆盖，未设置时使用当前主题与组件的默认样式。

| 变量 | 作用范围 |
| --- | --- |
| `--cso-ui-surface` | 共享主题 |
| `--cso-ui-text` | 共享主题 |

## 源代码

[Tour 组件源码](./sources/tour/Tour.tsx.txt) · [示例源码](./sources/tour/demo.tsx.txt) · [文档源码](./sources/tour/docs.md.txt)
